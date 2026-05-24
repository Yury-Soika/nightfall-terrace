"use client";

const blocks = [
  {
    eyebrow: "Urban oasis",
    title: "Paradise, far above the street",
    body: "A rooftop made for late conversations and skyline moments. Light bites, a full bar, and tables that feel like yours the moment you book.",
  },
  {
    eyebrow: "Private events",
    title: "A setting unlike any other",
    body: "From celebrations to brand nights — host events with curated table arrangements, custom menus, and deposits that keep everything smooth.",
  },
  {
    eyebrow: "Seamless booking",
    title: "Reserve in minutes",
    body: "Real-time availability, instant confirmation, and a booking system built to keep the evening effortless from start to finish.",
  },
];

export default function FeatureBlocks() {
  return (
    <section className="nt-section">
      <div className="grid gap-px bg-[#243447] md:grid-cols-3">
        {blocks.map((b) => (
          <div key={b.title} className="bg-[#0f1621] p-8 sm:p-10 hover:bg-[#141e2d] transition-colors">
            <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#d4a574]">
              {b.eyebrow}
            </div>
            <div className="mt-4 nt-display text-2xl font-light italic text-[#f0ece4]">
              {b.title}
            </div>
            <div className="mt-4 text-sm leading-relaxed text-[#8b9bb4]">{b.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
