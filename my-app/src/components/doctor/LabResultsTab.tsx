"use client"

import { useState } from 'react'
import { useLabResults, useCreateLabOrder } from '@/hooks/useDoctors'
import { UploadLabReportButton } from '@/components/doctor/UploadLabReportButton'
import { useAuthStore } from '@/store/authStore'
import { LabResult } from '@/types/doctors'

interface Props {
  caseId: string
}

const statusColor: Record<string, string> = {
  AVAILABLE: 'text-green-700',
  PENDING:   'text-yellow-700',
}

const LAB_TEST_TYPES = [
  'Blood Test',
  'Urinalysis',
  'Lipid Panel',
  'Liver Function',
  'Thyroid Panel',
  'COVID-19 PCR',
  'Hemoglobin A1C',
  'Complete Blood Count',
  'Metabolic Panel',
  'Other',
]

export function LabResultsTab({ caseId }: Props) {
  const { data, isLoading, isError } = useLabResults(caseId)
  const { user } = useAuthStore()
  const isDoctor = user?.role === 'DOCTOR'
  const isLabStaff = user?.role === 'LAB_STAFF'

  // Order creation state
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [testType, setTestType] = useState('')
  const [notes, setNotes] = useState('')
  
  const createLabOrder = useCreateLabOrder(caseId)

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!testType) return
    
    createLabOrder.mutate(
      { type: testType, notes: notes || undefined },
      {
        onSuccess: () => {
          setShowOrderForm(false)
          setTestType('')
          setNotes('')
        },
      }
    )
  }

  if (isLoading) return <p className="text-gray-700 text-sm">Loading lab results...</p>
  if (isError)   return <p className="text-red-600 text-sm">Failed to load lab results.</p>

  return (
    <div className="space-y-4">
      {/* Order Creation Button - Only for Doctors */}
      {isDoctor && (
        <div>
          {!showOrderForm ? (
            <button
              onClick={() => setShowOrderForm(true)}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Order Lab Test
            </button>
          ) : (
            <form onSubmit={handleCreateOrder} className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-indigo-900 mb-3">New Lab Order</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Test Type
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black/70"
                    required
                  >
                    <option value="">Select test type...</option>
                    {LAB_TEST_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black/70"
                    placeholder="Any specific instructions..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={createLabOrder.isPending || !testType}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createLabOrder.isPending ? 'Creating...' : 'Create Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
                
                {createLabOrder.isError && (
                  <p className="text-xs text-red-600">
                    Failed to create order. Please try again.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Lab Results List */}
      {!data?.data.length ? (
        <p className="text-gray-700 text-sm">No lab results available yet.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((lab: LabResult) => (
            <div key={lab.id} className="border border-gray-100 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">{lab.type}</span>
                <span className={`text-xs font-semibold ${statusColor[lab.status]}`}>
                  {lab.status}
                </span>
              </div>
              <p className="text-sm text-gray-900">{lab.result}</p>
              <p className="text-xs text-gray-700 mt-1">
                {new Date(lab.date).toLocaleDateString()}
              </p>
              
              {/* Report file link and upload button */}
              <div className="flex items-center justify-between mt-2">
                {lab.reportFileUrl && (
                  <a
                    href={lab.reportFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Report PDF
                  </a>
                )}
                {isLabStaff && (
                  <div className={lab.reportFileUrl ? '' : 'ml-auto'}>
                    <UploadLabReportButton labResultId={lab.id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}