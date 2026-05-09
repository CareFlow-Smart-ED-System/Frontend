import { QueueResponse, QueueStats } from '@/types/queue'
import { CasesResponse, CaseDetail, CaseTimelineResponse, DischargeSummary } from '@/types/cases'
import { TriageRecord, TriageHistoryResponse } from '@/types/triage'
import {
  DoctorsResponse,
  DoctorCasesResponse,
  LabResultsResponse,
  ImagingResponse,
  MedicationsResponse,
} from '@/types/doctors'
import { VitalSignsResponse, ClinicalNotesResponse } from '@/types/nurse'

// ── Utility ───────────────────────────────────────────────────────────────────
export const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

// ── Queue ─────────────────────────────────────────────────────────────────────
export const MOCK_QUEUE: QueueResponse = {
  total: 3,
  page: 1,
  limit: 20,
  totalPages: 1,
  data: [
    {
      position: 1,
      caseId: 'case-001',
      patientName: 'John Doe',
      severity: 'CRITICAL',
      status: 'WAITING',
      arrivalTime: '2026-05-09T08:00:00Z',
      waitingMinutes: 12,
    },
    {
      position: 2,
      caseId: 'case-002',
      patientName: 'Layla Hassan',
      severity: 'URGENT',
      status: 'WAITING',
      arrivalTime: '2026-05-09T08:20:00Z',
      waitingMinutes: 5,
    },
    {
      position: 3,
      caseId: 'case-003',
      patientName: 'Omar Khalil',
      severity: 'NON_URGENT',
      status: 'UNDER_TREATMENT',
      arrivalTime: '2026-05-09T08:45:00Z',
      waitingMinutes: 0,
    },
  ],
}

export const MOCK_QUEUE_STATS: QueueStats = {
  totalWaiting: 3,
  bySeverity: { Critical: 1, Urgent: 1, 'Non-Urgent': 1 },
  averageWaitMinutes: 18,
}

// ── Cases ─────────────────────────────────────────────────────────────────────
export const MOCK_CASES: CasesResponse = {
  total: 3,
  page: 1,
  limit: 20,
  totalPages: 1,
  data: [
    {
      caseId: 'case-001',
      patientId: 'patient-001',
      patientName: 'John Doe',
      status: 'WAITING',
      severity: 'CRITICAL',
      arrivalTime: '2026-05-09T08:00:00Z',
    },
    {
      caseId: 'case-002',
      patientId: 'patient-002',
      patientName: 'Layla Hassan',
      status: 'WAITING',
      severity: 'URGENT',
      arrivalTime: '2026-05-09T08:20:00Z',
    },
    {
      caseId: 'case-003',
      patientId: 'patient-003',
      patientName: 'Omar Khalil',
      status: 'UNDER_TREATMENT',
      severity: 'NON_URGENT',
      arrivalTime: '2026-05-09T08:45:00Z',
    },
  ],
}

export const MOCK_CASE_DETAIL: CaseDetail = {
  caseId: 'case-001',
  patientId: 'patient-001',
  patientName: 'John Doe',
  status: 'UNDER_TREATMENT',
  arrivalTime: '2026-05-09T08:00:00Z',
  assignedDoctor: {
    doctorId: 'doctor-001',
    name: 'Dr. Sara Ahmed',
    specialization: 'Emergency Medicine',
    role: 'PRIMARY',
  },
  triage: {
    severity: 'CRITICAL',
    triageTime: '2026-05-09T08:10:00Z',
  },
}

export const MOCK_TIMELINE: CaseTimelineResponse = {
  caseId: 'case-001',
  total: 4,
  data: [
    {
      type: 'TRIAGE',
      performedBy: 'Nurse Aisha',
      details: 'Severity classified as CRITICAL',
      timestamp: '2026-05-09T08:10:00Z',
    },
    {
      type: 'VITAL_SIGNS',
      performedBy: 'Nurse Aisha',
      details: 'Temperature: 39.1 °C, HR: 118 bpm',
      timestamp: '2026-05-09T08:20:00Z',
    },
    {
      type: 'MEDICATION',
      performedBy: 'Dr. Sara Ahmed',
      details: 'Paracetamol 500mg prescribed',
      timestamp: '2026-05-09T08:45:00Z',
    },
    {
      type: 'NOTE',
      performedBy: 'Nurse Aisha',
      details: 'Patient is stable and responsive',
      timestamp: '2026-05-09T09:00:00Z',
    },
  ],
}

export const MOCK_CASE_SUMMARY: DischargeSummary = {
  caseId: 'case-001',
  patientId: 'patient-001',
  patientName: 'John Doe',
  finalDiagnosis: 'Acute febrile illness with tachycardia',
  treatmentSummary: 'IV fluids administered, antipyretics given, vitals stabilized',
  medications: [
    { name: 'Paracetamol', dosage: '500mg every 6 hours' },
    { name: 'IV Normal Saline', dosage: '1L over 4 hours' },
  ],
  dischargeRecommendation: 'Rest, oral fluids, follow up with GP in 3 days',
  dischargedAt: '2026-05-09T14:00:00Z',
}

// ── Triage ────────────────────────────────────────────────────────────────────
export const MOCK_TRIAGE: TriageRecord = {
  triageId: 'triage-001',
  caseId: 'case-001',
  severity: 'CRITICAL',
  temperature: 39.1,
  systolic: 140,
  diastolic: 90,
  heartRate: 118,
  oxygenSaturation: 89,
  nurseId: 'nurse-001',
  triageTime: '2026-05-09T08:10:00Z',
}

export const MOCK_TRIAGE_HISTORY: TriageHistoryResponse = {
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
  data: [
    {
      triageId: 'triage-002',
      caseId: 'case-001',
      severity: 'CRITICAL',
      temperature: 39.5,
      systolic: 145,
      diastolic: 92,
      heartRate: 122,
      oxygenSaturation: 87,
      respiratoryRate: 28,
      nurseId: 'nurse-001',
      triageTime: '2026-05-09T09:00:00Z',
    },
    {
      triageId: 'triage-001',
      caseId: 'case-001',
      severity: 'URGENT',
      temperature: 38.9,
      systolic: 130,
      diastolic: 85,
      heartRate: 110,
      oxygenSaturation: 92,
      respiratoryRate: 24,
      nurseId: 'nurse-001',
      triageTime: '2026-05-09T08:10:00Z',
    },
  ],
}

// ── Doctors ───────────────────────────────────────────────────────────────────
export const MOCK_DOCTORS: DoctorsResponse = {
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
  data: [
    { doctorId: 'doctor-001', displayName: 'Dr. Sara Ahmed', specialization: 'Emergency Medicine' },
    { doctorId: 'doctor-002', displayName: 'Dr. Khaled Omar', specialization: 'Cardiology' },
  ],
}

export const MOCK_DOCTOR_CASES: DoctorCasesResponse = {
  doctorId: 'mock-doctor-001',
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
  data: [
    {
      caseId: 'case-001',
      patientName: 'John Doe',
      patientId: 'patient-001',
      severity: 'CRITICAL',
      priorityScore: 1,
      status: 'UNDER_TREATMENT',
      arrivalTime: '2026-05-09T08:00:00Z',
    },
    {
      caseId: 'case-002',
      patientName: 'Layla Hassan',
      patientId: 'patient-002',
      severity: 'URGENT',
      priorityScore: 2,
      status: 'WAITING',
      arrivalTime: '2026-05-09T08:20:00Z',
    },
  ],
}

export const MOCK_LAB_RESULTS: LabResultsResponse = {
  caseId: 'case-001',
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
  data: [
    {
      id: 'lab-001',
      type: 'Blood Count',
      result: 'WBC: 13.2 × 10³/µL (High)',
      date: '2026-05-09',
      status: 'AVAILABLE',
    },
    {
      id: 'lab-002',
      type: 'Metabolic Panel',
      result: 'Glucose: 105 mg/dL (Normal)',
      date: '2026-05-09',
      status: 'AVAILABLE',
    },
  ],
}

export const MOCK_IMAGING: ImagingResponse = {
  caseId: 'case-001',
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  data: [
    {
      id: 'img-001',
      type: 'Chest X-Ray',
      region: 'Chest',
      report: 'No acute cardiopulmonary process identified',
      date: '2026-05-09',
      status: 'AVAILABLE',
    },
  ],
}

export const MOCK_MEDICATIONS: MedicationsResponse = {
  caseId: 'case-001',
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
  data: [
    {
      id: 'med-001',
      caseId: 'case-001',
      name: 'Paracetamol',
      dosage: '500mg every 6 hours',
      prescribedBy: 'Dr. Sara Ahmed',
      createdAt: '2026-05-09T08:45:00Z',
    },
    {
      id: 'med-002',
      caseId: 'case-001',
      name: 'IV Normal Saline',
      dosage: '1L over 4 hours',
      prescribedBy: 'Dr. Sara Ahmed',
      createdAt: '2026-05-09T08:50:00Z',
    },
  ],
}

// ── Nurse ─────────────────────────────────────────────────────────────────────
export const MOCK_VITAL_SIGNS: VitalSignsResponse = {
  caseId: 'case-001',
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
  data: [
    {
      id: 'vital-001',
      temperature: 39.1,
      systolic: 140,
      diastolic: 90,
      heartRate: 118,
      nurseId: 'nurse-001',
      timestamp: '2026-05-09T08:20:00Z',
    },
    {
      id: 'vital-002',
      temperature: 38.4,
      systolic: 132,
      diastolic: 86,
      heartRate: 108,
      nurseId: 'nurse-001',
      timestamp: '2026-05-09T09:30:00Z',
    },
  ],
}

export const MOCK_NURSE_NOTES: ClinicalNotesResponse = {
  caseId: 'case-001',
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  data: [
    {
      id: 'note-001',
      nurseId: 'nurse-001',
      note: 'Patient is alert and oriented. Responding well to IV fluids.',
      timestamp: '2026-05-09T09:00:00Z',
    },
  ],
}