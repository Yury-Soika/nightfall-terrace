"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#reservation", label: "Reservations" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0e1a]/95 backdrop-blur-md border-b border-[#1e2d40]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="nt-container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="nt-display text-lg font-light italic tracking-wide text-[#f0ece4]">
          Nightfall Terrace
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.16em] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "transition-colors duration-200",
                pathname === l.href
                  ? "text-[#d4a574]"
                  : "text-[#8b9bb4] hover:text-[#f0ece4]",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/#reservation"
            className="hidden md:inline-flex items-center justify-center border border-[#d4a574] px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors duration-200"
          >
            Book a table
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-1 text-[#8b9bb4] hover:text-[#f0ece4]"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0e1a]/98 border-b border-[#1e2d40]">
          <nav className="nt-container py-4 flex flex-col gap-4 text-[11px] uppercase tracking-[0.16em]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#8b9bb4] hover:text-[#f0ece4] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#reservation"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center border border-[#d4a574] px-5 py-2.5 text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors"
            >
              Book a table
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
