import interviewClient from './interviewClient'

// Create reference embedding from a base64 image, optionally tying to a session
export async function createReference({ sessionId, imageBase64 }) {
  const res = await interviewClient.post('/vision/reference', { sessionId, imageBase64 })
  return res.data
}

// Verify a live frame against stored reference for a session
export async function verifyFrame({ sessionId, imageBase64 }) {
  const res = await interviewClient.post('/vision/verify', { sessionId, imageBase64 })
  return res.data
}
