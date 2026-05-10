"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";
import { useMemo, useState } from "react";

type Role = "DOCTOR" | "NURSE" | "ADMIN" | "RECEPTIONIST";

interface NavLink {
  href: string;
  label: string;
}

const publicRoutes = ["/", "/login", "/change-password"];

function getRoleLabel(role: Role) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "DOCTOR":
      return "Doctor";
    case "NURSE":
      return "Nurse";
    case "RECEPTIONIST":
      return "Receptionist";
    default:
      return role;
  }
}

export function LogoNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated } = useAuthStore();
  const role = user?.role as Role | undefined;

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navLinks: NavLink[] = useMemo(() => {
    if (!role) return [];

    const linksByRole: Record<Role, NavLink[]> = {
      RECEPTIONIST: [
        { href: "/queue", label: "Queue" },
        { href: "/patients/register", label: "Register Patient" },
        { href: "/billing", label: "Billing" },
        { href: "/appointments", label: "Appointments" },
      ],

      NURSE: [
        { href: "/queue", label: "Queue" },
        { href: "/cases", label: "Cases" },
        { href: "/notifications", label: "Notifications" },
      ],

      DOCTOR: [
        { href: "/doctors/cases", label: "My Cases" },
        { href: "/queue", label: "Queue" },
        { href: "/cases", label: "All Cases" },
        { href: "/appointments", label: "Appointments" },
      ],

      ADMIN: [
        { href: "/queue", label: "Queue" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/audit-logs", label: "Audit Logs" },
        { href: "/cases", label: "Cases" },
      ],
    };

    return linksByRole[role] || [];
  }, [role]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (publicRoutes.includes(pathname)) {
    return null;
  }

  if (!isAuthenticated || !user || !role) {
    return null;
  }

  return (
    <nav className="w-full bg-[#eef2f3] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/queue" className="inline-flex items-center shrink-0">
          <Image
            src="/NavBar.png"
            alt="CareFlow ED"
            width={120}
            height={32}
            className="h-8"
            priority
          />
        </Link>

        <div className="flex items-center gap-5 text-sm">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "font-semibold text-red-700"
                    : "font-medium text-gray-600 hover:text-gray-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <NotificationBell />

          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user.displayName}
            </p>
            <p className="text-xs text-gray-500">{getRoleLabel(role)}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
}