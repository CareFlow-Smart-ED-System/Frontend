import type { Metadata } from "next";
import { LogoNavbar } from "@/components/layout/LogoNavbar";
import { QueryProvider } from "@/providers/QueryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareFlow - ED System",
  description:
    "CareFlow is an Emergency Department (ED) system designed to streamline patient management and improve workflow efficiency. It provides real-time updates on patient status, bed availability, and resource allocation, helping healthcare professionals deliver timely and effective care.",
  icons: {
    icon: "/CareFlow.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <LogoNavbar />
          <main className="flex-1">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
