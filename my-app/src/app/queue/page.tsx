"use client"

import { useRouter } from 'next/navigation'
import { TriageBadge } from '@/components/triage/TriageBadge'
import { CaseStatusBadge } from '@/components/cases/CaseStatusBadge'
import { useQueue, useQueueStats } from '@/hooks/useQueue'
import { QueueEntry } from '@/types/queue'

// ─────────────────────────────────────────────────────────────
// Queue Dashboard Page
//
// Purpose:
// - Shows the real-time emergency queue.
// - Displays aggregate queue stats.
// - Lets staff open a case from the queue list.
//
// Endpoints used through hooks:
// GET /api/v1/queue
// GET /api/v1/queue/stats
// ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color = 'default',
}: {
  label: string
  value: string | number | undefined
  color?: 'default' | 'red'
}) {
  const valueColor = color === 'red' ? 'text-red-700' : 'text-gray-900'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
        {label}
      </p>
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
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-gray-500">
          Loading queue...
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-red-700">
          Failed to load queue. Please refresh.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
            Live updates from triage and intake
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Emergency Queue
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Real-time view of arrivals, priorities, and waiting time.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Waiting" value={stats?.totalWaiting} />
          <StatCard
            label="Avg Wait"
            value={stats ? `${stats.averageWaitMinutes} min` : undefined}
          />
          <StatCard
            label="Critical"
            value={stats?.bySeverity.Critical}
            color="red"
          />
        </div>

        {/* Queue table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f5f7f8] text-gray-600">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Patient</th>
                <th className="text-left px-4 py-3 font-medium">Severity</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Waiting</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-900">
                    No active cases in the queue
                  </td>
                </tr>
              ) : (
                data?.data.map((entry: QueueEntry) => (
                  <tr
                    key={entry.caseId}
                    className="border-b border-gray-100 hover:bg-[#f5f7f8] cursor-pointer text-gray-900"
                    onClick={() => router.push(`/cases/${entry.caseId}`)}
                  >
                    <td className="px-4 py-3">{entry.position}</td>
                    <td className="px-4 py-3">{entry.patientName}</td>
                    <td className="px-4 py-3">
                      <TriageBadge severity={entry.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <CaseStatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3">{entry.waitingMinutes} min</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}