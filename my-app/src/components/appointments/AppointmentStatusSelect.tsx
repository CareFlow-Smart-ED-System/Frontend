"use client"

import { AppointmentStatus } from "@/types/appointments"

// ─────────────────────────────────────────────────────────────
// Appointment Status Select + Badge
//
// Purpose:
// - AppointmentStatusSelect is used when updating status.
// - AppointmentStatusBadge is used in tables for readable display.
//
// Allowed statuses from API:
// SCHEDULED | COMPLETED | CANCELLED
// ─────────────────────────────────────────────────────────────

interface AppointmentStatusSelectProps {
    value: AppointmentStatus
    onChange: (value: AppointmentStatus) => void
}

export function AppointmentStatusSelect({
    value,
    onChange,
}: AppointmentStatusSelectProps) {
    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1">
                Appointment Status
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value as AppointmentStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                required
            >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
            </select>
        </div>
    )
}

export function AppointmentStatusBadge({
    status,
}: {
    status: AppointmentStatus
}) {
    const styles: Record<AppointmentStatus, string> = {
        SCHEDULED: "bg-blue-50 text-blue-700",
        COMPLETED: "bg-green-50 text-green-700",
        CANCELLED: "bg-red-50 text-red-700",
    }

    const labels: Record<AppointmentStatus, string> = {
        SCHEDULED: "Scheduled",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
    }

    return (
        <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>
    )
}
