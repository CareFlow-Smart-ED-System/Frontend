import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  VitalSignsPayload,
  VitalSignsResponse,
  RecordVitalSignsResponse,
  AdministerMedicationPayload,
  AdministerMedicationResponse,
  AddNotePayload,
  AddNoteResponse,
  ClinicalNotesResponse,
} from "@/types/nurse";
import { MOCK_VITAL_SIGNS, MOCK_NURSE_NOTES, delay } from "@/lib/mockData";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

type ApiResponse<T> = { success: boolean; data: T; timestamp: string };

// POST /api/v1/nurses/vital-signs/{caseId}
export function useRecordVitalSigns(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation<RecordVitalSignsResponse, Error, VitalSignsPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300);
        return {
          message: "Vital signs recorded successfully",
          id: `vital-${Date.now()}`,
          caseId,
          temperature: payload.temperature ?? null,
          systolic: payload.systolic ?? null,
          diastolic: payload.diastolic ?? null,
          heartRate: payload.heartRate ?? null,
          oxygenSaturation: payload.oxygenSaturation ?? null,
          respiratoryRate: payload.respiratoryRate ?? null,
          recordedBy: "Nurse Aisha",
          timestamp: new Date().toISOString(),
        };
      }
      const res = await api.post<ApiResponse<RecordVitalSignsResponse>>(
        `/nurses/vital-signs/${caseId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "vital-signs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "timeline"],
      });
    },
  });
}

// GET /api/v1/nurses/vital-signs/{caseId}
export function useVitalSigns(caseId: string) {
  return useQuery<VitalSignsResponse>({
    queryKey: ["cases", caseId, "vital-signs"],
    queryFn: async () => {
      if (USE_MOCK) {
        await delay();
        return MOCK_VITAL_SIGNS;
      }
      const res = await api.get<ApiResponse<VitalSignsResponse>>(
        `/nurses/vital-signs/${caseId}`,
      );
      return res.data.data;
    },
    enabled: !!caseId,
    staleTime: 10000,
  });
}

// POST /api/v1/nurses/medications/{medicationId}/administr
export function useAdministerMedication(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation<
    AdministerMedicationResponse,
    Error,
    AdministerMedicationPayload
  >({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300);
        return {
          message: "Medication administered successfully",
          data: {
            caseId: payload.caseId,
            medicationId: payload.medicationId,
            administeredBy: "Nurse Aisha",
            administeredAt: new Date().toISOString(),
          },
        };
      }
      const res = await api.post<ApiResponse<AdministerMedicationResponse>>(
        `/nurses/medications/${payload.medicationId}/administr`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "timeline"],
      });
    },
  });
}

// POST /api/v1/nurses/notes/{caseId}
export function useAddNote(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation<AddNoteResponse, Error, AddNotePayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay(300);
        return {
          message: "Note added successfully",
          data: {
            id: `note-${Date.now()}`,
            caseId,
            nurseId: "nurse-001",
            note: payload.note,
            timestamp: new Date().toISOString(),
          },
        };
      }
      const res = await api.post<ApiResponse<AddNoteResponse>>(
        `/nurses/notes/${caseId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases", caseId, "notes"] });
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "timeline"],
      });
    },
  });
}

// GET /api/v1/nurses/notes/{caseId}
export function useClinicalNotes(caseId: string) {
  return useQuery<ClinicalNotesResponse>({
    queryKey: ["cases", caseId, "notes"],
    queryFn: async () => {
      if (USE_MOCK) {
        await delay();
        return MOCK_NURSE_NOTES;
      }
      const res = await api.get<ApiResponse<ClinicalNotesResponse>>(
        `/nurses/notes/${caseId}`,
      );
      return res.data.data;
    },
    enabled: !!caseId,
    staleTime: 10000,
  });
}
