import { useState } from 'react'
import { motion } from 'framer-motion'
import { HabitForm } from '@/components/habit/HabitForm'
import { Menu } from '@/components/ui/menu'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useData } from '@/context/DataContext'
import { DAY_ORDER } from '@/lib/constants'
import type { Habit } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HabitCardProps {
  habit: Habit
  done: boolean
  onToggle: () => void
  index: number
}

export function HabitCard({ habit, done, onToggle, index }: HabitCardProps) {
  const { toggleArchive, deleteHabit } = useData()
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const remove = async () => {
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteHabit(habit.id)
      setConfirming(false)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed — try again.')
      setDeleting(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border p-4 transition-colors',
        done
          ? 'border-emerald-500/25 bg-emerald-500/[0.06]'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700',
      )}
    >
      <motion.button
        layout
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? 'Mark incomplete' : `Complete ${habit.title}`}
        className={cn(
          'relative grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-colors',
          done
            ? 'border-emerald-500 bg-emerald-500 text-emerald-950'
            : 'border-zinc-600 text-transparent hover:border-emerald-500/60 hover:text-emerald-500/30',
        )}
        whileTap={{ scale: 0.85 }}
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={done ? { scale: [0, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.path
            d="M20 6 9 17l-5-5"
            initial={false}
            animate={done ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.25 }}
          />
        </motion.svg>
      </motion.button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm leading-none"
            style={{ background: `${habit.color}26` }}
          >
            {habit.icon}
          </span>
          <h3
            className={cn(
              'truncate text-sm font-semibold',
              done ? 'text-zinc-400 line-through decoration-emerald-500/50' : 'text-zinc-100',
            )}
          >
            {habit.title}
          </h3>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {habit.description && (
            <span className="mr-1 truncate text-xs text-zinc-500">{habit.description}</span>
          )}
          {DAY_ORDER.filter((d) => habit.scheduledDays.includes(d.wd)).map(({ label, wd }) => (
            <span
              key={wd}
              className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <Menu
        triggerClassName="shrink-0 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        trigger={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.7" />
            <circle cx="12" cy="12" r="1.7" />
            <circle cx="19" cy="12" r="1.7" />
          </svg>
        }
        items={[
          { label: 'Edit', onClick: () => setEditing(true) },
          {
            label: habit.archived ? 'Restore' : 'Archive',
            onClick: () => toggleArchive(habit),
          },
          { label: 'Delete', onClick: () => setConfirming(true), danger: true },
        ]}
      />

      <Modal
        open={confirming}
        onClose={() => {
          if (!deleting) setConfirming(false)
        }}
        title="Delete habit?"
      >
        <p className="text-sm text-zinc-400">
          Delete <span className="font-semibold text-zinc-200">“{habit.title}”</span>? This removes
          the habit and its tick history. This can't be undone.
        </p>
        {deleteError && <p className="mt-3 text-xs text-red-400">{deleteError}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={remove} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>

      <HabitForm open={editing} onClose={() => setEditing(false)} habit={habit} />
    </motion.div>
  )
}