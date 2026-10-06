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
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
        <h1 className="text-lg font-bold text-slate-900">Connect Firebase</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Discipline needs a Firebase project to run. Add your Firebase web-app configuration to a
          local env file; it is ignored by Git so it will not be committed accidentally.
        </p>
        <ol className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
          <Step n="1">
            Create a project at{' '}
            <a
              className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
            >
              console.firebase.google.com
            </a>
          </Step>
          <Step n="2">
            Enable <b>Authentication</b> (Google and/or Email/Password) and <b>Cloud Firestore</b>.
            Set Firestore rules to allow reads/writes for logged-in users on their own data.
          </Step>
          <Step n="3">
            Register a <b>web app</b> and copy your config values.
          </Step>
          <Step n="4">
            Copy <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.example</code>{' '}
            to <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">.env.local</code> and
            fill in the values below.
          </Step>
        </ol>
        <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          {KEYS.map(([env, key]) => (
            <div key={env}>
              <span className="text-slate-400">▸ {env}</span> = your {key}
            </div>
          ))}
        </pre>
        <p className="mt-4 text-xs text-slate-500">
          Restart <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run dev</code> after
          adding the file. Firebase web config is public by design; never add service-account or
          other server credentials here.
        </p>
      </div>
    </div>
  )
}

function Step({ n, children }: { n: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
        {n}
      </span>
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  )
}
