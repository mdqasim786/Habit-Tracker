import { motion } from 'framer-motion'

interface ProgressRingProps {
  value: number // 0-100
  size?: number
  stroke?: number
  label?: string
  suffix?: string
}

export function ProgressRing({ value, size = 108, stroke = 9, label = 'today', suffix = '%' }: ProgressRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#27272a"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - (clamped / 100) * c }}
          transition={{ type: 'spring', duration: 0.8, bounce: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tabular-nums tracking-tight">
          {clamped}
          {suffix}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
    </div>
  )
}