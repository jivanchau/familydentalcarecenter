/// <reference types="@cloudflare/workers-types" />
// POST /api/admin/logout → clears the session cookie.
import { clearSessionCookie, isHttps, json, type Env } from '../../../server/shared'

export const onRequestPost: PagesFunction<Env> = async ({ request }) =>
  json({ ok: true }, 200, { 'set-cookie': clearSessionCookie(isHttps(request)) })
