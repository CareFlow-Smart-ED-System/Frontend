"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { StaffRole } from "@/types/auth";

function getRoleHomePath(role: StaffRole) {
    switch (role) {
        case "ADMIN":
            return "/admin/users";
        case "DOCTOR":
            return "/doctors/cases";
        case "NURSE":
            return "/queue";
        case "RECEPTIONIST":
            return "/patients/register";
        default:
            return "/queue";
    }
}

function getErrorMessage(error: unknown) {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message === "string"
    ) {
        return (error as { response: { data: { message: string } } }).response.data
            .message;
    }

    return "Password update failed. Please check your current password and try again.";
}

export default function ChangePasswordPage() {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!accessToken) {
            router.replace("/login");
        }
    }, [accessToken, router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (newPassword !== newPasswordConfirm) {
            setError("New password and confirmation password do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await updatePassword({
                currentPassword,
                newPassword,
                newPasswordConfirm,
                confirmPassword: newPasswordConfirm,
            });

            router.push(getRoleHomePath(result.user.role));
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#eef2f3] flex items-center justify-center px-6 py-10">
            <section className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <Link
                    href="/login"
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                    ← Back to login
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mt-8">
                    Change password
                </h1>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {user?.displayName
                        ? `Hi ${user.displayName}, you need to change your temporary password before continuing.`
                        : "You need to change your temporary password before continuing."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Current temporary password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            New password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Confirm new password
                        </label>
                        <input
                            type="password"
                            value={newPasswordConfirm}
                            onChange={(event) => setNewPasswordConfirm(event.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-red-700 text-white py-3 text-sm font-semibold hover:bg-red-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Updating password..." : "Update Password"}
                    </button>
                </form>
            </section>
        </main>
    );
}