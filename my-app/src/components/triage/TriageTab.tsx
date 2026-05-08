"use client"

import { useState } from 'react'
import { useTriage, useTriageHistory, useRecordTriage } from '@/hooks/useTriage'
import { TriageBadge } from '@/components/triage/TriageBadge'
import { Severity } from '@/types/queue'
import { TriageHistoryRecord } from '@/types/triage'

interface Props {
  caseId: string
  userRole: 'DOCTOR' | 'NURSE' | 'ADMIN'
}

// This is a single tab component — doctors and admins see the current triage snapshot and the full history,
// nurses see all of that plus a form to record a new triage assessment.

export function TriageTab({ caseId, userRole }: Props) {
  const { data: current, isLoading: loadingCurrent } = useTriage(caseId)
  const { data: history, isLoading: loadingHistory } = useTriageHistory(caseId)

  return (
    <div className="space-y-8">

      {/* Nurse only: submit new triage */}
      {userRole === 'NURSE' && <TriageForm caseId={caseId} />}

      {/* Current triage snapshot — all roles */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Triage</h3>

        {loadingCurrent && <p className="text-sm text-gray-400">Loading...</p>}

        {!loadingCurrent && !current && (
          <p className="text-sm text-gray-400">No triage recorded yet for this case.</p>
        )}

        {current && (
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <TriageBadge severity={current.severity} />
              <span className="text-xs text-gray-400">
                {new Date(current.triageTime).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <VitalCard label="Temperature" value={`${current.temperature} °C`} />
              <VitalCard label="Heart Rate"  value={`${current.heartRate} bpm`} />
              <VitalCard label="O₂ Saturation" value={`${current.oxygenSaturation}%`} />
              <VitalCard label="Systolic"    value={`${current.systolic} mmHg`} />
              <VitalCard label="Diastolic"   value={`${current.diastolic} mmHg`} />
            </div>
          </div>
        )}
      </div>

      {/* Triage history — all roles */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Triage History
          {history && (
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({history.total} record{history.total !== 1 ? 's' : ''})
            </span>
          )}
        </h3>

        {loadingHistory && <p className="text-sm text-gray-400">Loading history...</p>}

        {!loadingHistory && !history?.data.length && (
          <p className="text-sm text-gray-400">No triage history available.</p>
        )}

        <div className="space-y-3">
          {history?.data.map((record: TriageHistoryRecord, index: number) => (
            <div
              key={record.triageId}
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TriageBadge severity={record.severity} />
                  {index === 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Latest
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(record.triageTime).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <VitalCard label="Temp"        value={`${record.temperature} °C`} small />
                <VitalCard label="Heart Rate"  value={`${record.heartRate} bpm`} small />
                <VitalCard label="O₂ Sat"      value={`${record.oxygenSaturation}%`} small />
                <VitalCard label="Systolic"    value={`${record.systolic} mmHg`} small />
                <VitalCard label="Diastolic"   value={`${record.diastolic} mmHg`} small />
                <VitalCard label="Resp. Rate"  value={`${record.respiratoryRate} /min`} small />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Vital card helper ────────────────────────────────────────────────────────
function VitalCard({
  label,
  value,
  small = false,
}: {
  label: string
  value: string
  small?: boolean
}) {
  return (
    <div className="bg-gray-50 rounded p-2">
      <p className={`text-gray-400 ${small ? 'text-xs' : 'text-xs'}`}>{label}</p>
      <p className={`font-medium ${small ? 'text-sm' : 'text-base'}`}>{value}</p>
    </div>
  )
}

// ─── Triage form (nurse only) ─────────────────────────────────────────────────
function TriageForm({ caseId }: { caseId: string }) {
  const [form, setForm] = useState({
    severity: 'URGENT' as Severity,
    temperature: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    oxygenSaturation: '',
    respiratoryRate: '',
  })

  const { mutate, isPending, isError, isSuccess, reset } = useRecordTriage(caseId)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    reset()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(
      {
        severity: form.severity,
        temperature: parseFloat(form.temperature),
        systolic: parseInt(form.systolic),
        diastolic: parseInt(form.diastolic),
        heartRate: parseInt(form.heartRate),
        oxygenSaturation: parseFloat(form.oxygenSaturation),
        respiratoryRate: parseInt(form.respiratoryRate),
      },
      {
        onSuccess: () =>
          setForm({
            severity: 'URGENT',
            temperature: '',
            systolic: '',
            diastolic: '',
            heartRate: '',
            oxygenSaturation: '',
            respiratoryRate: '',
          }),
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4"
    >
      <h3 className="text-sm font-semibold text-red-800">Record New Triage Assessment</h3>
      <p className="text-xs text-red-600">
        Each submission creates a permanent record. Only submit if the patient's condition has changed.
      </p>

      {/* Severity */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Severity</label>
        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="CRITICAL">Critical</option>
          <option value="URGENT">Urgent</option>
          <option value="NON_URGENT">Non-Urgent</option>
        </select>
      </div>

      {/* Vitals grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'temperature',     label: 'Temperature (°C)',  placeholder: '38.9' },
          { name: 'heartRate',       label: 'Heart Rate (bpm)',  placeholder: '110' },
          { name: 'systolic',        label: 'Systolic (mmHg)',   placeholder: '130' },
          { name: 'diastolic',       label: 'Diastolic (mmHg)',  placeholder: '85' },
          { name: 'oxygenSaturation',label: 'O₂ Saturation (%)', placeholder: '92' },
          { name: 'respiratoryRate', label: 'Respiratory Rate',  placeholder: '24' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              placeholder={field.placeholder}
              step="0.1"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
        ))}
      </div>

      {isError && <p className="text-xs text-red-500">Failed to record triage. Try again.</p>}
      {isSuccess && <p className="text-xs text-green-600">Triage recorded successfully.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Submit Triage Assessment'}
      </button>
    </form>
  )
}