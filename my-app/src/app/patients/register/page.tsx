"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuickRegisterPatient } from "@/hooks/usePatients"
import { Gender } from "@/types/patients"

// ─────────────────────────────────────────────────────────────
// Patient Quick Registration Page
//
// Purpose:
// - Used when a patient arrives at the emergency department.
// - Nurse or Receptionist enters only the minimum required data.
// - After success, backend returns the new patientId.
//
// Endpoint used:
// POST /api/v1/patients/quick-register
// ─────────────────────────────────────────────────────────────

export default function QuickRegisterPatientPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "FEMALE" as Gender,
    phone: "",
  })

  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null)
  const [createdPatientName, setCreatedPatientName] = useState<string | null>(null)

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    reset,
  } = useQuickRegisterPatient()

  // Updates the form whenever the user types/selects a value.
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    // Clear previous mutation status when editing again.
    reset()
    setCreatedPatientId(null)
    setCreatedPatientName(null)
  }

  // Sends the quick registration request to the backend.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    mutate(form, {
      onSuccess: (data) => {
        setCreatedPatientId(data.patientId)
        setCreatedPatientName(data.displayName)

        // Clear the form after successful registration.
        setForm({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "FEMALE",
          phone: "",
        })
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
            Emergency arrival intake
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Quick Patient Registration
          </h1>

          <p className="text-sm md:text-base text-gray-500">
            Register a patient quickly with the minimum required information
            before creating an emergency case.
          </p>
        </div>

        {/* Registration form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First name */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Salma"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            {/* Last name */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Ahmed"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
              </select>
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+201012345678"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                required
              />
            </div>
          </div>

          {/* Error / success messages */}
          {isError && (
            <p className="text-sm text-red-600">
              Failed to register patient. Please check the required fields and
              try again.
            </p>
          )}

          {isSuccess && createdPatientId && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-800">
                Patient registered successfully.
              </p>

              <p className="text-sm text-green-700 mt-1">
                Patient: {createdPatientName}
              </p>

              <p className="text-xs text-green-700 mt-1">
                Patient ID: {createdPatientId}
              </p>

              {/* Helpful next actions after quick registration */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href={`/patients/${createdPatientId}`}
                  className="text-xs bg-white border border-green-300 text-green-800 px-3 py-2 rounded-full hover:bg-green-100"
                >
                  View Patient Profile
                </Link>

                <Link
                  href="/cases"
                  className="text-xs bg-green-700 text-white px-3 py-2 rounded-full hover:bg-green-800"
                >
                  Go to Cases
                </Link>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
          >
            {isPending ? "Registering..." : "Register Patient"}
          </button>
        </form>
      </div>
    </div>
  )
}