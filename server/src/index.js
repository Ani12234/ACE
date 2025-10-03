import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import './firebaseAdmin.js'
import protectedRoutes from './routes/protected.js'

dotenv.config()

const app = express()

// Middleware
app.use(express.json({ limit: '1mb' }))
app.use(cors({
  origin: (process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
    : true),
  credentials: true,
}))
app.use(morgan('dev'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ace-server' })
})

// Protected routes mounted under /api
app.use('/api', protectedRoutes)

const PORT = process.env.PORT || 4000
// Only start a local server outside Vercel serverless
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

// Export the app for Vercel serverless
export default app
