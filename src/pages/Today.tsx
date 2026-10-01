import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HabitCard } from '@/components/today/HabitCard'
import { ProgressRing } from '@/components/today/ProgressRing'
import { Confetti } from '@/components/today/Confetti'
import { HabitForm } from '@/components/habit/HabitForm'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { useData } from '@/context/DataContext'
import { fmtLong, todayStr } from '@/lib/utils'

export function TodayPage() {
  const { dueOn, isDoneOn, setCompleted, habits, stats, ready, error } = useData()
  const today = todayStr()
  const due = dueOn(today)
  const doneCount = due.filter((h) => isDoneOn(h.id, today)).length
  const allDone = due.length > 0 && doneCount === due.length
  const pct = due.length ? Math.round((doneCount / due.length) * 100) : 0

  const [formOpen, setFormOpen] = useState(false)
  const [bursts, setBursts] = useState(1)
  const wasAllDone = useRef(false)

  useEffect(() => {
    if (allDone && !wasAllDone.current) setBursts((b) => b + 1)
    wasAllDone.current = allDone
  }, [allDone])

  const toggle = (habitId: string) =>
    setCompleted(habitId, today, !isDoneOn(habitId, today))

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6 sm:pb-10">
      {allDone && <Confetti key={bursts} />}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <Icon name="alert" size={16} />
          {error}
        </div>
      )}

      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {fmtLong(today)}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {allDone ? 'Perfect day.' : 'Discipline.'}
          </h1>
        </div>
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
            <Icon name="flame" size={15} />
            {stats.currentStreak} day{stats.currentStreak === 1 ? '' : 's'}
          </div>
        )}
      </header>

      <motion.div
        key={pct}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-8 shadow-sm shadow-slate-900/5"
      >
        <ProgressRing value={pct} />
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-700">
          {due.length === 0
            ? 'Nothing scheduled today'
            : `${doneCount} of ${due.length} done`}
        </h2>
        <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
          <Icon name="plus" size={15} strokeWidth={2.2} />
          New habit
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {due.map((h, i) => (
          <HabitCard
            key={h.id}
            habit={h}
            index={i}
            done={isDoneOn(h.id, today)}
            onToggle={() => toggle(h.id)}
          />
        ))}

        {habits.length === 0 && ready && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon name="target" size={26} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No habits yet</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
              Build a habit like a notebook entry — pick the days you're committing to.
            </p>
            <Button className="mt-5" onClick={() => setFormOpen(true)}>
              Start your first habit
            </Button>
          </div>
        )}

        {due.length === 0 && habits.length > 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            Rest day. Nothing scheduled for today — see you tomorrow.
          </p>
        )}
      </div>

      <HabitForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}