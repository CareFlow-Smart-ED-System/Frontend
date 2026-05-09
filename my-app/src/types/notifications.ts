export type NotificationType =
    | 'LAB_RESULT'
    | 'DOCTOR_ASSIGNED'
    | 'VITALS_ABNORMAL'
    | 'IMAGING_READY'
    | 'CRITICAL_ALERT'
    | 'NEW_PRESCRIPTION'

export interface NotificationItem {
    id: string
    caseId?: string
    message: string
    type: NotificationType
    isRead: boolean
    createdAt: string
}

export interface NotificationsResponse {
    total: number
    unread: number
    page: number
    limit: number
    totalPages: number
    data: NotificationItem[]
}

export interface MarkNotificationReadResponse {
    message: string
    notificationId: string
}

export interface MarkAllNotificationsReadResponse {
    message: string
    updatedCount: number
}