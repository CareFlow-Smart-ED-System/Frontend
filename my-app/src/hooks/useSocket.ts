import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type NotificationSocketPayload = {
  notificationId?: string
  caseId?: string
  message?: string
  type?: string
  action?: string
}

export function useSocket(userId: string) {
  const queryClient = useQueryClient()
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    if (!userId) return
    if (socketRef.current) return

    const socket = io(process.env.NEXT_PUBLIC_API_URL!)

    socketRef.current = socket

    socket.emit('join', `user_${userId}`)
    socket.emit('join', 'clinical_floor')

    socket.on('queue.updated', () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    })

    socket.on('notification.critical_triage', (data: NotificationSocketPayload) => {
      toast.error(data.message ?? 'Critical triage alert', {
        duration: 8000,
        icon: '🚨',
      })

      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    })

    socket.on('notification.doctor_assigned', (data: NotificationSocketPayload) => {
      toast(data.message ?? 'Doctor assigned to case', {
        icon: '👨‍⚕️',
        duration: 6000,
      })

      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['cases'] })

      if (data.caseId) {
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId] })
      }
    })

    socket.on('notification.vitals_abnormal', (data: NotificationSocketPayload) => {
      toast(data.message ?? 'Abnormal vitals recorded', {
        icon: '⚠️',
        duration: 6000,
      })

      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      if (data.caseId) {
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId] })
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId, 'vital-signs'] })
      }
    })

    socket.on('notification.new_prescription', (data: NotificationSocketPayload) => {
      toast(data.message ?? 'New prescription added', {
        icon: '💊',
        duration: 6000,
      })

      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      if (data.caseId) {
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId, 'medications'] })
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId, 'timeline'] })
      }
    })

    socket.on('notification.lab_ready', (data: NotificationSocketPayload) => {
      toast(data.message ?? 'New lab or imaging result available', {
        icon: '🧪',
        duration: 6000,
      })

      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      if (data.caseId) {
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId, 'lab-results'] })
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId, 'imaging'] })
        queryClient.invalidateQueries({ queryKey: ['cases', data.caseId, 'timeline'] })
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userId, queryClient])
}