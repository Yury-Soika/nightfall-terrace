"use client";

import Link from "next/link";

export default function MenuSection() {
  return (
    <section id="menu" className="bg-[#1a1a18]">
      <div className="nt-container py-20 sm:py-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#c8a96e]">Menu</p>
            <h2 className="nt-display text-4xl font-light italic text-white sm:text-5xl">
              Cocktails &amp; small plates
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Signature drinks, snacks, and dishes designed for long evenings
              above the city.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center gap-3 border border-white/30 px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#1a1a18] transition-colors duration-200"
          >
            View full menu
            <span className="h-px w-6 bg-current" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-3">
          {[
            { label: "Cocktails", count: "6 signatures" },
            { label: "Small plates", count: "8 dishes" },
            { label: "Large plates", count: "4 mains" },
          ].map((cat) => (
            <div key={cat.label} className="bg-[#1a1a18] px-6 py-8">
              <p className="nt-display text-2xl font-light text-white">{cat.label}</p>
              <p className="mt-1 text-xs text-white/50">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
