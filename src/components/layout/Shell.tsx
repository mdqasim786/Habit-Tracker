import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TodayPage } from '@/pages/Today'
import { CalendarPage } from '@/pages/Calendar'
import { ProfilePage } from '@/pages/Profile'
import { PhasePieChart } from '@/components/today/PhasePieChart'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'

type View = 'today' | 'calendar' | 'profile'

const NAV: { id: View; label: string; icon: ReactNode }[] = [
  { id: 'today', label: 'Today', icon: <IconBolt /> },
  { id: 'calendar', label: 'Calendar', icon: <IconCalendar /> },
  { id: 'profile', label: 'Profile', icon: <IconChart /> },
]

export function Shell() {
  const [view, setView] = useState<View>('today')
  const { user, signOutUser } = useAuth()
  const { habits, completions } = useData()

  return (
    <div className="flex min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-zinc-800/90 bg-zinc-950/95 backdrop-blur-xl p-4 lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-1">
          <LogoMark />
          <span className="text-base font-bold tracking-tight text-zinc-50">Discipline</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                view === item.id
                  ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/20 shadow-sm shadow-emerald-900/10'
                  : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-6 rounded-xl surface p-4">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Today's Phases
          </p>
          <PhasePieChart habits={habits} completions={completions} />
        </div>
        <div className="mt-auto">
          <div className="mb-3 rounded-xl surface p-3">
            <div className="flex items-center gap-2.5">
              <Avatar email={user?.email ?? '?'} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-zinc-200">
                  {user?.displayName ?? 'Habit keeper'}
                </p>
                <p className="truncate text-[11px] text-zinc-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOutUser}
              className="mt-3 w-full cursor-pointer rounded-lg py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-60">
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {view === 'today' && <TodayPage />}
              {view === 'calendar' && <CalendarPage />}
              {view === 'profile' && <ProfilePage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800/90 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
                view === item.id ? 'text-emerald-400' : 'text-zinc-500',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export function LogoMark() {
  return (
    <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30">
      <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
        <path d="M10 7v18M10 7l12 9-12 9" stroke="#10b981" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Avatar({ email }: { email: string }) {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
      {(email || '?').charAt(0).toUpperCase()}
    </div>
  )
}

const stroke = {
  width: '18',
  height: '18',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function IconBolt() {
  return (
    <svg {...stroke}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg {...stroke}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg {...stroke}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </svg>
  )
}