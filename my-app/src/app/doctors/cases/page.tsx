"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useDoctorCases } from '@/hooks/useDoctors'
import { useAuthStore } from '@/store/authStore'
import { TriageBadge } from '@/components/triage/TriageBadge'
import { CaseStatus } from '@/types/queue'

// ─────────────────────────────────────────────────────────────
// Doctor Cases Page
//
// Purpose:
// - Lists all cases assigned to the currently logged-in doctor.
// - Supports filtering by case status (ALL / WAITING / UNDER_TREATMENT / COMPLETED).
// - Links to individual case workspace.
//
// Endpoints used through hooks:
// GET /api/v1/doctors/me/cases   
// ─────────────────────────────────────────────────────────────

const STATUS_FILTERS: { label: string; value: CaseStatus | 'ALL' }[] = [
  { label: 'All',              value: 'ALL' },
  { label: 'Waiting',          value: 'WAITING' },
  { label: 'Under Treatment',  value: 'UNDER_TREATMENT' },
  { label: 'Completed',        value: 'COMPLETED' },
]

export default function DoctorCasesPage() {
  const user = useAuthStore((s) => s.user)
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL')

  const { data, isLoading, isError } = useDoctorCases(
    user?.userId ?? '',
    statusFilter !== 'ALL' ? { status: statusFilter } : undefined
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cases assigned to {user?.displayName ?? 'you'}
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-[#1a2e44] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* States */}
        {isLoading && (
          <div className="text-sm text-gray-400 py-12 text-center">
            Loading your cases...
          </div>
        )}

        {isError && (
          <div className="text-sm text-red-500 py-12 text-center">
            Failed to load cases. Please try again.
          </div>
        )}

        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="text-sm text-gray-400 py-12 text-center">
            No cases found{statusFilter !== 'ALL' ? ` with status "${statusFilter}"` : ''}.
          </div>
        )}

        {/* Cases table */}
        {data && data.data.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Patient</th>
                  <th className="text-left px-5 py-3 font-medium">Severity</th>
                  <th className="text-left px-5 py-3 font-medium">Priority</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Arrival</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.data.map((c) => (
                  <tr
                    key={c.caseId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{c.patientName}</p>
                      <p className="text-xs text-gray-400">{c.patientId}</p>
                    </td>

                    {/* Severity */}
                    <td className="px-5 py-4">
                      <TriageBadge severity={c.severity} />
                    </td>

                    {/* Priority score */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                        {c.priorityScore}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Arrival */}
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(c.arrivalTime).toLocaleString()}
                    </td>

                    {/* View link */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/cases/${c.caseId}`}
                        className="text-xs font-medium text-[#1a2e44] hover:underline"
                      >
                        Open Case →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination info */}
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {data.data.length} of {data.total} case{data.total !== 1 ? 's' : ''}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Status badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CaseStatus }) {
  const styles: Record<CaseStatus, string> = {
    WAITING:          'bg-yellow-100 text-yellow-800',
    UNDER_TREATMENT:  'bg-blue-100 text-blue-800',
    COMPLETED:        'bg-green-100 text-green-800',
  }
  const labels: Record<CaseStatus, string> = {
    WAITING:          'Waiting',
    UNDER_TREATMENT:  'Under Treatment',
    COMPLETED:        'Completed',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}