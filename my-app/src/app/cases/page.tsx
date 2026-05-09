"use client"

import { useCases } from '@/hooks/useCases'
import { CaseTable } from '@/components/cases/CaseTable'

// ─────────────────────────────────────────────────────────────
// Cases Dashboard Page
//
// Purpose:
// - Lists active cases for staff overview.
// - Opens a case workspace from the table.
//
// Endpoints used through hooks:
// GET /api/v1/cases
// ─────────────────────────────────────────────────────────────

export default function CasesPage() {
  const { data, isLoading, isError } = useCases()

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-gray-500">
          Loading cases...
        </div>
      </div>
    )
  if (isError)
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-red-700">
          Failed to load cases. Please refresh.
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
            Live case tracking and assignments
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Active Cases
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Review all ongoing cases and current status at a glance.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <CaseTable cases={data?.data ?? []} />
        </div>
      </div>
    </div>
  )
}