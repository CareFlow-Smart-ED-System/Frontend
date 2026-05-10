"use client"

import { useRef, useState } from "react"
import { useBills, useUnbilledCompletedCases } from "@/hooks/useBilling"
import { BillingForm } from "@/components/billing/BillingForm"
import { BillingTable } from "@/components/billing/BillingTable"
import { UnbilledCompletedCasesTable } from "@/components/billing/UnbilledCompletedCasesTable"

// ─────────────────────────────────────────────────────────────
// Billing Dashboard Page
//
// Purpose:
// - Shows completed/discharged cases that do not have bills yet.
// - Shows all billing records for Admin/Receptionist.
// - Allows creating a new billing record for a completed case.
// - Clicking a bill row opens the bill details page.
//
// Endpoints used through hooks:
// GET  /api/v1/cases?status=COMPLETED
// GET  /api/v1/billing
// POST /api/v1/billing
//
// System flow position:
// 9. Case completed
// 10. Billing generated  ← this page supports this step
// 11. Follow-up appointment scheduled
// ─────────────────────────────────────────────────────────────

export default function BillingPage() {
    const [selectedCaseId, setSelectedCaseId] = useState("")
    const formRef = useRef<HTMLDivElement | null>(null)

    const { data, isLoading, isError } = useBills()

    const {
        data: unbilledCases = [],
        isLoading: isLoadingUnbilledCases,
        isError: isUnbilledCasesError,
    } = useUnbilledCompletedCases()

    function handleSelectCaseForBilling(caseId: string) {
        setSelectedCaseId(caseId)

        formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    return (
        <div className="min-h-screen bg-[#eef2f3]">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8">
                    <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
                        Payment and insurance tracking
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Billing Dashboard
                    </h1>

                    <p className="text-sm md:text-base text-gray-500">
                        Create bills for completed emergency cases and track payment or
                        insurance status.
                    </p>
                </div>

                {/* Discharged cases without bills */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Discharged Cases Without Bills
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            {unbilledCases.length} completed case
                            {unbilledCases.length === 1 ? "" : "s"} still need billing.
                        </p>
                    </div>

                    <UnbilledCompletedCasesTable
                        cases={unbilledCases}
                        isLoading={isLoadingUnbilledCases}
                        isError={isUnbilledCasesError}
                        onCreateBill={handleSelectCaseForBilling}
                    />
                </div>

                {/* Create bill form */}
                <div ref={formRef} className="mb-8 scroll-mt-6">
                    <BillingForm initialCaseId={selectedCaseId} />
                </div>

                {/* Bills table */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-gray-900">
                            All Bills
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            {data?.total ?? 0} bill{data?.total === 1 ? "" : "s"} found
                        </p>
                    </div>

                    {isLoading && (
                        <p className="text-sm text-gray-500">Loading bills...</p>
                    )}

                    {isError && (
                        <p className="text-sm text-red-600">
                            Failed to load billing records. Please refresh.
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <BillingTable bills={data?.data ?? []} />
                    )}
                </div>
            </div>
        </div>
    )
}