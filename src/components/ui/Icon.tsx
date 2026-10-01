import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Single-source icon set — inline SVG, no icon dependency. */
const PATHS: Record<string, ReactNode> = {
  // nav + chrome
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </>
  ),
  flame: (
    <path d="M12 22c4 0 7-2.7 7-6.5 0-4.5-5-6-5-11 0 0-3 2-3 5.5 0 1.5-1 2-1.7 1.2-.6-.6-.8-1.7-.8-2.7C6.3 10 5 12 5 15.5 5 19.3 8 22 12 22z" />
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  // actions
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  edit: (
    <>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />
    </>
  ),
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  alert: (
    <>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 2 18a1.8 1.8 0 0 0 1.6 2.7h16.8A1.8 1.8 0 0 0 22 18L13.7 3.9a1.8 1.8 0 0 0-3.4 0z" />
    </>
  ),
  // habit icons (keys stored in Firestore)
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  dumbbell: (
    <>
      <path d="m6.5 6.5 11 11M21 21l-1-1M3 3l1 1" />
      <path d="M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  heart: (
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
  ),
  move: (
    <>
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
    </>
  ),
  sparkles: (
    <>
      <path d="m11 3 1.9 5.6L18.5 10l-5.6 1.9L11 17.5 9.1 11.9 3.5 10l5.6-1.4Z" />
      <path d="M18.5 16.5 19.4 19l2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9Z" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  apple: (
    <>
      <path d="M12 20c-3.5 0-6-2.8-6-6.6S8.6 5.6 12 5.6s6 3.8 6 7.8S15.5 20 12 20z" />
      <path d="M12 5.6V3M12 3a2.6 2.6 0 0 0 2.4-1.7" />
    </>
  ),
  pen: (
    <>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </>
  ),
  droplet: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  moon: <path d="M12 3a6.5 6.5 0 0 0 9 9A9 9 0 1 1 12 3z" />,
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2a2.1 2.1 0 0 0-3-3z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.4 12.4 0 0 1 22 2c0 2.7-.8 7.7-6 11a22 22 0 0 1-4 2z" />
      <circle cx="16" cy="8" r="1.6" />
    </>
  ),
  palette: (
    <>
      <path d="M12 22a10 10 0 1 1 10-10c0 2-1.5 3-3 3h-1.5a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 22z" />
      <circle cx="7.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
}

export interface IconProps {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}

/** Unknown names (e.g. legacy emoji stored in Firestore) fall back to the target icon. */
export function Icon({ name, size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {PATHS[name] ?? PATHS.target}
    </svg>
  )
}