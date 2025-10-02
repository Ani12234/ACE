import dotenv from 'dotenv'
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Load env vars
dotenv.config()

function initFirebaseAdmin() {
  if (getApps().length) return

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  const hasGAC = !!process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (b64) {
    // Expecting FIREBASE_SERVICE_ACCOUNT_JSON as Base64-encoded JSON of the service account
    const json = Buffer.from(b64, 'base64').toString('utf8')
    const creds = JSON.parse(json)
    initializeApp({ credential: cert(creds) })
  } else if (hasGAC) {
    // Use ADC (file path in GOOGLE_APPLICATION_CREDENTIALS or environment-provided)
    initializeApp({ credential: applicationDefault() })
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Minimal init with projectId (useful in emulators)
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID })
  } else {
    // Last resort
    initializeApp()
  }
}

initFirebaseAdmin()

export const adminAuth = getAuth()
