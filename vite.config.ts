import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // `npm run dev` serves the UI with hot reload; API calls are forwarded to the Cloudflare
    // runtime started by `npm run cf:dev` (port 8788), so blogs, admin and contact work too.
    proxy: { '/api': 'http://localhost:8788' },
  },
})
