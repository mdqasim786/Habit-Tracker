import type { ReactNode } from 'react'

const KEYS = [
  ['VITE_FIREBASE_API_KEY', 'apiKey'],
  ['VITE_FIREBASE_AUTH_DOMAIN', 'authDomain'],
  ['VITE_FIREBASE_PROJECT_ID', 'projectId'],
  ['VITE_FIREBASE_STORAGE_BUCKET', 'storageBucket'],
  ['VITE_FIREBASE_MESSAGING_SENDER_ID', 'messagingSenderId'],
  ['VITE_FIREBASE_APP_ID', 'appId'],
] as const

export function SetupPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h1 className="text-lg font-bold text-zinc-50">Connect Firebase</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Discipline needs a Firebase project to run. This build reads keys from an env file —
          your keys never ship to the browser if you don't commit them.
        </p>
        <ol className="mt-5 flex flex-col gap-3 text-sm text-zinc-300">
          <Step n="1">
            Create a project at{' '}
            <a className="text-emerald-400 underline underline-offset-2" href="https://console.firebase.google.com" target="_blank" rel="noreferrer">
              console.firebase.google.com
            </a>
          </Step>
          <Step n="2">
            Enable <b>Authentication</b> (Google and/or Email/Password) and{' '}
            <b>Cloud Firestore</b>. Set Firestore rules to allow reads/writes for logged-in
            users on their own data.
          </Step>
          <Step n="3">
            Register a <b>web app</b> and copy your config values.
          </Step>
          <Step n="4">
            Copy <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">.env.example</code> to{' '}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">.env.local</code> and fill in
            the values below.
          </Step>
        </ol>
        <pre className="mt-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-400">
          {KEYS.map(([env, key]) => (
            <div key={env}>
              <span className="text-zinc-500">▸ {env}</span> = your {key}
            </div>
          ))}
        </pre>
        <p className="mt-4 text-xs text-zinc-500">
          Restart <code className="rounded bg-zinc-800 px-1.5 py-0.5">npm run dev</code> after adding
          the file.
        </p>
      </div>
    </div>
  )
}

function Step({ n, children }: { n: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
        {n}
      </span>
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  )
}