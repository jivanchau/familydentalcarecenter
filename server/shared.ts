/// <reference types="@cloudflare/workers-types" />
export interface Env {
  DB?: D1Database
  /** R2 bucket for uploaded blog thumbnails (served at /media/...). */
  MEDIA?: R2Bucket
  /** Admin login. Set as secrets: `wrangler pages secret put ADMIN_PASSWORD` (locally in .dev.vars). */
  ADMIN_USERNAME?: string
  ADMIN_PASSWORD?: string
  /** Long random string used to sign the admin session cookie. */
  SESSION_SECRET?: string
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', ...headers } })

// ---------- Blog validation ----------

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type BlogInput = { title: string; slug: string; description: string; thumbnail: string | null }

/** Only images uploaded through the admin are accepted: /media/blog/<uuid>.<ext> */
export const MEDIA_URL_RE = /^\/media\/(blog\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:webp|jpg|png))$/

/** "/media/blog/x.webp" → "blog/x.webp" (the R2 key), or null for anything else. */
export const mediaKey = (url: unknown) => (typeof url === 'string' ? (MEDIA_URL_RE.exec(url)?.[1] ?? null) : null)

/** Validates and normalises a blog payload. Returns the clean input or an error message. */
export function parseBlog(body: unknown): BlogInput | string {
  const b = (body ?? {}) as Record<string, unknown>
  const title = typeof b.title === 'string' ? b.title.trim() : ''
  const slug = typeof b.slug === 'string' ? b.slug.trim().toLowerCase() : ''
  const description = typeof b.description === 'string' ? b.description.replace(/\r\n/g, '\n').trim() : ''
  if (title.length < 3 || title.length > 150) return 'Title must be 3–150 characters.'
  if (!SLUG_RE.test(slug) || slug.length > 120) return 'Slug may only contain lowercase letters, numbers and single hyphens (e.g. my-first-post).'
  if (description.length < 20 || description.length > 50_000) return 'Description must be 20–50,000 characters.'
  let thumbnail: string | null = null
  if (b.thumbnail != null && b.thumbnail !== '') {
    if (!mediaKey(b.thumbnail)) return 'Thumbnail must be an image uploaded through the admin.'
    thumbnail = b.thumbnail as string
  }
  return { title, slug, description, thumbnail }
}

// ---------- Admin session (HMAC-signed cookie) ----------

export const SESSION_COOKIE = 'fd_admin'
const SESSION_TTL_SECONDS = 8 * 60 * 60 // 8 hours

const enc = new TextEncoder()

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Constant-time string comparison (compares HMACs so lengths never leak). */
export async function safeEqual(a: string, b: string, secret: string): Promise<boolean> {
  const [x, y] = await Promise.all([hmac(secret, a), hmac(secret, b)])
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.min(x.length, y.length); i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i)
  return diff === 0
}

export function adminConfigured(env: Env): env is Env & Required<Pick<Env, 'ADMIN_USERNAME' | 'ADMIN_PASSWORD' | 'SESSION_SECRET'>> {
  return Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.SESSION_SECRET && env.SESSION_SECRET.length >= 32)
}

export async function createSessionCookie(secret: string, secure: boolean): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const value = `${exp}.${await hmac(secret, `admin.${exp}`)}`
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? '; Secure' : ''}`
}

export const clearSessionCookie = (secure: boolean) =>
  `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`

export async function hasValidSession(request: Request, secret: string): Promise<boolean> {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  if (!match) return false
  const [expStr, sig] = match[1].split('.')
  const exp = Number(expStr)
  if (!exp || !sig || exp < Date.now() / 1000) return false
  return safeEqual(sig, await hmac(secret, `admin.${exp}`), secret)
}

export const isHttps = (request: Request) => new URL(request.url).protocol === 'https:'
