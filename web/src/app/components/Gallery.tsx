"use client";

import Image from "next/image";
import Link from "next/link";

const shots = [
  {
    src: "/images/gallery/aerial-rooftop-dusk.png",
    title: "Aerial dusk",
    sub: "rooftop overview",
  },
  {
    src: "/images/gallery/cocktail-lounge-night.png",
    title: "Lounge night",
    sub: "cocktail hour",
  },
  {
    src: "/images/gallery/twilight-coastal-skyline.png",
    title: "Coastal skyline",
    sub: "twilight views",
  },
  {
    src: "/images/gallery/golden-hour-terrace.png",
    title: "Golden hour",
    sub: "terrace seating",
  },
  {
    src: "/images/gallery/midnight-terrace-candles.png",
    title: "Midnight candles",
    sub: "late evenings",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="nt-section">
      <div className="mb-12 flex items-end justify-between">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Gallery</p>
          <h2 className="nt-display text-4xl font-light italic text-[#f0ece4] sm:text-5xl">
            The terrace
          </h2>
        </div>
        <Link
          href="/gallery"
          className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors"
        >
          View all
          <span className="h-px w-6 bg-current" />
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {shots.map((s, idx) => (
          <div
            key={s.title}
            className={`group relative overflow-hidden ${idx === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <div
              className={`relative w-full overflow-hidden ${
                idx === 0 ? "aspect-[16/10]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={s.src}
                alt={s.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1621]/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-baseline justify-between">
              <p className="nt-display text-base font-light text-[#f0ece4]">{s.title}</p>
              <p className="text-xs text-[#8b9bb4]">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
