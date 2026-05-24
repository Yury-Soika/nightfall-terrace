"use client";

export default function About() {
  return (
    <section id="about" className="nt-section">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">
            About the terrace
          </p>
          <h2 className="nt-display text-4xl font-light leading-tight text-[#f0ece4] sm:text-5xl">
            An oasis above<br />
            <em>the city skyline</em>
          </h2>
          <p className="text-sm leading-relaxed text-[#8b9bb4]">
            Nightfall Terrace sits high above Nocturne Bay, offering uninterrupted
            views from golden hour to last call. The space was designed for those
            who believe a great evening begins with where you sit.
          </p>
          <p className="text-sm leading-relaxed text-[#8b9bb4]">
            Reserve your table in minutes. Real-time availability, transparent
            deposit, seamless check-in — everything is taken care of
            so the evening can begin.
          </p>
          <a
            href="#reservation"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:gap-5 transition-all duration-200"
          >
            Make a reservation
            <span className="h-px w-8 bg-[#d4a574]" />
          </a>
        </div>

        <div className="grid gap-px bg-[#1e2d40]">
          <div className="bg-[#0d1526] p-8 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">Hours</p>
            <p className="mt-3 nt-display text-2xl font-light text-[#f0ece4]">
              Tuesday – Sunday
            </p>
            <p className="mt-1 text-sm text-[#8b9bb4]">5:00 pm – 1:00 am</p>
          </div>
          <div className="bg-[#0d1526] p-8 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">Location</p>
            <p className="mt-3 nt-display text-2xl font-light text-[#f0ece4]">
              34th Floor, Nocturne Bay
            </p>
            <p className="mt-1 text-sm text-[#8b9bb4]">270° panoramic views</p>
          </div>
          <div className="bg-[#0d1526] p-8 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">Reservations</p>
            <p className="mt-3 nt-display text-2xl font-light text-[#f0ece4]">
              Deposit-secured tables
            </p>
            <p className="mt-1 text-sm text-[#8b9bb4]">Walk-ins subject to availability</p>
          </div>
        </div>
      </div>
    </section>
  );
}
