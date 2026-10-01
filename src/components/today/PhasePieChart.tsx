import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PHASES } from '@/lib/constants'
import { isScheduled, todayStr } from '@/lib/utils'
import { isDone } from '@/lib/stats'
import type { Habit, Completion, Phase } from '@/lib/types'

interface PhasePieChartProps {
  habits: Habit[]
  completions: Completion[]
}

interface PhaseSlice {
  phase: Phase
  completed: number
  total: number
}

function getPhaseData(habits: Habit[], completions: Completion[]): PhaseSlice[] {
  const today = todayStr()
  return PHASES.map((p) => {
    const phaseHabits = habits.filter((h) => !h.archived && h.phase === p.id && isScheduled(h, today))
    const completed = phaseHabits.filter((h) => isDone(completions, h.id, today)).length
    return { phase: p.id, completed, total: phaseHabits.length }
  })
}

export function PhasePieChart({ habits, completions }: PhasePieChartProps) {
  const phaseData = getPhaseData(habits, completions)
  const totalHabits = phaseData.reduce((s, p) => s + p.total, 0)
  const totalDone = phaseData.reduce((s, p) => s + p.completed, 0)
  const overallPct = totalHabits > 0 ? Math.round((totalDone / totalHabits) * 100) : 0

  const chartData = phaseData.map((p) => {
    const info = PHASES.find((ph) => ph.id === p.phase)!
    const done = p.completed
    const remaining = p.total - p.completed
    return { phase: p.phase, done, remaining, color: info.color, dimColor: info.dimColor, total: p.total }
  })

  const hasAnyHabits = totalHabits > 0

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="done"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.done > 0 ? entry.color : 'transparent'} />
              ))}
            </Pie>
            {hasAnyHabits && (
              <Pie
                data={chartData}
                dataKey="remaining"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.remaining > 0 ? entry.dimColor : 'transparent'} />
                ))}
              </Pie>
            )}
            {!hasAnyHabits && (
              <Pie
                data={[{ value: 1 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill="#27272a" />
              </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-zinc-100">{overallPct}%</span>
          <span className="text-[10px] text-zinc-500">done</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 w-full">
        {phaseData.map((p) => {
          const info = PHASES.find((ph) => ph.id === p.phase)!
          const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
          return (
            <div key={p.phase} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: p.total > 0 ? info.color : '#3f3f46' }}
              />
              <span className="text-zinc-400">{info.label}</span>
              <span className="ml-auto text-zinc-500">
                {p.total > 0 ? `${p.completed}/${p.total} (${pct}%)` : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
