import { Severity, CaseStatus } from './queue'

// GET /api/v1/cases — list item
export interface CaseListItem {
  caseId: string
  patientId: string
  patientName: string
  status: CaseStatus
  severity: Severity
  arrivalTime: string
}

export interface CasesResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: CaseListItem[]
}

// GET /api/v1/cases/{caseId} — full detail
export interface AssignedDoctor {
  doctorId: string
  name: string
  specialization: string
  role: 'PRIMARY' | 'COLLABORATING'
}

export interface CaseTriage {
  severity: Severity
  triageTime: string
}

export interface CaseDetail {
  caseId: string
  patientId: string
  patientName: string
  status: CaseStatus
  arrivalTime: string
  assignedDoctor: AssignedDoctor | null
  triage: CaseTriage | null
}

// GET /api/v1/cases/{caseId}/timeline
export type TimelineEntryType = 'TRIAGE' | 'VITAL_SIGNS' | 'MEDICATION' | 'NOTE' | 'STATUS_UPDATE'

export interface TimelineEntry {
  type: TimelineEntryType
  performedBy: string
  details: string
  timestamp: string
}

export interface CaseTimelineResponse {
  caseId: string
  total: number
  data: TimelineEntry[]
}

// GET /api/v1/cases/{caseId}/summary
export interface DischargeMedication {
  name: string
  dosage: string
}

export interface DischargeSummary {
  caseId: string
  patientId: string
  patientName: string
  finalDiagnosis: string
  treatmentSummary: string
  medications: DischargeMedication[]
  dischargeRecommendation: string
  dischargedAt: string
}

// POST /api/v1/cases
export interface CreateCasePayload {
  patientId: string
}

export interface CreateCaseResponse {
  message: string
  caseId: string
  patientId: string
  status: CaseStatus
  arrivalTime: string
}

// PATCH /api/v1/cases/{caseId}/status
export interface UpdateStatusPayload {
  status: CaseStatus
}

export interface UpdateStatusResponse {
  message: string
  caseId: string
  status: CaseStatus
}

// POST /api/v1/cases/{caseId}/doctors
export type DoctorRole = 'PRIMARY' | 'COLLABORATING'

export interface AssignDoctorPayload {
  doctorId: string
  role: DoctorRole
}

export interface AssignDoctorResponse {
  message: string
  caseId: string
  doctorId: string
  role: DoctorRole
}