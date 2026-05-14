import { apiGet } from "@/lib/api";

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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="text-sm text-zinc-400">Booking confirmed</div>
          <h1 className="mt-1 text-3xl font-semibold">{booking.venue.name}</h1>
          <div className="mt-4 grid gap-2 text-zinc-200">
            <div>
              <span className="text-zinc-400">Code:</span>{" "}
              <span className="font-mono">{booking.bookingCode}</span>
            </div>
            <div>
              <span className="text-zinc-400">When:</span>{" "}
              {booking.slot.date} {booking.slot.startTime}–{booking.slot.endTime}
            </div>
            <div>
              <span className="text-zinc-400">Table:</span> {booking.table.name}
            </div>
            <div>
              <span className="text-zinc-400">Party size:</span> {booking.partySize}
            </div>
            <div>
              <span className="text-zinc-400">Guest:</span> {booking.guestName} (
              {booking.guestEmail})
            </div>
            <div>
              <span className="text-zinc-400">Status:</span> {booking.status}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

