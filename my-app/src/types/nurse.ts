// POST /api/v1/cases/{caseId}/vital-signs
export interface VitalSignsPayload {
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
}

export interface VitalSignsRecord {
  id: string
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
  nurseId: string
  timestamp: string
}

export interface RecordVitalSignsResponse {
  message: string
  id: string
  caseId: string
  temperature: number
  systolic: number
  diastolic: number
  heartRate: number
  recordedBy: string
  timestamp: string
}

// GET /api/v1/cases/{caseId}/vital-signs
export interface VitalSignsResponse {
  caseId: string
  total: number
  page: number
  limit: number
  totalPages: number
  data: VitalSignsRecord[]
}

// POST /api/v1/cases/{caseId}/medications/administrations
export interface AdministerMedicationPayload {
  caseId: string
  medicationId: string
}

export interface AdministerMedicationResponse {
  message: string
  data: {
    caseId: string
    medicationId: string
    administeredBy: string
    administeredAt: string
  }
}

// POST /api/v1/cases/{caseId}/notes
export interface AddNotePayload {
  note: string
}

export interface NoteRecord {
  id: string
  nurseId: string
  note: string
  timestamp: string
}

export interface AddNoteResponse {
  message: string
  data: {
    id: string
    caseId: string
    nurseId: string
    note: string
    timestamp: string
  }
}

// GET /api/v1/cases/{caseId}/notes
export interface ClinicalNotesResponse {
  caseId: string
  total: number
  page: number
  limit: number
  totalPages: number
  data: NoteRecord[]
}