import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#eef2f3] font-sans">
      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/NavBar.png"
            alt="CareFlow ED"
            width={120}
            height={32}
            className="h-8"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
          <Link
            href="#features"
            className="hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#modules"
            className="hover:text-gray-900 transition-colors"
          >
            Modules
          </Link>
          <Link href="#about" className="hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link
            href="#contact"
            className="hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/queue"
            className="text-sm text-gray-700 font-medium hover:text-gray-900 transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/cases"
            className="text-sm bg-red-700 text-white font-medium px-5 py-2 rounded-full hover:bg-red-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="text-center px-6 pt-12 pb-0 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-block border border-gray-300 bg-white/60 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full mb-8">
          Now live: Real-time queue management and triage tracking
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          CareFlow: The Emergency
          <br />
          Department System for
          <br />
          Modern Hospitals.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          CareFlow manages, prioritizes, and tracks every patient from arrival
          through discharge — giving clinical teams the clarity they need in
          high-pressure environments.
        </p>

        {/* CTA */}
        <Link
          href="/queue"
          className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-medium px-7 py-3.5 rounded-full hover:bg-red-800 transition-colors"
        >
          View Live Queue Dashboard →
        </Link>
      </section>

      {/* ── Hero image / visual ───────────────────────────── */}
      <section className="mt-14 px-6 max-w-5xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 bg-linear-to-b from-[#c8dde8] via-[#ddeaf0] to-[#eef2f3] flex items-end justify-center">
          {/* Abstract hospital/ED silhouette via CSS */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <svg
              viewBox="0 0 800 200"
              className="w-full opacity-30"
              preserveAspectRatio="none"
            >
              <rect
                x="320"
                y="40"
                width="160"
                height="160"
                fill="#1a2e44"
                rx="4"
              />
              <rect
                x="360"
                y="0"
                width="80"
                height="60"
                fill="#1a2e44"
                rx="2"
              />
              <rect x="355" y="20" width="12" height="40" fill="#eef2f3" />
              <rect x="433" y="20" width="12" height="40" fill="#eef2f3" />
              <rect x="340" y="100" width="40" height="60" fill="#eef2f3" />
              <rect x="420" y="100" width="40" height="60" fill="#eef2f3" />
              <rect x="355" y="120" width="10" height="20" fill="#1a2e44" />
              <rect x="435" y="120" width="10" height="20" fill="#1a2e44" />
              <rect
                x="80"
                y="100"
                width="120"
                height="100"
                fill="#1a2e44"
                rx="2"
                opacity="0.5"
              />
              <rect
                x="600"
                y="80"
                width="140"
                height="120"
                fill="#1a2e44"
                rx="2"
                opacity="0.5"
              />
            </svg>
          </div>
          {/* Mist overlay */}
          <div className="absolute bottom-0 w-full h-24 bg-linear-to-t from-[#eef2f3] to-transparent" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
          Built for every role in the ED
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Real-Time Queue",
              desc: "Priority-sorted queue updated live via WebSocket. Critical patients always surface first.",
            },
            {
              title: "Triage Tracking",
              desc: "Nurses record severity and vitals at arrival. Full triage history tracks patient deterioration over time.",
            },
            {
              title: "Doctor Workspace",
              desc: "Assigned doctors access labs, imaging, prescriptions, and case timeline from one view.",
            },
            {
              title: "Medication Management",
              desc: "Prescribe and administer medications with a full clinical record attached to each case.",
            },
            {
              title: "Lab & Imaging Results",
              desc: "Lab work and radiology reports linked directly to the patient case for immediate access.",
            },
            {
              title: "Discharge Summary",
              desc: "Automated discharge summary with diagnosis, treatment notes, and follow-up recommendations.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA section ──────────────────────────────────── */}
      <section className="py-20 px-6 text-center">
        <div className="bg-red-700 rounded-3xl max-w-2xl mx-auto py-16 px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your ED?
          </h2>
          <p className="text-white text-sm mb-8 leading-relaxed">
            Start managing patients, queues, and clinical data from one system.
          </p>
          <Link
            href="/queue"
            className="inline-flex items-center gap-2 bg-white text-[#1a2e44] font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            Open Dashboard →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-10 px-6 text-center text-xs text-gray-400 border-t border-gray-200">
        <p>© 2026 CareFlow. Emergency Department Information System.</p>
      </footer>
    </div>
  );
}
