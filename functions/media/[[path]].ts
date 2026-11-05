/// <reference types="@cloudflare/workers-types" />
// GET /media/blog/<uuid>.<ext> — serves uploaded images from R2 (cached for a year; keys never change).
import { MEDIA_URL_RE, type Env } from '../../server/shared'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const { pathname } = new URL(request.url)
  const key = MEDIA_URL_RE.exec(pathname)?.[1]
  if (!key || !env.MEDIA) return new Response('Not found', { status: 404 })

  const object = await env.MEDIA.get(key)
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  headers.set('x-content-type-options', 'nosniff')
  return new Response(object.body, { headers })
}
