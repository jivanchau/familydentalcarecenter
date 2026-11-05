import { useEffect, useState, type FormEvent } from 'react'
import { PageBanner, useSeo } from '../components/ui'
import { site } from '../config/site'
import { submitContact } from '../lib/api'

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; message?: string }

export default function Contact() {
  useSeo('Contact Us', `Book an appointment at ${site.name}, ${site.city}. Call ${site.phones.join(', ')}.`)
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  // Cloudflare Turnstile (free CAPTCHA) — only loaded when a site key is configured.
  useEffect(() => {
    if (!import.meta.env.VITE_TURNSTILE_SITE_KEY || document.getElementById('cf-turnstile')) return
    const s = document.createElement('script')
    s.id = 'cf-turnstile'
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setStatus({ state: 'sending' })
    const res = await submitContact({
      name: String(f.get('name') ?? ''),
      email: String(f.get('email') ?? ''),
      phone: String(f.get('phone') ?? ''),
      subject: String(f.get('subject') ?? ''),
      message: String(f.get('message') ?? ''),
      website: String(f.get('website') ?? ''),
      turnstileToken: String(f.get('cf-turnstile-response') ?? ''),
    })
    if (res.ok) {
      form.reset()
      setStatus({ state: 'sent', message: 'Thank you! We have received your message and will contact you shortly.' })
    } else {
      setStatus({ state: 'error', message: res.error })
    }
  }

  return (
    <>
      <PageBanner title="Contact Us" />
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2 className="heading-bar">Get In Touch</h2>
            <h3>{site.name}</h3>
            <p><i className="fa-solid fa-location-dot" /> {site.address}</p>
            {site.phones.map((p) => (
              <p key={p}><i className="fa-solid fa-phone" /> <a href={`tel:${p.replace(/\D/g, '')}`}>{p}</a></p>
            ))}
            <p><i className="fa-solid fa-envelope" /> <a href={`mailto:${site.email}`}>{site.email}</a></p>
            <div className="hours-card">
              <h4>Consulting Hours</h4>
              {site.hours.map((h) => (
                <p key={h.label}>{h.label}: {h.value}</p>
              ))}
              <p className="closed">{site.closed}</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
            <div className="form-row">
              <input name="name" placeholder="Name" required maxLength={100} autoComplete="name" />
              <input name="email" type="email" placeholder="Email address" required maxLength={150} autoComplete="email" />
            </div>
            <div className="form-row">
              <input name="phone" type="tel" placeholder="Please enter your phone" required pattern="[0-9+\-\s]{10,15}" autoComplete="tel" />
              <input name="subject" placeholder="Subject" required maxLength={150} />
            </div>
            <textarea name="message" placeholder="Your message" rows={7} required maxLength={3000} />
            {/* Honeypot: hidden from humans, bots fill it */}
            <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
              <div className="cf-turnstile" data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY} />
            )}
            <button className="btn btn-custom btn-lg" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status.message && (
              <p className={`form-status is-${status.state}`} role="status">{status.message}</p>
            )}
          </form>
        </div>
      </section>
      <iframe className="map" title="Clinic location" src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </>
  )
}
