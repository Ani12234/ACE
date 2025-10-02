// Firebase client initialization for Vite
// Provide the following env vars in F:\ACE\ACE\.env (Vite uses VITE_ prefix):
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=...
// VITE_FIREBASE_PROJECT_ID=...
// VITE_FIREBASE_APP_ID=...
// VITE_FIREBASE_STORAGE_BUCKET=...
// VITE_FIREBASE_MESSAGING_SENDER_ID=...

import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

// Dev-time validation to aid debugging when env vars are missing or not picked up by Vite
if (import.meta.env.DEV) {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  const missing = required.filter((k) => !import.meta.env[k]);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error(
      '[Firebase] Missing Vite env vars:',
      missing.join(', '),
      '\nCreate F:/ACE/ACE/.env with these keys prefixed by VITE_ (e.g. VITE_FIREBASE_API_KEY=...)',
      '\nThen restart the Vite dev server.'
    );
  }
}

if (!getApps().length) {
  initializeApp(firebaseConfig)
}
