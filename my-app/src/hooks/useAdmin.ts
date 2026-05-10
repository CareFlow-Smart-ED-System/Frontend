import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
    AdminUser,
    AdminUsersResponse,
    AuditLogsResponse,
    CreateStaffUserPayload,
    CreateStaffUserResponse,
    DeleteStaffUserResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    StaffRole,
    UpdateStaffUserPayload,
    UpdateStaffUserResponse,
} from '@/types/admin'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// Small local delay so mock mode behaves like a real API request.
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

type ApiWrapper<T> = {
    success: boolean
    data: T
    timestamp?: string
}

type BackendAdminUser = {
    id: string
    displayName: string
    email: string
    role: StaffRole
    createdAt?: string
    specialization?: string
    department?: string
    mustChangePassword?: boolean
}

type BackendAuditLog = {
    id: string
    action?: string
    actionType?: string
    userId?: string
    performedBy?: string
    targetId?: string
    details?: string
    timestamp: string
}

function normalizeAdminUser(user: BackendAdminUser): AdminUser {
    return {
        userId: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        department: user.department,
    }
}

// ─────────────────────────────────────────────────────────────
// Admin Users
//
// Covers:
// GET    /api/v1/admin/users
// POST   /api/v1/admin/users
// PATCH  /api/v1/admin/users/{userId}
// DELETE /api/v1/admin/users/{userId}
// PATCH  /api/v1/admin/users/{userId}/reset-password
// ─────────────────────────────────────────────────────────────

// GET /api/v1/admin/users
export function useAdminUsers(filters?: { role?: StaffRole }) {
    return useQuery<AdminUsersResponse>({
        queryKey: ['admin', 'users', filters],
        queryFn: async () => {
            if (USE_MOCK) {
                await delay()

                const mockUsers: AdminUser[] = [
                    {
                        userId: 'doctor-001',
                        displayName: 'Dr. Sara Ahmed',
                        email: 'sara.ahmed@careflow.com',
                        role: 'DOCTOR',
                        specialization: 'Emergency Medicine',
                    },
                    {
                        userId: 'nurse-001',
                        displayName: 'Nurse Aisha',
                        email: 'aisha@careflow.com',
                        role: 'NURSE',
                        department: 'Emergency',
                    },
                    {
                        userId: 'labstaff-001',
                        displayName: 'Lab Tech Omar',
                        email: 'omar.lab@careflow.com',
                        role: 'LAB_STAFF',
                    },
                    {
                        userId: 'radiologist-001',
                        displayName: 'Dr. Lina Hassan',
                        email: 'lina.radiology@careflow.com',
                        role: 'RADIOLOGIST',
                    },
                    {
                        userId: 'receptionist-001',
                        displayName: 'Nada Hassan',
                        email: 'nada@careflow.com',
                        role: 'RECEPTIONIST',
                    },
                    {
                        userId: 'admin-001',
                        displayName: 'Admin Mona',
                        email: 'admin@careflow.com',
                        role: 'ADMIN',
                    },
                ]

                const filteredUsers = mockUsers.filter((user) => {
                    return !filters?.role || user.role === filters.role
                })

                return {
                    total: filteredUsers.length,
                    page: 1,
                    limit: 20,
                    totalPages: 1,
                    data: filteredUsers,
                }
            }

            const res = await api.get<ApiWrapper<BackendAdminUser[]>>(
                '/admin/users',
                {
                    params: filters,
                }
            )

            const users = res.data.data.map(normalizeAdminUser)

            return {
                total: users.length,
                page: 1,
                limit: users.length,
                totalPages: 1,
                data: users,
            }
        },
        staleTime: 10000,
    })
}

// POST /api/v1/admin/users
export function useCreateStaffUser() {
    const queryClient = useQueryClient()

    return useMutation<CreateStaffUserResponse, Error, CreateStaffUserPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Staff registered successfully',
                    userId: `user-${Date.now()}`,
                    displayName: payload.displayName,
                    email: payload.email,
                    role: payload.role,
                    specialization: payload.specialization,
                    department: payload.department,
                }
            }

            const res = await api.post<ApiWrapper<CreateStaffUserResponse>>(
                '/admin/users',
                payload
            )

            return res.data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}

// PATCH /api/v1/admin/users/{userId}
export function useUpdateStaffUser(userId: string) {
    const queryClient = useQueryClient()

    return useMutation<UpdateStaffUserResponse, Error, UpdateStaffUserPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'User updated successfully',
                    userId,
                }
            }

            const res = await api.patch<
                ApiWrapper<UpdateStaffUserResponse> | UpdateStaffUserResponse
            >(`/admin/users/${userId}`, payload)

            return 'data' in res.data && 'success' in res.data
                ? res.data.data
                : res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}

// DELETE /api/v1/admin/users/{userId}
export function useDeleteStaffUser() {
    const queryClient = useQueryClient()

    return useMutation<DeleteStaffUserResponse, Error, string>({
        mutationFn: async (userId) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'User deleted successfully',
                    userId,
                    deletedAt: new Date().toISOString(),
                }
            }

            const res = await api.delete<DeleteStaffUserResponse>(
                `/admin/users/${userId}`
            )

            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    })
}

// PATCH /api/v1/admin/users/{userId}/reset-password
export function useResetStaffPassword(userId: string) {
    return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Password reset successfully',
                    userId,
                    mustChangePassword: true,
                }
            }

            const res = await api.patch<ApiWrapper<Omit<ResetPasswordResponse, 'userId'>>>(
                `/admin/users/${userId}/reset-password`,
                {
                    newTemporaryPassword: payload.temporaryPassword,
                }
            )

            return {
                ...res.data.data,
                userId,
            }
        },
    })
}

// ─────────────────────────────────────────────────────────────
// Audit Logs
//
// Covers:
// GET /api/v1/admin/audit-logs
// ─────────────────────────────────────────────────────────────

// GET /api/v1/admin/audit-logs
export function useAuditLogs(filters?: { actionType?: string; userId?: string }) {
    return useQuery<AuditLogsResponse>({
        queryKey: ['admin', 'audit-logs', filters],
        queryFn: async () => {
            if (USE_MOCK) {
                await delay()

                return {
                    total: 3,
                    page: 1,
                    limit: 20,
                    totalPages: 1,
                    data: [
                        {
                            id: 'log-001',
                            actionType: 'CASE_STATUS_UPDATED',
                            performedBy: 'Dr. Sara Ahmed',
                            targetId: 'case-001',
                            details: 'Case marked as COMPLETED',
                            timestamp: '2026-05-09T10:00:00Z',
                        },
                        {
                            id: 'log-002',
                            actionType: 'MEDICATION_PRESCRIBED',
                            performedBy: 'Dr. Khaled Omar',
                            targetId: 'case-002',
                            details: 'Paracetamol prescribed',
                            timestamp: '2026-05-09T10:10:00Z',
                        },
                        {
                            id: 'log-003',
                            actionType: 'USER_CREATED',
                            performedBy: 'Admin Mona',
                            targetId: 'doctor-003',
                            details: 'New doctor account created',
                            timestamp: '2026-05-09T10:30:00Z',
                        },
                    ].filter((log) => {
                        const matchesAction =
                            !filters?.actionType || log.actionType === filters.actionType

                        const matchesUser =
                            !filters?.userId || log.targetId === filters.userId

                        return matchesAction && matchesUser
                    }),
                }
            }

            const res = await api.get<ApiWrapper<BackendAuditLog[]>>(
                '/admin/audit-logs',
                {
                    params: filters,
                }
            )

            const logs = res.data.data.map((log) => ({
                id: log.id,
                actionType: log.actionType ?? log.action ?? 'UNKNOWN_ACTION',
                performedBy: log.performedBy ?? log.userId ?? 'Unknown user',
                targetId: log.targetId ?? log.userId ?? '—',
                details: log.details ?? log.action ?? 'No details available',
                timestamp: log.timestamp,
            }))

            return {
                total: logs.length,
                page: 1,
                limit: logs.length,
                totalPages: 1,
                data: logs,
            }
        },
        staleTime: 15000,
    })
}