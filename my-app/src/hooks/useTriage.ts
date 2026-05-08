import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  TriagePayload,
  TriageResponse,
  TriageRecord,
  TriageHistoryResponse,
} from '@/types/triage'

// POST /api/v1/cases/{caseId}/triage
export function useRecordTriage(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<TriageResponse, Error, TriagePayload>({
    mutationFn: async (payload) => {
      const res = await api.post<TriageResponse>(`/cases/${caseId}/triage`, payload)
      return res.data
    },
    onSuccess: () => {
      // Refresh triage, history, queue (severity change affects queue order)
      // and timeline so the new triage entry appears there too
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'triage'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'triage-history'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] })
      queryClient.invalidateQueries({ queryKey: ['queue'] })
    },
  })
}

// GET /api/v1/cases/{caseId}/triage
export function useTriage(caseId: string) {
  return useQuery<TriageRecord>({
    queryKey: ['cases', caseId, 'triage'],
    queryFn: async () => {
      const res = await api.get<TriageRecord>(`/cases/${caseId}/triage`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}

// GET /api/v1/cases/{caseId}/triage/history
export function useTriageHistory(caseId: string) {
  return useQuery<TriageHistoryResponse>({
    queryKey: ['cases', caseId, 'triage-history'],
    queryFn: async () => {
      const res = await api.get<TriageHistoryResponse>(`/cases/${caseId}/triage/history`)
      return res.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}