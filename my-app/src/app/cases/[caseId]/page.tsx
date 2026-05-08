"use client";

import { useState } from "react";
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

type Tab =
  | "overview"
  | "timeline"
  | "triage"
  | "vitals"
  | "notes"
  | "labs"
  | "imaging"
  | "prescriptions"
  | "summary";

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { user } = useAuthStore();
  const role = user?.role as "DOCTOR" | "NURSE";

  const { data: caseData, isLoading, isError } = useCase(caseId);
  const { data: timeline } = useCaseTimeline(caseId);
  const { data: summary } = useCaseSummary(
    caseId,
    caseData?.status === "COMPLETED",
  );
  const { data: medications } = useMedications(caseId);

  if (isLoading)
    return <div className="p-6 text-gray-500">Loading case...</div>;
  if (isError || !caseData)
    return <div className="p-6 text-red-500">Case not found.</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "timeline", label: "Timeline" },
    { key: "vitals", label: "Vital Signs" },
    { key: "notes", label: "Clinical Notes" },
    { key: "labs", label: "Lab Results" },
    { key: "imaging", label: "Imaging" },
    { key: "prescriptions", label: "Prescriptions" },
    { key: "triage", label: "Triage" },
    ...(caseData.status === "COMPLETED"
      ? [{ key: "summary" as Tab, label: "Discharge Summary" }]
      : []),
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{caseData.patientName}</h1>
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

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase mb-3">
              Assigned Doctor
            </p>
            {caseData.assignedDoctor ? (
              <div>
                <p className="font-medium">{caseData.assignedDoctor.name}</p>
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

          <UpdateStatusButton
            caseId={caseId}
            currentStatus={caseData.status}
            userRole={role}
          />
        </div>
      )}

      {activeTab === "timeline" && (
        <CaseTimeline entries={timeline?.data ?? []} />
      )}

      {activeTab === "vitals" && (
        <VitalSignsTab caseId={caseId} userRole={role} />
      )}

      {activeTab === "notes" && (
        <ClinicalNotesTab caseId={caseId} userRole={role} />
      )}

      {activeTab === "labs" && <LabResultsTab caseId={caseId} />}

      {activeTab === "imaging" && <ImagingTab caseId={caseId} />}

      {/* Prescriptions tab: doctor sees form, nurse sees administer buttons */}
      {activeTab === "prescriptions" && (
        <div className="space-y-6">
          {/* Existing medications list — visible to both roles */}
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
                    className="flex items-center justify-between border rounded-lg p-4 bg-white"
                  >
                    <div>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-gray-500">{med.dosage}</p>
                    </div>
                    {/*  only nurses see the administer button */}
                    {role === "NURSE" && (
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

          {/* Only doctors see the prescription form */}
          {role === "DOCTOR" && <PrescriptionForm caseId={caseId} />}
        </div>
      )}

      {activeTab === "triage" && (
        <TriageTab
          caseId={caseId}
          userRole={role as "DOCTOR" | "NURSE" | "ADMIN"}
        />
      )}

      {activeTab === "summary" && summary && (
        <DischargeSummaryCard summary={summary} />
      )}
    </div>
  );
}
