import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f5f2] pt-16">
        {/* Page header */}
        <div className="border-b border-[#e2e0db]">
          <div className="nt-container py-16 sm:py-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#c8a96e]">Nightfall Terrace</p>
            <h1 className="nt-display mt-3 text-5xl font-light italic text-[#1a1a18] sm:text-6xl">
              About
            </h1>
          </div>
        </div>

        {/* Story */}
        <div className="nt-container py-20 sm:py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-28">
            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#c8a96e]">The space</p>
              <h2 className="nt-display text-4xl font-light leading-tight text-[#1a1a18] sm:text-5xl">
                An oasis above<br />
                <em>the city skyline</em>
              </h2>
              <p className="text-sm leading-relaxed text-[#6b6b68]">
                Nightfall Terrace sits on the 34th floor of Nocturne Bay, offering
                270-degree panoramic views from golden hour to last call. The space
                was conceived as an antidote to the ordinary — somewhere the city
                feels both close and distant.
              </p>
              <p className="text-sm leading-relaxed text-[#6b6b68]">
                Every detail, from the curated cocktail list to the warm lighting
                at dusk, is designed to make the evening feel effortless. We keep
                the guest count intentional so the terrace never feels like
                anything other than your own.
              </p>
            </div>

            <div className="grid gap-px bg-[#e2e0db]">
              <div className="bg-[#f7f5f2] p-8 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Hours</p>
                <p className="nt-display mt-3 text-2xl font-light text-[#1a1a18]">Tuesday – Sunday</p>
                <p className="mt-1 text-sm text-[#6b6b68]">5:00 pm – 1:00 am</p>
              </div>
              <div className="bg-[#f7f5f2] p-8 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Location</p>
                <p className="nt-display mt-3 text-2xl font-light text-[#1a1a18]">34th Floor, Nocturne Bay</p>
                <p className="mt-1 text-sm text-[#6b6b68]">270° panoramic views</p>
              </div>
              <div className="bg-[#f7f5f2] p-8 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Dress code</p>
                <p className="nt-display mt-3 text-2xl font-light text-[#1a1a18]">Smart casual</p>
                <p className="mt-1 text-sm text-[#6b6b68]">We ask guests to dress the part</p>
              </div>
              <div className="bg-[#f7f5f2] p-8 sm:p-10">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#c8a96e]">Reservations</p>
                <p className="nt-display mt-3 text-2xl font-light text-[#1a1a18]">Deposit-secured</p>
                <p className="mt-1 text-sm text-[#6b6b68]">Walk-ins subject to availability</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-[#e2e0db]">
          <div className="nt-container py-16 text-center">
            <p className="nt-display text-3xl font-light italic text-[#1a1a18] sm:text-4xl">
              Join us for the evening
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/#reservation"
                className="inline-flex items-center justify-center border border-[#1a1a18] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#1a1a18] hover:bg-[#1a1a18] hover:text-white transition-colors duration-200"
              >
                Reserve a table
              </Link>
              <Link
                href="/menu"
                className="text-[11px] uppercase tracking-[0.2em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors"
              >
                View the menu
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
