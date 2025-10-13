import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()

// In-memory stores (dev/demo). For production, persist to DB/storage.
const ragStore = new Map() // domainId -> [{ id, text }]
const sessions = new Map() // sessionId -> { userId, email, domain, qIndex, startedAt, qa: [] }
const references = new Map() // sessionId -> { imageBase64, createdAt }

router.get('/me', requireAuth, (req, res) => {
  // `req.user` is from Firebase ID token claims
  res.json({ user: req.user })
})

// Filesystem-backed domains for UI selection (wrapped payload the UI expects)
router.get('/rag/domains', async (_req, res) => {
  try {
    let entries = []
    try {
      entries = await fs.readdir(RAG_STORAGE_ROOT, { withFileTypes: true })
    } catch {
      res.set('Cache-Control', 'no-store')
      return res.json({ domains: [] })
    }
    const ids = entries
      .filter((e) => e.isDirectory())
      .map((e) => decodeURIComponent(e.name))
      .sort((a, b) => a.localeCompare(b))
    const domains = ids.map((id) => ({ id, title: humanize(id) }))
    res.set('Cache-Control', 'no-store')
    return res.json({ domains })
  } catch {
    return res.status(500).json({ error: 'failed to list domains' })
  }
})

// Resolve storage root for RAG domains
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DEFAULT_RAG_STORAGE = path.join(__dirname, '..', '..', 'data', 'llamaindex')
const RAG_STORAGE_ROOT = process.env.RAG_STORAGE_ROOT || DEFAULT_RAG_STORAGE

// Filesystem-backed RAG domains (optional) — lists directories under storage root
router.get('/rag/domains-fs', async (_req, res) => {
  try {
    let entries = []
    try {
      entries = await fs.readdir(RAG_STORAGE_ROOT, { withFileTypes: true })
    } catch {
      // storage root may not exist yet
      res.set('Cache-Control', 'no-store')
      return res.json([])
    }
    const domains = entries
      .filter((e) => e.isDirectory())
      .map((e) => decodeURIComponent(e.name))
      .sort((a, b) => a.localeCompare(b))
    res.set('Cache-Control', 'no-store')
    return res.json(domains)
  } catch (e) {
    return res.status(500).json({ error: 'failed to list domains' })
  }
})

function humanize(id) {
  try {
    return String(id)
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase())
  } catch {
    return String(id)
  }
}

// Admin upload RAG text for a domain (accepts raw text)
router.post('/rag/upload', requireAuth, async (req, res) => {
  try {
    const { domainId, text } = req.body || {}
    if (!domainId || !text) return res.status(400).json({ error: 'domainId and text are required' })
    const items = ragStore.get(domainId) || []
    const chunks = chunkText(String(text))
    const mapped = chunks.map((t, i) => ({ id: `${Date.now()}-${i}`, text: t }))
    const next = [...items, ...mapped]
    ragStore.set(domainId, next)
    return res.json({ ok: true, added: mapped.length, total: next.length })
  } catch (e) {
    return res.status(500).json({ error: 'failed to upload rag', details: e?.message })
  }
})

// Start interview: select domain from uploaded RAG, generate first question via RAG+LLM (fallback template)
router.post('/interview/start', requireAuth, async (req, res) => {
  try {
    let { domainId, domain, domain_id } = req.body || {}
    let selectedDomain = domainId || domain || domain_id
    if (!selectedDomain) {
      // Try to pick the first available domain from storage root
      try {
        const entries = await fs.readdir(RAG_STORAGE_ROOT, { withFileTypes: true })
        const ids = entries.filter(e => e.isDirectory()).map(e => decodeURIComponent(e.name)).sort()
        if (ids.length) selectedDomain = ids[0]
      } catch {}
    }
    if (!selectedDomain) selectedDomain = 'general'
    const chunks = ragStore.get(selectedDomain) || []
    const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
    const user = req.user || {}
    sessions.set(sessionId, { userId: user.uid, email: user.email, domain: selectedDomain, qIndex: 0, startedAt: Date.now(), qa: [] })
    const questionText = await generateQuestion(selectedDomain, chunks, null)
    const firstQ = { id: 'q1', text: questionText }
    return res.json({ sessionId, firstQ })
  } catch (e) {
    return res.status(500).json({ error: 'failed to start interview', details: e?.message })
  }
})

// Submit answer, get feedback and next question via RAG+LLM
router.post('/interview/answer', requireAuth, async (req, res) => {
  try {
    const { sessionId, questionId, candidateText } = req.body || {}
    if (!sessionId || !candidateText) return res.status(400).json({ error: 'sessionId and candidateText are required' })
    const s = sessions.get(sessionId)
    if (!s) return res.status(404).json({ error: 'session not found' })
    s.qa.push({ qid: questionId, a: candidateText, at: Date.now() })
    const chunks = ragStore.get(s.domain) || []
    const feedback = await generateFeedback(s.domain, chunks, candidateText)
    s.qIndex += 1
    const total = 6
    let nextQuestion = null
    if (s.qIndex < total) {
      const qText = await generateQuestion(s.domain, chunks, candidateText)
      nextQuestion = { id: `q${s.qIndex + 1}`, text: qText }
    }
    const progress = { current: s.qIndex, total }
    return res.json({ feedback, nextQuestion, progress })
  } catch (e) {
    return res.status(500).json({ error: 'failed to submit answer', details: e?.message })
  }
})

// Finish interview, compute summary via LLM (fallback simple scoring)
router.post('/interview/finish', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.body || {}
    const s = sessions.get(sessionId)
    if (!s) return res.status(404).json({ error: 'session not found' })
    const chunks = ragStore.get(s.domain) || []
    const summary = await summarizeInterview(s, chunks)
    sessions.delete(sessionId)
    return res.json({ summary })
  } catch (e) {
    return res.status(500).json({ error: 'failed to finish interview', details: e?.message })
  }
})

// Vision endpoints (simple placeholders; integrate YOLO service via env if available)
router.post('/vision/reference', requireAuth, (req, res) => {
  const { sessionId, imageBase64 } = req.body || {}
  if (!sessionId || !imageBase64) return res.status(400).json({ error: 'sessionId and imageBase64 are required' })
  references.set(sessionId, { imageBase64, createdAt: Date.now() })
  return res.json({ ok: true })
})

// Alias to avoid 404s from clients calling /api/interview/vision/reference
router.post('/interview/vision/reference', requireAuth, (req, res) => {
  const { sessionId, imageBase64 } = req.body || {}
  if (!sessionId || !imageBase64) return res.status(400).json({ error: 'sessionId and imageBase64 are required' })
  references.set(sessionId, { imageBase64, createdAt: Date.now() })
  return res.json({ ok: true, alias: true })
})

router.post('/vision/verify', requireAuth, async (req, res) => {
  const { sessionId } = req.body || {}
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' })
  const hasRef = references.has(sessionId)
  // TODO: If YOLO verification endpoint available, call it here with current frame
  return res.json({ ok: hasRef, matchScore: hasRef ? 0.96 : 0.0, multipleFaces: false, lookingAway: false, facesCount: 1, headPose: { pitch: 1, yaw: -1, roll: 0 } })
})

// Lightweight scoring endpoint to avoid 404s and heavy LLM usage
router.post('/scoring/final', requireAuth, async (req, res) => {
  try {
    const { sessionId, qa = [], proctor = {} } = req.body || {}
    // Heuristic content/delivery scores based on length and basic structure
    const norm = (v, a, b) => Math.max(0, Math.min(1, (v - a) / Math.max(1, b - a)))
    const answers = Array.isArray(qa) ? qa : []
    const lengths = answers.map(x => String(x?.answer || '').trim().length)
    const avgLen = lengths.length ? (lengths.reduce((s, n) => s + n, 0) / lengths.length) : 0
    const content10 = Math.round(10 * norm(avgLen, 60, 500)) // reward moderate detail
    const delivery10 = Math.round(10 * norm(avgLen, 40, 300)) // brevity/clarity proxy
    const integrity = typeof proctor?.integrity === 'number' ? proctor.integrity : 1
    const severeCount = (proctor?.events || []).filter(e => e?.severity === 'high').length
    const integrityAdj10 = (integrity < 0.8 ? -2 : 0) + (severeCount > 0 ? -1 : 0)
    const rawOverall = content10 * 0.7 + delivery10 * 0.3 + integrityAdj10
    const overall10 = Math.max(0, Math.min(10, Math.round(rawOverall)))
    const overall100 = Math.round(overall10 * 10)

    // Simple suggestions
    const strengths = []
    if (avgLen > 120) strengths.push('Provides sufficient detail in answers')
    strengths.push('Maintains coherent flow in responses')
    const weaknesses = []
    if (avgLen < 100) weaknesses.push('Answers are too brief; add specifics and examples')
    weaknesses.push('Could structure answers with definition, key points, example, and trade-offs')
    const improvements = [
      'Use a clear structure: what, how, example, trade-offs',
      'Include 1–2 concrete examples or metrics per answer',
      'Keep answers concise but complete (2–4 sentences each)'
    ]

    const report = {
      content_score_10: content10,
      delivery_score_10: delivery10,
      integrity_adjustment_10: integrityAdj10,
      overall_score_10: overall10,
      overall_score_100: overall100,
      strengths,
      weaknesses,
      improvements,
      confidence: 0.6,
      raw: { avg_answer_length: avgLen, severe_events: severeCount, integrity }
    }

    // keep a minimal session record if present
    const s = sessions.get(sessionId)
    if (s) {
      s.finalReport = report
      s.endedAt = Date.now()
      s.status = 'ended'
    }

    res.json({ sessionId, report })
  } catch (e) {
    res.status(500).json({ error: 'final scoring failed' })
  }
})

// --- Helpers ---
function chunkText(text, chunkSize = 900, overlap = 150) {
  const clean = String(text || '').replace(/\r\n?/g, '\n').trim()
  if (!clean) return []
  const chunks = []
  let i = 0
  while (i < clean.length) {
    const end = Math.min(clean.length, i + chunkSize)
    const slice = clean.slice(i, end)
    chunks.push(slice)
    if (end >= clean.length) break
    i = Math.max(0, end - overlap)
  }
  return chunks
}

function keywordRetrieve(query, chunks, k = 3) {
  const q = String(query || '').toLowerCase()
  return (chunks || [])
    .map((c) => ({ text: c.text ?? c, score: scoreChunk(q, String(c.text ?? c)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

function scoreChunk(q, c) {
  const terms = q.split(/[^a-z0-9]+/).filter(Boolean)
  let score = 0
  for (const t of terms) {
    score += (c.split(t).length - 1)
  }
  return score
}

async function generateQuestion(domainId, chunks, context) {
  // Prefer local chunks; when empty, try upstream RAG server questions
  const localTop = keywordRetrieve(context || domainId, chunks, 3).map(c => c.text).join('\n---\n')
  if (!localTop && (!chunks || chunks.length === 0)) {
    const upstream = process.env.RAG_UPSTREAM || 'http://localhost:4000'
    try {
      const resp = await fetch(`${upstream}/api/rag/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainId, count: 10, targetDifficulty: 'medium', radius: 1 }),
      })
      if (resp.ok) {
        const data = await resp.json()
        const items = Array.isArray(data?.items) ? data.items : []
        if (items.length) return items[0]?.question || `Explain a key concept related to ${domainId} from the provided materials.`
      }
    } catch {}
  }
  const sys = `You are an expert interviewer for the domain: ${domainId}. Using the provided context, ask a concise, specific interview question. Do not include answers.`
  const prompt = `Context:\n${localTop}\n\nAsk one question:`
  const llm = await callOllama(sys, prompt)
  return llm || `Explain a key concept related to ${domainId} from the provided materials.`
}

async function generateFeedback(domainId, chunks, answer) {
  const top = keywordRetrieve(answer, chunks, 3).map(c => c.text).join('\n---\n')
  const sys = `You are a strict technical interviewer for ${domainId}. Evaluate the candidate's answer. Provide a short summary and 1-2 actionable tips.`
  const prompt = `Relevant context:\n${top}\n\nCandidate answer:\n${answer}\n\nFeedback (summary + tips):`
  const llm = await callOllama(sys, prompt)
  return llm || 'Good attempt. Provide clearer structure and concrete examples next time.'
}

async function summarizeInterview(session, chunks) {
  const joined = session.qa.map((x, i) => `Q${i+1}: ${x.q}\nA${i+1}: ${x.a}`).join('\n\n')
  const sys = `You are creating a final interview report.`
  const prompt = `Domain: ${session.domain}\nTranscript:\n${joined}\n\nCreate a concise report with strengths, weaknesses, and a final score out of 10.`
  const llm = await callOllama(sys, prompt)
  return llm || { summary: 'Interview concluded', score: 7 }
}

async function callOllama(systemPrompt, userPrompt) {
  try {
    const host = process.env.OLLAMA_HOST || 'http://localhost:11434'
    const model = process.env.OLLAMA_MODEL || 'llama3'
    const resp = await fetch(`${host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        prompt: userPrompt,
        stream: false
      })
    })
    if (!resp.ok) return ''
    const data = await resp.json()
    // Ollama returns { response: '...' }
    return data?.response || ''
  } catch {
    return ''
  }
}

export default router
