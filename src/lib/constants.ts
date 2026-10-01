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
  timeRange: string
  color: string
  dimColor: string
}

export const PHASES: PhaseInfo[] = [
  { id: 'morning', label: 'Morning', timeRange: '5:00 AM – 10:00 AM', color: '#fbbf24', dimColor: '#fbbf2440' },
  { id: 'afternoon', label: 'Afternoon', timeRange: '10:00 AM – 6:00 PM', color: '#22d3ee', dimColor: '#22d3ee40' },
  { id: 'evening', label: 'Evening', timeRange: '6:00 PM – 10:00 PM', color: '#818cf8', dimColor: '#818cf840' },
]

export function phaseColor(phase?: Phase): string {
  return PHASES.find((p) => p.id === phase)?.color ?? '#52525b'
}

export function phaseInfo(phase?: Phase): PhaseInfo | undefined {
  return PHASES.find((p) => p.id === phase)
}
