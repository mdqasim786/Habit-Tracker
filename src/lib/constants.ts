import type { Phase } from './types'

export const HABIT_COLORS = [
  '#10b981',
  '#22d3ee',
  '#818cf8',
  '#f472b6',
  '#fbbf24',
  '#fb923c',
  '#a3e635',
  '#e879f9',
]

/** Keys into the icon set in components/ui/Icon.tsx. Legacy emoji values fall back to "target". */
export const HABIT_ICONS = [
  'target',
  'code',
  'dumbbell',
  'book',
  'heart',
  'move',
  'sparkles',
  'music',
  'apple',
  'pen',
  'droplet',
  'moon',
  'rocket',
  'palette',
]

/** Display order Mon→Sun, mapped to Date#getDay() values (0 = Sunday). */
export const DAY_ORDER: { label: string; wd: number }[] = [
  { label: 'Mon', wd: 1 },
  { label: 'Tue', wd: 2 },
  { label: 'Wed', wd: 3 },
  { label: 'Thu', wd: 4 },
  { label: 'Fri', wd: 5 },
  { label: 'Sat', wd: 6 },
  { label: 'Sun', wd: 0 },
]

export const ALL_DAYS = DAY_ORDER.map((d) => d.wd)

export interface PhaseInfo {
  id: Phase
  label: string
  start: string
  end: string
  timeRange: string
  color: string
  dimColor: string
}

export const PHASES: PhaseInfo[] = [
  {
    id: 'morning',
    label: 'Morning',
    start: '05:00',
    end: '10:00',
    timeRange: '5:00 AM – 10:00 AM',
    color: '#fbbf24',
    dimColor: '#fbbf2440',
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    start: '10:00',
    end: '18:00',
    timeRange: '10:00 AM – 6:00 PM',
    color: '#22d3ee',
    dimColor: '#22d3ee40',
  },
  {
    id: 'evening',
    label: 'Evening',
    start: '18:00',
    end: '22:00',
    timeRange: '6:00 PM – 10:00 PM',
    color: '#818cf8',
    dimColor: '#818cf840',
  },
]

const PHASE_SETTINGS_KEY = 'discipline.phase-settings'

function formatClock(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return ''

  const safeHour = ((hours % 12) + 12) % 12 || 12
  const meridiem = hours >= 12 ? 'PM' : 'AM'
  return `${safeHour}:${String(minutes).padStart(2, '0')} ${meridiem}`
}

export function formatPhaseTimeRange(start: string, end: string): string {
  const startLabel = formatClock(start)
  const endLabel = formatClock(end)
  return startLabel && endLabel ? `${startLabel} – ${endLabel}` : 'Custom hours'
}

export function getPhaseSettings(): PhaseInfo[] {
  if (typeof window === 'undefined') return PHASES

  try {
    const saved = JSON.parse(localStorage.getItem(PHASE_SETTINGS_KEY) ?? 'null') ?? {}
    return PHASES.map((phase) => {
      const override = saved[phase.id] ?? {}
      const start = String(override.start ?? phase.start)
      const end = String(override.end ?? phase.end)
      const label = String(override.label ?? phase.label).trim() || phase.label

      return {
        ...phase,
        label,
        start,
        end,
        timeRange: formatPhaseTimeRange(start, end),
      }
    })
  } catch {
    return PHASES
  }
}

export function savePhaseSettings(settings: Partial<Record<Phase, { label?: string; start?: string; end?: string }>>) {
  if (typeof window === 'undefined') return

  const next = { ...JSON.parse(localStorage.getItem(PHASE_SETTINGS_KEY) ?? '{}') }
  for (const [phaseId, value] of Object.entries(settings)) {
    const phase = phaseId as Phase
    next[phase] = {
      ...(next[phase] ?? {}),
      ...(value ?? {}),
    }
  }

  localStorage.setItem(PHASE_SETTINGS_KEY, JSON.stringify(next))
}

export function resetPhaseSettings() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PHASE_SETTINGS_KEY)
}

export function normalizePhases(phase?: Phase | Phase[] | null): Phase[] {
  if (!phase) return []

  const values = Array.isArray(phase) ? phase : [phase]
  return values.filter(
    (value, index, arr) => arr.indexOf(value) === index && PHASES.some((p) => p.id === value),
  ) as Phase[]
}

export function phaseIncludes(phase: Phase | Phase[] | null | undefined, target: Phase): boolean {
  return normalizePhases(phase).includes(target)
}

export function phaseColor(phase?: Phase | Phase[] | null): string {
  const primary = normalizePhases(phase)[0]
  return getPhaseSettings().find((p) => p.id === primary)?.color ?? '#52525b'
}

export function phaseInfo(phase?: Phase | Phase[] | null): PhaseInfo | undefined {
  const primary = normalizePhases(phase)[0]
  return getPhaseSettings().find((p) => p.id === primary)
}
