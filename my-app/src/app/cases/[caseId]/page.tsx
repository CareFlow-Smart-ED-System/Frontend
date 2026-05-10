"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useCase, useCaseTimeline, useCaseSummary } from "@/hooks/useCases";
import { TriageBadge } from "@/components/triage/TriageBadge";
import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { CaseTimeline } from "@/components/cases/CaseTimeline";
import { DischargeSummaryCard } from "@/components/cases/DischargeSummary";
import { UpdateStatusButton } from "@/components/cases/UpdateStatusButton";
import { LabResultsTab } from "@/components/doctor/LabResultsTab";
import { ImagingTab } from "@/components/doctor/ImagingTab";
import { PrescriptionForm } from "@/components/doctor/PrescriptionForm";
import { VitalSignsTab } from "@/components/nurse/VitalSignsTab";
import { ClinicalNotesTab } from "@/components/nurse/ClinicalNotesTab";
import { AdministerMedicationButton } from "@/components/nurse/AdministerMedicationButton";
import { useAuthStore } from "@/store/authStore";
import { useMedications } from "@/hooks/useDoctors";
import { TriageTab } from "@/components/triage/TriageTab";
import { MedicalRecordsTab } from "@/components/patients/MedicalRecordsTab";
import { AssignDoctorForm } from "@/components/cases/AssignDoctorForm";

// ─────────────────────────────────────────────────────────────
// Case Details Page
//
// Purpose:
// - Full case workspace for clinical/admin roles.
// - Aggregates timeline, triage, vitals, notes, labs, imaging,
//   prescriptions, medications, medical records, and summary.
// - Allows role-based updates (triage, vitals, notes, status, meds).
//
// Endpoints used through hooks/components:
// GET   /api/v1/cases/{caseId}
// GET   /api/v1/cases/{caseId}/timeline
// GET   /api/v1/cases/{caseId}/summary
// GET   /api/v1/cases/{caseId}/medications
// PATCH /api/v1/cases/{caseId}/status
// GET   /api/v1/cases/{caseId}/triage
// GET   /api/v1/cases/{caseId}/triage/history
// POST  /api/v1/cases/{caseId}/triage
// GET   /api/v1/cases/{caseId}/vital-signs
// POST  /api/v1/cases/{caseId}/vital-signs
// GET   /api/v1/cases/{caseId}/notes
// POST  /api/v1/cases/{caseId}/notes
// GET   /api/v1/cases/{caseId}/medical-records
// POST  /api/v1/cases/{caseId}/medical-records
// POST  /api/v1/cases/{caseId}/medications/administrations
// GET   /api/v1/doctors/cases/{caseId}/lab-results
// GET   /api/v1/doctors/cases/{caseId}/imaging
// POST  /api/v1/doctors/cases/{caseId}/medications
// POST  /api/v1/lab-results/{labResultId}/upload-report
// POST  /api/v1/imaging/{imagingId}/upload-report
//
// Notes:
// - Summary is fetched only when the case is completed.
// - RADIOLOGIST can view timeline and imaging tabs.
// - LAB_STAFF can view timeline and labs tabs.
// ─────────────────────────────────────────────────────────────

type Tab =
  | "overview"
  | "timeline"
  | "triage"
  | "vitals"
  | "notes"
  | "medicalRecords"
  | "labs"
  | "imaging"
  | "prescriptions"
  | "assignDoctor"
  | "summary";

type Role = "DOCTOR" | "NURSE" | "ADMIN" | "RECEPTIONIST" | "PATIENT" | "RADIOLOGIST" | "LAB_STAFF";

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { user } = useAuthStore();
  const role = user?.role as Role | undefined;

  const isDoctor = role === "DOCTOR";
  const isNurse = role === "NURSE";
  const isAdmin = role === "ADMIN";
  const isReceptionist = role === "RECEPTIONIST";
  const isPatient = role === "PATIENT";
  const isRadiologist = role === "RADIOLOGIST";
  const isLabStaff = role === "LAB_STAFF";

  const isClinicalRole = isDoctor || isNurse;
  const canViewTriage = isDoctor || isNurse || isAdmin;
  const canUseCasePage = isDoctor || isNurse || isAdmin || isReceptionist || isRadiologist || isLabStaff;

  const { data: caseData, isLoading, isError } = useCase(caseId);
  const { data: timeline } = useCaseTimeline(caseId);

  const { data: summary } = useCaseSummary(
    caseId,
    caseData?.status === "COMPLETED",
  );

  const { data: medications } = useMedications(caseId);

  // ─────────────────────────────────────────────────────────────
  // Role-based tabs
  //
  // DOCTOR:
  // - Can view clinical data.
  // - Can prescribe medication.
  // - Can complete the case.
  //
  // NURSE:
  // - Can perform triage.
  // - Can record vitals/notes.
  // - Can administer prescribed medication.
  //
  // ADMIN:
  // - Can view high-level case info, timeline, triage, and summary.
  //
  // RECEPTIONIST:
  // - Should not see clinical tabs.
  // - Can view basic case progress only.
  //
  // RADIOLOGIST:
  // - Can view timeline and imaging tabs.
  // - Can upload imaging reports.
  //
  // LAB_STAFF:
  // - Can view timeline and labs tabs.
  // - Can upload lab reports.
  //
  // PATIENT:
  // - Should not access this internal staff case page.
  // ─────────────────────────────────────────────────────────────
  const tabs: { key: Tab; label: string }[] = useMemo(() => {
    const allowedTabs: { key: Tab; label: string }[] = [];

    if (canUseCasePage) {
      allowedTabs.push({ key: "overview", label: "Overview" });
      allowedTabs.push({ key: "timeline", label: "Timeline" });
    }

    if (isNurse) {
      allowedTabs.push({ key: "vitals", label: "Vital Signs" });
      allowedTabs.push({ key: "notes", label: "Clinical Notes" });
      allowedTabs.push({ key: "assignDoctor", label: "Assign Doctor" });
    }

    if (isClinicalRole) {
      allowedTabs.push({ key: "medicalRecords", label: "Medical Records" });
    }

    // Doctor and Lab Staff can see labs tab
    if (isDoctor || isLabStaff) {
      allowedTabs.push({ key: "labs", label: "Lab Results" });
    }

    // Doctor and Radiologist can see imaging tab
    if (isDoctor || isRadiologist) {
      allowedTabs.push({ key: "imaging", label: "Imaging" });
    }

    if (isClinicalRole) {
      allowedTabs.push({ key: "prescriptions", label: "Prescriptions" });
    }

    if (canViewTriage) {
      allowedTabs.push({ key: "triage", label: "Triage" });
    }

    if (caseData?.status === "COMPLETED" && canUseCasePage) {
      allowedTabs.push({ key: "summary", label: "Discharge Summary" });
    }

    return allowedTabs;
  }, [
    canUseCasePage,
    isNurse,
    isClinicalRole,
    isDoctor,
    isLabStaff,
    isRadiologist,
    canViewTriage,
    caseData?.status,
  ]);

  // Instead of calling setState inside useEffect, we derive the visible tab.
  // If activeTab is no longer allowed for this role, we display the first allowed tab.
  const activeTabIsAllowed = tabs.some((tab) => tab.key === activeTab);
  const visibleActiveTab = activeTabIsAllowed ? activeTab : tabs[0]?.key;

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-gray-500">
          Loading case...
        </div>
      </div>
    );

  if (isError || !caseData)
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10 text-red-700">
          Case not found.
        </div>
      </div>
    );

  if (!role || isPatient || tabs.length === 0) {
    return (
      <div className="min-h-screen bg-[#eef2f3]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Restricted
            </h1>

            <p className="text-sm text-gray-600">
              This case workspace is only available to authorized hospital
              staff.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
            Live case details and care history
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {caseData.patientName}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Arrived {new Date(caseData.arrivalTime).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {caseData.triage && (
                <TriageBadge severity={caseData.triage.severity} />
              )}

              <CaseStatusBadge status={caseData.status} />
            </div>
          </div>
        </div>

        {/* Role-based tabs */}
        <div className="flex gap-2 flex-wrap bg-white border border-gray-100 rounded-2xl p-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                visibleActiveTab === tab.key
                  ? "bg-red-700 text-white"
                  : "text-gray-600 hover:bg-[#f5f7f8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {visibleActiveTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                Assigned Doctor
              </p>

              {caseData.assignedDoctor ? (
                <div>
                  <p className="font-medium text-gray-900">
                    {caseData.assignedDoctor.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {caseData.assignedDoctor.specialization}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {caseData.assignedDoctor.role}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No doctor assigned yet</p>
              )}
            </div>

            {/* Only doctors and nurses update case status.
                Nurse: WAITING → UNDER_TREATMENT
                Doctor: UNDER_TREATMENT → COMPLETED */}
            {isClinicalRole && (
              <UpdateStatusButton
                caseId={caseId}
                currentStatus={caseData.status}
                userRole={role}
              />
            )}
          </div>
        )}

        {/* Timeline tab */}
        {visibleActiveTab === "timeline" && (
          <CaseTimeline entries={timeline?.data ?? []} />
        )}

        {/* Nurse-only vitals tab */}
        {visibleActiveTab === "vitals" && isNurse && (
          <VitalSignsTab caseId={caseId} userRole={role} />
        )}

        {/* Nurse-only clinical notes tab */}
        {visibleActiveTab === "notes" && isNurse && (
          <ClinicalNotesTab caseId={caseId} userRole={role} />
        )}

        {/* Doctor and Nurse medical records tab */}
        {visibleActiveTab === "medicalRecords" && isClinicalRole && (
          <MedicalRecordsTab caseId={caseId} userRole={role} />
        )}

        {/* Doctor and Lab Staff lab results tab */}
        {visibleActiveTab === "labs" && (isDoctor || isLabStaff) && (
          <LabResultsTab caseId={caseId} />
        )}

        {/* Doctor and Radiologist imaging tab */}
        {visibleActiveTab === "imaging" && (isDoctor || isRadiologist) && (
          <ImagingTab caseId={caseId} />
        )}

        {/* Nurse-only assign doctor tab */}
        {visibleActiveTab === "assignDoctor" && isNurse && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Assign Doctor
            </h3>
            <AssignDoctorForm
              caseId={caseId}
              onSuccess={() => setActiveTab("overview")}
            />
          </div>
        )}

        {/* Doctor/Nurse prescriptions tab */}
        {visibleActiveTab === "prescriptions" && isClinicalRole && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Prescribed Medications
              </h3>

              {!medications?.data.length ? (
                <p className="text-sm text-gray-400">
                  No medications prescribed yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {medications.data.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 bg-white"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {med.name}
                        </p>

                        <p className="text-xs text-gray-500">{med.dosage}</p>
                      </div>

                      {/* Nurses administer medication. */}
                      {isNurse && (
                        <AdministerMedicationButton
                          caseId={caseId}
                          medicationId={med.id}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Doctors prescribe medication. */}
            {isDoctor && <PrescriptionForm caseId={caseId} />}
          </div>
        )}

        {/* Doctor/Nurse/Admin triage tab */}
        {visibleActiveTab === "triage" && canViewTriage && (
          <TriageTab caseId={caseId} userRole={role} />
        )}

        {/* Completed-case summary */}
        {visibleActiveTab === "summary" && summary && (
          <DischargeSummaryCard summary={summary} />
        )}
      </div>
    </div>
  );
}