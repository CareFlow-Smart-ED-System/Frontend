"use client"

import { useState } from "react"
import { useAuditLogs } from "@/hooks/useAdmin"
import { AuditLogsTable } from "@/components/admin/AuditLogsTable"

// ─────────────────────────────────────────────────────────────
// Admin Audit Logs Page
//
// Purpose:
// - Displays immutable system activity logs.
// - Allows filtering by action type.
// - Allows filtering by user/target ID.
//
// Endpoint used through hook:
// GET /api/v1/admin/audit-logs
//
// Notes:
// - Audit logs are read-only.
// - No edit/delete actions should be available here.
// ─────────────────────────────────────────────────────────────

export default function AuditLogsPage() {
    const [actionType, setActionType] = useState("")
    const [userId, setUserId] = useState("")

    const {
        data,
        isLoading,
        isError,
    } = useAuditLogs({
        actionType: actionType || undefined,
        userId: userId || undefined,
    })

    return (
        <div className="min-h-screen bg-[#eef2f3]">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8">
                    <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
                        Immutable system activity
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Audit Logs
                    </h1>

                    <p className="text-sm md:text-base text-gray-500">
                        Track important user actions across the emergency department system.
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Action Type
                            </label>

                            <input
                                type="text"
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                placeholder="CASE_STATUS_UPDATED"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                User / Target ID
                            </label>

                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="case-001"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setActionType("")
                                    setUserId("")
                                }}
                                className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-black"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Table status */}
                    <div className="mb-4">
                        <p className="text-xs text-gray-500">
                            {data?.total ?? 0} log{data?.total === 1 ? "" : "s"} found
                        </p>
                    </div>

                    {isLoading && (
                        <p className="text-sm text-gray-500">Loading audit logs...</p>
                    )}

                    {isError && (
                        <p className="text-sm text-red-600">
                            Failed to load audit logs. Please refresh.
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <AuditLogsTable logs={data?.data ?? []} />
                    )}
                </div>
            </div>
        </div>
    )
}