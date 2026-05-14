"use client";

const hours = [
  { label: "Sunday, Monday, Thursday", value: "5 PM – 10 PM" },
  { label: "Friday & Saturday", value: "5 PM – 11 PM" },
  { label: "Happy Hour", value: "Mon–Fri • 5 PM – 7 PM" },
  { label: "Closed", value: "Tuesday & Wednesday" },
];

export default function Hours() {
  return (
    <section id="hours" className="nt-section">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            Hours
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Revel on the roof
          </h2>
          <p className="max-w-2xl text-sm text-white/70 sm:text-base">
            Everything up here runs a little lighter: the mood, the skyline, the
            slow slip from late afternoon into a long night under the stars.
          </p>
        </div>

        <div className="nt-card">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            Our hours
          </div>
          <dl className="mt-5 grid gap-4">
            {hours.map((h) => (
              <div key={h.label} className="flex items-start justify-between gap-6">
                <dt className="text-sm text-white/75">{h.label}</dt>
                <dd className="nt-mono text-sm text-white">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

