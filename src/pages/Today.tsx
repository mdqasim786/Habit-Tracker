import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { HabitCard } from '@/components/today/HabitCard'
import { ProgressRing } from '@/components/today/ProgressRing'
import { Confetti } from '@/components/today/Confetti'
import { HabitForm } from '@/components/habit/HabitForm'
import { Button } from '@/components/ui/button'
import { useData } from '@/context/DataContext'
import { PHASES } from '@/lib/constants'
import { cn, fmtLong, todayStr } from '@/lib/utils'

type Filter = 'all' | 'morning' | 'afternoon' | 'evening' | 'unassigned'

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
  const [filter, setFilter] = useState<Filter>('all')
  const [hideDone, setHideDone] = useState(false)

  useEffect(() => {
    if (allDone && !wasAllDone.current) setBursts((b) => b + 1)
    wasAllDone.current = allDone
  }, [allDone])

  const toggle = (habitId: string) =>
    setCompleted(habitId, today, !isDoneOn(habitId, today))

  const visible = useMemo(() => {
    let list = due
    if (filter === 'unassigned') list = list.filter((h) => !h.phase)
    else if (filter !== 'all') list = list.filter((h) => h.phase === filter)
    if (hideDone) list = list.filter((h) => !isDoneOn(h.id, today))
    return list
  }, [due, filter, hideDone, isDoneOn, today])

  const grouped = PHASES.map((p) => {
    const habitsInPhase = visible.filter((h) => h.phase === p.id)
    const doneInPhase = habitsInPhase.filter((h) => isDoneOn(h.id, today)).length
    return { ...p, habits: habitsInPhase, done: doneInPhase }
  })
  const unassigned = visible.filter((h) => !h.phase)

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6 sm:pb-10">
      {allDone && <Confetti key={bursts} />}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

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
        className="mb-8 flex items-center justify-center rounded-3xl surface py-8"
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

      {due.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              All
            </FilterChip>
            {PHASES.map((p) => (
              <FilterChip
                key={p.id}
                active={filter === p.id}
                onClick={() => setFilter(p.id)}
                dot={p.color}
              >
                {p.label}
              </FilterChip>
            ))}
            <FilterChip
              active={filter === 'unassigned'}
              onClick={() => setFilter('unassigned')}
            >
              Unassigned
            </FilterChip>
          </div>

          <button
            onClick={() => setHideDone((v) => !v)}
            aria-pressed={hideDone}
            className={cn(
              'ml-auto shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
              hideDone
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
            )}
          >
            {hideDone ? 'Showing open' : 'Hide completed'}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {grouped.map((phase) => (
          <div key={phase.id}>
            {phase.habits.length > 0 && (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: phase.color }}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">
                      {phase.id === 'morning' ? '🌅' : phase.id === 'afternoon' ? '☀️' : '🌙'}{' '}
                      {phase.label} Phase
                    </h3>
                    <p className="text-[10px] text-zinc-500">{phase.timeRange}</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500">
                    {phase.done}/{phase.habits.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {phase.habits.map((h, i) => (
                    <HabitCard
                      key={h.id}
                      habit={h}
                      index={i}
                      done={isDoneOn(h.id, today)}
                      onToggle={() => toggle(h.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {unassigned.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-zinc-600" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Unassigned</h3>
                <p className="text-[10px] text-zinc-500">Edit habit to assign a phase</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {unassigned.map((h, i) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  index={i}
                  done={isDoneOn(h.id, today)}
                  onToggle={() => toggle(h.id)}
                />
              ))}
            </div>
          </div>
        )}

        {habits.length === 0 && ready && (
          <div className="rounded-3xl border border-dashed border-zinc-800/80 bg-zinc-950/40 p-10 text-center shadow-inner">
            <p className="text-5xl">⚔️</p>
            <h3 className="mt-4 text-base font-semibold text-zinc-100">No habits yet</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-500">
              Small, consistent reps beat sporadic bursts. Add your first daily commitment.
            </p>
            <Button className="mt-6 shadow-sm shadow-emerald-900/20" onClick={() => setFormOpen(true)}>
              Start your first habit
            </Button>
          </div>
        )}

        {due.length === 0 && habits.length > 0 && (
          <p className="py-6 text-center text-sm text-zinc-500">
            Rest day. Nothing scheduled for today — see you tomorrow.
          </p>
        )}

        {due.length > 0 && visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-950/40 px-6 py-10 text-center">
            <p className="text-sm font-medium text-zinc-300">Nothing to show</p>
            <p className="mt-1 text-xs text-zinc-500">
              {hideDone
                ? 'Every habit in this filter is already completed. Nice work.'
                : 'No habits match this filter.'}
            </p>
          </div>
        )}
      </div>

      <HabitForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  dot,
  children,
}: {
  active: boolean
  onClick: () => void
  dot?: string
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
        active
          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
      )}
    >
      {dot && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: dot, opacity: active ? 1 : 0.6 }}
        />
      )}
      {children}
    </button>
  )
}