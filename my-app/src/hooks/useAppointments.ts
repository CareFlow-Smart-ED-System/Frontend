import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
    AppointmentsResponse,
    AppointmentStatus,
    CreateAppointmentPayload,
    CreateAppointmentResponse,
    UpdateAppointmentPayload,
    UpdateAppointmentResponse,
} from '@/types/appointments'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// Small local delay so mock mode behaves like a real API request.
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

type ApiWrapper<T> = {
    success: boolean
    data: T
    timestamp?: string
}

// ─────────────────────────────────────────────────────────────
// Appointments
//
// Covers:
// GET   /api/v1/appointments
// POST  /api/v1/appointments
// PATCH /api/v1/appointments/{appointmentId}
// ─────────────────────────────────────────────────────────────

// GET /api/v1/appointments
export function useAppointments(filters?: { status?: AppointmentStatus }) {
    return useQuery<AppointmentsResponse>({
        queryKey: ['appointments', filters],
        queryFn: async () => {
            if (USE_MOCK) {
                await delay()

                const allAppointments: AppointmentsResponse['data'] = [
                    {
                        appointmentId: 'appointment-001',
                        patientId: 'patient-001',
                        patientName: 'John Doe',
                        doctorId: 'doctor-001',
                        doctorName: 'Dr. Sara Ahmed',
                        date: '2026-05-10T09:00:00.000Z',
                        status: 'SCHEDULED',
                    },
                    {
                        appointmentId: 'appointment-002',
                        patientId: 'patient-002',
                        patientName: 'Layla Hassan',
                        doctorId: 'doctor-002',
                        doctorName: 'Dr. Khaled Omar',
                        date: '2026-05-11T09:00:00.000Z',
                        status: 'COMPLETED',
                    },
                    {
                        appointmentId: 'appointment-003',
                        patientId: 'patient-003',
                        patientName: 'Omar Khalil',
                        doctorId: 'doctor-001',
                        doctorName: 'Dr. Sara Ahmed',
                        date: '2026-05-12T09:00:00.000Z',
                        status: 'CANCELLED',
                    },
                ]

                const filteredAppointments =
                    filters?.status === undefined
                        ? allAppointments
                        : allAppointments.filter((appointment) => {
                            return appointment.status === filters.status
                        })

                return {
                    total: filteredAppointments.length,
                    page: 1,
                    limit: 20,
                    totalPages: 1,
                    data: filteredAppointments,
                }
            }

            const res = await api.get<AppointmentsResponse | ApiWrapper<AppointmentsResponse>>(
                '/appointments',
                {
                    params: filters,
                }
            )

            return 'success' in res.data ? res.data.data : res.data
        },
        staleTime: 10000,
    })
}

// POST /api/v1/appointments
export function useCreateAppointment() {
    const queryClient = useQueryClient()

    return useMutation<CreateAppointmentResponse, Error, CreateAppointmentPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Appointment booked successfully',
                    appointmentId: `appointment-${Date.now()}`,
                    patientId: payload.patientId,
                    doctorId: payload.doctorId,
                    date: payload.date,
                    status: payload.status,
                }
            }

            const res = await api.post<CreateAppointmentResponse>(
                '/appointments',
                payload
            )

            return res.data
        },
        onSuccess: () => {
            // Refresh the appointments table after booking.
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
        },
    })
}

// PATCH /api/v1/appointments/{appointmentId}
export function useUpdateAppointment(appointmentId: string) {
    const queryClient = useQueryClient()

    return useMutation<UpdateAppointmentResponse, Error, UpdateAppointmentPayload>({
        mutationFn: async (payload) => {
            if (USE_MOCK) {
                await delay()

                return {
                    message: 'Appointment updated successfully',
                    appointmentId,
                    status: payload.status,
                }
            }

            const res = await api.patch<UpdateAppointmentResponse>(
                `/appointments/${appointmentId}`,
                payload
            )

            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
        },
    })
}