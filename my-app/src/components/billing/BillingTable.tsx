"use client"

import { useRouter } from "next/navigation"
import { Bill } from "@/types/billing"
import { BillingStatusBadge } from "@/components/billing/BillingStatusSelect"

// ─────────────────────────────────────────────────────────────
// Billing Table
//
// Purpose:
// - Displays all billing records.
// - Clicking a row navigates to the bill details page.
//
// Route used:
// /billing/{billId}
// ─────────────────────────────────────────────────────────────

interface Props {
    bills: Bill[]
}

export function BillingTable({ bills }: Props) {
    const router = useRouter()

    if (bills.length === 0) {
        return (
            <div className="text-center py-12 text-gray-900">
                No billing records found.
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
                        <th className="text-left px-4 py-3 font-medium">Amount</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium">Created</th>
                    </tr>
                </thead>

                <tbody>
                    {bills.map((bill) => (
                        <tr
                            key={bill.billId}
                            onClick={() => router.push(`/billing/${bill.billId}`)}
                            className="border-b border-gray-100 hover:bg-[#f5f7f8] cursor-pointer text-gray-900"
                        >
                            <td className="px-4 py-3 font-medium">
                                {bill.patientName}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {bill.caseId}
                            </td>

                            <td className="px-4 py-3">
                                {bill.amount.toLocaleString()} EGP
                            </td>

                            <td className="px-4 py-3">
                                <BillingStatusBadge status={bill.status} />
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {new Date(bill.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}