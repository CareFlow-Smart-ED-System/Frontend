"use client"

import { UnbilledCompletedCase } from "@/types/billing"

// ─────────────────────────────────────────────────────────────
// Unbilled Completed Cases Table
//
// Purpose:
// - Shows completed/discharged emergency cases that do not have bills yet.
// - Lets receptionist/admin choose a case and create a bill for it.
// ─────────────────────────────────────────────────────────────

interface Props {
    cases: UnbilledCompletedCase[]
    isLoading: boolean
    isError: boolean
    onCreateBill: (caseId: string) => void
}

export function UnbilledCompletedCasesTable({
    cases,
    isLoading,
    isError,
    onCreateBill,
}: Props) {
    const safeCases = Array.isArray(cases) ? cases : []

    if (isLoading) {
        return (
            <p className="text-sm text-gray-500">
                Loading discharged cases without bills...
            </p>
        )
    }

    if (isError) {
        return (
            <p className="text-sm text-red-600">
                Failed to load discharged cases without bills. Please refresh.
            </p>
        )
    }

    if (safeCases.length === 0) {
        return (
            <div className="text-center py-8 text-gray-900">
                All discharged cases already have bills.
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[#f5f7f8] text-gray-600">
                        <th className="text-left px-4 py-3 font-medium">Patient</th>
                        <th className="text-left px-4 py-3 font-medium">Case ID</th>
                        <th className="text-left px-4 py-3 font-medium">Severity</th>
                        <th className="text-left px-4 py-3 font-medium">Arrival</th>
                        <th className="text-right px-4 py-3 font-medium">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {safeCases.map((caseItem) => (
                        <tr
                            key={caseItem.caseId}
                            className="border-b border-gray-100 hover:bg-[#f5f7f8] text-gray-900"
                        >
                            <td className="px-4 py-3 font-medium">
                                {caseItem.patientName}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {caseItem.caseId}
                            </td>

                            <td className="px-4 py-3">
                                {caseItem.severity ?? "—"}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {caseItem.arrivalTime
                                    ? new Date(caseItem.arrivalTime).toLocaleDateString()
                                    : "—"}
                            </td>

                            <td className="px-4 py-3 text-right">
                                <button
                                    type="button"
                                    onClick={() => onCreateBill(caseItem.caseId)}
                                    className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-800"
                                >
                                    Create Bill
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}