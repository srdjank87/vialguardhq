import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VialGuardHQ - Injectable Inventory Guardian for Medical Spas",
  description:
    "Stop losing money on injectable inventory. VialGuardHQ helps medical spas and aesthetic clinics prevent waste, catch discrepancies, and stay audit-ready with vial-level tracking for Botox, fillers, and more.",
  keywords: [
    "medical spa inventory",
    "injectable tracking",
    "Botox inventory management",
    "filler inventory",
    "medspa software",
    "aesthetic clinic inventory",
    "DEA compliance",
    "vial tracking",
  ],
  openGraph: {
    title: "VialGuardHQ - Injectable Inventory Guardian",
    description:
      "The specialized inventory guardian for medical spas. Track every vial, catch discrepancies, stay audit-ready.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
