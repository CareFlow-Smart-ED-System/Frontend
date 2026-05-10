"use client"

import { useState } from "react"
import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
    useNotifications,
} from "@/hooks/useNotifications"

// ─────────────────────────────────────────────────────────────
// Notifications Page
//
// Purpose:
// - Shows notifications for the currently authenticated user.
// - Allows filtering by read/unread status.
// - Allows marking one notification as read.
// - Allows marking all notifications as read.
//
// Endpoints used through hooks:
// GET   /api/v1/notifications
// PATCH /api/v1/notifications/{notificationId}/read
// PATCH /api/v1/notifications/read-all
// ─────────────────────────────────────────────────────────────

type NotificationFilter = "ALL" | "UNREAD" | "READ"

export default function NotificationsPage() {
    const [filter, setFilter] = useState<NotificationFilter>("ALL")

    const isReadFilter =
        filter === "ALL" ? undefined : filter === "READ" ? true : false

    const { data, isLoading, isError } = useNotifications(
        isReadFilter === undefined ? undefined : { isRead: isReadFilter }
    )

    const markReadMutation = useMarkNotificationRead()
    const markAllReadMutation = useMarkAllNotificationsRead()
    const notifications = Array.isArray(data?.data) ? data.data : []

    return (
        <div className="min-h-screen bg-[#eef2f3]">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8">
                    <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
                        Real-time alerts and updates
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Notifications
                    </h1>

                    <p className="text-sm md:text-base text-gray-500">
                        Review alerts related to assigned doctors, critical triage, lab
                        results, abnormal vitals, imaging, and prescriptions.
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    {/* Top controls */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Notification Center
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                {data?.unread ?? 0} unread notification
                                {data?.unread === 1 ? "" : "s"}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filter dropdown */}
                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value as NotificationFilter)
                                }
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                            >
                                <option value="ALL">All</option>
                                <option value="UNREAD">Unread</option>
                                <option value="READ">Read</option>
                            </select>

                            {/* Mark all as read */}
                            <button
                                type="button"
                                onClick={() => markAllReadMutation.mutate()}
                                disabled={markAllReadMutation.isPending}
                                className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-800 disabled:opacity-50"
                            >
                                {markAllReadMutation.isPending
                                    ? "Updating..."
                                    : "Mark All as Read"}
                            </button>
                        </div>
                    </div>

                    {/* Loading / error states */}
                    {isLoading && (
                        <p className="text-sm text-gray-500">Loading notifications...</p>
                    )}

                    {isError && (
                        <p className="text-sm text-red-600">
                            Failed to load notifications. Please refresh.
                        </p>
                    )}

                    {markAllReadMutation.isError && (
                        <p className="text-xs text-red-600 mb-3">
                            Failed to mark all notifications as read.
                        </p>
                    )}

                    {markAllReadMutation.isSuccess && (
                        <p className="text-xs text-green-600 mb-3">
                            All notifications marked as read.
                        </p>
                    )}

                    {/* Empty state */}
                    {!isLoading && !isError && notifications.length === 0 && (
                        <div className="text-center py-12 text-gray-900">
                            No notifications found.
                        </div>
                    )}

                    {/* Notifications list */}
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`border rounded-2xl p-4 ${notification.isRead
                                    ? "bg-white border-gray-100"
                                    : "bg-red-50 border-red-100"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <NotificationTypeBadge type={notification.type} />

                                            {!notification.isRead && (
                                                <span className="text-xs bg-red-700 text-white px-2 py-0.5 rounded-full">
                                                    Unread
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm font-medium text-gray-900">
                                            {notification.message}
                                        </p>

                                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                            {notification.caseId && (
                                                <span>Case: {notification.caseId}</span>
                                            )}

                                            <span>
                                                Created: {new Date(notification.createdAt).toLocaleString()}
                                            </span>

                                            {notification.readAt && (
                                                <span>
                                                    Read: {new Date(notification.readAt).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!notification.isRead && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                markReadMutation.mutate(notification.id)
                                            }
                                            disabled={markReadMutation.isPending}
                                            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-red-200 text-red-700 text-xs hover:bg-red-100 disabled:opacity-50"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {markReadMutation.isError && (
                        <p className="text-xs text-red-600 mt-3">
                            Failed to mark notification as read.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// Small badge helper for notification type readability.
function NotificationTypeBadge({ type }: { type: string }) {
    return (
        <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            {type}
        </span>
    )
}