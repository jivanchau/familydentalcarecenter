-- Cloudflare D1 schema. Apply with:
--   npm run db:schema          (production)
--   npm run db:local           (local dev)

CREATE TABLE IF NOT EXISTS blogs (
  slug         TEXT PRIMARY KEY,                       -- URL: /blog/<slug>
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,                          -- post text (simple Markdown: **bold**, *italic*, ## headings, lists, > quotes, [links](url))
  thumbnail    TEXT,                                   -- /media/blog/<uuid>.<ext> in the R2 bucket, or NULL
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs (created_at DESC);

CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  ip         TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
