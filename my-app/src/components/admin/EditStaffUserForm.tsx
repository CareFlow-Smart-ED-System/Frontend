"use client"

import { useState } from "react"
import { AdminUser, StaffRole } from "@/types/admin"
import { useUpdateStaffUser } from "@/hooks/useAdmin"

// ─────────────────────────────────────────────────────────────
// Edit Staff User Form
//
// Purpose:
// - Updates existing staff user display name, role,
//   and role-specific fields.
//
// Endpoint used:
// PATCH /api/v1/admin/users/{userId}
//
// Notes:
// - If role is DOCTOR, specialization is shown.
// - If role is NURSE, department is shown.
// ─────────────────────────────────────────────────────────────

interface Props {
  user: AdminUser
  onCancel: () => void
  onSuccess: () => void
}

export function EditStaffUserForm({ user, onCancel, onSuccess }: Props) {
  const [form, setForm] = useState({
    displayName: user.displayName,
    role: user.role,
    specialization: user.specialization ?? "",
    department: user.department ?? "",
  })

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    reset,
  } = useUpdateStaffUser(user.userId)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    reset()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    mutate(
      {
        displayName: form.displayName,
        role: form.role as StaffRole,
        specialization:
          form.role === "DOCTOR" ? form.specialization : undefined,
        department:
          form.role === "NURSE" ? form.department : undefined,
      },
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
            Edit Staff User
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Updating: {user.displayName}
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
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
            required
          />
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
          Failed to update user. Please try again.
        </p>
      )}

      {isSuccess && (
        <p className="text-xs text-green-600">
          User updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-black disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save User Updates"}
      </button>
    </form>
  )
}