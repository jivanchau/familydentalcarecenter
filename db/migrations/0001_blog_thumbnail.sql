-- Adds the thumbnail column to databases created before thumbnails existed.
--   npx wrangler d1 execute freshdent-db --local  --file=db/migrations/0001_blog_thumbnail.sql
--   npx wrangler d1 execute freshdent-db --remote --file=db/migrations/0001_blog_thumbnail.sql
ALTER TABLE blogs ADD COLUMN thumbnail TEXT;
