"use client"

import { BillDetails } from "@/types/billing"
import { BillingStatusBadge } from "@/components/billing/BillingStatusSelect"

// ─────────────────────────────────────────────────────────────
// Billing Details Card
//
// Purpose:
// - Displays full details of one billing record.
//
// Endpoint used indirectly:
// GET /api/v1/billing/{billId}
// ─────────────────────────────────────────────────────────────

interface Props {
    bill: BillDetails
}

export function BillingDetailsCard({ bill }: Props) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Bill ID
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 break-words">
                        {bill.billId}
                    </h2>
                </div>

                <BillingStatusBadge status={bill.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Patient Name" value={bill.patientName} />
                <InfoCard label="Case ID" value={bill.caseId} />
                <InfoCard label="Amount" value={`${bill.amount.toLocaleString()} EGP`} />
                <InfoCard
                    label="Created At"
                    value={new Date(bill.createdAt).toLocaleDateString()}
                />
            </div>
        </div>
    )
}

// Small helper used to keep the details grid clean and consistent.
function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#f5f7f8] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">
                {label}
            </p>

            <p className="text-sm font-medium text-gray-900 break-words">
                {value || "—"}
            </p>
        </div>
    )
}