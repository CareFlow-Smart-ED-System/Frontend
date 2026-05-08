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
      <div className="text-center py-12 text-gray-400">
        No cases assigned to you
      </div>
    )
  }

  return (
    <table className="w-full text-sm border rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left px-3 py-2">Patient</th>
          <th className="text-left px-3 py-2">Severity</th>
          <th className="text-left px-3 py-2">Priority</th>
          <th className="text-left px-3 py-2">Status</th>
          <th className="text-left px-3 py-2">Arrival</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr
            key={c.caseId}
            className="border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push(`/cases/${c.caseId}`)}
          >
            <td className="px-3 py-2 font-medium">{c.patientName}</td>
            <td className="px-3 py-2">
              <TriageBadge severity={c.severity} />
            </td>
            <td className="px-3 py-2 text-gray-500">#{c.priorityScore}</td>
            <td className="px-3 py-2">
              <CaseStatusBadge status={c.status} />
            </td>
            <td className="px-3 py-2 text-gray-500">
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