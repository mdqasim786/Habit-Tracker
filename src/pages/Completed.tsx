import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { useData } from '@/context/DataContext'
import { fmtLong, todayStr } from '@/lib/utils'

export function CompletedPage() {
  const { habits, isDoneOn, setCompleted } = useData()
  const today = todayStr()
  const completed = habits
    .filter((habit) => !habit.archived && isDoneOn(habit.id, today))
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pb-10">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {fmtLong(today)}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Completed</h1>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
          {completed.length} done
        </div>
      </header>

      {completed.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Icon name="check" size={24} />
          </div>
          <h2 className="mt-4 text-sm font-bold text-slate-900">No completions yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            Finish a habit from the menu and it will show up here as your win for the day.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {completed.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm shadow-emerald-900/5"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${habit.color}1a`, color: habit.color }}
              >
                <Icon name={habit.icon} size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{habit.title}</p>
                {habit.description && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">{habit.description}</p>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompleted(habit.id, today, false, Array.isArray(habit.phase) ? habit.phase[0] : habit.phase)}
                className="text-slate-600"
              >
                Undo
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
