import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { useData } from '@/context/DataContext'
import { DAY_ORDER, normalizePhases } from '@/lib/constants'
import { fmtLong, toDateStr, todayStr } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  all: 'border-emerald-200 bg-emerald-50',
  partial: 'border-amber-200 bg-amber-50',
  missed: 'border-red-200 bg-red-50',
  neutral: 'border-transparent hover:border-slate-200 hover:bg-slate-50',
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
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Calendar</h1>
        </div>
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => shift(-1)}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Previous month"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <span className="min-w-32 text-center text-sm font-bold text-slate-800">{monthLabel}</span>
          <button
            onClick={() => shift(1)}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Next month"
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </header>

      {ready && (
        <motion.div
          key={viewMonth.toISOString()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-900/5 sm:p-4"
        >
          <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                    'group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border text-sm transition-colors',
                    STATUS_STYLES[status],
                    !inMonth && 'opacity-40',
                  )}
                >
                  {isToday && (
                    <span className="absolute inset-0 rounded-xl ring-2 ring-inset ring-emerald-500/70" />
                  )}
                  <span
                    className={cn(
                      'font-semibold',
                      status === 'all' && 'text-emerald-700',
                      status === 'partial' && 'text-amber-700',
                      status === 'missed' && 'text-red-600',
                      status === 'neutral' && 'text-slate-500',
                    )}
                  >
                    {d.getDate()}
                  </span>
                  <span
                    className={cn(
                      'mt-1 h-1.5 w-1.5 rounded-full',
                      status === 'all' && 'bg-emerald-500',
                      status === 'partial' && 'bg-amber-500',
                      status === 'missed' && 'bg-red-400',
                      status === 'neutral' && 'bg-slate-300 group-hover:bg-slate-400',
                    )}
                  />
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Complete
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" /> Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" /> Rest
        </span>
      </div>

      <div className="mt-6">
        <Button variant="outline" size="sm" onClick={() => setSelected(today)}>
          View today
        </Button>
      </div>

      <DayDetailModal date={selected} onClose={() => setSelected(null)} />
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
        {isFuture && <span className="text-xs text-slate-500">Future — tick to plan ahead</span>}
      </div>

      {due.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          No habits scheduled for this day.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {due.map((h) => {
            const done = isDoneOn(h.id, date)
            const phase = normalizePhases(h.phase)[0]
            return (
              <li key={h.id}>
                <button
                  onClick={() => setCompleted(h.id, date, !done, phase)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                    done
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <motion.span
                    animate={done ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-transparent',
                      done
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300',
                    )}
                  >
                    <Icon name="check" size={13} strokeWidth={3} />
                  </motion.span>
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ background: `${h.color}1a`, color: h.color }}
                  >
                    <Icon name={h.icon} size={15} />
                  </span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      done ? 'text-slate-400 line-through' : 'text-slate-900',
                    )}
                  >
                    {h.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {habits.length === 0 && (
        <p className="text-center text-xs text-slate-400">Create habits from the Today tab.</p>
      )}
    </Modal>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    all: { label: 'All habits complete', cls: 'bg-emerald-50 text-emerald-700' },
    partial: { label: 'Partially complete', cls: 'bg-amber-50 text-amber-700' },
    missed: { label: 'Missed day', cls: 'bg-red-50 text-red-600' },
    neutral: { label: 'Rest day', cls: 'bg-slate-100 text-slate-500' },
  }
  const m = map[status]
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', m.cls)}>{m.label}</span>
  )
}