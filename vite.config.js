import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // A second real HTML entry for /resume. The SPA sets the title in an
      // effect, which any crawler that doesn't execute JS never sees — so
      // LinkedIn, Slack and Facebook previewed the home page's tags on the
      // résumé URL. Both entries boot the same app; only the <head> differs.
      input: {
        main: resolve(__dirname, 'index.html'),
        resume: resolve(__dirname, 'resume.html'),
      },
    },
  },
})
