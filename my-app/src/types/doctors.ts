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
  reportFileUrl?: string   
  reportFileName?: string 
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
  reportFileUrl?: string 
  reportFileName?: string  
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
export interface MedicationsResponse {
  caseId: string
  total: number
  page: number
  limit: number
  totalPages: number
  data: Medication[]
}
export interface CreateLabOrderPayload {
  type: string
  notes?: string
}

export interface CreateLabOrderResponse {
  id: string
  caseId: string
  type: string
  notes: string | null
  date: string
  status: string
}

export interface CreateImagingOrderPayload {
  type: string
  region?: string
  summary?: string
}

export interface CreateImagingOrderResponse {
  id: string
  caseId: string
  type: string
  region: string | null
  summary: string | null
  date: string
  status: string
}

export interface UploadLabReportPayload {
  reportFile: File
  notes?: string
}

export interface UploadLabReportResponse {
  message: string
  data: {
    id: string
    caseId: string
    reportFileUrl: string
    reportFileName: string
    uploadedBy: string
    uploadedAt: string
  }
}

export interface UploadImagingReportPayload {
  reportFile: File
  summary?: string
}

export interface UploadImagingReportResponse {
  message: string
  data: {
    id: string
    caseId: string
    reportFileUrl: string
    reportFileName: string
    reportedBy: string
    uploadedAt: string
  }
}