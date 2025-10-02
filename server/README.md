# ACE Server

Express server with Firebase Admin auth verification. Verifies Firebase ID tokens issued by the frontend login (`src/context/AuthContext.js`) and exposes protected endpoints.

## Setup

1. Install dependencies:

```bash
npm install --prefix server
```

2. Configure environment variables. Copy `.env.example` to `.env` and set one of the Firebase Admin credential options:

- FIREBASE_SERVICE_ACCOUNT_JSON: base64 of your service account JSON
- or set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON

Optionally set `CORS_ORIGIN` (comma-separated) and `PORT`.

## Run

```bash
npm run dev --prefix server
```

Server starts on `http://localhost:8080` by default.

## Endpoints

- GET `/health` — public health check.
- GET `/api/me` — protected; requires `Authorization: Bearer <Firebase ID token>`.

The frontend already attaches the ID token in `src/api/client.js`.
