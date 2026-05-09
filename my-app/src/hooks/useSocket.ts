import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useSocket(userId: string) {
  const queryClient = useQueryClient()
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    if (socketRef.current) return

    const socket = io(process.env.NEXT_PUBLIC_API_URL!)

    socketRef.current = socket

    socket.emit('join', `user_${userId}`)
    socket.emit('join', 'clinical_floor')

    socket.on('queue.updated', () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
    })

    socket.on('notification.critical_triage', (data) => {
      toast.error(data.message, { duration: 8000, icon: '🚨' })
    })

    socket.on('notification.doctor_assigned', () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    })

    socket.on('notification.vitals_abnormal', (data) => {
      toast(data.message, { icon: '⚠️', duration: 6000 })
      queryClient.invalidateQueries({ queryKey: ['cases', data.caseId] })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userId])
}