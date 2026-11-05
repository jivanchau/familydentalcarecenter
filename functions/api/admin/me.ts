/// <reference types="@cloudflare/workers-types" />
// GET /api/admin/me → 200 when signed in (the middleware returns 401 otherwise).
import { json, type Env } from '../../../server/shared'

export const onRequestGet: PagesFunction<Env> = async () => json({ ok: true })
