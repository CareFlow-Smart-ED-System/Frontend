"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
            Logout
        </button>
    );
}