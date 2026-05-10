"use client"

import { useState } from 'react'
import { useImaging, useCreateImagingOrder } from '@/hooks/useDoctors'
import { UploadImagingReportButton } from '@/components/doctor/UploadImagingReportButton'
import { useAuthStore } from '@/store/authStore'
import { ImagingReport } from '@/types/doctors'

interface Props {
  caseId: string
}

const statusColor: Record<string, string> = {
  AVAILABLE: 'text-green-700',
  PENDING:   'text-yellow-700',
}

const IMAGING_TYPES = [
  'X-Ray',
  'CT Scan',
  'MRI',
  'Ultrasound',
  'Mammography',
  'PET Scan',
  'Bone Density',
  'Angiography',
  'Other',
]

const BODY_REGIONS = [
  'Head',
  'Chest',
  'Abdomen',
  'Pelvis',
  'Spine',
  'Upper Extremity',
  'Lower Extremity',
  'Full Body',
  'Other',
]

export function ImagingTab({ caseId }: Props) {
  const { data, isLoading, isError } = useImaging(caseId)
  const { user } = useAuthStore()
  const isDoctor = user?.role === 'DOCTOR'
  const isRadiologist = user?.role === 'RADIOLOGIST'

  // Order creation state
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [imagingType, setImagingType] = useState('')
  const [region, setRegion] = useState('')
  const [summary, setSummary] = useState('')
  
  const createImagingOrder = useCreateImagingOrder(caseId)

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!imagingType) return
    
    createImagingOrder.mutate(
      { 
        type: imagingType, 
        region: region || undefined, 
        summary: summary || undefined 
      },
      {
        onSuccess: () => {
          setShowOrderForm(false)
          setImagingType('')
          setRegion('')
          setSummary('')
        },
      }
    )
  }

  if (isLoading) return <p className="text-gray-700 text-sm">Loading imaging reports...</p>
  if (isError)   return <p className="text-red-600 text-sm">Failed to load imaging reports.</p>

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
              + Order Imaging
            </button>
          ) : (
            <form onSubmit={handleCreateOrder} className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-indigo-900 mb-3">New Imaging Order</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Imaging Type
                  </label>
                  <select
                    value={imagingType}
                    onChange={(e) => setImagingType(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select imaging type...</option>
                    {IMAGING_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Body Region (optional)
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select region...</option>
                    {BODY_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Clinical Summary (optional)
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={2}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief clinical history or reason for imaging..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={createImagingOrder.isPending || !imagingType}
                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createImagingOrder.isPending ? 'Creating...' : 'Create Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
                
                {createImagingOrder.isError && (
                  <p className="text-xs text-red-600">
                    Failed to create order. Please try again.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Imaging Reports List */}
      {!data?.data.length ? (
        <p className="text-gray-700 text-sm">No imaging reports available yet.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((img: ImagingReport) => (
            <div key={img.id} className="border border-gray-100 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">
                  {img.type}{img.region ? ` — ${img.region}` : ''}
                </span>
                <span className={`text-xs font-semibold ${statusColor[img.status]}`}>
                  {img.status}
                </span>
              </div>
              <p className="text-sm text-gray-900">{img.report}</p>
              <p className="text-xs text-gray-700 mt-1">
                {new Date(img.date).toLocaleDateString()}
              </p>
              
              {/* Report file link and upload button */}
              <div className="flex items-center justify-between mt-2">
                {img.reportFileUrl && (
                  <a
                    href={img.reportFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Report PDF
                  </a>
                )}
                {isRadiologist && (
                  <div className={img.reportFileUrl ? '' : 'ml-auto'}>
                    <UploadImagingReportButton imagingId={img.id} />
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