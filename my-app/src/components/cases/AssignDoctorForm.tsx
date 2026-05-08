"use client"

import { useState } from 'react'
import { useAssignDoctor } from '@/hooks/useCases'
import { DoctorRole } from '@/types/cases'
import { Doctor } from '@/types/doctors'

interface Props {
  caseId: string
  doctors: Doctor[]
  onSuccess?: () => void
}

export function AssignDoctorForm({ caseId, doctors, onSuccess }: Props) {
  const [doctorId, setDoctorId] = useState('')
  const [role, setRole] = useState<DoctorRole>('PRIMARY')
  const { mutate, isPending, isError } = useAssignDoctor(caseId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!doctorId) return
    mutate({ doctorId, role }, { onSuccess })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((d) => (
            <option key={d.doctorId} value={d.doctorId}>
              {d.displayName} — {d.specialization}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as DoctorRole)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="PRIMARY">Primary</option>
          <option value="COLLABORATING">Collaborating</option>
        </select>
      </div>

      {isError && (
        <p className="text-sm text-red-500">Failed to assign doctor. Try again.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Assigning...' : 'Assign Doctor'}
      </button>
    </form>
  )
}