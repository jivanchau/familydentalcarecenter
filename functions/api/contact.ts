/// <reference types="@cloudflare/workers-types" />
// POST /api/contact — Cloudflare Pages Function.
// Saves the enquiry to D1 (if bound) and emails the clinic via Resend (if configured).

interface Env {
  DB?: D1Database
  RESEND_API_KEY?: string
  CONTACT_TO?: string // clinic inbox, e.g. familydentalcarecenter@gmail.com
  CONTACT_FROM?: string // verified sender, e.g. "Website <no-reply@yourdomain.com>"
  TURNSTILE_SECRET?: string
}

type Body = Record<string, unknown>

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  // Honeypot — pretend success so bots don't retry.
  if (str(body.website, 200)) return json({ ok: true })

  const data = {
    name: str(body.name, 100),
    email: str(body.email, 150),
    phone: str(body.phone, 20),
    subject: str(body.subject, 150),
    message: str(body.message, 3000),
  }
  if (!data.name || !data.message || !/^\S+@\S+\.\S+$/.test(data.email) || !/^[0-9+\-\s]{10,15}$/.test(data.phone)) {
    return json({ error: 'Please fill in your name, a valid email, phone number and message.' }, 422)
  }

  if (env.TURNSTILE_SECRET) {
    const form = new FormData()
    form.append('secret', env.TURNSTILE_SECRET)
    form.append('response', str(body.turnstileToken, 2048))
    form.append('remoteip', request.headers.get('CF-Connecting-IP') ?? '')
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
    const out = (await r.json()) as { success: boolean }
    if (!out.success) return json({ error: 'Spam check failed. Please refresh and try again.' }, 403)
  }

  const sinks: Promise<unknown>[] = []

  if (env.DB) {
    sinks.push(
      env.DB.prepare('INSERT INTO enquiries (name, email, phone, subject, message, ip) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(data.name, data.email, data.phone, data.subject, data.message, request.headers.get('CF-Connecting-IP'))
        .run(),
    )
  }

  if (env.RESEND_API_KEY && env.CONTACT_TO && env.CONTACT_FROM) {
    sinks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: env.CONTACT_FROM,
          to: env.CONTACT_TO,
          reply_to: data.email,
          subject: `Website enquiry: ${data.subject || data.name}`,
          html: `<h2>New appointment enquiry</h2>
            <p><b>Name:</b> ${esc(data.name)}<br><b>Email:</b> ${esc(data.email)}<br><b>Phone:</b> ${esc(data.phone)}<br><b>Subject:</b> ${esc(data.subject)}</p>
            <p>${esc(data.message).replace(/\n/g, '<br>')}</p>`,
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Resend ${r.status}`)
      }),
    )
  }

  if (sinks.length === 0) {
    // Nothing configured: fail loudly rather than silently dropping a patient's enquiry.
    return json({ error: 'Online form is not configured yet. Please call or WhatsApp us.' }, 503)
  }

  const results = await Promise.allSettled(sinks)
  results.filter((r) => r.status === 'rejected').forEach((r) => console.error('contact sink failed', (r as PromiseRejectedResult).reason))
  // Succeed if at least one sink stored the enquiry.
  return results.some((r) => r.status === 'fulfilled')
    ? json({ ok: true })
    : json({ error: 'Could not send right now. Please call or WhatsApp us.' }, 502)
}
