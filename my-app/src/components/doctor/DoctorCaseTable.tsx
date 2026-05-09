"use client"

import { useRouter } from 'next/navigation'
import { DoctorCaseItem } from '@/types/doctors'
import { TriageBadge } from '@/components/triage/TriageBadge'
import { CaseStatusBadge } from '@/components/cases/CaseStatusBadge'

interface Props {
  cases: DoctorCaseItem[]
}

export function DoctorCaseTable({ cases }: Props) {
  const router = useRouter()

  if (cases.length === 0) {
    return (
      <div className="text-center py-12 text-gray-900">
        No cases assigned to you
      </div>
    )
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#f5f7f8] text-gray-600">
          <th className="text-left px-4 py-3 font-medium">Patient</th>
          <th className="text-left px-4 py-3 font-medium">Severity</th>
          <th className="text-left px-4 py-3 font-medium">Priority</th>
          <th className="text-left px-4 py-3 font-medium">Status</th>
          <th className="text-left px-4 py-3 font-medium">Arrival</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr
            key={c.caseId}
            className="border-b border-gray-100 hover:bg-[#f5f7f8] cursor-pointer text-gray-900"
            onClick={() => router.push(`/cases/${c.caseId}`)}
          >
            <td className="px-4 py-3 font-medium">{c.patientName}</td>
            <td className="px-4 py-3">
              <TriageBadge severity={c.severity} />
            </td>
            <td className="px-4 py-3">#{c.priorityScore}</td>
            <td className="px-4 py-3">
              <CaseStatusBadge status={c.status} />
            </td>
            <td className="px-4 py-3">
              {new Date(c.arrivalTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}