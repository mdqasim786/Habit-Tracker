import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/ui/Icon'
import { DayPicker } from '@/components/habit/DayPicker'
import { useData } from '@/context/DataContext'
import { ALL_DAYS, HABIT_COLORS, HABIT_ICONS, PHASES } from '@/lib/constants'
import type { Habit, NewHabit, Phase } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HabitFormProps {
  open: boolean
  onClose: () => void
  habit?: Habit | null
}

export function HabitForm({ open, onClose, habit }: HabitFormProps) {
  const { addHabit, updateHabit } = useData()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [days, setDays] = useState<number[]>([...ALL_DAYS])
  const [color, setColor] = useState(HABIT_COLORS[0])
  const [icon, setIcon] = useState(HABIT_ICONS[0])
  const [phase, setPhase] = useState<Phase>('morning')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const savingRef = useRef(false)

  useEffect(() => {
    if (open) {
      setTitle(habit?.title ?? '')
      setDescription(habit?.description ?? '')
      setDays(habit?.scheduledDays ?? [...ALL_DAYS])
      setColor(habit?.color ?? HABIT_COLORS[0])
      setIcon(habit?.icon ?? HABIT_ICONS[0])
      setPhase(habit?.phase ?? 'morning')
      setSaving(false)
      setError('')
      savingRef.current = false
    }
  }, [open, habit])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || savingRef.current) return
    savingRef.current = true // synchronous lock — state alone is too slow to block a double-click
    setSaving(true)
    setError('')
    try {
      const payload: NewHabit = {
        title: trimmed,
        scheduledDays: days,
        color,
        icon,
        phase,
      }
      const desc = description.trim()
      if (desc) payload.description = desc
      if (habit) await updateHabit(habit.id, payload)
      else await addHabit(payload)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save habit')
      setSaving(false)
      savingRef.current = false
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={habit ? 'Edit habit' : 'New habit'}>
      <form onSubmit={save} className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${color}1a`, color }}
          >
            <Icon name={icon} size={20} />
          </div>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you committing to?"
            aria-label="Habit name"
          />
        </div>

        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why it matters (optional)"
          aria-label="Why it matters"
          className="h-10 text-slate-600"
        />

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Scheduled days
          </span>
          <DayPicker value={days} onChange={setDays} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Phase of day
          </span>
          <div className="flex gap-2">
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPhase(p.id)}
                aria-pressed={phase === p.id}
                className={cn(
                  'flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all',
                  phase === p.id
                    ? 'border-transparent shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
                )}
                style={phase === p.id ? { background: p.color, color: '#fff' } : undefined}
              >
                <span className="flex justify-center">
                  <Icon name={p.id === 'morning' ? 'sun' : p.id === 'afternoon' ? 'sparkles' : 'moon'} size={16} />
                </span>
                <span className="mt-0.5 block">{p.label}</span>
                <span className="mt-0.5 block text-[10px] font-normal opacity-70">{p.timeRange}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Icon
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {HABIT_ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                aria-label={ic}
                aria-pressed={icon === ic}
                className={cn(
                  'grid h-9 cursor-pointer place-items-center rounded-xl transition-colors',
                  icon === ic
                    ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
                )}
              >
                <Icon name={ic} size={17} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          {error && <p className="mr-auto self-center text-xs font-medium text-red-600">{error}</p>}
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || saving}>
            {saving ? 'Saving…' : habit ? 'Save changes' : 'Create habit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
