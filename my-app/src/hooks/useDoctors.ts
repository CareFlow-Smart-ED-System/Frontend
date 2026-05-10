import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  DoctorsResponse,
  DoctorCasesResponse,
  LabResultsResponse,
  ImagingResponse,
  PrescribeMedicationPayload,
  PrescribeMedicationResponse,
  MedicationsResponse,
} from '@/types/doctors'
import { CaseStatus } from '@/types/queue'
import {
  MOCK_DOCTORS,
  MOCK_DOCTOR_CASES,
  MOCK_LAB_RESULTS,
  MOCK_IMAGING,
  MOCK_MEDICATIONS,
  delay,
} from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// GET /api/v1/doctors
export function useDoctors() {
  return useQuery<DoctorsResponse>({
    queryKey: ['doctors'],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_DOCTORS }
      const res = await api.get<DoctorsResponse>('/doctors')
      return res.data
    },
    staleTime: 30000,
  })
}

// GET /api/v1/doctors/me/cases
export function useDoctorCases(doctorId: string, filters?: { status?: CaseStatus }) {
  return useQuery<DoctorCasesResponse>({
    queryKey: ['doctors', 'me', 'cases', filters],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_DOCTOR_CASES }
      const res = await api.get<DoctorCasesResponse>('/doctors/me/cases', {
        params: filters,
      })
      return res.data
    },
    enabled: !!doctorId,
    staleTime: 10000,
  })
}

// GET /api/v1/doctors/cases/{caseId}/lab-results
export function useLabResults(caseId: string) {
  return useQuery<LabResultsResponse>({
    queryKey: ['cases', caseId, 'lab-results'],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_LAB_RESULTS }
      const res = await api.get<LabResultsResponse>(`/doctors/cases/${caseId}/lab-results`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 15000,
  })
}

// GET /api/v1/doctors/cases/{caseId}/imaging-reports
export function useImaging(caseId: string) {
  return useQuery<ImagingResponse>({
    queryKey: ['cases', caseId, 'imaging'],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_IMAGING }
      const res = await api.get<ImagingResponse>(
        `/doctors/cases/${caseId}/imaging-reports`
      )
      return res.data
    },
    enabled: !!caseId,
    staleTime: 15000,
  })
}

// POST /api/v1/doctors/cases/{caseId}/medications
export function usePrescribeMedication(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<PrescribeMedicationResponse, Error, PrescribeMedicationPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300)
        return {
          message: 'Medication prescribed successfully',
          medication: {
            id: `med-${Date.now()}`,
            caseId,
            name: payload.name,
            dosage: payload.dosage,
            prescribedBy: 'Dr. Sara Ahmed',
            createdAt: new Date().toISOString(),
          },
        }
      }
      const res = await api.post<PrescribeMedicationResponse>(
        `/doctors/cases/${caseId}/medications`,
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors', 'cases', caseId, 'medications'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
    },
  })
}


// GET /api/v1/cases/{caseId}/medications
export function useMedications(caseId: string) {
  return useQuery<MedicationsResponse>({
    queryKey: ['cases', caseId, 'medications'],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_MEDICATIONS }
      const res = await api.get<MedicationsResponse>(`/cases/${caseId}/medications`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}