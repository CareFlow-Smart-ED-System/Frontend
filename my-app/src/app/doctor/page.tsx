"use client"

import { useDoctorCases } from '@/hooks/useDoctors'
import { DoctorCaseTable } from '@/components/doctor/DoctorCaseTable'
import { useAuthStore } from '@/store/authStore' // auth store

export default function DoctorDashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, isError } = useDoctorCases(user?.userId ?? '')

  if (isLoading) return <div className="p-6 text-gray-500">Loading your cases...</div>
  if (isError)   return <div className="p-6 text-red-500">Failed to load cases. Please refresh.</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.total ?? 0} active case{data?.total !== 1 ? 's' : ''} assigned to you
        </p>
      </div>

      <DoctorCaseTable cases={data?.data ?? []} />
    </div>
  )
}