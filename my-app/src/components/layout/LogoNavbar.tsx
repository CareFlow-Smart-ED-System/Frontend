"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LogoNavbar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="w-full bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/NavBar.png"
            alt="CareFlow ED"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>
    </nav>
  );
}
