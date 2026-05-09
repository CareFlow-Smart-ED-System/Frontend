import { create } from 'zustand'

interface User {
  userId: string
  displayName: string
  role: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'RECEPTIONIST' | 'PATIENT'
  email: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  setUser: (user: User, token: string) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  // ── Hardcoded mock user — swap role here to test different views ──
  user: {
    userId: 'mock-admin-001',
    displayName: 'Admin Mona',
    role: 'ADMIN',
    email: 'admin@careflow.com',
  },
  accessToken: 'mock-token',
  // ─────────────────────────────────────────────────────────────────
  setUser: (user, accessToken) => set({ user, accessToken }),
  clearUser: () => set({ user: null, accessToken: null }),
}))