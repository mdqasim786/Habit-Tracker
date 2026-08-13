export type Weekday = number // 0 = Sunday … 6 = Saturday (matches Date#getDay)

export type DayStatus = 'all' | 'partial' | 'missed' | 'neutral'

export interface Habit {
  id: string
  title: string
  description?: string
  color: string
  icon: string
  scheduledDays: Weekday[]
  createdAt: string // ISO timestamp
  archived: boolean
}

export interface Completion {
  habitId: string
  date: string // YYYY-MM-DD (local)
  completedAt: string // ISO timestamp
}

export type NewHabit = Omit<Habit, 'id' | 'createdAt' | 'archived'>

export interface HabitRate {
  habit: Habit
  completed: number
  scheduled: number
  rate: number // 0-100
}

export interface Stats {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  successRate30: number // 0-100
  disciplineScore: number // 0-100
  habits: HabitRate[]
}
