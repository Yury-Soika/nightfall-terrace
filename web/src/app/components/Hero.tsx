"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[620px] w-full overflow-hidden">
      <Image
        src="/images/sunset/hero.png"
        alt="Nightfall Terrace rooftop"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/75">
          Rooftop Bar &amp; Terrace
        </p>
        <h1 className="nt-display text-6xl font-light italic text-white sm:text-7xl lg:text-8xl">
          Nightfall Terrace
        </h1>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/80">
          High above the city, where the night begins
          and the view never gets old.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#reservation"
            className="inline-flex items-center justify-center border border-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#1a1a18] transition-colors duration-300"
          >
            Reserve a table
          </a>
          <a
            href="/about"
            className="text-[11px] uppercase tracking-[0.2em] text-white/75 hover:text-white transition-colors duration-200"
          >
            Discover more
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="h-10 w-px bg-white/40" />
      </div>
    </section>
  );
}
