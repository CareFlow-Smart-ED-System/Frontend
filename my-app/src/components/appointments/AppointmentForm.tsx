"use client"

import { useState } from "react"
import { useDoctors } from "@/hooks/useDoctors"
import { useCreateAppointment } from "@/hooks/useAppointments"
import { AppointmentStatus } from "@/types/appointments"

// ─────────────────────────────────────────────────────────────
// Appointment Form
//
// Purpose:
// - Books a new follow-up appointment for a patient with a doctor.
//
// Endpoints used through hooks:
// POST /api/v1/appointments
// GET  /api/v1/doctors
//
// Important:
// - The API does not currently provide GET /patients.
// - Because of that, patient selection is a manual patientId input.
// - Doctor selection uses the existing useDoctors() hook.
// ─────────────────────────────────────────────────────────────

export function AppointmentForm() {
    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        date: "",
        status: "SCHEDULED" as AppointmentStatus,
    })

    const {
        data: doctors,
        isLoading: doctorsLoading,
        isError: doctorsError,
    } = useDoctors()

    const {
        mutate,
        isPending,
        isError,
        isSuccess,
        reset,
    } = useCreateAppointment()

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

        // Clear previous success/error message when editing again.
        reset()
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        mutate(
            {
                patientId: form.patientId,
                doctorId: form.doctorId,
                date: form.date,
                status: form.status,
            },
            {
                onSuccess: () => {
                    setForm({
                        patientId: "",
                        doctorId: "",
                        date: "",
                        status: "SCHEDULED",
                    })
                },
            }
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5"
        >
            <div>
                <h2 className="text-sm font-semibold text-gray-900">
                    Book Follow-up Appointment
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                    Schedule a follow-up visit after the patient&apos;s emergency case is
                    completed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient ID */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Patient ID
                    </label>

                    <input
                        type="text"
                        name="patientId"
                        value={form.patientId}
                        onChange={handleChange}
                        placeholder="patient-001"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>

                {/* Doctor */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Doctor
                    </label>

                    <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    >
                        <option value="">
                            {doctorsLoading ? "Loading doctors..." : "Select doctor"}
                        </option>

                        {doctors?.data.map((doctor) => (
                            <option key={doctor.doctorId} value={doctor.doctorId}>
                                {doctor.displayName} — {doctor.specialization}
                            </option>
                        ))}
                    </select>

                    {doctorsError && (
                        <p className="text-xs text-red-600 mt-1">
                            Failed to load doctors.
                        </p>
                    )}
                </div>

                {/* Appointment date */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Appointment Date
                    </label>

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>

                {/* Initial status */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {isError && (
                <p className="text-xs text-red-600">
                    Failed to book appointment. Please check the patient ID, doctor, and
                    date.
                </p>
            )}

            {isSuccess && (
                <p className="text-xs text-green-600">
                    Appointment booked successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={isPending || doctorsLoading}
                className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
            >
                {isPending ? "Booking..." : "Book Appointment"}
            </button>
        </form>
    )
}