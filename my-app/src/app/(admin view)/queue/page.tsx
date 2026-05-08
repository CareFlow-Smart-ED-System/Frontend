"use client"

import { useRouter } from 'next/navigation'
import { TriageBadge } from '@/components/triage/TriageBadge'
import { CaseStatusBadge } from '@/components/cases/CaseStatusBadge'
import { useQueue, useQueueStats } from '@/hooks/useQueue'
import { QueueEntry } from '@/types/queue'

function StatCard({
  label,
  value,
  color = 'default',
}: {
  label: string
  value: string | number | undefined
  color?: 'default' | 'red'
}) {
  const valueColor = color === 'red' ? 'text-red-600' : 'text-gray-800'

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>
        {value ?? '—'}
      </p>
    </div>
  )
}

export default function QueuePage() {
  const { data, isLoading, isError } = useQueue()
  const { data: stats } = useQueueStats()
  const router = useRouter()

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading queue...</div>
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load queue. Please refresh.
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Emergency Queue</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Waiting" value={stats?.totalWaiting} />
        <StatCard label="Avg Wait" value={stats ? `${stats.averageWaitMinutes} min` : undefined} />
        <StatCard label="Critical" value={stats?.bySeverity.Critical} color="red" />
      </div>

      {/* Queue table */}
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-3 py-2">#</th>
            <th className="text-left px-3 py-2">Patient</th>
            <th className="text-left px-3 py-2">Severity</th>
            <th className="text-left px-3 py-2">Status</th>
            <th className="text-left px-3 py-2">Waiting</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400">
                No active cases in the queue
              </td>
            </tr>
          ) : (
            data?.data.map((entry: QueueEntry) => (
              <tr
                key={entry.caseId}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/cases/${entry.caseId}`)}
              >
                <td className="px-3 py-2">{entry.position}</td>
                <td className="px-3 py-2">{entry.patientName}</td>
                <td className="px-3 py-2">
                  <TriageBadge severity={entry.severity} />
                </td>
                <td className="px-3 py-2">
                  <CaseStatusBadge status={entry.status} />
                </td>
                <td className="px-3 py-2">{entry.waitingMinutes} min</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}