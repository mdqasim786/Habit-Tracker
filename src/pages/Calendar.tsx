import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useData } from '@/context/DataContext'
import { DAY_ORDER } from '@/lib/constants'
import { fmtLong, toDateStr, todayStr } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  all: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  partial: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  missed: 'bg-red-500/15 text-red-300 border-red-500/30',
  neutral: 'text-zinc-400 border-transparent hover:border-zinc-700',
}

export function CalendarPage() {
  const { statusOf, ready } = useData()
  const today = todayStr()
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selected, setSelected] = useState<string | null>(null)

  const cells = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
    const startOffset = (first.getDay() + 6) % 7 // Monday-first
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(first.getFullYear(), first.getMonth(), 1 - startOffset + i)
      return d
    })
  }, [viewMonth])

  const shift = (n: number) =>
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1))

  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:pb-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">Calendar</h1>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => shift(-1)}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="min-w-32 text-center text-sm font-semibold">
            {monthLabel}
          </span>
          <button
            onClick={() => shift(1)}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </header>

      {ready && (
        <motion.div
          key={viewMonth.toISOString()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4"
        >
          <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {DAY_ORDER.map((d) => (
              <span key={d.wd}>{d.label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              const dateStr = toDateStr(d)
              const inMonth = d.getMonth() === viewMonth.getMonth()
              const isToday = dateStr === today
              const status = statusOf(dateStr)
              return (
                <button
                  key={i}
                  onClick={() => setSelected(dateStr)}
                  className={cn(
                    'group relative flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition-colors cursor-pointer',
                    STATUS_STYLES[status],
                    !inMonth && 'opacity-30',
                  )}
                >
                  {isToday && (
                    <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-emerald-500/60" />
                  )}
                  <span className={cn('font-medium', status !== 'neutral' && 'font-bold')}>
                    {d.getDate()}
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 h-1 w-1 rounded-full',
                      status === 'all' && 'bg-emerald-400',
                      status === 'partial' && 'bg-amber-400',
                      status === 'missed' && 'bg-red-400',
                      status === 'neutral' && 'bg-zinc-700 group-hover:bg-zinc-600',
                    )}
                  />
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Complete
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-700" /> Rest
        </span>
      </div>

      <DayDetailModal date={selected} onClose={() => setSelected(null)} />

      <div className="mt-6">
        <Button variant="outline" size="sm" onClick={() => setSelected(today)}>
          View today
        </Button>
      </div>
    </div>
  )
}

function DayDetailModal({ date, onClose }: { date: string | null; onClose: () => void }) {
  const { dueOn, isDoneOn, setCompleted, statusOf, habits } = useData()
  if (!date) return null

  const due = dueOn(date)
  const status = statusOf(date)
  const isFuture = date > todayStr()

  return (
    <Modal
      open={Boolean(date)}
      onClose={onClose}
      title={fmtLong(date)}
      className={due.length > 2 ? 'max-h-[85vh] overflow-y-auto' : ''}
    >
      <div className="mb-4 flex items-center gap-2">
        <StatusBadge status={status} />
        {isFuture && <span className="text-xs text-zinc-500">Future — tick to plan ahead</span>}
      </div>

      {due.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">
          No habits scheduled for this day.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {due.map((h) => {
            const done = isDoneOn(h.id, date)
            return (
              <li key={h.id}>
                <button
                  onClick={() => setCompleted(h.id, date, !done)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                    done
                      ? 'border-emerald-500/25 bg-emerald-500/[0.06]'
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700',
                  )}
                >
                  <motion.span
                    animate={done ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px]',
                      done
                        ? 'border-emerald-500 bg-emerald-500 text-emerald-950'
                        : 'border-zinc-600 text-transparent',
                    )}
                  >
                    ✓
                  </motion.span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm" style={{ background: `${h.color}26` }}>
                    {h.icon}
                  </span>
                  <span className={cn('text-sm font-medium', done ? 'text-zinc-400 line-through' : 'text-zinc-100')}>
                    {h.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {habits.length === 0 && (
        <p className="text-center text-xs text-zinc-600">Create habits from the Today tab.</p>
      )}
    </Modal>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    all: { label: 'All habits complete', cls: 'bg-emerald-500/15 text-emerald-300' },
    partial: { label: 'Partially complete', cls: 'bg-amber-500/15 text-amber-300' },
    missed: { label: 'Missed day', cls: 'bg-red-500/15 text-red-300' },
    neutral: { label: 'Rest day', cls: 'bg-zinc-800/60 text-zinc-400' },
  }
  const m = map[status]
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', m.cls)}>{m.label}</span>
}