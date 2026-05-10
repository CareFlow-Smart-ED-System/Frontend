"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuthStore } from "@/store/authStore";
import { useMemo } from "react";

type Role = "DOCTOR" | "NURSE" | "ADMIN" | "RECEPTIONIST";

interface NavLink {
  href: string;
  label: string;
}

export function LogoNavbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role as Role | undefined;

  // Define which links each role can see
  const navLinks: NavLink[] = useMemo(() => {
    if (!role) return [];

    const linksByRole: Record<Role, NavLink[]> = {
      RECEPTIONIST: [
        { href: "/", label: "Home" },
        { href: "/queue", label: "Queue" },
        { href: "/billing", label: "Billing" },
        { href: "/appointments", label: "Appointments" },
      ],
      NURSE: [
        { href: "/", label: "Home" },
        { href: "/queue", label: "Queue" },
        { href: "/cases", label: "Cases" },
      ],
      DOCTOR: [
        { href: "/", label: "Home" },
        { href: "/queue", label: "Queue" },
        { href: "/cases", label: "Cases" },
      ],
      ADMIN: [
        { href: "/", label: "Home" },
        { href: "/queue", label: "Queue" },
        { href: "/admin/users", label: "Admin" },
        { href: "/admin/audit-logs", label: "Audit Logs" },
      ],
    };

    return linksByRole[role] || [];
  }, [role]);

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="w-full bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/NavBar.png"
            alt="CareFlow ED"
            width={120}
            height={32}
            className="h-8"
            priority
          />
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}

          <NotificationBell />
        </div>
      </div>
    </nav>
  );
}