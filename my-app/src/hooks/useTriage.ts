import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  TriagePayload,
  TriageResponse,
  TriageRecord,
  TriageHistoryResponse,
} from '@/types/triage'
import { MOCK_TRIAGE, MOCK_TRIAGE_HISTORY, delay } from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

type ApiResponse<T> = { success: boolean; data: T; timestamp: string }

// POST /api/v1/cases/{caseId}/triage
export function useRecordTriage(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<TriageResponse, Error, TriagePayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300)
        return {
          message: 'Triage recorded successfully',
          triageId: `triage-${Date.now()}`,
          caseId,
          severity: payload.severity,
          triageTime: new Date().toISOString(),
        }
      }
      const res = await api.post<ApiResponse<TriageResponse>>(`/cases/${caseId}/triage`, payload)
      return res.data.data
    },
    onSuccess: () => {
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
      if (USE_MOCK) { await delay(); return MOCK_TRIAGE }
      const res = await api.get<ApiResponse<TriageRecord>>(`/cases/${caseId}/triage`)
      return res.data.data
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
      if (USE_MOCK) { await delay(); return MOCK_TRIAGE_HISTORY }
      const res = await api.get<ApiResponse<TriageHistoryResponse>>(`/cases/${caseId}/triage/history`)
      return res.data.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}