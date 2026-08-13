import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ProgressRing } from '@/components/today/ProgressRing'
import { Button } from '@/components/ui/button'
import { useData } from '@/context/DataContext'
import { dayStatus } from '@/lib/stats'
import { addDays, fmtShort, todayStr } from '@/lib/utils'
import type { Habit } from '@/lib/types'

export function ProfilePage() {
  const { stats, habits, completions, toggleArchive, deleteHabit } = useData()
  const today = todayStr()
  const [archiveError, setArchiveError] = useState('')

  const chartData = useMemo(() => {
    const toValue = (date: string): number | null => {
      const st = dayStatus(date, habits, completions)
      if (st === 'neutral') return null
      if (st === 'all') return 1
      if (st === 'partial') return 0.5
      return 0
    }
    return Array.from({ length: 30 }, (_, i) => {
      const date = addDays(today, i - 29)
      return { label: fmtShort(date), value: toValue(date) }
    })
  }, [habits, completions, today])

  const archived = habits.filter((h) => h.archived)

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:pb-10">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Progress</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">Profile</h1>
      </header>

      <div className="mb-4 flex items-center gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
        <ProgressRing value={stats.disciplineScore} label="score" suffix="" size={116} />
        <div>
          <p className="text-sm font-semibold text-zinc-100">Discipline score</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            A blend of your streak, consistency and total ticks — the higher the better.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Current streak" value={`${stats.currentStreak}`} sub="days" accent />
        <StatCard label="Longest streak" value={`${stats.longestStreak}`} sub="days" />
        <StatCard label="Total ticks" value={stats.totalCompletions.toLocaleString()} sub="completed" />
        <StatCard label="Success rate" value={`${stats.successRate30}`} sub="last 30 days" />
      </div>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-zinc-200">Consistency — last 30 days</h2>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#71717a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis domain={[0, 1]} ticks={[0, 1]} hide />
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#e4e4e7',
                }}
                labelStyle={{ color: '#71717a' }}
                formatter={(value) => {
                  if (value == null) return 'Rest day'
                  if (value === 1) return 'Complete day'
                  if (value === 0.5) return 'Partial'
                  return 'Missed'
                }}
              />
              <Area
                type="stepAfter"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradSuccess)"
                connectNulls={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-zinc-200">Habit breakdown</h2>
        {stats.habits.length === 0 ? (
          <p className="text-sm text-zinc-500">No active habits yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {stats.habits.map(({ habit, rate, completed, scheduled }) => (
              <li key={habit.id}>
                <div className="mb-1.5 flex items-center gap-2 text-sm">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md text-sm leading-none"
                    style={{ background: `${habit.color}26` }}
                  >
                    {habit.icon}
                  </span>
                  <span className="flex-1 truncate font-medium text-zinc-200">{habit.title}</span>
                  <span className="tabular-nums text-xs text-zinc-500">
                    {completed}/{scheduled}
                  </span>
                  <span className="w-10 text-right text-xs font-bold tabular-nums" style={{ color: habit.color }}>
                    {rate}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${rate}%`, background: habit.color }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {archived.length > 0 && (
        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-sm font-semibold text-zinc-200">
            Archived ({archived.length})
          </h2>
          {archiveError && <p className="mb-3 text-xs text-red-400">{archiveError}</p>}
          <ul className="flex flex-col gap-2">
            {archived.map((h: Habit) => (
              <li key={h.id} className="flex items-center gap-2 text-sm text-zinc-400">
                <span>{h.icon}</span>
                <span className="flex-1 truncate line-through">{h.title}</span>
                <Button variant="ghost" size="sm" onClick={() => toggleArchive(h)}>
                  Restore
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={async () => {
                    setArchiveError('')
                    try {
                      await deleteHabit(h.id)
                    } catch (err) {
                      setArchiveError(
                        err instanceof Error ? err.message : 'Delete failed — try again.',
                      )
                    }
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={accent ? 'mt-1 text-2xl font-bold text-orange-300' : 'mt-1 text-2xl font-bold text-zinc-100'}>
        {value}
      </p>
      <p className="text-[10px] text-zinc-600">{sub}</p>
    </div>
  )
}
