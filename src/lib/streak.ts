import type { DayStatus } from './types'

export interface StreakResult {
  current: number
  longest: number
}

/**
 * Compute current + longest streaks from a day-by-day status timeline
 * (oldest → newest, ending on today).
 *
 * Rules:
 * - 'all'        counts toward a run
 * - 'neutral'    (nothing scheduled) never breaks a run — it's skipped
 * - 'missed'/'partial' break a run
 * - today is treated as in-progress: unless it's 'all', the current
 *   streak anchors on yesterday so it doesn't blink to 0 each morning.
 */
export function computeStreaks(statuses: readonly DayStatus[]): StreakResult {
  let current = 0
  let i = statuses.length - 1
  if (i >= 0) {
    if (statuses[i] === 'all') current++
    i-- // today is counted (if 'all') or treated as in-progress — never a breaker
  }
  for (; i >= 0; i--) {
    const s = statuses[i]
    if (s === 'all') current++
    else if (s === 'neutral') continue
    else break
  }

  let longest = 0
  let run = 0
  for (const s of statuses) {
    if (s === 'all') {
      run++
      longest = Math.max(longest, run)
    } else if (s === 'neutral') {
      continue
    } else {
      run = 0
    }
  }

  return { current, longest }
}