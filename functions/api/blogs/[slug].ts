/// <reference types="@cloudflare/workers-types" />
// GET /api/blogs/:slug — a single post.
import { json, type Env } from '../../../server/shared'

export const onRequestGet: PagesFunction<Env, 'slug'> = async ({ params, env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)

  const post = await env.DB.prepare(
    'SELECT slug, title, description, thumbnail, created_at AS createdAt FROM blogs WHERE slug = ?',
  )
    .bind(String(params.slug))
    .first()

  return post ? json(post, 200, { 'cache-control': 'no-cache' }) : json({ error: 'Not found' }, 404)
}
