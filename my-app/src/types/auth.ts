export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT'

export interface AuthUser {
  userId: string
  displayName: string
  role: Role
  mustChangePassword: boolean
}

export interface UserProfile {
  userId: string
  displayName: string
  email: string
  gender: string | null
  role: Role
  specialization: string | null
}