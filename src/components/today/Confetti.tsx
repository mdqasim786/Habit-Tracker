import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#10b981', '#22d3ee', '#fbbf24', '#f472b6', '#818cf8', '#fb923c']

/** One-shot celebratory burst. key it to re-trigger. */
export function Confetti({ count = 24 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (i / count) * 360 + Math.random() * 20,
        dist: 70 + Math.random() * 90,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.15,
        size: 5 + Math.random() * 5,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b) => {
        const x = Math.cos((b.angle * Math.PI) / 180) * b.dist
        const y = Math.sin((b.angle * Math.PI) / 180) * b.dist
        return (
          <motion.span
            key={b.id}
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{ width: b.size, height: b.size * 0.45, background: b.color }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x, y, opacity: 0, rotate: 360 }}
            transition={{ duration: 0.9 + Math.random() * 0.5, ease: 'easeOut', delay: b.delay }}
          />
        )
      })}
    </div>
  )
}