import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PHASES, phaseIncludes } from '@/lib/constants'
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
    const phaseHabits = habits.filter(
      (h) => !h.archived && phaseIncludes(h.phase, p.id) && isScheduled(h, today),
    )
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
                <Cell fill="#e2e8f0" />
              </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{overallPct}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            done
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        {phaseData.map((p) => {
          const info = PHASES.find((ph) => ph.id === p.phase)!
          const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
          return (
            <div key={p.phase} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: p.total > 0 ? info.color : '#cbd5e1' }}
              />
              <span className="font-medium text-slate-500">{info.label}</span>
              <span className="ml-auto font-semibold text-slate-400">
                {p.total > 0 ? `${p.completed}/${p.total} (${pct}%)` : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
