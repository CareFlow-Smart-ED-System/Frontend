"use client"

import { useCases } from '@/hooks/useCases'
import { CaseTable } from '@/components/cases/CaseTable'

export default function CasesPage() {
  const { data, isLoading, isError } = useCases()

  if (isLoading) return <div className="p-6 text-gray-500">Loading cases...</div>
  if (isError) return <div className="p-6 text-red-500">Failed to load cases. Please refresh.</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Active Cases</h1>
      <CaseTable cases={data?.data ?? []} />
    </div>
  )
}