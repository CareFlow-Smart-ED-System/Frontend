import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { QueueResponse, QueueStats } from '@/types/queue'

export function useQueue() {
  return useQuery<QueueResponse>({
    queryKey: ['queue'],
    queryFn: async () => {
      const res = await api.get<QueueResponse>('/queue')
      return res.data
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useQueueStats() {
  return useQuery<QueueStats>({
    queryKey: ['queue', 'stats'],
    queryFn: async () => {
      const res = await api.get<QueueStats>('/queue/stats')
      return res.data
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })
}