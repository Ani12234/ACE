import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

dotenv.config()

const app = express()
app.use(express.json({ limit: '2mb' }))
app.use(cors({ origin: true, credentials: true }))
app.use(morgan('dev'))

// In-memory stores (dev only)
const sessions = new Map() // sessionId -> { candidateEmail, domain, startedAt, qIndex }
const references = new Map() // sessionId -> { imageBase64, createdAt }

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'vision-service' })
})

// Interview: start
app.post('/api/start', (req, res) => {
  const { candidateEmail, domain } = req.body || {}
  if (!candidateEmail || !domain) {
    return res.status(400).json({ error: 'candidateEmail and domain are required' })
  }
  const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  sessions.set(sessionId, { candidateEmail, domain, startedAt: Date.now(), qIndex: 0 })
  const firstQ = { id: 'q1', text: `Introduce yourself and explain your experience in ${domain}.` }
  return res.json({ sessionId, firstQ })
})

// Interview: answer -> naive feedback and next question
app.post('/api/answer', (req, res) => {
  const { sessionId, questionId, candidateText } = req.body || {}
  if (!sessionId || !candidateText) {
    return res.status(400).json({ error: 'sessionId and candidateText are required' })
  }
  const s = sessions.get(sessionId)
  if (!s) return res.status(404).json({ error: 'session not found' })

  // very naive feedback
  const lengthScore = Math.min(1, (candidateText?.split(/\s+/).length || 0) / 120)
  const feedback = {
    summary: `Good answer with ${Math.round(lengthScore * 100)}% completeness.`,
    tips: lengthScore < 0.5 ? 'Add more details and examples.' : 'Well elaborated. Consider adding metrics.'
  }
  s.qIndex += 1
  const total = 6
  const nextQuestion = s.qIndex < total
    ? { id: `q${s.qIndex + 1}`, text: `Discuss a project related to ${s.domain} highlighting challenges and impact.` }
    : null
  const progress = { current: s.qIndex, total }
  return res.json({ feedback, nextQuestion, progress })
})

// Event ingestion (malpractice, telemetry) – dev no-op storage
app.post('/api/event', (req, res) => {
  const { sessionId, type, payload } = req.body || {}
  if (!sessionId || !type) return res.status(400).json({ error: 'sessionId and type are required' })
  // In real service, persist to DB. Here just acknowledge.
  return res.json({ ok: true })
})

// Finish session – return a basic summary
app.post('/api/finish', (req, res) => {
  const { sessionId } = req.body || {}
  const s = sessions.get(sessionId)
  if (!s) return res.status(404).json({ error: 'session not found' })
  const summary = { sessionId, domain: s.domain, startedAt: s.startedAt, finishedAt: Date.now(), questionsAsked: s.qIndex + 1 }
  sessions.delete(sessionId)
  return res.json({ summary })
})

// Vision: create reference
app.post('/api/vision/reference', (req, res) => {
  const { sessionId, imageBase64 } = req.body || {}
  if (!sessionId || !imageBase64) {
    return res.status(400).json({ error: 'sessionId and imageBase64 are required' })
  }
  references.set(sessionId, { imageBase64, createdAt: Date.now() })
  return res.json({ ok: true })
})

// Vision: verify
app.post('/api/vision/verify', (req, res) => {
  const { sessionId, imageBase64 } = req.body || {}
  if (!sessionId || !imageBase64) {
    return res.status(400).json({ error: 'sessionId and imageBase64 are required' })
  }
  const hasRef = references.has(sessionId)
  // Mock some stable results
  const facesCount = 1
  const multipleFaces = facesCount > 1
  const lookingAway = false
  const matchScore = hasRef ? 0.97 : 0.0
  return res.json({ ok: hasRef, matchScore, multipleFaces, lookingAway, facesCount, headPose: { pitch: 2, yaw: -1, roll: 0 } })
})

const PORT = process.env.PORT || 4100
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`vision-service listening on http://localhost:${PORT}`)
})
