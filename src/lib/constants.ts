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

export const HABIT_ICONS = [
  '⚔️',
  '💻',
  '🏋️',
  '📚',
  '🧘',
  '🏃',
  '🧠',
  '🎸',
  '🥗',
  '✍️',
  '💧',
  '😴',
  '🚀',
  '🎨',
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
