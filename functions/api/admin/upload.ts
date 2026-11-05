/// <reference types="@cloudflare/workers-types" />
// POST /api/admin/upload   body: raw image bytes (content-type image/jpeg|png|webp)  → { url }
// The browser resizes/compresses before upload; this checks the real file type from its bytes.
import { json, type Env } from '../../../server/shared'

const MAX_BYTES = 4 * 1024 * 1024 // 4 MB (after client-side compression, a thumbnail is usually ~100–300 KB)

/** Detects the image type from its magic bytes, ignoring whatever the client claimed. */
function sniff(b: Uint8Array): { ext: 'jpg' | 'png' | 'webp'; type: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: 'png', type: 'image/png' }
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to))
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return { ext: 'webp', type: 'image/webp' }
  return null
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.MEDIA) return json({ error: 'Image storage (R2 bucket "MEDIA") is not configured.' }, 503)

  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > MAX_BYTES) return json({ error: 'Image is too large (max 4 MB).' }, 413)

  const bytes = new Uint8Array(await request.arrayBuffer())
  if (bytes.byteLength === 0) return json({ error: 'No image received.' }, 400)
  if (bytes.byteLength > MAX_BYTES) return json({ error: 'Image is too large (max 4 MB).' }, 413)

  const kind = sniff(bytes)
  if (!kind) return json({ error: 'Only JPG, PNG or WebP images are allowed.' }, 415)

  const key = `blog/${crypto.randomUUID()}.${kind.ext}`
  await env.MEDIA.put(key, bytes, {
    httpMetadata: { contentType: kind.type, cacheControl: 'public, max-age=31536000, immutable' },
  })
  return json({ url: `/media/${key}` }, 201)
}
