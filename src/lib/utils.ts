import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Habit } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateStr(s: string): Date {
  return new Date(`${s}T00:00:00`)
}

export function todayStr(): string {
  return toDateStr(new Date())
}

export function addDays(s: string, n: number): string {
  const d = parseDateStr(s)
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

export function weekdayOf(s: string): number {
  return parseDateStr(s).getDay()
}

export function isScheduled(habit: Pick<Habit, 'scheduledDays'>, date: string): boolean {
  return habit.scheduledDays.includes(weekdayOf(date))
}

export function fmtLong(s: string): string {
  return parseDateStr(s).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function fmtShort(s: string): string {
  return parseDateStr(s).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}