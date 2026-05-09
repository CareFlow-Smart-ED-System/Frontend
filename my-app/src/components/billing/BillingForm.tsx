"use client"

import { useState } from "react"
import { useCreateBill } from "@/hooks/useBilling"

// ─────────────────────────────────────────────────────────────
// Billing Form
//
// Purpose:
// - Creates a billing record for a completed emergency case.
//
// Endpoint used:
// POST /api/v1/billing
//
// Important:
// - Backend only accepts completed emergency cases.
// - If the case is not COMPLETED, backend should return 400.
// ─────────────────────────────────────────────────────────────

export function BillingForm() {
    const [form, setForm] = useState({
        caseId: "",
        amount: "",
    })

    const {
        mutate,
        isPending,
        isError,
        isSuccess,
        reset,
    } = useCreateBill()

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

        // Clear previous success/error message when editing again.
        reset()
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        mutate(
            {
                caseId: form.caseId,
                amount: Number(form.amount),
            },
            {
                onSuccess: () => {
                    setForm({
                        caseId: "",
                        amount: "",
                    })
                },
            }
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5"
        >
            <div>
                <h2 className="text-sm font-semibold text-gray-900">
                    Create Billing Record
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                    Generate a bill after the emergency case has been completed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Case ID */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Case ID
                    </label>

                    <input
                        type="text"
                        name="caseId"
                        value={form.caseId}
                        onChange={handleChange}
                        placeholder="case-001"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Amount
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="1500"
                        min="0"
                        step="1"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>
            </div>

            {isError && (
                <p className="text-xs text-red-600">
                    Failed to create bill. Make sure the case exists and is completed.
                </p>
            )}

            {isSuccess && (
                <p className="text-xs text-green-600">
                    Billing record created successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
            >
                {isPending ? "Creating Bill..." : "Create Bill"}
            </button>
        </form>
    )
}