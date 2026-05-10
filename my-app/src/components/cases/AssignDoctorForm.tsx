"use client"

import { useState } from 'react'
import { useAssignDoctor } from '@/hooks/useCases'
import { useDoctors } from '@/hooks/useDoctors'
import { DoctorRole } from '@/types/cases'

interface Props {
  caseId: string
  onSuccess?: () => void
}

export function AssignDoctorForm({ caseId, onSuccess }: Props) {
  const [doctorId, setDoctorId] = useState('')
  const [role, setRole] = useState<DoctorRole>('PRIMARY')

  const { data: doctorsData, isLoading: loadingDoctors } = useDoctors()
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
          className="w-full border rounded px-3 py-2 text-sm text-black"
          required
          disabled={loadingDoctors}
        >
          <option value="">
            {loadingDoctors ? 'Loading doctors...' : 'Select a doctor'}
          </option>
          {doctorsData?.data.map((d) => (
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
          className="w-full border rounded px-3 py-2 text-sm text-black"
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
        disabled={isPending || loadingDoctors}
        className="w-full bg-red-700 text-white py-2 rounded text-sm hover:bg-red-800 disabled:opacity-50"
      >
        {isPending ? 'Assigning...' : 'Assign Doctor'}
      </button>
    </form>
  )
}