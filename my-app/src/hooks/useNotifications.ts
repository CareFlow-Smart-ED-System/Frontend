import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
    MarkAllNotificationsReadResponse,
    MarkNotificationReadResponse,
    NotificationsResponse,
} from '@/types/notifications'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// Small local delay so mock mode behaves like a real API request.
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

type ApiWrapper<T> = {
    success: boolean
    data: T
    timestamp?: string
}

// ─────────────────────────────────────────────────────────────
// Notifications
//
// Covers:
// GET   /api/v1/notifications
// PATCH /api/v1/notifications/{notificationId}/read
// PATCH /api/v1/notifications/read-all
// ─────────────────────────────────────────────────────────────

// GET /api/v1/notifications
export function useNotifications(filters?: { isRead?: boolean }) {
    return useQuery<NotificationsResponse>({
        queryKey: ['notifications', filters],
        queryFn: async () => {
            if (USE_MOCK) {
                await delay()

                const allNotifications: NotificationsResponse['data'] = [
                    {
                        id: 'notif-001',
                        caseId: 'case-001',
                        message: 'New lab results available for patient John Doe',
                        type: 'LAB_RESULT',
                        isRead: false,
                        readAt: null,
                        createdAt: '2026-05-09T10:00:00.000Z',
                    },
                    {
                        id: 'notif-002',
                        caseId: 'case-002',
                        message: 'Patient Layla Hassan assigned to you',
                        type: 'DOCTOR_ASSIGNED',
                        isRead: true,
                        readAt: '2026-05-09T10:30:00.000Z',
                        createdAt: '2026-05-09T10:15:00.000Z',
                    },
                    {
                        id: 'notif-003',
                        caseId: 'case-003',
                        message: 'CRITICAL PATIENT ARRIVED: Omar Khalil',
                        type: 'CRITICAL_ALERT',
                        isRead: false,
                        readAt: null,
                        createdAt: '2026-05-09T11:00:00.000Z',
                    },
                ]

                const filteredNotifications =
                    filters?.isRead === undefined
                        ? allNotifications
                        : allNotifications.filter((notification) => {
                            return notification.isRead === filters.isRead
                        })

                return {
                    total: filteredNotifications.length,
                    unread: allNotifications.filter((notification) => !notification.isRead)
                        .length,
                    page: 1,
                    limit: 20,
                    totalPages: 1,
                    data: filteredNotifications,
                }
            }

            const res = await api.get<
                NotificationsResponse | ApiWrapper<NotificationsResponse>
            >('/notifications', {
                params: filters,
            })

            return 'success' in res.data ? res.data.data : res.data
        },
        staleTime: 10000,
    })
}

// PATCH /api/v1/notifications/{notificationId}/read
export function useMarkNotificationRead() {
    const queryClient = useQueryClient()

    return useMutation<MarkNotificationReadResponse, Error, string>({
        mutationFn: async (notificationId) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Notification marked as read',
                    notificationId,
                }
            }

            const res = await api.patch<
                MarkNotificationReadResponse | ApiWrapper<MarkNotificationReadResponse>
            >(`/notifications/${notificationId}/read`)

            return 'success' in res.data ? res.data.data : res.data
        },
        onSuccess: () => {
            // Refresh notification list and unread bell count.
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
    })
}

// PATCH /api/v1/notifications/read-all
export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient()

    return useMutation<MarkAllNotificationsReadResponse, Error, void>({
        mutationFn: async () => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'All notifications marked as read',
                    updatedCount: 2,
                }
            }

            const res = await api.patch<
                MarkAllNotificationsReadResponse | ApiWrapper<MarkAllNotificationsReadResponse>
            >('/notifications/read-all')

            return 'success' in res.data ? res.data.data : res.data
        },
        onSuccess: () => {
            // Refresh notification list and unread bell count.
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
    })
}