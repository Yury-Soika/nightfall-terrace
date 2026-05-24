"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <Image
        src="/images/gallery/aerial-rooftop-dusk.png"
        alt="Nightfall Terrace rooftop at dusk"
        fill
        priority
        className="object-cover"
      />
      {/* Deep gradient overlay — heavier at top for nav legibility, heavier at bottom for text */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1621]/70 via-[#0f1621]/30 to-[#0f1621]/80" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-[#d4a574]">
          Rooftop Bar &amp; Terrace
        </p>
        <h1 className="nt-display text-6xl font-light italic text-[#f0ece4] sm:text-7xl lg:text-[6.5rem] lg:leading-none">
          Nightfall Terrace
        </h1>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-[#8b9bb4]">
          High above the city, where the night begins
          and the view never gets old.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#reservation"
            className="inline-flex items-center justify-center border border-[#d4a574] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0f1621] transition-colors duration-300"
          >
            Reserve a table
          </a>
          <a
            href="/events"
            className="text-[11px] uppercase tracking-[0.2em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors duration-200"
          >
            Upcoming events →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#4a5872]">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-[#4a5872] to-transparent" />
      </div>
    </section>
  );
}
