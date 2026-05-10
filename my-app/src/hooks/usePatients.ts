import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  QuickRegisterPatientPayload,
  QuickRegisterPatientResponse,
  PatientProfile,
  UpdatePatientPayload,
  UpdatePatientResponse,
  LinkPatientAccountPayload,
  LinkPatientAccountResponse,
  MedicalRecordsResponse,
  MedicalRecordPayload,
  CreateMedicalRecordResponse,
  UpdateMedicalRecordResponse,
} from "@/types/patients";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

type ApiResponse<T> = { success: boolean; data: T; timestamp: string };

export function useQuickRegisterPatient() {
  return useMutation<
    QuickRegisterPatientResponse,
    Error,
    QuickRegisterPatientPayload
  >({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay();
        return {
          message: "Patient registered successfully",
          patientId: `patient-${Date.now()}`,
          firstName: payload.firstName,
          lastName: payload.lastName,
          displayName: `${payload.firstName} ${payload.lastName}`,
          age: 23,
          gender: payload.gender,
          phone: payload.phone,
        };
      }

      const res = await api.post<ApiResponse<QuickRegisterPatientResponse>>(
        "/patients/quick-register",
        payload,
      );
      return res.data.data;
    },
  });
}

export function usePatient(patientId: string) {
  return useQuery<PatientProfile>({
    queryKey: ["patients", patientId],
    queryFn: async () => {
      if (USE_MOCK) {
        await delay();
        return {
          patientId,
          firstName: "John",
          lastName: "Doe",
          displayName: "John Doe",
          age: 45,
          gender: "MALE",
          phone: "0501234567",
        };
      }

      const res = await api.get<ApiResponse<PatientProfile>>(
        `/patients/${patientId}`,
      );
      return res.data.data;
    },
    enabled: !!patientId,
  });
}

export function useUpdatePatient(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation<UpdatePatientResponse, Error, UpdatePatientPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay();
        return {
          message: "Patient profile updated successfully",
          patientId,
        };
      }

      const res = await api.patch<ApiResponse<UpdatePatientResponse>>(
        `/patients/${patientId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients", patientId] });
    },
  });
}

export function useLinkPatientAccount(patientId: string) {
  return useMutation<
    LinkPatientAccountResponse,
    Error,
    LinkPatientAccountPayload
  >({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay();
        return {
          message: "User account successfully linked to patient",
          userId: `user-${Date.now()}`,
          patientId,
          role: "PATIENT",
        };
      }

      const res = await api.post<ApiResponse<LinkPatientAccountResponse>>(
        `/patients/${patientId}/link-account`,
        payload,
      );
      return res.data.data;
    },
  });
}

export function useMedicalRecords(caseId: string) {
  return useQuery<MedicalRecordsResponse>({
    queryKey: ["cases", caseId, "medical-records"],
    queryFn: async () => {
      if (USE_MOCK) {
        await delay();
        return {
          patientId: "patient-001",
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          data: [
            {
              recordId: "record-001",
              caseId,
              diagnosis: "Acute appendicitis",
              notes: "Patient presented with right lower quadrant pain",
              chronicDiseases: "Type 2 Diabetes",
              familyHistory: "Hypertension",
            },
          ],
        };
      }

      const res = await api.get<ApiResponse<MedicalRecordsResponse>>(
        `/patients/cases/${caseId}/medical-records`,
      );
      return res.data.data;
    },
    enabled: !!caseId,
  });
}

export function useCreateMedicalRecord(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation<CreateMedicalRecordResponse, Error, MedicalRecordPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay();
        return {
          message: "Medical record created successfully",
          recordId: `record-${Date.now()}`,
          patientId: "patient-001",
          caseId,
        };
      }

      const res = await api.post<ApiResponse<CreateMedicalRecordResponse>>(
        `/patients/cases/${caseId}/medical-records`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "medical-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "timeline"],
      });
    },
  });
}

export function useUpdateMedicalRecord(caseId: string, recordId: string) {
  const queryClient = useQueryClient();

  return useMutation<UpdateMedicalRecordResponse, Error, MedicalRecordPayload>({
    mutationFn: async (payload) => {
      if (USE_MOCK) {
        await delay();
        return {
          message: "Medical record updated successfully",
          recordId,
          caseId,
        };
      }

      const res = await api.patch<ApiResponse<UpdateMedicalRecordResponse>>(
        `/patients/cases/${caseId}/medical-records/${recordId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cases", caseId, "medical-records"],
      });
    },
  });
}