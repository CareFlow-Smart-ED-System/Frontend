export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

export interface Appointment {
    appointmentId: string
    patientId: string
    patientName: string
    doctorId: string
    doctorName: string
    date: string
    status: AppointmentStatus
}

export interface AppointmentsResponse {
    total: number
    page: number
    limit: number
    totalPages: number
    data: Appointment[]
}

export interface CreateAppointmentPayload {
    patientId: string
    doctorId: string
    date: string
    status: AppointmentStatus
}

export interface CreateAppointmentResponse {
    message: string
    appointmentId: string
    patientId: string
    doctorId: string
    date: string
    status: AppointmentStatus
}

export interface UpdateAppointmentPayload {
    status: AppointmentStatus
}

export interface UpdateAppointmentResponse {
    message: string
    appointmentId: string
    status: AppointmentStatus
}