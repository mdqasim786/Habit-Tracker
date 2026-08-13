import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HabitCard } from '@/components/today/HabitCard'
import { ProgressRing } from '@/components/today/ProgressRing'
import { Confetti } from '@/components/today/Confetti'
import { HabitForm } from '@/components/habit/HabitForm'
import { Button } from '@/components/ui/button'
import { useData } from '@/context/DataContext'
import { fmtLong, todayStr } from '@/lib/utils'

export function TodayPage() {
  const { dueOn, isDoneOn, setCompleted, habits, stats, ready } = useData()
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

      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {fmtLong(today)}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">
            {allDone ? 'Perfect day.' : 'Discipline.'}
          </h1>
        </div>
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-300">
            <span>🔥</span>
            {stats.currentStreak} day{stats.currentStreak === 1 ? '' : 's'}
          </div>
        )}
      </header>

      <motion.div
        key={pct}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 flex items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/50 py-8"
      >
        <ProgressRing value={pct} />
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">
          {due.length === 0
            ? 'Nothing scheduled today'
            : `${doneCount} of ${due.length} done`}
        </h2>
        <Button variant="secondary" size="sm" onClick={() => setFormOpen(true)}>
          <span className="text-base leading-none">+</span> New habit
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
          <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
            <p className="text-4xl">⚔️</p>
            <h3 className="mt-3 text-sm font-semibold text-zinc-200">No habits yet</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs text-zinc-500">
              Build a habit like a notebook entry — pick the days you're committing to.
            </p>
            <Button className="mt-5" onClick={() => setFormOpen(true)}>
              Start your first habit
            </Button>
          </div>
        )}

        {due.length === 0 && habits.length > 0 && (
          <p className="py-6 text-center text-sm text-zinc-500">
            Rest day. Nothing scheduled for today — see you tomorrow.
          </p>
        )}
      </div>

      <HabitForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}