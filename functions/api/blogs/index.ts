/// <reference types="@cloudflare/workers-types" />
// GET /api/blogs?page=1&limit=9 — public list of posts (newest first), with a short excerpt.
import { json, type Env } from '../../../server/shared'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'Database not bound.' }, 503)

  const url = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit')) || 9))
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)

  const [list, count] = await env.DB.batch([
    env.DB.prepare(
      `SELECT slug, title, thumbnail, substr(description, 1, 260) AS excerpt, created_at AS createdAt
       FROM blogs ORDER BY created_at DESC, rowid DESC LIMIT ? OFFSET ?`,
    ).bind(limit, (page - 1) * limit),
    env.DB.prepare('SELECT COUNT(*) AS total FROM blogs'),
  ])

  return json(
    { items: list.results, total: (count.results[0] as { total: number }).total },
    200,
    { 'cache-control': 'no-cache' },
  )
}
