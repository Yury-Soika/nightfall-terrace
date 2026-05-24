import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0e1a] pt-16">
        <div className="border-b border-[#1e2d40]">
          <div className="nt-container py-16 sm:py-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Nightfall Terrace</p>
            <h1 className="nt-display mt-3 text-5xl font-light italic text-[#f0ece4] sm:text-6xl">
              About
            </h1>
          </div>
        </div>

        <div className="nt-container py-20 sm:py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-28">
            <div className="space-y-6">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">The space</p>
              <h2 className="nt-display text-4xl font-light leading-tight text-[#f0ece4] sm:text-5xl">
                An oasis above<br />
                <em>the city skyline</em>
              </h2>
              <p className="text-sm leading-relaxed text-[#8b9bb4]">
                Nightfall Terrace sits on the 34th floor of Nocturne Bay, offering
                270-degree panoramic views from golden hour to last call. The space
                was conceived as an antidote to the ordinary — somewhere the city
                feels both close and distant.
              </p>
              <p className="text-sm leading-relaxed text-[#8b9bb4]">
                Every detail, from the curated cocktail list to the warm lighting
                at dusk, is designed to make the evening feel effortless. We keep
                the guest count intentional so the terrace never feels like
                anything other than your own.
              </p>
            </div>

            <div className="grid gap-px bg-[#1e2d40]">
              {[
                { label: "Hours", title: "Tuesday – Sunday", sub: "5:00 pm – 1:00 am" },
                { label: "Location", title: "34th Floor, Nocturne Bay", sub: "270° panoramic views" },
                { label: "Dress code", title: "Smart casual", sub: "We ask guests to dress the part" },
                { label: "Reservations", title: "Deposit-secured", sub: "Walk-ins subject to availability" },
              ].map((item) => (
                <div key={item.label} className="bg-[#0d1526] p-8 sm:p-10">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">{item.label}</p>
                  <p className="nt-display mt-3 text-2xl font-light text-[#f0ece4]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#8b9bb4]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1e2d40]">
          <div className="nt-container py-16 text-center">
            <p className="nt-display text-3xl font-light italic text-[#f0ece4] sm:text-4xl">
              Join us for the evening
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/#reservation"
                className="inline-flex items-center justify-center border border-[#d4a574] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors duration-200"
              >
                Reserve a table
              </Link>
              <Link
                href="/menu"
                className="text-[11px] uppercase tracking-[0.2em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors"
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
