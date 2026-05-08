import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  DoctorsResponse,
  DoctorCasesResponse,
  LabResultsResponse,
  ImagingResponse,
  PrescribeMedicationPayload,
  PrescribeMedicationResponse,
} from '@/types/doctors'
import { CaseStatus } from '@/types/queue'

// GET /api/v1/doctors
export function useDoctors() {
  return useQuery<DoctorsResponse>({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await api.get<DoctorsResponse>('/doctors')
      return res.data
    },
    staleTime: 30000,
  })
}

// GET /api/v1/doctors/{doctorId}/cases
export function useDoctorCases(doctorId: string, filters?: { status?: CaseStatus }) {
  return useQuery<DoctorCasesResponse>({
    queryKey: ['doctors', doctorId, 'cases', filters],
    queryFn: async () => {
      const res = await api.get<DoctorCasesResponse>(`/doctors/${doctorId}/cases`, {
        params: filters,
      })
      return res.data
    },
    enabled: !!doctorId,
    staleTime: 10000,
  })
}

// GET /api/v1/cases/{caseId}/lab-results
export function useLabResults(caseId: string) {
  return useQuery<LabResultsResponse>({
    queryKey: ['cases', caseId, 'lab-results'],
    queryFn: async () => {
      const res = await api.get<LabResultsResponse>(`/cases/${caseId}/lab-results`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 15000,
  })
}

// GET /api/v1/cases/{caseId}/imaging
export function useImaging(caseId: string) {
  return useQuery<ImagingResponse>({
    queryKey: ['cases', caseId, 'imaging'],
    queryFn: async () => {
      const res = await api.get<ImagingResponse>(`/cases/${caseId}/imaging`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 15000,
  })
}

// POST /api/v1/cases/{caseId}/medications
export function usePrescribeMedication(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<PrescribeMedicationResponse, Error, PrescribeMedicationPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<PrescribeMedicationResponse>(
        `/cases/${caseId}/medications`,
        payload
      )
      return res.data
    },
    onSuccess: () => {
      // Invalidate medications list and the case timeline so both refresh
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'medications'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
    },
  })
}