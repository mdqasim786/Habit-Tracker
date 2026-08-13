import { ALL_DAYS, DAY_ORDER } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface DayPickerProps {
  value: number[]
  onChange: (days: number[]) => void
}

export function DayPicker({ value, onChange }: DayPickerProps) {
  const allActive = value.length === 7
  const toggleAll = () => onChange(allActive ? [] : [...ALL_DAYS])
  const toggle = (wd: number) =>
    onChange(value.includes(wd) ? value.filter((d) => d !== wd) : [...value, wd])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggleAll}
        className={cn(
          'h-9 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer',
          allActive
            ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
            : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800',
        )}
      >
        Every day
      </button>
      {DAY_ORDER.map(({ label, wd }) => {
        const active = value.includes(wd)
        return (
          <button
            key={wd}
            type="button"
            onClick={() => toggle(wd)}
            aria-pressed={active}
            className={cn(
              'h-9 rounded-lg border px-3 text-xs font-semibold transition-all cursor-pointer',
              active
                ? 'border-emerald-500/60 bg-emerald-500 text-emerald-950'
                : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}