import { Severity } from './queue'

// POST /api/v1/cases/{caseId}/triage
export interface TriagePayload {
  severity: Severity
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
  oxygenSaturation: number
  respiratoryRate: number
}

export interface TriageResponse {
  message: string
  triageId: string
  caseId: string
  severity: Severity
  triageTime: string
}

// GET /api/v1/cases/{caseId}/triage
export interface TriageRecord {
  triageId: string
  caseId: string
  severity: Severity
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
  oxygenSaturation: number
  nurseId: string
  triageTime: string
}

// GET /api/v1/cases/{caseId}/triage/history
export interface TriageHistoryRecord {
  triageId: string
  caseId: string
  severity: Severity
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
  oxygenSaturation: number
  respiratoryRate: number
  nurseId: string
  triageTime: string
}

export interface TriageHistoryResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: TriageHistoryRecord[]
}