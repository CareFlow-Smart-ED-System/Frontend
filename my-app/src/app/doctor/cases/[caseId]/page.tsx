"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Doctor Case Redirect Page
//
// Purpose:
// - Keeps /doctor/cases/{caseId} working if any doctor dashboard
//   links point to it.
// - Redirects to the shared case details page:
//   /cases/{caseId}
//
// Why:
// - The actual case workspace already lives in:
//   src/app/cases/[caseId]/page.tsx
// - Avoid duplicating the full case details UI.
// ─────────────────────────────────────────────────────────────

export default function DoctorCaseRedirectPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (caseId) {
      router.replace(`/cases/${caseId}`);
    }
  }, [caseId, router]);

  return (
    <div className="min-h-screen bg-[#eef2f3]">
      <div className="max-w-6xl mx-auto px-6 py-10 text-gray-500">
        Opening case workspace...
      </div>
    </div>
  );
}