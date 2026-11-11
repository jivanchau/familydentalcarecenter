/// <reference types="@cloudflare/workers-types" />
// GET /blog/:slug — serves the app's index.html with the post's own title, description and image
// in <title>, meta description and Open Graph tags, so Facebook (and other link previews, which
// don't run JavaScript) show a proper card for the shared post.
import { type Env as BaseEnv } from '../../server/shared'

type Env = BaseEnv & { ASSETS: Fetcher }

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Plain-text summary from the post body (strips the editor's formatting marks). */
const summary = (text: string, max = 200) => {
  const clean = text
    .replace(/^(#{2,3}\s+|[-*]\s+|\d+\.\s+|>\s?)/gm, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*|\*([^*]+)\*/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim()
  return clean.length > max ? clean.slice(0, max).replace(/\s+\S*$/, '') + '…' : clean
}

export const onRequestGet: PagesFunction<Env, 'slug'> = async ({ request, env, params }) => {
  const page = await env.ASSETS.fetch(new URL('/', request.url))
  if (!env.DB) return page

  const post = await env.DB.prepare('SELECT title, description, thumbnail FROM blogs WHERE slug = ?')
    .bind(String(params.slug))
    .first<{ title: string; description: string; thumbnail: string | null }>()
    .catch(() => null)
  if (!post) return page // the app shows its own "not found" page

  const origin = new URL(request.url).origin
  const url = `${origin}/blog/${encodeURIComponent(String(params.slug))}`
  const title = `${post.title} | FamilyDentalCareCenter`
  const description = summary(post.description)
  const image = post.thumbnail ? origin + post.thumbnail : `${origin}/img/images/hero-smile.jpg`

  const tags = [
    ['og:type', 'article'],
    ['og:site_name', 'Family Dental Care Center'],
    ['og:title', post.title],
    ['og:description', description],
    ['og:url', url],
    ['og:image', image],
  ]
    .map(([p, c]) => `<meta property="${p}" content="${attr(c)}" />`)
    .concat([
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<link rel="canonical" href="${attr(url)}" />`,
    ])
    .join('\n    ')

  const res = new HTMLRewriter()
    .on('title', { element: (el) => void el.setInnerContent(title) })
    .on('meta[name="description"]', { element: (el) => void el.setAttribute('content', description) })
    .on('head', { element: (el) => void el.append(tags, { html: true }) })
    .transform(page)

  const headers = new Headers(res.headers)
  headers.set('cache-control', 'no-cache')
  return new Response(res.body, { status: 200, headers })
}
