"use client";

import Link from "next/link";

const categories = [
  {
    label: "Signature cocktails",
    count: "6 creations",
    description: "House-crafted spirits and seasonal ingredients",
  },
  {
    label: "Small plates",
    count: "8 dishes",
    description: "Light bites designed for sharing",
  },
  {
    label: "Mains & desserts",
    count: "6 selections",
    description: "Elevated classics and seasonal specials",
  },
];

export default function MenuSection() {
  return (
    <section id="menu" className="bg-[#141e2d] border-y border-[#243447]">
      <div className="nt-container py-20 sm:py-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Menu</p>
            <h2 className="nt-display text-4xl font-light italic text-[#f0ece4] sm:text-5xl">
              Cocktails &amp; small plates
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-[#8b9bb4]">
              Signature drinks, snacks, and dishes designed for long evenings
              above the city.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center gap-3 border border-[#d4a574]/40 px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0f1621] hover:border-[#d4a574] transition-colors duration-200"
          >
            View full menu
            <span className="h-px w-6 bg-current" />
          </Link>
        </div>

        <div className="grid gap-px bg-[#243447] sm:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.label} className="bg-[#141e2d] px-6 py-8 hover:bg-[#192438] transition-colors">
              <p className="nt-display text-2xl font-light text-[#f0ece4]">{cat.label}</p>
              <p className="mt-1 text-xs text-[#d4a574] uppercase tracking-[0.14em]">{cat.count}</p>
              <p className="mt-3 text-sm text-[#8b9bb4]">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
