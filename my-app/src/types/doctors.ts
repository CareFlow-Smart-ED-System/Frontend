import { CaseStatus, Severity } from './queue'

// GET /api/v1/doctors — list item
export interface Doctor {
  doctorId: string
  displayName: string
  specialization: string
}

export interface DoctorsResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: Doctor[]
}

// GET /api/v1/doctors/{doctorId}/cases — assigned case item
export interface DoctorCaseItem {
  caseId: string
  patientName: string
  patientId: string
  severity: Severity
  priorityScore: number
  status: CaseStatus
  arrivalTime: string
}

export interface DoctorCasesResponse {
  doctorId: string
  total: number
  page: number
  limit: number
  totalPages: number
  data: DoctorCaseItem[]
}

// GET /api/v1/cases/{caseId}/lab-results
export type LabResultStatus = 'AVAILABLE' | 'PENDING'

export interface LabResult {
  id: string
  type: string
  result: string
  date: string
  status: LabResultStatus
}

export interface LabResultsResponse {
  caseId: string
  total: number
  page: number
  limit: number
  totalPages: number
  data: LabResult[]
}

// GET /api/v1/cases/{caseId}/imaging
export type ImagingStatus = 'AVAILABLE' | 'PENDING'

export interface ImagingReport {
  id: string
  type: string
  region: string
  report: string
  date: string
  status: ImagingStatus
}

export interface ImagingResponse {
  caseId: string
  total: number
  page: number
  limit: number
  totalPages: number
  data: ImagingReport[]
}

// POST /api/v1/cases/{caseId}/medications
export interface PrescribeMedicationPayload {
  name: string
  dosage: string
}

export interface Medication {
  id: string
  caseId: string
  name: string
  dosage: string
  prescribedBy: string
  createdAt: string
}

export interface PrescribeMedicationResponse {
  message: string
  medication: Medication
}