import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TodayPage } from '@/pages/Today'
import { CompletedPage } from '@/pages/Completed'
import { CalendarPage } from '@/pages/Calendar'
import { ProfilePage } from '@/pages/Profile'
import { PhasePieChart } from '@/components/today/PhasePieChart'
import { useAuth } from '@/context/AuthContext'
import { Icon } from '@/components/ui/Icon'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'

type View = 'today' | 'completed' | 'calendar' | 'profile'

const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: 'bolt' },
  { id: 'completed', label: 'Completed', icon: 'check' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'profile', label: 'Profile', icon: 'chart' },
]

export function Shell() {
  const [view, setView] = useState<View>('today')
  const { user, signOutUser } = useAuth()
  const { habits, completions } = useData()

  return (
    <div className="flex min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-1 pt-1">
          <LogoMark />
          <span className="text-[17px] font-bold tracking-tight text-slate-900">Discipline</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                view === item.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Today's Phases
          </p>
          <PhasePieChart habits={habits} completions={completions} />
        </div>
        <div className="mt-auto">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2.5">
              <Avatar email={user?.email ?? '?'} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {user?.displayName ?? 'Habit keeper'}
                </p>
                <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOutUser}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              <Icon name="logout" size={13} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
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
              {view === 'completed' && <CompletedPage />}
              {view === 'calendar' && <CalendarPage />}
              {view === 'profile' && <ProfilePage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors',
                view === item.id ? 'text-emerald-600' : 'text-slate-400',
              )}
            >
              <Icon name={item.icon} size={19} />
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
    <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 shadow-sm shadow-emerald-600/30">
      <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
        <path d="M10 7v18M10 7l12 9-12 9" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Avatar({ email }: { email: string }) {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
      {(email || '?').charAt(0).toUpperCase()}
    </div>
  )
}