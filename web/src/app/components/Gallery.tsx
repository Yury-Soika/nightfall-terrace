"use client";

import Image from "next/image";

const shots = [
  {
    src: "/images/sunset/shot-1.png",
    title: "Ocean horizon",
    sub: "sunset seating",
  },
  {
    src: "/images/sunset/shot-2.png",
    title: "Afterglow",
    sub: "warm sky tones",
  },
  {
    src: "/images/sunset/hero.png",
    title: "Golden hour",
    sub: "skyline reflections",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="nt-section">
      <div className="mb-12 flex items-end justify-between">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#c8a96e]">Gallery</p>
          <h2 className="nt-display text-4xl font-light italic text-[#1a1a18] sm:text-5xl">
            The terrace
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {shots.map((s, idx) => (
          <div
            key={s.title}
            className={`group relative overflow-hidden ${idx === 0 ? "md:row-span-2" : ""}`}
          >
            <div className={`relative w-full overflow-hidden ${idx === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image
                src={s.src}
                alt={s.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="nt-display text-base font-light text-[#1a1a18]">{s.title}</p>
              <p className="text-xs text-[#6b6b68]">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
