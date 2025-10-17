import api from './client'

// Create reference embedding from a base64 image, optionally tying to a session
export async function createReference({ sessionId, imageBase64 }) {
  const res = await api.post('/vision/reference', { sessionId, imageBase64 }, { timeout: 15000 })
  return res.data
}

// Verify a live frame against stored reference for a session
export async function verifyFrame({ sessionId, imageBase64 }) {
  const res = await api.post('/vision/verify', { sessionId, imageBase64 }, { timeout: 8000 })
  return res.data
}
