"use client"

import { useUpdateCaseStatus } from '@/hooks/useCases'
import { CaseStatus } from '@/types/queue'

interface Props {
  caseId: string
  currentStatus: CaseStatus
  userRole: 'DOCTOR' | 'NURSE'
}

// Rules from the API:
// Nurse: WAITING → UNDER_TREATMENT
// Doctor: UNDER_TREATMENT → COMPLETED
const nextStatus: Partial<Record<string, Record<CaseStatus, CaseStatus>>> = {
  NURSE:  { WAITING: 'UNDER_TREATMENT', UNDER_TREATMENT: 'UNDER_TREATMENT', COMPLETED: 'COMPLETED' },
  DOCTOR: { WAITING: 'WAITING', UNDER_TREATMENT: 'COMPLETED', COMPLETED: 'COMPLETED' },
}

const buttonLabel: Partial<Record<CaseStatus, string>> = {
  WAITING:         'Start Treatment',
  UNDER_TREATMENT: 'Mark as Completed',
}

export function UpdateStatusButton({ caseId, currentStatus, userRole }: Props) {
  const { mutate, isPending } = useUpdateCaseStatus(caseId)
  const next = nextStatus[userRole]?.[currentStatus]

  // Nothing to do if already at the end state for this role
  if (!next || next === currentStatus) return null

  return (
    <button
      onClick={() => mutate({ status: next })}
      disabled={isPending}
      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? 'Updating...' : buttonLabel[currentStatus]}
    </button>
  )
}