"use client"

import { useState } from "react"
import { AdminUser } from "@/types/admin"
import { useResetStaffPassword } from "@/hooks/useAdmin"

// ─────────────────────────────────────────────────────────────
// Reset Password Form
//
// Purpose:
// - Allows admin to assign a temporary password to a staff user.
// - Backend marks mustChangePassword = true.
//
// Endpoint used:
// PATCH /api/v1/admin/users/{userId}/reset-password
// ─────────────────────────────────────────────────────────────

interface Props {
  user: AdminUser
  onCancel: () => void
  onSuccess: () => void
}

export function ResetPasswordForm({ user, onCancel, onSuccess }: Props) {
  const [temporaryPassword, setTemporaryPassword] = useState("")

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    reset,
  } = useResetStaffPassword(user.userId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    mutate(
      { temporaryPassword },
      {
        onSuccess: () => {
          setTemporaryPassword("")
          onSuccess()
        },
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Reset Staff Password
          </h3>

          <p className="text-xs text-blue-700 mt-1">
            Assigning temporary password for: {user.displayName}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-blue-700 hover:text-blue-900"
        >
          Cancel
        </button>
      </div>

      <div>
        <label className="block text-xs text-blue-700 mb-1">
          Temporary Password
        </label>

        <input
          type="password"
          value={temporaryPassword}
          onChange={(e) => {
            setTemporaryPassword(e.target.value)
            reset()
          }}
          placeholder="TempPassword123!"
          className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {isError && (
        <p className="text-xs text-red-600">
          Failed to reset password. Make sure the password meets requirements.
        </p>
      )}

      {isSuccess && (
        <p className="text-xs text-green-600">
          Password reset successfully. User must change it after login.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-700 text-white py-2 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50"
      >
        {isPending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  )
}