/// <reference types="@cloudflare/workers-types" />
// GET  /api/admin/blogs  → every post (for the admin list)
// POST /api/admin/blogs  { title, slug, description, thumbnail? } → create a post
import { json, parseBlog, type Env } from '../../../../server/shared'

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)
  const { results } = await env.DB.prepare(
    `SELECT slug, title, thumbnail, created_at AS createdAt, updated_at AS updatedAt
     FROM blogs ORDER BY created_at DESC, rowid DESC`,
  ).all()
  return json({ items: results })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)
  const input = parseBlog(await request.json().catch(() => null))
  if (typeof input === 'string') return json({ error: input }, 422)

  const exists = await env.DB.prepare('SELECT 1 FROM blogs WHERE slug = ?').bind(input.slug).first()
  if (exists) return json({ error: 'A post with this slug already exists. Choose a different slug.' }, 409)

  await env.DB.prepare('INSERT INTO blogs (slug, title, description, thumbnail) VALUES (?, ?, ?, ?)')
    .bind(input.slug, input.title, input.description, input.thumbnail)
    .run()
  return json({ ok: true, slug: input.slug }, 201)
}
