import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.join(here, 'ui'),
  plugins: [react()],
  build: {
    outDir: path.join(here, 'dist', 'ui'),
    emptyOutDir: true,
  },
  server: {
    // dev convenience: point at a running `node server/index.js` instance
    proxy: { '/api': 'http://127.0.0.1:4400' },
  },
})
