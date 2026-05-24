import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const events = [
  {
    date: "Jun 6",
    day: "Friday",
    title: "DJ Celeste",
    genre: "Deep House · Melodic Techno",
    time: "9 PM – 2 AM",
    description:
      "Celeste brings her signature blend of deep house and melodic techno to the rooftop. Expect long, hypnotic sets as the city glows below.",
    image: "/images/gallery/cocktail-lounge-night.png",
    tag: "Featured",
  },
  {
    date: "Jun 13",
    day: "Friday",
    title: "Sunset Sessions",
    genre: "Chill House · Ambient",
    time: "6 PM – 10 PM",
    description:
      "An early evening of ambient chill house as the sun dips below the horizon. Cocktail hour specials and reserved terrace seating.",
    image: "/images/gallery/golden-hour-terrace.png",
    tag: "Happy Hour",
  },
  {
    date: "Jun 20",
    day: "Friday",
    title: "NOCTURNE: Vol. 4",
    genre: "Afro House · Nu-Disco",
    time: "10 PM – 3 AM",
    description:
      "The fourth edition of our monthly late-night series. Afro house rhythms and nu-disco grooves under open skies.",
    image: "/images/gallery/midnight-terrace-candles.png",
    tag: "Monthly series",
  },
  {
    date: "Jun 28",
    day: "Saturday",
    title: "Champagne & Skyline",
    genre: "Jazz · Lounge",
    time: "7 PM – 11 PM",
    description:
      "A refined evening of live jazz and curated champagne pairings. Limited seating — reservations strongly recommended.",
    image: "/images/gallery/champagne-rooftop-setup.png",
    tag: "Private dining",
  },
];

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <div className="relative h-72 overflow-hidden">
          <Image
            src="/images/gallery/twilight-coastal-skyline.png"
            alt="Nightfall Terrace events"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 to-[#0a0e1a]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-[#d4a574]">
              What's on
            </p>
            <h1 className="nt-display text-5xl font-light italic text-[#f0ece4] sm:text-6xl">
              Upcoming Events
            </h1>
          </div>
        </div>

        {/* Events list */}
        <section className="nt-section">
          <div className="space-y-px bg-[#1e2d40]">
            {events.map((ev) => (
              <div
                key={ev.title}
                className="group grid gap-0 bg-[#0a0e1a] hover:bg-[#0d1526] transition-colors md:grid-cols-[1fr_2fr]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[220px]">
                  <Image
                    src={ev.image}
                    alt={ev.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#0a0e1a]/30" />
                  {ev.tag && (
                    <span className="absolute top-4 left-4 border border-[#d4a574]/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#d4a574] bg-[#0a0e1a]/70">
                      {ev.tag}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">{ev.day}</p>
                    <span className="h-px w-4 bg-[#1e2d40]" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4a574]">{ev.date}</p>
                  </div>
                  <h2 className="nt-display text-3xl font-light italic text-[#f0ece4] sm:text-4xl">
                    {ev.title}
                  </h2>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4]">{ev.genre}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[#8b9bb4]">{ev.description}</p>
                  <div className="mt-6 flex items-center gap-6">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#4a5872]">{ev.time}</span>
                    <Link
                      href="/#reservation"
                      className="text-[11px] uppercase tracking-[0.16em] text-[#d4a574] hover:gap-4 flex items-center gap-2 transition-all"
                    >
                      Reserve a table
                      <span className="h-px w-5 bg-current transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center space-y-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#8b9bb4]">
              For private events &amp; bookings
            </p>
            <h3 className="nt-display text-3xl font-light italic text-[#f0ece4]">
              Host your night here
            </h3>
            <p className="text-sm text-[#8b9bb4] max-w-md mx-auto">
              Planning something special? We offer exclusive buyouts, custom menus, and full rooftop takeovers.
            </p>
            <Link
              href="/#reservation"
              className="mt-4 inline-flex items-center gap-3 border border-[#d4a574] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
