"use client"

import { useDoctorCases } from '@/hooks/useDoctors'
import { DoctorCaseTable } from '@/components/doctor/DoctorCaseTable'
import { useAuthStore } from '@/store/authStore' // auth store

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, isError } = useDoctorCases(user?.userId ?? '')

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-gray-500">
          Loading your cases...
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
            Your current caseload overview
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Patients
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            {data?.total ?? 0} active case{data?.total !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <DoctorCaseTable cases={data?.data ?? []} />
        </div>
      </div>
    </div>
  )
}