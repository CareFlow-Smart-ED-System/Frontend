export type StaffRole =
    | 'ADMIN'
    | 'DOCTOR'
    | 'NURSE'
    | 'RECEPTIONIST'
    | 'RADIOLOGIST'
    | 'LAB_STAFF'

export type StaffGender = 'MALE' | 'FEMALE'

export interface AdminUser {
    userId: string
    displayName: string
    email: string
    role: StaffRole
    specialization?: string
    department?: string
}

export interface AdminUsersResponse {
    total: number
    page: number
    limit: number
    totalPages: number
    data: AdminUser[]
}

export interface CreateStaffUserPayload {
    displayName: string
    email: string
    password: string
    dateOfBirth: string
    gender: StaffGender
    role: StaffRole
    specialization?: string
    department?: string
}

export interface CreateStaffUserResponse {
    message: string
    userId: string
    displayName: string
    email: string
    role: StaffRole
    specialization?: string
    department?: string
}

export interface UpdateStaffUserPayload {
    displayName?: string
    role?: StaffRole
    specialization?: string
    department?: string
}

export interface UpdateStaffUserResponse {
    message: string
    userId: string
}

export interface DeleteStaffUserResponse {
    message: string
    userId: string
    deletedAt: string
}

export interface AuditLog {
    id: string
    actionType: string
    performedBy: string
    targetId: string
    details: string
    timestamp: string
}

export interface AuditLogsResponse {
    total: number
    page: number
    limit: number
    totalPages: number
    data: AuditLog[]
}

export interface ResetPasswordPayload {
    temporaryPassword: string
}

export interface ResetPasswordResponse {
    message: string
    userId: string
    mustChangePassword: boolean
}