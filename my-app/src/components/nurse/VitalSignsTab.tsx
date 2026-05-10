"use client"

import { useState } from 'react'
import { useVitalSigns, useRecordVitalSigns } from '@/hooks/useNurse'
import { VitalSignsRecord } from '@/types/nurse'

interface Props {
  caseId: string
  userRole: 'DOCTOR' | 'NURSE'
}

// This is the main tab — doctors see only the table, nurses see the table plus the form to record new readings.

export function VitalSignsTab({ caseId, userRole }: Props) {
  const { data, isLoading, isError } = useVitalSigns(caseId)

  return (
    <div className="space-y-6">
      {/* Nurse-only: record new vital signs */}
      {userRole === 'NURSE' && <VitalSignsForm caseId={caseId} />}

      {/* Both roles: view history */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recorded Vital Signs</h3>

        {isLoading && <p className="text-sm text-gray-700">Loading...</p>}
        {isError && <p className="text-sm text-red-600">Failed to load vital signs.</p>}

        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-gray-700">No vital signs recorded yet.</p>
        )}

        {data?.data && data.data.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f5f7f8] text-gray-600">
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Temp (°C)</th>
                <th className="text-left px-4 py-3 font-medium">Systolic</th>
                <th className="text-left px-4 py-3 font-medium">Diastolic</th>
                <th className="text-left px-4 py-3 font-medium">Heart Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((v: VitalSignsRecord) => (
                <tr key={v.id} className="border-b border-gray-100 text-gray-900">
                  <td className="px-4 py-3">
                    {new Date(v.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">{v.temperature}</td>
                  <td className="px-4 py-3">{v.systolic}</td>
                  <td className="px-4 py-3">{v.diastolic}</td>
                  <td className="px-4 py-3">{v.heartRate} bpm</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function VitalSignsForm({ caseId }: { caseId: string }) {
  const [form, setForm] = useState({
    temperature: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
  })
  const { mutate, isPending, isError, isSuccess, reset } = useRecordVitalSigns(caseId)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    reset()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(
      {
        temperature: parseFloat(form.temperature),
        systolic: parseInt(form.systolic),
        diastolic: parseInt(form.diastolic),
        heartRate: parseInt(form.heartRate),
      },
      {
        onSuccess: () =>
          setForm({ temperature: '', systolic: '', diastolic: '', heartRate: '' }),
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4"
    >
      <h3 className="text-sm font-semibold text-black">Record New Vital Signs</h3>

      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'temperature', label: 'Temperature (°C)', placeholder: '37.5' },
          { name: 'heartRate',   label: 'Heart Rate (bpm)', placeholder: '80' },
          { name: 'systolic',    label: 'Systolic (mmHg)',  placeholder: '120' },
          { name: 'diastolic',   label: 'Diastolic (mmHg)', placeholder: '80' },
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

      {isError && <p className="text-xs text-red-500">Failed to record. Try again.</p>}
      {isSuccess && <p className="text-xs text-green-600">Vital signs recorded successfully.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-700 text-white py-2 rounded text-sm hover:bg-red-800 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Record Vital Signs'}
      </button>
    </form>
  )
}