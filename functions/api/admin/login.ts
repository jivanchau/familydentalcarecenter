/// <reference types="@cloudflare/workers-types" />
// POST /api/admin/login  { username, password }  → sets the signed session cookie.
import { createSessionCookie, isHttps, json, safeEqual, type Env } from '../../../server/shared'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json().catch(() => ({}))) as { username?: unknown; password?: unknown }
  const username = typeof body.username === 'string' ? body.username : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const secret = env.SESSION_SECRET! // presence checked by _middleware

  const [userOk, passOk] = await Promise.all([
    safeEqual(username, env.ADMIN_USERNAME!, secret),
    safeEqual(password, env.ADMIN_PASSWORD!, secret),
  ])

  if (!userOk || !passOk) {
    // Small fixed delay slows down password guessing.
    await new Promise((r) => setTimeout(r, 800))
    return json({ error: 'Incorrect username or password.' }, 401)
  }

  return json({ ok: true }, 200, { 'set-cookie': await createSessionCookie(secret, isHttps(request)) })
}
