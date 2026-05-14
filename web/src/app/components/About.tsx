"use client";

export default function About() {
  return (
    <section id="about" className="nt-section">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#c8a96e]">
            About the terrace
          </p>
          <h2 className="nt-display text-4xl font-light leading-tight text-[#1a1a18] sm:text-5xl">
            An oasis above<br />
            <em>the city skyline</em>
          </h2>
          <p className="text-sm leading-relaxed text-[#6b6b68]">
            Nightfall Terrace sits high above Nocturne Bay, offering uninterrupted
            views from golden hour to last call. The space was designed for those
            who believe a great evening begins with where you sit.
          </p>
          <p className="text-sm leading-relaxed text-[#6b6b68]">
            Reserve your table in minutes. Real-time availability, transparent
            deposit, seamless check-in — everything is taken care of
            so the evening can begin.
          </p>
          <a
            href="#reservation"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:gap-5 transition-all duration-200"
          >
            Make a reservation
            <span className="h-px w-8 bg-[#1a1a18]" />
          </a>
        </div>

        <div className="grid gap-px bg-[#e2e0db]">
          <div className="bg-[#f7f5f2] p-8 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Hours</p>
            <p className="mt-3 nt-display text-2xl font-light text-[#1a1a18]">
              Tuesday – Sunday
            </p>
            <p className="mt-1 text-sm text-[#6b6b68]">5:00 pm – 1:00 am</p>
          </div>
          <div className="bg-[#f7f5f2] p-8 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Location</p>
            <p className="mt-3 nt-display text-2xl font-light text-[#1a1a18]">
              34th Floor, Nocturne Bay
            </p>
            <p className="mt-1 text-sm text-[#6b6b68]">270° panoramic views</p>
          </div>
          <div className="bg-[#f7f5f2] p-8 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Reservations</p>
            <p className="mt-3 nt-display text-2xl font-light text-[#1a1a18]">
              Deposit-secured tables
            </p>
            <p className="mt-1 text-sm text-[#6b6b68]">Walk-ins subject to availability</p>
          </div>
        </div>
      </div>
    </section>
  );
}
