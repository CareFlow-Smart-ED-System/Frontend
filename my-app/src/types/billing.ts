export type BillingStatus = 'Pending' | 'Paid' | 'Sent to Insurance'

export interface Bill {
  billId: string
  caseId: string
  patientName: string
  amount: number
  status: BillingStatus
  createdAt: string
}

export interface BillingResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  data: Bill[]
}

export interface CreateBillPayload {
  caseId: string
  amount: number
}

export interface CreateBillResponse {
  message: string
  billId: string
  caseId: string
  amount: number
  status: BillingStatus
}

export interface BillDetails {
  billId: string
  caseId: string
  patientName: string
  amount: number
  status: BillingStatus
  createdAt: string
}

export interface UpdateBillStatusPayload {
  status: BillingStatus
}

export interface UpdateBillStatusResponse {
  message: string
  billId: string
  status: BillingStatus
}

export interface CaseBilling {
  caseId: string
  billId: string
  amount: number
  status: BillingStatus
}