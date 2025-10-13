import { adminAuth } from '../firebaseAdmin.js'

export async function requireAuth(req, res, next) {
  try {
    // Development bypass: allow anonymous or admin-token based access when enabled
    if (process.env.DEV_ALLOW_ANON === 'true') {
      req.user = { uid: 'dev-anon', email: 'anon@local' }
      return next()
    }
    const adminToken = req.headers['x-admin-token']
    if (adminToken && process.env.ADMIN_TOKEN && adminToken === process.env.ADMIN_TOKEN) {
      req.user = { uid: 'dev-admin', email: 'admin@local' }
      return next()
    }
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
