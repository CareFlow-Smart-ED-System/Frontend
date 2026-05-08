"use client"

import { useAdministerMedication } from '@/hooks/useNurse'

interface Props {
  caseId: string
  medicationId: string
}

// This button sits next to each prescribed medication in the prescriptions list. Only nurses see it.

export function AdministerMedicationButton({ caseId, medicationId }: Props) {
  const { mutate, isPending, isSuccess, isError } = useAdministerMedication(caseId)

  if (isSuccess) {
    return <span className="text-xs text-green-600 font-medium">Administered</span>
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={() => mutate({ caseId, medicationId })}
        disabled={isPending}
        className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {isPending ? 'Recording...' : 'Mark as Administered'}
      </button>
      {isError && (
        <span className="text-xs text-red-500">Failed. Try again.</span>
      )}
    </div>
  )
}