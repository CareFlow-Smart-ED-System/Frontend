import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  VitalSignsPayload,
  VitalSignsResponse,
  RecordVitalSignsResponse,
  AdministerMedicationPayload,
  AdministerMedicationResponse,
  AddNotePayload,
  AddNoteResponse,
  ClinicalNotesResponse,
} from '@/types/nurse'

// POST /api/v1/cases/{caseId}/vital-signs
export function useRecordVitalSigns(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<RecordVitalSignsResponse, Error, VitalSignsPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<RecordVitalSignsResponse>(
        `/cases/${caseId}/vital-signs`,
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'vital-signs'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
    },
  })
}

// GET /api/v1/cases/{caseId}/vital-signs
export function useVitalSigns(caseId: string) {
  return useQuery<VitalSignsResponse>({
    queryKey: ['cases', caseId, 'vital-signs'],
    queryFn: async () => {
      const res = await api.get<VitalSignsResponse>(`/cases/${caseId}/vital-signs`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}

// POST /api/v1/cases/{caseId}/medications/administrations
export function useAdministerMedication(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<AdministerMedicationResponse, Error, AdministerMedicationPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<AdministerMedicationResponse>(
        `/cases/${caseId}/medications/administrations`,
        payload
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
    },
  })
}

// POST /api/v1/cases/{caseId}/notes
export function useAddNote(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<AddNoteResponse, Error, AddNotePayload>({
    mutationFn: async (payload) => {
      const res = await api.post<AddNoteResponse>(`/cases/${caseId}/notes`, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'notes'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
    },
  })
}

// GET /api/v1/cases/{caseId}/notes
export function useClinicalNotes(caseId: string) {
  return useQuery<ClinicalNotesResponse>({
    queryKey: ['cases', caseId, 'notes'],
    queryFn: async () => {
      const res = await api.get<ClinicalNotesResponse>(`/cases/${caseId}/notes`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}