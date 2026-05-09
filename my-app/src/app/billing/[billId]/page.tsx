"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { useBillDetails, useUpdateBillStatus } from "@/hooks/useBilling"
import { BillingStatus } from "@/types/billing"
import { BillingDetailsCard } from "@/components/billing/BillingDetailsCard"
import { BillingStatusSelect } from "@/components/billing/BillingStatusSelect"

// ─────────────────────────────────────────────────────────────
// Bill Details Page
//
// Purpose:
// - Shows details of one billing record.
// - Allows Admin/Receptionist to update payment status.
//
// Endpoints used through hooks:
// GET   /api/v1/billing/{billId}
// PATCH /api/v1/billing/{billId}/status
// ─────────────────────────────────────────────────────────────

export default function BillDetailsPage() {
    const { billId } = useParams<{ billId: string }>()

    const { data: bill, isLoading, isError } = useBillDetails(billId)
    const updateStatusMutation = useUpdateBillStatus(billId)

    const [selectedStatus, setSelectedStatus] =
        useState<BillingStatus>("Pending")

    // Keep selected status aligned with loaded bill data.
    // This avoids showing "Pending" forever if the bill is already Paid.
    if (bill && selectedStatus !== bill.status && !updateStatusMutation.isPending) {
        setSelectedStatus(bill.status)
    }

    function handleUpdateStatus(e: React.FormEvent) {
        e.preventDefault()

        updateStatusMutation.mutate({
            status: selectedStatus,
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#eef2f3]">
                <div className="max-w-5xl mx-auto px-6 py-10 text-gray-500">
                    Loading bill details...
                </div>
            </div>
        )
    }

    if (isError || !bill) {
        return (
            <div className="min-h-screen bg-[#eef2f3]">
                <div className="max-w-5xl mx-auto px-6 py-10 text-red-700">
                    Bill not found.
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#eef2f3]">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8">
                    <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-4">
                        Billing record details
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Bill Details
                    </h1>

                    <p className="text-sm md:text-base text-gray-500">
                        Review the billing amount, linked emergency case, and update payment
                        status.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bill details card */}
                    <div className="lg:col-span-2">
                        <BillingDetailsCard bill={bill} />
                    </div>

                    {/* Status update form */}
                    <form
                        onSubmit={handleUpdateStatus}
                        className="bg-white border border-gray-100 rounded-2xl p-5 h-fit space-y-4"
                    >
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Update Payment Status
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Change the bill status after payment or insurance processing.
                            </p>
                        </div>

                        <BillingStatusSelect
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                        />

                        {updateStatusMutation.isError && (
                            <p className="text-xs text-red-600">
                                Failed to update bill status. Please try again.
                            </p>
                        )}

                        {updateStatusMutation.isSuccess && (
                            <p className="text-xs text-green-600">
                                Bill status updated successfully.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={updateStatusMutation.isPending}
                            className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
                        >
                            {updateStatusMutation.isPending
                                ? "Updating..."
                                : "Update Status"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}