import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  CasesResponse,
  CaseDetail,
  CaseTimelineResponse,
  DischargeSummary,
  CreateCasePayload,
  CreateCaseResponse,
  UpdateStatusPayload,
  UpdateStatusResponse,
  AssignDoctorPayload,
  AssignDoctorResponse,
} from '@/types/cases'

// GET /api/v1/cases
export function useCases(filters?: { status?: string }) {
  return useQuery<CasesResponse>({
    queryKey: ['cases', filters],
    queryFn: async () => {
      const res = await api.get<CasesResponse>('/cases', { params: filters })
      return res.data
    },
    staleTime: 10000,
  })
}

// GET /api/v1/cases/{caseId}
export function useCase(caseId: string) {
  return useQuery<CaseDetail>({
    queryKey: ['cases', caseId],
    queryFn: async () => {
      const res = await api.get<CaseDetail>(`/cases/${caseId}`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}

// GET /api/v1/cases/{caseId}/timeline
export function useCaseTimeline(caseId: string) {
  return useQuery<CaseTimelineResponse>({
    queryKey: ['cases', caseId, 'timeline'],
    queryFn: async () => {
      const res = await api.get<CaseTimelineResponse>(`/cases/${caseId}/timeline`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}

// GET /api/v1/cases/{caseId}/summary — only when COMPLETED
export function useCaseSummary(caseId: string, enabled: boolean) {
  return useQuery<DischargeSummary>({
    queryKey: ['cases', caseId, 'summary'],
    queryFn: async () => {
      const res = await api.get<DischargeSummary>(`/cases/${caseId}/summary`)
      return res.data
    },
    enabled: !!caseId && enabled,
    staleTime: 60000,
  })
}

// POST /api/v1/cases
export function useCreateCase() {
  const queryClient = useQueryClient()
  return useMutation<CreateCaseResponse, Error, CreateCasePayload>({
    mutationFn: async (payload) => {
      const res = await api.post<CreateCaseResponse>('/cases', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
      queryClient.invalidateQueries({ queryKey: ['queue'] })
    },
  })
}

// PATCH /api/v1/cases/{caseId}/status
export function useUpdateCaseStatus(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<UpdateStatusResponse, Error, UpdateStatusPayload>({
    mutationFn: async (payload) => {
      const res = await api.patch<UpdateStatusResponse>(`/cases/${caseId}/status`, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
      queryClient.invalidateQueries({ queryKey: ['cases'] })
      queryClient.invalidateQueries({ queryKey: ['queue'] })
    },
  })
}

// POST /api/v1/cases/{caseId}/doctors
export function useAssignDoctor(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<AssignDoctorResponse, Error, AssignDoctorPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<AssignDoctorResponse>(`/cases/${caseId}/doctors`, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
    },
  })
}