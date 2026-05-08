"use client"

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useCase, useCaseTimeline, useCaseSummary } from '@/hooks/useCases'
import { TriageBadge } from '@/components/triage/TriageBadge'
import { CaseStatusBadge } from '@/components/cases/CaseStatusBadge'
import { CaseTimeline } from '@/components/cases/CaseTimeline'
import { DischargeSummaryCard } from '@/components/cases/DischargeSummary'
import { UpdateStatusButton } from '@/components/cases/UpdateStatusButton'

type Tab = 'overview' | 'timeline' | 'summary'

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const { data: caseData, isLoading, isError } = useCase(caseId)
  const { data: timeline } = useCaseTimeline(caseId)
  const { data: summary } = useCaseSummary(caseId, caseData?.status === 'COMPLETED')

  if (isLoading) return <div className="p-6 text-gray-500">Loading case...</div>
  if (isError || !caseData) return <div className="p-6 text-red-500">Case not found.</div>

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline' },
    ...(caseData.status === 'COMPLETED' ? [{ key: 'summary' as Tab, label: 'Discharge Summary' }] : []),
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{caseData.patientName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Arrived {new Date(caseData.arrivalTime).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {caseData.triage && <TriageBadge severity={caseData.triage.severity} />}
          <CaseStatusBadge status={caseData.status} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase mb-3">Assigned Doctor</p>
            {caseData.assignedDoctor ? (
              <div>
                <p className="font-medium">{caseData.assignedDoctor.name}</p>
                <p className="text-sm text-gray-500">{caseData.assignedDoctor.specialization}</p>
                <p className="text-xs text-gray-400 mt-1">{caseData.assignedDoctor.role}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No doctor assigned yet</p>
            )}
          </div>

          {/* Status action button — role comes from your auth context */}
          <UpdateStatusButton
            caseId={caseId}
            currentStatus={caseData.status}
            userRole="DOCTOR" // replace with actual role from auth context
          />
        </div>
      )}

      {activeTab === 'timeline' && (
        <CaseTimeline entries={timeline?.data ?? []} />
      )}

      {activeTab === 'summary' && summary && (
        <DischargeSummaryCard summary={summary} />
      )}
    </div>
  )
}