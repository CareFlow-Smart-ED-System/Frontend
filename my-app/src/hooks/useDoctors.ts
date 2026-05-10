import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  DoctorsResponse,
  DoctorCasesResponse,
  LabResultsResponse,
  ImagingResponse,
  PrescribeMedicationPayload,
  PrescribeMedicationResponse,
  MedicationsResponse,
  CreateLabOrderPayload,
  CreateLabOrderResponse,
  CreateImagingOrderPayload,
  CreateImagingOrderResponse,
  UploadLabReportPayload,
  UploadLabReportResponse,
  UploadImagingReportPayload,
  UploadImagingReportResponse,
} from '@/types/doctors'
import { CaseStatus } from '@/types/queue'
import {
  MOCK_DOCTORS,
  MOCK_DOCTOR_CASES,
  MOCK_LAB_RESULTS,
  MOCK_IMAGING,
  MOCK_MEDICATIONS,
  delay,
} from '@/lib/mockData'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

type ApiResponse<T> = { success: boolean; data: T; timestamp: string }

// GET /api/v1/doctors
export function useDoctors(page: number = 1, limit: number = 20) {
  return useQuery<DoctorsResponse>({
    queryKey: ['doctors', { page, limit }],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_DOCTORS }
      const res = await api.get<ApiResponse<DoctorsResponse>>('/doctors', {
        params: { page, limit },
      })
      return res.data.data
    },
    staleTime: 30000,
  })
}

// GET /api/v1/doctors/me/cases
export function useDoctorCases(
  page: number = 1,
  limit: number = 20,
  status?: CaseStatus
) {
  return useQuery<DoctorCasesResponse>({
    queryKey: ['doctors', 'me', 'cases', { page, limit, status }],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_DOCTOR_CASES }
      const res = await api.get<ApiResponse<DoctorCasesResponse>>('/doctors/me/cases', {
        params: { page, limit, status },
      })
      return res.data.data
    },
    staleTime: 10000,
  })
}

// GET /api/v1/doctors/cases/{caseId}/lab-results
export function useLabResults(caseId: string, page: number = 1, limit: number = 10) {
  return useQuery<LabResultsResponse>({
    queryKey: ['cases', caseId, 'lab-results', { page, limit }],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_LAB_RESULTS }
      const res = await api.get<ApiResponse<LabResultsResponse>>(
        `/doctors/cases/${caseId}/lab-results`,
        { params: { page, limit } }
      )
      return res.data.data
    },
    enabled: !!caseId,
    staleTime: 15000,
  })
}

// ===== POST /api/v1/doctors/cases/{caseId}/lab-results =====
export function useCreateLabOrder(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<CreateLabOrderResponse, Error, CreateLabOrderPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300)
        return {
          id: `lab-${Date.now()}`,
          caseId,
          type: payload.type,
          notes: payload.notes ?? null,
          date: new Date().toISOString(),
          status: 'PENDING',
        }
      }
      const res = await api.post<ApiResponse<CreateLabOrderResponse>>(
        `/doctors/cases/${caseId}/lab-results`,
        payload
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'lab-results'] })
    },
  })
}

// GET /api/v1/doctors/cases/{caseId}/imaging
export function useImaging(caseId: string, page: number = 1, limit: number = 10) {
  return useQuery<ImagingResponse>({
    queryKey: ['cases', caseId, 'imaging', { page, limit }],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_IMAGING }
      const res = await api.get<ApiResponse<ImagingResponse>>(
        `/doctors/cases/${caseId}/imaging`, 
        { params: { page, limit } }
      )
      return res.data.data
    },
    enabled: !!caseId,
    staleTime: 15000,
  })
}

// ===== POST /api/v1/doctors/cases/{caseId}/imaging =====
export function useCreateImagingOrder(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<CreateImagingOrderResponse, Error, CreateImagingOrderPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300)
        return {
          id: `img-${Date.now()}`,
          caseId,
          type: payload.type,
          region: payload.region ?? null,
          summary: payload.summary ?? null,
          date: new Date().toISOString(),
          status: 'PENDING',
        }
      }
      const res = await api.post<ApiResponse<CreateImagingOrderResponse>>(
        `/doctors/cases/${caseId}/imaging`,
        payload
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'imaging'] })
    },
  })
}

// POST /api/v1/doctors/cases/{caseId}/medications
export function usePrescribeMedication(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation<PrescribeMedicationResponse, Error, PrescribeMedicationPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300)
        return {
          message: 'Medication prescribed successfully',
          medication: {
            id: `med-${Date.now()}`,
            caseId,
            name: payload.name,
            dosage: payload.dosage,
            prescribedBy: 'Dr. Sara Ahmed',
            createdAt: new Date().toISOString(),
          },
        }
      }
      const res = await api.post<ApiResponse<PrescribeMedicationResponse>>(
        `/doctors/cases/${caseId}/medications`,
        payload
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors', 'cases', caseId, 'medications'] })
      queryClient.invalidateQueries({ queryKey: ['cases', caseId, 'timeline'] })
    },
  })
}

// GET /api/v1/doctors/cases/{caseId}/medications
export function useMedications(caseId: string, page: number = 1, limit: number = 20) {
  return useQuery<MedicationsResponse>({
    queryKey: ['doctors', 'cases', caseId, 'medications', { page, limit }],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return MOCK_MEDICATIONS }
      const res = await api.get<ApiResponse<MedicationsResponse>>(
        `/doctors/cases/${caseId}/medications`,
        { params: { page, limit } }
      )
      return res.data.data
    },
    enabled: !!caseId,
    staleTime: 10000,
  })
}

// ===== POST /api/v1/lab-results/{labResultId}/upload-report =====
// Role: LAB_STAFF
export function useUploadLabReport(labResultId: string) {
  const queryClient = useQueryClient()
  return useMutation<UploadLabReportResponse, Error, UploadLabReportPayload>({
    mutationFn: async ({ reportFile, notes }) => {
      if (USE_MOCK) {
        await delay(500)
        return {
          message: 'Lab report uploaded successfully',
          data: {
            id: labResultId,
            caseId: 'mock-case-id',
            reportFileUrl: `/uploads/lab-reports/${reportFile.name}`,
            reportFileName: reportFile.name,
            uploadedBy: 'mock-user-id',
            uploadedAt: new Date().toISOString(),
          },
        }
      }
      const formData = new FormData()
      formData.append('reportFile', reportFile)
      if (notes) formData.append('notes', notes)
      
      const res = await api.post<ApiResponse<UploadLabReportResponse>>(
        `/lab-results/${labResultId}/upload-report`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return res.data.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate lab results for the case
      queryClient.invalidateQueries({ queryKey: ['cases', labResultId, 'lab-results'] })
    },
  })
}

// ===== POST /api/v1/imaging/{imagingId}/upload-report =====
// Role: RADIOLOGIST
export function useUploadImagingReport(imagingId: string) {
  const queryClient = useQueryClient()
  return useMutation<UploadImagingReportResponse, Error, UploadImagingReportPayload>({
    mutationFn: async ({ reportFile, summary }) => {
      if (USE_MOCK) {
        await delay(500)
        return {
          message: 'Imaging report uploaded successfully',
          data: {
            id: imagingId,
            caseId: 'mock-case-id',
            reportFileUrl: `/uploads/imaging-reports/${reportFile.name}`,
            reportFileName: reportFile.name,
            reportedBy: 'mock-user-id',
            uploadedAt: new Date().toISOString(),
          },
        }
      }
      const formData = new FormData()
      formData.append('reportFile', reportFile)
      if (summary) formData.append('summary', summary)
      
      const res = await api.post<ApiResponse<UploadImagingReportResponse>>(
        `/imaging/${imagingId}/upload-report`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return res.data.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate imaging reports for the case
      queryClient.invalidateQueries({ queryKey: ['cases', imagingId, 'imaging'] })
    },
  })
}