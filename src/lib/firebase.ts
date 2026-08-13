import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const env = import.meta.env

// Defensive: env values may be pasted straight from the console's
// firebaseConfig snippet (with quotes / trailing commas). Tolerate it.
const clean = (v: string | undefined): string =>
  (v ?? '').trim().replace(/^"+|"+$|,+$/g, '')

const opts = {
  apiKey: clean(env.VITE_FIREBASE_API_KEY),
  authDomain: clean(env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: clean(env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: clean(env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(env.VITE_FIREBASE_APP_ID),
}

export const isConfigured = Boolean(opts.apiKey && opts.projectId && opts.appId)

export const app: FirebaseApp | null = isConfigured ? initializeApp(opts) : null
export const auth: Auth | null = app ? getAuth(app) : null
export const db: Firestore | null = app ? getFirestore(app) : null
