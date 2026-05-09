"use client"

import { useState } from "react"
import { useAppointments } from "@/hooks/useAppointments"
import { AppointmentStatus } from "@/types/appointments"
import { AppointmentForm } from "@/components/appointments/AppointmentForm"
import { AppointmentsTable } from "@/components/appointments/AppointmentsTable"

// ─────────────────────────────────────────────────────────────
// Appointments Dashboard Page
//
// Purpose:
// - Shows all follow-up appointments.
// - Allows filtering appointments by status.
// - Allows Receptionist/Admin to book new follow-up appointments.
// - Allows Receptionist/Admin to update/cancel appointments.
//
// Endpoints used through hooks:
// GET   /api/v1/appointments
// POST  /api/v1/appointments
// PATCH /api/v1/appointments/{appointmentId}
//
// System flow position:
// 10. Billing generated
// 11. Follow-up appointment scheduled  ← this page supports this step
// ─────────────────────────────────────────────────────────────

export default function AppointmentsPage() {
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("")

    const {
        data,
        isLoading,
        isError,
    } = useAppointments(statusFilter ? { status: statusFilter } : undefined)

    return (
        <div className="min-h-screen bg-[#eef2f3]">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8">
                    <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
                        Follow-up scheduling
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Appointments
                    </h1>

                    <p className="text-sm md:text-base text-gray-500">
                        Book follow-up appointments after emergency treatment and track
                        appointment status.
                    </p>
                </div>

                {/* Book appointment form */}
                <div className="mb-8">
                    <AppointmentForm />
                </div>

                {/* Appointments table */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                All Appointments
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                {data?.total ?? 0} appointment
                                {data?.total === 1 ? "" : "s"} found
                            </p>
                        </div>

                        {/* Status filter */}
                        <div className="w-full md:w-56">
                            <label className="block text-xs text-gray-500 mb-1">
                                Filter by Status
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value as AppointmentStatus | "")
                                }
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                            >
                                <option value="">All statuses</option>
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading / error / table states */}
                    {isLoading && (
                        <p className="text-sm text-gray-500">
                            Loading appointments...
                        </p>
                    )}

                    {isError && (
                        <p className="text-sm text-red-600">
                            Failed to load appointments. Please refresh.
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <AppointmentsTable appointments={data?.data ?? []} />
                    )}
                </div>
            </div>
        </div>
    )
}