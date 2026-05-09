"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    useLinkPatientAccount,
    usePatient,
    useUpdatePatient,
} from "@/hooks/usePatients"
import { useCreateCase } from "@/hooks/useCases"
import { Gender } from "@/types/patients"

// ─────────────────────────────────────────────────────────────
// Patient Profile Page
//
// Purpose:
// - Displays the patient's basic profile.
// - Allows Receptionist/Admin to complete or update patient data.
// - Allows Receptionist/Admin to link a login account to the patient.
// - Allows staff to create an emergency case for this patient.
//
// Endpoints used:
// GET   /api/v1/patients/{patientId}
// PATCH /api/v1/patients/{patientId}
// POST  /api/v1/patients/{patientId}/link-account
// POST  /api/v1/cases
//
// System flow position:
// 1. Quick patient registration
// 2. Create emergency case  ← this page supports this step
// 3. Perform triage
// ─────────────────────────────────────────────────────────────

export default function PatientProfilePage() {
    const { patientId } = useParams<{ patientId: string }>()
    const router = useRouter()

    const {
        data: patient,
        isLoading,
        isError,
    } = usePatient(patientId)

    const createCaseMutation = useCreateCase()

    // Creates a new emergency case for the current patient.
    function handleCreateCase() {
        createCaseMutation.mutate(
            { patientId },
            {
                onSuccess: (data) => {
                    // After creating the case, send the user directly to the case details page.
                    router.push(`/cases/${data.caseId}`)
                },
            }
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#eef2f3]">
                <div className="max-w-5xl mx-auto px-6 py-10 text-gray-500">
                    Loading patient profile...
                </div>
            </div>
        )
    }

    if (isError || !patient) {
        return (
            <div className="min-h-screen bg-[#eef2f3]">
                <div className="max-w-5xl mx-auto px-6 py-10 text-red-700">
                    Patient not found.
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
                        Patient profile and registration completion
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {patient.displayName}
                    </h1>

                    <p className="text-sm md:text-base text-gray-500">
                        View patient information, update registration details, link a login
                        account, or create an emergency case.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column: profile + create case */}
                    <div className="lg:col-span-1 space-y-6">
                        <PatientProfileCard
                            patientId={patient.patientId}
                            displayName={patient.displayName}
                            age={patient.age}
                            gender={patient.gender}
                            phone={patient.phone}
                        />

                        {/* Create emergency case step */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-5">
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">
                                Emergency Case
                            </h2>

                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                After quick registration, create an emergency case so the patient
                                can move to triage and appear in the ED queue.
                            </p>

                            {createCaseMutation.isError && (
                                <p className="text-xs text-red-600 mb-3">
                                    Failed to create emergency case. Please try again.
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleCreateCase}
                                disabled={createCaseMutation.isPending}
                                className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
                            >
                                {createCaseMutation.isPending
                                    ? "Creating Case..."
                                    : "Create Emergency Case"}
                            </button>
                        </div>
                    </div>

                    {/* Right column: edit + link account */}
                    <div className="lg:col-span-2 space-y-6">
                        <EditPatientForm
                            patientId={patient.patientId}
                            currentDisplayName={patient.displayName}
                            currentGender={patient.gender}
                            currentPhone={patient.phone}
                        />

                        <LinkPatientAccountForm patientId={patient.patientId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Patient Profile Card
//
// Shows the basic patient information returned by:
// GET /api/v1/patients/{patientId}
// ─────────────────────────────────────────────────────────────

function PatientProfileCard({
    patientId,
    displayName,
    age,
    gender,
    phone,
}: {
    patientId: string
    displayName: string
    age: number
    gender: Gender
    phone: string
}) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Profile Information
            </h2>

            <div className="space-y-3">
                <InfoRow label="Patient ID" value={patientId} />
                <InfoRow label="Name" value={displayName} />
                <InfoRow label="Age" value={`${age}`} />
                <InfoRow label="Gender" value={gender} />
                <InfoRow label="Phone" value={phone} />
            </div>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-900 break-words">
                {value || "—"}
            </p>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Edit Patient Form
//
// Purpose:
// - Completes/updates the patient profile after quick registration.
//
// Endpoint used:
// PATCH /api/v1/patients/{patientId}
//
// Note:
// - The API expects dateOfBirth in the update request.
// - The current GET profile response does not return dateOfBirth,
//   so the user must enter it when updating.
// ─────────────────────────────────────────────────────────────

function EditPatientForm({
    patientId,
    currentDisplayName,
    currentGender,
    currentPhone,
}: {
    patientId: string
    currentDisplayName: string
    currentGender: Gender
    currentPhone: string
}) {
    const [form, setForm] = useState({
        displayName: currentDisplayName,
        dateOfBirth: "",
        gender: currentGender,
        phone: currentPhone,
    })

    const {
        mutate,
        isPending,
        isError,
        isSuccess,
        reset,
    } = useUpdatePatient(patientId)

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

        // Clear previous success/error messages when editing again.
        reset()
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        mutate(form)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4"
        >
            <div>
                <h2 className="text-sm font-semibold text-gray-900">
                    Update Patient Profile
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                    Use this after quick registration to complete or correct the patient&apos;s
                    profile information.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display name */}
                <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                        Display Name
                    </label>

                    <input
                        type="text"
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        placeholder="John Michael Doe"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>

                {/* Date of birth */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Date of Birth
                    </label>

                    <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Gender
                    </label>

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    >
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                    </select>
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                        Phone
                    </label>

                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0509876543"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                        required
                    />
                </div>
            </div>

            {isError && (
                <p className="text-xs text-red-600">
                    Failed to update patient profile. Please try again.
                </p>
            )}

            {isSuccess && (
                <p className="text-xs text-green-600">
                    Patient profile updated successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50"
            >
                {isPending ? "Saving..." : "Save Patient Updates"}
            </button>
        </form>
    )
}

// ─────────────────────────────────────────────────────────────
// Link Patient Account Form
//
// Purpose:
// - Generates a login account for a patient who was created using
//   quick registration.
// - This is usually done after emergency treatment or when full
//   registration is completed.
//
// Endpoint used:
// POST /api/v1/patients/{patientId}/link-account
// ─────────────────────────────────────────────────────────────

function LinkPatientAccountForm({ patientId }: { patientId: string }) {
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const {
        mutate,
        isPending,
        isError,
        isSuccess,
        reset,
    } = useLinkPatientAccount(patientId)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

        // Clear previous success/error messages when editing again.
        reset()
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        mutate(form, {
            onSuccess: () => {
                setForm({
                    email: "",
                    password: "",
                })
            },
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4"
        >
            <div>
                <h2 className="text-sm font-semibold text-gray-900">
                    Link Patient Login Account
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                    Create a patient login account after the emergency intake process.
                </p>
            </div>

            {/* Email */}
            <div>
                <label className="block text-xs text-gray-500 mb-1">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john.doe@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                />
            </div>

            {/* Temporary password */}
            <div>
                <label className="block text-xs text-gray-500 mb-1">
                    Temporary Password
                </label>

                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="SecurePass123!"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    required
                />
            </div>

            {isError && (
                <p className="text-xs text-red-600">
                    Failed to link account. The patient may already have an account, or
                    the email may already be taken.
                </p>
            )}

            {isSuccess && (
                <p className="text-xs text-green-600">
                    Patient login account linked successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
            >
                {isPending ? "Linking Account..." : "Link Login Account"}
            </button>
        </form>
    )
}