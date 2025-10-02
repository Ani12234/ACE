import { adminAuth } from '../firebaseAdmin.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers['authorization'] || ''
    const match = header.match(/^Bearer\s+(.+)$/i)
    if (!match) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }
    const idToken = match[1]
    const decoded = await adminAuth.verifyIdToken(idToken, true)
    req.user = decoded
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', details: err?.message })
  }
}
