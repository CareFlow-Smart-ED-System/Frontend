"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
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

    return "Login failed. Please check your email and password.";
}

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await login({ email, password });

            if (result.mustChangePassword || result.user.mustChangePassword) {
                router.push("/change-password");
                return;
            }

            router.push(getRoleHomePath(result.user.role));
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#eef2f3] flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                {/* Left side */}
                <section className="hidden lg:flex flex-col justify-between bg-red-700 text-white p-10">
                    <div>
                        <Image
                            src="/NavBar.png"
                            alt="CareFlow"
                            width={150}
                            height={40}
                            className="h-10 w-auto bg-white rounded-xl px-3 py-2"
                        />

                        <h1 className="text-4xl font-bold mt-16 leading-tight">
                            Welcome back to CareFlow.
                        </h1>

                        <p className="text-sm text-red-50 mt-5 leading-relaxed max-w-sm">
                            Sign in to manage emergency cases, triage, patient queues, staff
                            accounts, billing, and clinical workflows.
                        </p>
                    </div>

                    <p className="text-xs text-red-100">
                        Emergency Department Information System
                    </p>
                </section>

                {/* Form side */}
                <section className="p-8 md:p-12">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            ← Back to home
                        </Link>

                        <h2 className="text-3xl font-bold text-gray-900 mt-8">
                            Sign in
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Use the credentials provided by the system administrator.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                placeholder="name@careflow.com"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                placeholder="Enter your password"
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
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                        <h3 className="text-sm font-semibold text-gray-800">
                            First-time login?
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            If this is your first login after the admin created your account,
                            you will be redirected to change your temporary password before
                            accessing the system.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}