/// <reference types="@cloudflare/workers-types" />
// Guards every /api/admin/* route except /api/admin/login.
import { adminConfigured, hasValidSession, json, type Env } from '../../../server/shared'

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const { pathname } = new URL(request.url)
  const res = (body: unknown, status: number) => {
    const r = json(body, status)
    r.headers.set('cache-control', 'no-store')
    return r
  }

  if (!adminConfigured(env)) return res({ error: 'Admin is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET.' }, 503)

  // State-changing requests must be JSON (or an image, for uploads). Neither type can be sent by a plain
  // cross-site HTML form, which blocks CSRF on top of the SameSite=Strict cookie.
  const type = request.headers.get('content-type') ?? ''
  const allowed = pathname === '/api/admin/upload' ? /^image\/(jpeg|png|webp)$/.test(type) : type.includes('application/json')
  if (request.method !== 'GET' && !allowed) {
    return res({ error: 'Unsupported content type.' }, 415)
  }

  if (pathname !== '/api/admin/login' && !(await hasValidSession(request, env.SESSION_SECRET))) {
    return res({ error: 'Please sign in.' }, 401)
  }

  const response = await next()
  response.headers.set('cache-control', 'no-store')
  return response
}
