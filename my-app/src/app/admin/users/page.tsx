"use client"

import { useState } from "react"
import { useAdminUsers } from "@/hooks/useAdmin"
import { StaffRole } from "@/types/admin"
import { StaffUserForm } from "@/components/admin/StaffUserForm"
import { StaffUsersTable } from "@/components/admin/StaffUsersTable"

// ─────────────────────────────────────────────────────────────
// Admin Users Page
//
// Purpose:
// - Allows admins to view all staff users.
// - Supports filtering users by role.
// - Allows creating new staff accounts.
// - The table handles edit, delete, and reset password actions.
//
// Endpoint used through hooks:
// GET /api/v1/admin/users
// POST /api/v1/admin/users
// PATCH /api/v1/admin/users/{userId}
// DELETE /api/v1/admin/users/{userId}
// PATCH /api/v1/admin/users/{userId}/reset-password
// ─────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<StaffRole | "">("")

  const {
    data,
    isLoading,
    isError,
  } = useAdminUsers(roleFilter ? { role: roleFilter } : undefined)

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
            Admin system management
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Staff User Management
          </h1>

          <p className="text-sm md:text-base text-gray-500">
            Create, review, update, reset passwords, and remove staff accounts.
          </p>
        </div>

        {/* Create staff user form */}
        <div className="mb-8">
          <StaffUserForm />
        </div>

        {/* Filter + users table */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Registered Staff
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {data?.total ?? 0} user{data?.total === 1 ? "" : "s"} found
              </p>
            </div>

            {/* Role filter */}
            <div className="w-full md:w-56">
              <label className="block text-xs text-gray-500 mb-1">
                Filter by Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as StaffRole | "")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="">All roles</option>
                <option value="ADMIN">Admin</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="RECEPTIONIST">Receptionist</option>
              </select>
            </div>
          </div>

          {/* Loading / error / table states */}
          {isLoading && (
            <p className="text-sm text-gray-500">Loading staff users...</p>
          )}

          {isError && (
            <p className="text-sm text-red-600">
              Failed to load staff users. Please refresh.
            </p>
          )}

          {!isLoading && !isError && (
            <StaffUsersTable users={data?.data ?? []} />
          )}
        </div>
      </div>
    </div>
  )
}