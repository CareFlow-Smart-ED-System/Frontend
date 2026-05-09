"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { useSocket } from '@/hooks/useSocket'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SocketBridge />
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

function SocketBridge() {
  const { user } = useAuthStore()
  useSocket(user?.userId ?? '')
  return null
}