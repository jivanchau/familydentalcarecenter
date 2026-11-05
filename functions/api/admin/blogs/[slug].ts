/// <reference types="@cloudflare/workers-types" />
// GET    /api/admin/blogs/:slug → one post (for editing)
// PUT    /api/admin/blogs/:slug { title, slug, description, thumbnail? } → update (slug may change)
// DELETE /api/admin/blogs/:slug → delete (and its thumbnail)
import { json, mediaKey, parseBlog, type Env } from '../../../../server/shared'

const SELECT = 'SELECT slug, title, description, thumbnail, created_at AS createdAt, updated_at AS updatedAt FROM blogs WHERE slug = ?'

/** Removes an uploaded image from R2 once no post uses it. Failures are logged, never fatal. */
async function deleteImage(env: Env, url: unknown) {
  const key = mediaKey(url)
  if (!key || !env.MEDIA || !env.DB) return
  const stillUsed = await env.DB.prepare('SELECT 1 FROM blogs WHERE thumbnail = ?').bind(url).first()
  if (!stillUsed) await env.MEDIA.delete(key).catch((e) => console.error('R2 delete failed', key, e))
}

export const onRequestGet: PagesFunction<Env, 'slug'> = async ({ params, env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)
  const post = await env.DB.prepare(SELECT).bind(String(params.slug)).first()
  return post ? json(post) : json({ error: 'Post not found.' }, 404)
}

export const onRequestPut: PagesFunction<Env, 'slug'> = async ({ params, request, env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)
  const current = String(params.slug)
  const input = parseBlog(await request.json().catch(() => null))
  if (typeof input === 'string') return json({ error: input }, 422)

  const existing = await env.DB.prepare('SELECT thumbnail FROM blogs WHERE slug = ?').bind(current).first<{ thumbnail: string | null }>()
  if (!existing) return json({ error: 'Post not found.' }, 404)

  if (input.slug !== current) {
    const taken = await env.DB.prepare('SELECT 1 FROM blogs WHERE slug = ?').bind(input.slug).first()
    if (taken) return json({ error: 'Another post already uses this slug.' }, 409)
  }

  await env.DB.prepare(
    `UPDATE blogs SET slug = ?, title = ?, description = ?, thumbnail = ?, updated_at = datetime('now') WHERE slug = ?`,
  )
    .bind(input.slug, input.title, input.description, input.thumbnail, current)
    .run()

  if (existing.thumbnail && existing.thumbnail !== input.thumbnail) await deleteImage(env, existing.thumbnail)
  return json({ ok: true, slug: input.slug })
}

export const onRequestDelete: PagesFunction<Env, 'slug'> = async ({ params, env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)
  const slug = String(params.slug)
  const existing = await env.DB.prepare('SELECT thumbnail FROM blogs WHERE slug = ?').bind(slug).first<{ thumbnail: string | null }>()
  if (!existing) return json({ error: 'Post not found.' }, 404)

  await env.DB.prepare('DELETE FROM blogs WHERE slug = ?').bind(slug).run()
  if (existing.thumbnail) await deleteImage(env, existing.thumbnail)
  return json({ ok: true })
}
