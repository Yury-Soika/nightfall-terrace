"use client";

const blocks = [
  {
    eyebrow: "Urban oasis",
    title: "Paradise, far above the street",
    body: "A rooftop made for late conversations and skyline moments. Light bites, a full bar, and tables that feel like yours the moment you book.",
  },
  {
    eyebrow: "Private party",
    title: "A setting unlike any other",
    body: "From celebrations to brand nights — host events with simple table rules, blackout dates, and deposits that keep everything smooth.",
  },
  {
    eyebrow: "Ocean-friendly",
    title: "Small choices, cleaner coastlines",
    body: "We demo sustainability-friendly operations: fewer single-use plastics, thoughtful sourcing, and menus designed to reduce waste.",
  },
];

export default function FeatureBlocks() {
  return (
    <section id="views" className="nt-section">
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((b) => (
          <div key={b.title} className="nt-card">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {b.eyebrow}
            </div>
            <div className="mt-3 text-xl font-semibold tracking-tight text-white">
              {b.title}
            </div>
            <div className="mt-3 text-sm text-white/70">{b.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

