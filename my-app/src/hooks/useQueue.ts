import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { QueueResponse, QueueStats } from '@/types/queue'
import { MOCK_QUEUE, MOCK_QUEUE_STATS, delay } from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// GET /api/v1/queue
export function useQueue() {
  return useQuery<QueueResponse>({
    queryKey: ['queue'],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_QUEUE }
      const res = await api.get<QueueResponse>('/queue')
      return res.data
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

// GET /api/v1/queue/stats
export function useQueueStats() {
  return useQuery<QueueStats>({
    queryKey: ['queue', 'stats'],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_QUEUE_STATS }
      const res = await api.get<QueueStats>('/queue/stats')
      return res.data
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })
}