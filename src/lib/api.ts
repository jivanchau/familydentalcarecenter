import treatmentsJson from '../data/treatments.json'

export type Blog = { slug: string; title: string; description: string; thumbnail: string | null; createdAt: string; updatedAt?: string }
export type BlogSummary = { slug: string; title: string; thumbnail: string | null; excerpt: string; createdAt: string }

export type TreatmentGroup = 'orthodontics' | 'pain-relief' | 'replacement' | 'cosmetic' | 'family'
export type Treatment = { slug: string; title: string; group: TreatmentGroup; description: string; body: string }

/** Display order, names and icons of the treatment groups (used on /treatments). */
export const treatmentGroups: { key: TreatmentGroup; label: string; blurb: string; icon: string }[] = [
  { key: 'orthodontics', label: 'Orthodontics', blurb: 'Straighten teeth and correct the bite.', icon: 'fa-teeth' },
  { key: 'pain-relief', label: 'Pain Relief & Surgery', blurb: 'Treat infection, pain and gum problems.', icon: 'fa-kit-medical' },
  { key: 'replacement', label: 'Tooth Replacement', blurb: 'Rebuild or replace missing teeth.', icon: 'fa-tooth' },
  { key: 'cosmetic', label: 'Cosmetic Dentistry', blurb: 'Brighten and reshape your smile.', icon: 'fa-wand-magic-sparkles' },
  { key: 'family', label: 'Family & Prevention', blurb: 'Keep every smile in the family healthy.', icon: 'fa-people-roof' },
]

export const treatments = treatmentsJson as Treatment[]
export const findTreatment = (slug: string) => treatments.find((t) => t.slug === slug)

export const BLOGS_PER_PAGE = 9

/** Error with the HTTP status, so pages can tell "not signed in" (401) from other failures. */
export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      credentials: 'same-origin',
      headers: init?.body ? { 'content-type': 'application/json', ...init.headers } : init?.headers,
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }
  const isJson = res.headers.get('content-type')?.includes('json')
  const data = isJson ? await res.json().catch(() => ({})) : {}
  if (!res.ok || !isJson) {
    throw new ApiError((data as { error?: string }).error ?? 'The blog service is not available right now.', res.status)
  }
  return data as T
}

// ---------- Public blog API (Cloudflare Pages Functions + D1) ----------

export const fetchBlogs = (page = 1) =>
  request<{ items: BlogSummary[]; total: number }>(`/api/blogs?page=${page}&limit=${BLOGS_PER_PAGE}`)

export async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    return await request<Blog>(`/api/blogs/${encodeURIComponent(slug)}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}

export async function recentBlogs(exclude?: string, n = 4): Promise<BlogSummary[]> {
  const { items } = await fetchBlogs(1)
  return items.filter((b) => b.slug !== exclude).slice(0, n)
}

// ---------- Admin API (requires the signed session cookie) ----------

export type BlogInput = { title: string; slug: string; description: string; thumbnail: string | null }

export const admin = {
  me: () => request<{ ok: true }>('/api/admin/me'),
  login: (username: string, password: string) =>
    request<{ ok: true }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request<{ ok: true }>('/api/admin/logout', { method: 'POST', body: '{}' }),
  list: () => request<{ items: Omit<Blog, 'description'>[] }>('/api/admin/blogs'),
  get: (slug: string) => request<Blog>(`/api/admin/blogs/${encodeURIComponent(slug)}`),
  create: (data: BlogInput) => request<{ slug: string }>('/api/admin/blogs', { method: 'POST', body: JSON.stringify(data) }),
  update: (slug: string, data: BlogInput) =>
    request<{ slug: string }>(`/api/admin/blogs/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (slug: string) =>
    request<{ ok: true }>(`/api/admin/blogs/${encodeURIComponent(slug)}`, { method: 'DELETE', body: '{}' }),
  /** Uploads an image (already resized in the browser) and returns its public URL. */
  upload: (image: Blob) =>
    request<{ url: string }>('/api/admin/upload', { method: 'POST', body: image, headers: { 'content-type': image.type } }),
}

/** "My First Post!" → "my-first-post" */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)

/** Plain-text excerpt: strips the editor's formatting marks and collapses whitespace. */
export const toExcerpt = (text: string, max = 130) => {
  const clean = text
    .replace(/^(#{2,3}\s+|[-*]\s+|\d+\.\s+|>\s?)/gm, '') // headings, bullets, numbers, quotes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [text](url) → text
    .replace(/\*\*([^*]+)\*\*|\*([^*]+)\*/g, '$1$2') // **bold**, *italic*
    .replace(/\s+/g, ' ')
    .trim()
  return clean.length > max ? clean.slice(0, max).replace(/\s+\S*$/, '') + '…' : clean
}

export type ContactPayload = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  website?: string // honeypot
  turnstileToken?: string
}

export async function submitContact(data: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json().catch(() => ({}))
    return res.ok ? { ok: true } : { ok: false, error: json.error ?? 'Something went wrong. Please call us.' }
  } catch {
    return { ok: false, error: 'Could not reach the server. Please call or WhatsApp us.' }
  }
}

/** Formats D1 timestamps ("2026-10-20 09:30:00", UTC) or ISO dates as "20 October 2026". */
export const formatDate = (value: string) => {
  if (!value) return ''
  const d = new Date(/^\d{4}-\d{2}-\d{2} /.test(value) ? value.replace(' ', 'T') + 'Z' : value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
