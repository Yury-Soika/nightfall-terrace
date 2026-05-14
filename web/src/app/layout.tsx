import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-nt-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Montserrat({
  variable: "--font-nt-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nightfall Terrace — Rooftop reservations",
  description:
    "Nightfall Terrace — rooftop bar and terrace. Skyline views, signature cocktails, and effortless reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      {/* Grammarly and similar extensions mutate <body> before hydration */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
