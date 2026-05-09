"use client"

import Link from "next/link"
import { useNotifications } from "@/hooks/useNotifications"

export function NotificationBell() {
  const { data } = useNotifications({ isRead: false })

  const unread = data?.unread ?? 0

  return (
    <Link
      href="/notifications"
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-100 hover:bg-[#f5f7f8]"
      title="Notifications"
    >
      <span className="text-lg">🔔</span>

      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-700 text-white text-xs flex items-center justify-center">
          {unread}
        </span>
      )}
    </Link>
  )
}