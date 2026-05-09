// Severity types
export type Severity = 'CRITICAL' | 'URGENT' | 'NON_URGENT'

// Status types 
export type CaseStatus = 'WAITING' | 'UNDER_TREATMENT' | 'COMPLETED'

// Individual queue entry
export interface QueueEntry {
  position: number
  caseId: string
  patientName: string
  severity: Severity
  status: CaseStatus
  arrivalTime: string
  waitingMinutes: number
}

// GET /api/v1/queue response
export interface QueueResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: QueueEntry[]
}

// Severity counts for stats
export interface SeverityCounts {
  Critical: number
  Urgent: number
  'Non-Urgent': number
}

// GET /api/v1/queue/stats response
export interface QueueStats {
  totalWaiting: number
  bySeverity: SeverityCounts
  averageWaitMinutes: number
}

// Socket payload for (queue.updated event)
export interface QueueUpdatedPayload {
  caseId: string
  action: 'REFETCH_QUEUE'
}