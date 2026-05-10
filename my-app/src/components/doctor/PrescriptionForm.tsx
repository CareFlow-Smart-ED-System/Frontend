"use client"

import { useState } from 'react'
import { usePrescribeMedication } from '@/hooks/useDoctors'

interface Props {
  caseId: string
  onSuccess?: () => void
}

export function PrescriptionForm({ caseId, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const { mutate, isPending, isError, isSuccess, reset } = usePrescribeMedication(caseId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !dosage.trim()) return
    mutate(
      { name: name.trim(), dosage: dosage.trim() },
      {
        onSuccess: () => {
          setName('')
          setDosage('')
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-4">
      <h3 className="font-semibold text-sm text-gray-700">Prescribe Medication</h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Medication Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); reset() }}
          placeholder="e.g. Paracetamol"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Dosage</label>
        <input
          type="text"
          value={dosage}
          onChange={(e) => { setDosage(e.target.value); reset() }}
          placeholder="e.g. 500mg every 6 hours"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
      </div>

      {isError && (
        <p className="text-xs text-red-500">Failed to prescribe. Try again.</p>
      )}
      {isSuccess && (
        <p className="text-xs text-green-600">Medication prescribed successfully.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-700 text-white py-2 rounded text-sm hover:bg-red-800 disabled:opacity-50"
      >
        {isPending ? 'Prescribing...' : 'Prescribe'}
      </button>
    </form>
  )
}