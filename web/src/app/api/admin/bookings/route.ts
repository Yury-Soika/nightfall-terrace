import { NextResponse } from "next/server";
import { store } from "@/lib/mock-store";

export async function GET() {
  const bookings = store.bookings.map((b) => {
    const table = store.tables.find((t) => t.id === b.tableId);
    const slot = store.slots.find((s) => s.id === b.slotId);
    return {
      id: b.id,
      bookingCode: b.bookingCode,
      status: b.status,
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      partySize: b.partySize,
      serviceDate: b.serviceDate,
      table: { name: table?.name ?? "Unknown" },
      slot: {
        date: "1970-01-01",
        startTime: slot?.startTime ?? "",
        endTime: slot?.endTime ?? "",
      },
    };
  });

  return NextResponse.json(bookings);
}
