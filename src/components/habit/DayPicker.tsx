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
          'h-9 cursor-pointer rounded-xl border px-3 text-xs font-semibold transition-colors',
          allActive
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
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
              'h-9 cursor-pointer rounded-xl border px-3 text-xs font-bold transition-colors',
              active
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}