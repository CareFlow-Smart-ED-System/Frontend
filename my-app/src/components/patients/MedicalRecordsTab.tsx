"use client"

import { useState } from "react"
import {
    useMedicalRecords,
    useCreateMedicalRecord,
} from "@/hooks/usePatients"

interface Props {
    caseId: string
    userRole: "DOCTOR" | "NURSE"
}

export function MedicalRecordsTab({ caseId, userRole }: Props) {
    const { data, isLoading, isError } = useMedicalRecords(caseId)

    return (
        <div className="space-y-6">
            {userRole === "DOCTOR" && <MedicalRecordForm caseId={caseId} />}

            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Medical Records
                </h3>

                {isLoading && <p className="text-sm text-gray-700">Loading...</p>}
                {isError && (
                    <p className="text-sm text-red-600">Failed to load medical records.</p>
                )}

                {!isLoading && !isError && data?.data.length === 0 && (
                    <p className="text-sm text-gray-700">No medical records yet.</p>
                )}

                <div className="space-y-3">
                    {data?.data.map((record) => (
                        <div
                            key={record.recordId}
                            className="bg-white border border-gray-100 rounded-2xl p-5"
                        >
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Diagnosis
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {record.diagnosis}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-3">
                                <InfoCard label="Notes" value={record.notes} />
                                <InfoCard label="Chronic Diseases" value={record.chronicDiseases} />
                                <InfoCard label="Family History" value={record.familyHistory} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#f5f7f8] rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-sm text-gray-900">{value || "—"}</p>
        </div>
    )
}

function MedicalRecordForm({ caseId }: { caseId: string }) {
    const [form, setForm] = useState({
        diagnosis: "",
        notes: "",
        chronicDiseases: "",
        familyHistory: "",
    })

    const { mutate, isPending, isError, isSuccess, reset } =
        useCreateMedicalRecord(caseId)

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        reset()
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        mutate(form, {
            onSuccess: () =>
                setForm({
                    diagnosis: "",
                    notes: "",
                    chronicDiseases: "",
                    familyHistory: "",
                }),
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4"
        >
            <h3 className="text-sm font-semibold text-gray-900">
                Add Medical Record
            </h3>

            <input
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Diagnosis"
                className="w-full border rounded px-3 py-2 text-sm"
                required
            />

            <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm resize-none"
                required
            />

            <div className="grid md:grid-cols-2 gap-3">
                <input
                    name="chronicDiseases"
                    value={form.chronicDiseases}
                    onChange={handleChange}
                    placeholder="Chronic diseases"
                    className="w-full border rounded px-3 py-2 text-sm"
                />

                <input
                    name="familyHistory"
                    value={form.familyHistory}
                    onChange={handleChange}
                    placeholder="Family history"
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            {isError && (
                <p className="text-xs text-red-500">
                    Failed to create medical record.
                </p>
            )}
            {isSuccess && (
                <p className="text-xs text-green-600">
                    Medical record created successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-700 text-white py-2 rounded text-sm hover:bg-red-800 disabled:opacity-50"
            >
                {isPending ? "Saving..." : "Add Medical Record"}
            </button>
        </form>
    )
}