"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useUpdatePassword } from '@/hooks/useAuth'

export default function UpdatePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  })
  const { mutate, isPending, error } = useUpdatePassword()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMsg = error ? (error as any).response?.data?.error : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(form)
  }

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: 'currentPassword', label: 'Current password' },
    { key: 'newPassword', label: 'New password' },
    { key: 'newPasswordConfirm', label: 'Confirm new password' },
  ]

  return (
    <div className="min-h-screen bg-[#eef2f3] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/NavBar.png"
            alt="CareFlow"
            width={140}
            height={36}
            className="h-9 w-auto"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Set a new password
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your account requires a password change before you can continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <input
                  type="password"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            ))}

            {errorMsg && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-red-700 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-red-800 transition-colors disabled:opacity-60"
            >
              {isPending ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}