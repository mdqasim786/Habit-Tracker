import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setBusy(true)
    setError('')
    try {
      if (mode === 'in') await signInWithEmail(email, password)
      else await signUpWithEmail(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative grid min-h-dvh place-items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M10 7v18M10 7l12 9-12 9" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Discipline</h1>
          <p className="mt-1 text-sm text-zinc-500">Show up for yourself. Every scheduled day.</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
          <Button variant="outline" size="lg" className="w-full" onClick={signInWithGoogle}>
            <GoogleMark />
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-600">
            <div className="h-px flex-1 bg-zinc-800" /> or with email <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <button
            onClick={() => {
              setMode((m) => (m === 'in' ? 'up' : 'in'))
              setError('')
            }}
            className="mt-4 w-full cursor-pointer text-center text-xs text-zinc-500 hover:text-zinc-300"
          >
            {mode === 'in' ? "New here? Create an account" : 'Have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}