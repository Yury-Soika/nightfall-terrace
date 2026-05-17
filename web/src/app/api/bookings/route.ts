import { NextRequest, NextResponse } from "next/server";
import { store, uid, randomCode } from "@/lib/mock-store";

export async function POST(req: NextRequest) {
  const { date, startTime, tableId, partySize, guestName, guestEmail } =
    await req.json();

  const table = store.tables.find((t) => t.id === tableId);
  if (!table) {
    return NextResponse.json({ message: "Table not found" }, { status: 404 });
  }

  const slot = store.slots.find((s) => s.startTime === startTime);
  if (!slot) {
    return NextResponse.json({ message: "Slot not found" }, { status: 404 });
  }

  // Check for duplicate booking
  const conflict = store.bookings.find(
    (b) =>
      b.tableId === tableId &&
      b.slotId === slot.id &&
      b.serviceDate === date &&
      (b.status === "pending" || b.status === "confirmed"),
  );
  if (conflict) {
    return NextResponse.json({ message: "Table already booked" }, { status: 409 });
  }

  const booking = {
    id: uid(),
    bookingCode: randomCode(),
    tableId,
    slotId: slot.id,
    serviceDate: date,
    guestName,
    guestEmail,
    partySize,
    status: "pending" as const,
    minSpendCents: table.minSpendCents,
  };

  store.bookings.push(booking);

  return NextResponse.json({
    id: booking.id,
    bookingCode: booking.bookingCode,
    table: { name: table.name },
    slot: { startTime: slot.startTime, endTime: slot.endTime },
  });
}
