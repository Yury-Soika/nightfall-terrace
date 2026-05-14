"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#reservation", label: "Reservations" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f7f5f2]/90 backdrop-blur-md border-b border-[#e2e0db]">
      <div className="nt-container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="nt-display text-lg font-medium tracking-wide text-[#1a1a18]">
          Nightfall Terrace
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.16em] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "transition-colors duration-200",
                pathname === l.href
                  ? "text-[#1a1a18]"
                  : "text-[#6b6b68] hover:text-[#1a1a18]",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/#reservation"
            className="inline-flex items-center justify-center border border-[#1a1a18] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-[#f7f5f2] transition-colors duration-200"
          >
            Book a table
          </Link>
        </div>
      </div>
    </header>
  );
}
