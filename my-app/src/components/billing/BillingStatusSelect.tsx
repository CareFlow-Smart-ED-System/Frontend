"use client"

import { BillingStatus } from "@/types/billing"

// ─────────────────────────────────────────────────────────────
// Billing Status Select + Badge
//
// Purpose:
// - BillingStatusSelect is used when updating bill status.
// - BillingStatusBadge is used in tables/cards for readable display.
//
// Allowed statuses from API:
// PENDING | PAID | SENT_TO_INSURANCE
// ─────────────────────────────────────────────────────────────

interface BillingStatusSelectProps {
    value: BillingStatus
    onChange: (value: BillingStatus) => void
}

const billingStatusLabels: Record<BillingStatus, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    SENT_TO_INSURANCE: "Sent to Insurance",
}

export function BillingStatusSelect({
    value,
    onChange,
}: BillingStatusSelectProps) {
    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1">
                Payment Status
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value as BillingStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                required
            >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="SENT_TO_INSURANCE">Sent to Insurance</option>
            </select>
        </div>
    )
}

export function BillingStatusBadge({ status }: { status: BillingStatus }) {
    const styles: Record<BillingStatus, string> = {
        PENDING: "bg-yellow-50 text-yellow-700",
        PAID: "bg-green-50 text-green-700",
        SENT_TO_INSURANCE: "bg-blue-50 text-blue-700",
    }

    return (
        <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
        >
            {billingStatusLabels[status]}
        </span>
    )
}