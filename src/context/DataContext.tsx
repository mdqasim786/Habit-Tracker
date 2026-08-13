import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import type { Completion, DayStatus, Habit, NewHabit, Stats } from '@/lib/types'
import { dayStatus, computeStats, isDone } from '@/lib/stats'
import { isScheduled } from '@/lib/utils'

interface DataContextValue {
  habits: Habit[]
  completions: Completion[]
  stats: Stats
  ready: boolean
  error: string | null
  addHabit: (input: NewHabit) => Promise<void>
  updateHabit: (id: string, patch: Partial<Habit>) => Promise<void>
  toggleArchive: (habit: Habit) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  setCompleted: (habitId: string, date: string, completed: boolean) => Promise<void>
  isDoneOn: (habitId: string, date: string) => boolean
  statusOf: (date: string) => DayStatus
  dueOn: (date: string) => Habit[]
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loaded, setLoaded] = useState({ habits: false, completions: false })
  const [error, setError] = useState<string | null>(null)
  const uid = user?.uid ?? null

  useEffect(() => {
    if (!uid || !db) return
    setHabits([])
    setCompletions([])
    setLoaded({ habits: false, completions: false })
    setError(null)

    const handleErr = (e: unknown) =>
      setError(e instanceof Error ? e.message : 'Firestore sync failed')
    const unsubHabits = onSnapshot(collection(db, 'users', uid, 'habits'), (snap) => {
      setHabits(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Habit[])
      setLoaded((l) => ({ ...l, habits: true }))
    }, handleErr)
    const unsubComps = onSnapshot(collection(db, 'users', uid, 'completions'), (snap) => {
      setCompletions(snap.docs.map((d) => d.data()) as Completion[])
      setLoaded((l) => ({ ...l, completions: true }))
    }, handleErr)
    return () => {
      unsubHabits()
      unsubComps()
    }
  }, [uid])

  const stats = useMemo(() => computeStats(habits, completions), [habits, completions])

  const active = useMemo(() => habits.filter((h) => !h.archived), [habits])

  const dueOn = useCallback(
    (date: string) =>
      active
        .filter((h) => isScheduled(h, date))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [active],
  )

  const isDoneOn = useCallback(
    (habitId: string, date: string) => isDone(completions, habitId, date),
    [completions],
  )

  const statusOf = useCallback(
    (date: string) => dayStatus(date, habits, completions),
    [habits, completions],
  )

  const addHabit = useCallback(
    async (input: NewHabit) => {
      if (!uid || !db) return
      await setDoc(doc(collection(db, 'users', uid, 'habits')), {
        ...input,
        createdAt: new Date().toISOString(),
        archived: false,
      })
    },
    [uid],
  )

  const updateHabit = useCallback(
    async (id: string, patch: Partial<Habit>) => {
      if (!uid || !db) return
      await updateDoc(doc(db, 'users', uid, 'habits', id), patch)
    },
    [uid],
  )

  const toggleArchive = useCallback(
    async (habit: Habit) => {
      await updateHabit(habit.id, { archived: !habit.archived })
    },
    [updateHabit],
  )

  const deleteHabit = useCallback(
    async (id: string) => {
      if (!uid || !db) return
      const snap = await getDocs(
        query(collection(db, 'users', uid, 'completions'), where('habitId', '==', id)),
      )
      const batch = writeBatch(db)
      for (const d of snap.docs) batch.delete(d.ref)
      batch.delete(doc(db, 'users', uid, 'habits', id))
      await batch.commit()
    },
    [uid],
  )

  const setCompleted = useCallback(
    async (habitId: string, date: string, completed: boolean) => {
      if (!uid || !db) return
      const ref = doc(db, 'users', uid, 'completions', `${habitId}_${date}`)
      if (completed) {
        await setDoc(ref, { habitId, date, completedAt: new Date().toISOString() })
      } else {
        await deleteDoc(ref)
      }
    },
    [uid],
  )

  const value = useMemo<DataContextValue>(
    () => ({
      habits,
      completions,
      stats,
      ready: loaded.habits && loaded.completions,
      error,
      addHabit,
      updateHabit,
      toggleArchive,
      deleteHabit,
      setCompleted,
      isDoneOn,
      statusOf,
      dueOn,
    }),
    [
      habits,
      completions,
      stats,
      loaded,
      error,
      addHabit,
      updateHabit,
      toggleArchive,
      deleteHabit,
      setCompleted,
      isDoneOn,
      statusOf,
      dueOn,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
