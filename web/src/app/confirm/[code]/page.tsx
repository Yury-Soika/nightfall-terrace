import { apiGet } from "@/lib/api";
import Link from "next/link";

type Booking = {
  bookingCode: string;
  status: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
  table: { name: string };
  slot: { date: string; startTime: string; endTime: string };
  venue: { name: string };
};

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const booking = await apiGet<Booking>(`/bookings/${code}`);

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Booking confirmed</p>
        <h1 className="nt-display mt-3 text-4xl font-light italic text-[#f0ece4]">{booking.venue.name}</h1>
        <p className="mt-2 text-sm text-[#8b9bb4]">Your reservation is confirmed. See you soon.</p>

        <div className="mt-8 border border-[#1e2d40] divide-y divide-[#1e2d40]">
          {[
            { label: "Reference", value: booking.bookingCode, mono: true },
            { label: "Date", value: `${booking.slot.date} · ${booking.slot.startTime}–${booking.slot.endTime}` },
            { label: "Table", value: booking.table.name },
            { label: "Party size", value: String(booking.partySize) },
            { label: "Guest", value: `${booking.guestName} · ${booking.guestEmail}` },
            { label: "Status", value: booking.status },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex justify-between px-5 py-4 text-sm">
              <span className="text-[#8b9bb4]">{label}</span>
              <span className={mono ? "font-mono text-[#f0ece4]" : "text-[#f0ece4]"}>{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#d4a574] hover:gap-4 transition-all"
          >
            ← Back to Nightfall Terrace
          </Link>
        </div>
      </div>
    </main>
  );
}
