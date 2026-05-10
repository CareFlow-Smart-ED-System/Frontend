"use client"

import { useState } from "react"
import { Appointment } from "@/types/appointments"
import { AppointmentStatusBadge, AppointmentStatusSelect } from "@/components/appointments/AppointmentStatusSelect"
import { useUpdateAppointment } from "@/hooks/useAppointments"

// ─────────────────────────────────────────────────────────────
// Appointments Table
//
// Purpose:
// - Displays all appointments.
// - Allows updating appointment status.
// - Updating status can be used to cancel an appointment.
//
// Endpoint used indirectly:
// PATCH /api/v1/appointments/{appointmentId}
// ─────────────────────────────────────────────────────────────

interface Props {
    appointments: Appointment[]
}

export function AppointmentsTable({ appointments }: Props) {
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null)

    const safeAppointments = Array.isArray(appointments) ? appointments : []

    if (safeAppointments.length === 0) {
        return (
            <div className="text-center py-12 text-gray-900">
                No appointments found.
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* Status update panel */}
            {selectedAppointment && (
                <AppointmentStatusUpdatePanel
                    appointment={selectedAppointment}
                    onCancel={() => setSelectedAppointment(null)}
                    onSuccess={() => setSelectedAppointment(null)}
                />
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#f5f7f8] text-gray-600">
                            <th className="text-left px-4 py-3 font-medium">Patient</th>
                            <th className="text-left px-4 py-3 font-medium">Doctor</th>
                            <th className="text-left px-4 py-3 font-medium">Date</th>
                            <th className="text-left px-4 py-3 font-medium">Status</th>
                            <th className="text-left px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {safeAppointments.map((appointment) => (
                            <tr
                                key={appointment.appointmentId}
                                className="border-b border-gray-100 text-gray-900"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {appointment.patientName}
                                </td>

                                <td className="px-4 py-3">
                                    {appointment.doctorName}
                                </td>

                                <td className="px-4 py-3 text-gray-600">
                                    {new Date(appointment.date).toLocaleString()}
                                </td>

                                <td className="px-4 py-3">
                                    <AppointmentStatusBadge status={appointment.status} />
                                </td>

                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedAppointment(appointment)}
                                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-gray-200"
                                    >
                                        Update Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Appointment Status Update Panel
//
// Purpose:
// - Small inline form shown above the table.
// - Lets user change status to SCHEDULED, COMPLETED, or CANCELLED.
// ─────────────────────────────────────────────────────────────

function AppointmentStatusUpdatePanel({
    appointment,
    onCancel,
    onSuccess,
}: {
    appointment: Appointment
    onCancel: () => void
    onSuccess: () => void
}) {
    const [status, setStatus] = useState(appointment.status)

    const {
        mutate,
        isPending,
        isError,
        isSuccess,
    } = useUpdateAppointment(appointment.appointmentId)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        mutate(
            { status },
            {
                onSuccess,
            }
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-[#f5f7f8] border border-gray-200 rounded-2xl p-5 space-y-4"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                        Update Appointment Status
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                        Updating appointment for {appointment.patientName}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-gray-500 hover:text-gray-900"
                >
                    Cancel
                </button>
            </div>

            <AppointmentStatusSelect value={status} onChange={setStatus} />

            {isError && (
                <p className="text-xs text-red-600">
                    Failed to update appointment. Please try again.
                </p>
            )}

            {isSuccess && (
                <p className="text-xs text-green-600">
                    Appointment updated successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-700 text-white py-2 rounded-lg text-sm hover:bg-red-800 disabled:opacity-50"
            >
                {isPending ? "Updating..." : "Save Appointment Status"}
            </button>
        </form>
    )
}