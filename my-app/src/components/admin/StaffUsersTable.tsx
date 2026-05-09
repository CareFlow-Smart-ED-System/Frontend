"use client"

import { useState } from "react"
import { AdminUser } from "@/types/admin"
import { useDeleteStaffUser } from "@/hooks/useAdmin"
import { EditStaffUserForm } from "@/components/admin/EditStaffUserForm"
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm"

// ─────────────────────────────────────────────────────────────
// Staff Users Table
//
// Purpose:
// - Displays all staff users.
// - Provides actions for each user:
//   1. Edit profile/role
//   2. Reset password
//   3. Delete user
//
// Endpoints used indirectly:
// PATCH  /api/v1/admin/users/{userId}
// PATCH  /api/v1/admin/users/{userId}/reset-password
// DELETE /api/v1/admin/users/{userId}
// ─────────────────────────────────────────────────────────────

interface Props {
  users: AdminUser[]
}

export function StaffUsersTable({ users }: Props) {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null)

  const deleteMutation = useDeleteStaffUser()

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-900">
        No staff users found.
      </div>
    )
  }

  function handleDelete(user: AdminUser) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.displayName}?`
    )

    if (!confirmed) return

    deleteMutation.mutate(user.userId)
  }

  return (
    <div className="space-y-5">
      {/* Edit form appears above table when an edit action is selected */}
      {editingUser && (
        <EditStaffUserForm
          user={editingUser}
          onCancel={() => setEditingUser(null)}
          onSuccess={() => setEditingUser(null)}
        />
      )}

      {/* Reset password form appears above table when reset action is selected */}
      {resetPasswordUser && (
        <ResetPasswordForm
          user={resetPasswordUser}
          onCancel={() => setResetPasswordUser(null)}
          onSuccess={() => setResetPasswordUser(null)}
        />
      )}

      {deleteMutation.isError && (
        <p className="text-xs text-red-600">
          Failed to delete user. Please try again.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f5f7f8] text-gray-600">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Details</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.userId}
                className="border-b border-gray-100 text-gray-900"
              >
                <td className="px-4 py-3 font-medium">
                  {user.displayName}
                </td>

                <td className="px-4 py-3">
                  {user.email}
                </td>

                <td className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {user.specialization ||
                    user.department ||
                    "—"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(user)
                        setResetPasswordUser(null)
                      }}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-gray-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResetPasswordUser(user)
                        setEditingUser(null)
                      }}
                      className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs hover:bg-blue-100"
                    >
                      Reset Password
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Small role badge helper so the role stands out in the table.
function RoleBadge({ role }: { role: AdminUser["role"] }) {
  const label = role.replace("_", " ")

  return (
    <span className="inline-flex px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
      {label}
    </span>
  )
}