/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Lokal ishlab chiqishda /api/* so'rovlarini api/ papkadagi funksiyalarga yo'naltiradi
// (Vercel'da bu avtomatik ishlaydi).
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\//, '')
        if (!/^[\w-]+$/.test(name)) return next()
        let body = ''
        for await (const chunk of req) body += chunk
        try {
          req.body = body ? JSON.parse(body) : {}
        } catch {
          req.body = {}
        }
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
          return res
        }
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          res.status(500).json({ error: err.message })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // .env.local dagi ANTHROPIC_API_KEY ni server tomonga uzatamiz (brauzerga emas)
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [tailwindcss(), localApi()],
  }
})
