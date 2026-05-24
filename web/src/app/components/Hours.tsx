"use client";

const hours = [
  { label: "Tuesday – Thursday", value: "5 PM – 11 PM" },
  { label: "Friday & Saturday", value: "5 PM – 1 AM" },
  { label: "Sunday", value: "5 PM – 10 PM" },
  { label: "Monday", value: "Closed" },
  { label: "Happy Hour", value: "Tue – Fri · 5 PM – 7 PM" },
];

export default function Hours() {
  return (
    <section id="hours" className="bg-[#0d1526] border-y border-[#1e2d40]">
      <div className="nt-container py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Hours</p>
            <h2 className="nt-display text-4xl font-light italic text-[#f0ece4] sm:text-5xl">
              Revel on the roof
            </h2>
            <p className="text-sm leading-relaxed text-[#8b9bb4]">
              Everything up here runs a little lighter: the mood, the skyline,
              and the slow slip from golden hour into a long night under the stars.
            </p>
          </div>

          <div className="border border-[#1e2d40] divide-y divide-[#1e2d40]">
            {hours.map((h) => (
              <div key={h.label} className="flex items-center justify-between px-6 py-4 gap-6">
                <dt className="text-sm text-[#8b9bb4]">{h.label}</dt>
                <dd
                  className={[
                    "text-sm font-light tabular-nums",
                    h.value === "Closed" ? "text-[#4a5872]" : "text-[#f0ece4]",
                  ].join(" ")}
                >
                  {h.value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
