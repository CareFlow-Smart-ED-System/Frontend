"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function LogoNavbar() {
  const pathname = usePathname();

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
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/queue" className="text-gray-600 hover:text-gray-900">
            Queue
          </Link>
          <Link href="/cases" className="text-gray-600 hover:text-gray-900">
            Cases
          </Link>
          <Link href="/billing" className="text-gray-600 hover:text-gray-900">
            Billing
          </Link>
          <Link href="/appointments" className="text-gray-600 hover:text-gray-900">
            Appointments
          </Link>
          <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
            Admin
          </Link>

          <Link href="/admin/audit-logs" className="text-gray-600 hover:text-gray-900">
            Audit Logs
          </Link>

          <NotificationBell />
        </div>
      </div>
    </nav>
  );
}