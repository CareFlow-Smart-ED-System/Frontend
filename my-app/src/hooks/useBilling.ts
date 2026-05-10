import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
    BillDetails,
    BillingResponse,
    CaseBilling,
    CreateBillPayload,
    CreateBillResponse,
    UpdateBillStatusPayload,
    UpdateBillStatusResponse,
} from '@/types/billing'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// Small local delay so mock mode behaves like a real API request.
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

// ─────────────────────────────────────────────────────────────
// Billing
//
// Covers:
// GET   /api/v1/billing
// POST  /api/v1/billing
// GET   /api/v1/billing/{billId}
// PATCH /api/v1/billing/{billId}/status
// GET   /api/v1/cases/{caseId}/billing
// ─────────────────────────────────────────────────────────────

// GET /api/v1/billing
export function useBills() {
    return useQuery<BillingResponse>({
        queryKey: ['billing'],
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
                            billId: 'bill-001',
                            caseId: 'case-001',
                            patientName: 'John Doe',
                            amount: 1500,
                            status: 'PENDING',
                            createdAt: '2026-05-09',
                        },
                        {
                            billId: 'bill-002',
                            caseId: 'case-002',
                            patientName: 'Layla Hassan',
                            amount: 2200,
                            status: 'PAID',
                            createdAt: '2026-05-09',
                        },
                        {
                            billId: 'bill-003',
                            caseId: 'case-003',
                            patientName: 'Omar Khalil',
                            amount: 1800,
                            status: 'SENT_TO_INSURANCE',
                            createdAt: '2026-05-09',
                        },
                    ],
                }
            }

            const res = await api.get<BillingResponse>('/billing')
            return res.data
        },
        staleTime: 10000,
    })
}

// POST /api/v1/billing
export function useCreateBill() {
    const queryClient = useQueryClient()

    return useMutation<CreateBillResponse, Error, CreateBillPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Bill created successfully',
                    billId: `bill-${Date.now()}`,
                    caseId: payload.caseId,
                    amount: payload.amount,
                    status: 'PENDING',
                }
            }

            const res = await api.post<CreateBillResponse>('/billing', payload)
            return res.data
        },
        onSuccess: (_data, variables) => {
            // Refresh the billing dashboard and the case billing tab.
            queryClient.invalidateQueries({ queryKey: ['billing'] })
            queryClient.invalidateQueries({
                queryKey: ['cases', variables.caseId, 'billing'],
            })
        },
    })
}

// GET /api/v1/billing/{billId}
export function useBillDetails(billId: string) {
    return useQuery<BillDetails>({
        queryKey: ['billing', billId],
        queryFn: async () => {
            if (USE_MOCK) {
                await delay()

                return {
                    billId,
                    caseId: 'case-001',
                    patientName: 'John Doe',
                    amount: 1500,
                    status: 'PENDING',
                    createdAt: '2026-05-09',
                }
            }

            const res = await api.get<BillDetails>(`/billing/${billId}`)
            return res.data
        },
        enabled: !!billId,
        staleTime: 10000,
    })
}

// PATCH /api/v1/billing/{billId}/status
export function useUpdateBillStatus(billId: string) {
    const queryClient = useQueryClient()

    return useMutation<UpdateBillStatusResponse, Error, UpdateBillStatusPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Bill status updated successfully',
                    billId,
                    status: payload.status,
                }
            }

            const res = await api.patch<UpdateBillStatusResponse>(
                `/billing/${billId}/status`,
                payload
            )

            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing'] })
            queryClient.invalidateQueries({ queryKey: ['billing', billId] })
        },
    })
}

// GET /api/v1/cases/{caseId}/billing
export function useCaseBilling(caseId: string) {
    return useQuery<CaseBilling>({
        queryKey: ['cases', caseId, 'billing'],
        queryFn: async () => {
            if (USE_MOCK) {
                await delay()

                return {
                    billId: 'bill-001',
                    caseId,
                    patientName: 'John Doe',
                    amount: 1500,
                    status: 'PENDING',
                    createdAt: '2026-05-09',
                }
            }

            const res = await api.get<CaseBilling>(`/cases/${caseId}/billing`)
            return res.data
        },
        enabled: !!caseId,
        staleTime: 10000,
    })
}