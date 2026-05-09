"use client"

import { useState } from "react"
import { useCreateStaffUser } from "@/hooks/useAdmin"
import { StaffGender, StaffRole } from "@/types/admin"

// ─────────────────────────────────────────────────────────────
// Staff User Form
//
// Purpose:
// - Admin creates staff accounts.
// - Patients are NOT created here.
// - Patients are created through quick patient registration.
//
// Endpoint used:
// POST /api/v1/admin/users
//
// Conditional fields:
// - DOCTOR requires specialization.
// - NURSE requires department.
// - ADMIN and RECEPTIONIST do not require extra role-specific fields.
// ─────────────────────────────────────────────────────────────

export function StaffUserForm() {
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "FEMALE" as StaffGender,
    role: "DOCTOR" as StaffRole,
    specialization: "",
    department: "",
  })

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    reset,
  } = useCreateStaffUser()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear previous success/error message when editing again.
    reset()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    mutate(
      {
        displayName: form.displayName,
        email: form.email,
        password: form.password,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        role: form.role,
        specialization:
          form.role === "DOCTOR" ? form.specialization : undefined,
        department:
          form.role === "NURSE" ? form.department : undefined,
      },
      {
        onSuccess: () => {
          setForm({
            displayName: "",
            email: "",
            password: "",
            dateOfBirth: "",
            gender: "FEMALE",
            role: "DOCTOR",
            specialization: "",
            department: "",
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
          Create Staff User
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Add doctors, nurses, receptionists, or admins to the CareFlow ED system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display name */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Display Name
          </label>

          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            placeholder="Dr. Sara Ahmed"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="sara.ahmed@careflow.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="SecurePass123!"
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

        {/* Role */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
            required
          >
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Doctor-only field */}
        {form.role === "DOCTOR" && (
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Emergency Medicine"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
              required
            />
          </div>
        )}

        {/* Nurse-only field */}
        {form.role === "NURSE" && (
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Department
            </label>

            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Emergency"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
              required
            />
          </div>
        )}
      </div>

      {isError && (
        <p className="text-xs text-red-600">
          Failed to create staff user. Check required fields or duplicate email.
        </p>
      )}

      {isSuccess && (
        <p className="text-xs text-green-600">
          Staff user created successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Staff User"}
      </button>
    </form>
  )
}