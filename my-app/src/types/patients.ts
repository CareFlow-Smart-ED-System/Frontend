export type Gender = 'MALE' | 'FEMALE'

export interface QuickRegisterPatientPayload {
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: Gender
    phone: string
}

export interface QuickRegisterPatientResponse {
    message: string
    patientId: string
    firstName: string
    lastName: string
    displayName: string
    age: number
    gender: Gender
    phone: string
}

export interface LinkPatientAccountPayload {
    email: string
    password: string
}

export interface LinkPatientAccountResponse {
    message: string
    userId: string
    patientId: string
    role: 'PATIENT'
}

export interface PatientProfile {
    patientId: string
    firstName: string
    lastName: string
    displayName: string
    age: number
    gender: Gender
    phone: string
}

export interface UpdatePatientPayload {
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: Gender
    phone: string
}

export interface UpdatePatientResponse {
    message: string
    patientId: string
}

export interface MedicalRecord {
    recordId: string
    caseId: string
    diagnosis: string
    notes: string
    chronicDiseases: string
    familyHistory: string
}

export interface MedicalRecordsResponse {
    patientId: string
    total: number
    page: number
    limit: number
    totalPages: number
    data: MedicalRecord[]
}

export interface MedicalRecordPayload {
    diagnosis: string
    notes: string
    chronicDiseases: string
    familyHistory: string
}

export interface CreateMedicalRecordResponse {
    message: string
    recordId: string
    patientId: string
    caseId: string
}

export interface UpdateMedicalRecordResponse {
    message: string
    recordId: string
    caseId: string
}