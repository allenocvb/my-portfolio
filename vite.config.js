import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { handleLeaderboard, memoryStore } from './api/_leaderboard.js'

// Serves /api/leaderboard during `npm run dev` with an in-memory store,
// so the game's global leaderboard works locally without Redis.
const devLeaderboard = () => ({
  name: 'dev-leaderboard',
  configureServer(server) {
    const store = memoryStore()
    server.middlewares.use('/api/leaderboard', async (req, res) => {
      const url = new URL(req.originalUrl || req.url, 'http://localhost')
      let raw = ''
      for await (const chunk of req) raw += chunk
      let body = null
      try { body = raw ? JSON.parse(raw) : null } catch { /* validated below */ }
      const { status, json } = await handleLeaderboard(
        { method: req.method, query: Object.fromEntries(url.searchParams), body },
        store,
      )
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(json))
    })
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devLeaderboard()],
  server: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
