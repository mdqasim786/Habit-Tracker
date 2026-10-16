import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getPhaseSettings,
  resetPhaseSettings,
  savePhaseSettings,
  type PhaseInfo,
} from '@/lib/constants'

export function SettingsPage() {
  const [settings, setSettings] = useState<PhaseInfo[]>(() => getPhaseSettings())
  const [status, setStatus] = useState('')

  const updatePhase = (id: PhaseInfo['id'], patch: Partial<PhaseInfo>) => {
    setSettings((current) =>
      current.map((phase) => (phase.id === id ? { ...phase, ...patch } : phase)),
    )
  }

  const saveSettings = () => {
    const payload = Object.fromEntries(
      settings.map((phase) => [
        phase.id,
        {
          label: phase.label.trim() || phase.id,
          start: phase.start,
          end: phase.end,
        },
      ]),
    )

    savePhaseSettings(payload as Record<string, { label?: string; start?: string; end?: string }>)
    setStatus('Saved')
  }

  const resetSettings = () => {
    resetPhaseSettings()
    const next = getPhaseSettings()
    setSettings(next)
    setStatus('Reset to default phase settings')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:pb-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Preferences</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Phase settings</h1>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
        <p className="mb-5 text-sm leading-relaxed text-slate-500">
          Customize each phase name and the time window it covers across the app.
        </p>

        <div className="space-y-4">
          {settings.map((phase) => (
            <div
              key={phase.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              style={{ borderLeft: `4px solid ${phase.color}` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: phase.color }}
                />
                <span className="text-sm font-bold capitalize text-slate-800">{phase.id}</span>
              </div>

              <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Name
                  <Input
                    value={phase.label}
                    onChange={(event) => updatePhase(phase.id, { label: event.target.value })}
                    className="mt-1"
                  />
                </label>

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Start
                  <Input
                    type="time"
                    value={phase.start}
                    onChange={(event) => updatePhase(phase.id, { start: event.target.value })}
                    className="mt-1"
                  />
                </label>

                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  End
                  <Input
                    type="time"
                    value={phase.end}
                    onChange={(event) => updatePhase(phase.id, { end: event.target.value })}
                    className="mt-1"
                  />
                </label>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-500">
                Preview: <span className="font-semibold text-slate-700">{phase.timeRange}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-emerald-700">{status}</div>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={resetSettings}>
              Reset
            </Button>
            <Button type="button" onClick={saveSettings}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
