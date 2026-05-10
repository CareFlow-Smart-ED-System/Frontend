"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending, error } = useLogin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMsg = (error as any)?.response?.data?.error ?? null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login({ email, password })
  }

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
          <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access the ED system.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@careflow.com"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 text-gray-900 placeholder:text-gray-400"
              />
            </div>

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
              {isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 CareFlow — Emergency Department System
        </p>
      </div>
    </div>
  )
}