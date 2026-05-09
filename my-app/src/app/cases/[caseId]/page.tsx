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

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap bg-white border border-gray-100 rounded-2xl p-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTab === tab.key
                  ? "bg-red-700 text-white"
                  : "text-gray-600 hover:bg-[#f5f7f8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      {/* Tab content */}
        {activeTab === "overview" && (
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
                <p className="text-sm text-gray-400">
                  No doctor assigned yet
                </p>
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
                      className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 bg-white"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {med.name}
                        </p>
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
    </div>
  );
}
