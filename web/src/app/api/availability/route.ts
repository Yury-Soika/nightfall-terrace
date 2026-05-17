import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/mock-store";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date") ?? "";
  const partySize = parseInt(searchParams.get("partySize") ?? "1", 10);

  // Check full-day blackout
  const fullBlackout = store.blackouts.find(
    (b) => b.date === date && !b.startTime && !b.endTime,
  );
  if (fullBlackout) {
    return NextResponse.json({
      date,
      blackout: true,
      reason: fullBlackout.reason,
      slots: [],
      tables: [],
    });
  }

  const activeSlots = store.slots.filter((s) => s.active);

  // Filter slots blocked by partial blackouts
  const availableSlots = activeSlots.filter((slot) => {
    return !store.blackouts.some(
      (b) =>
        b.date === date &&
        b.startTime &&
        b.endTime &&
        b.startTime <= slot.startTime &&
        b.endTime >= slot.endTime,
    );
  });

  // Tables that fit the party size
  const eligibleTables = store.tables.filter(
    (t) => t.active && t.capacity >= partySize,
  );

  // Build availability per table per slot
  const tables = eligibleTables.map((t) => ({
    id: t.id,
    name: t.name,
    capacity: t.capacity,
    type: t.type,
    minSpendCents: t.minSpendCents,
    availability: availableSlots.map((slot) => {
      const soldOut = store.bookings.some(
        (b) =>
          b.tableId === t.id &&
          b.slotId === slot.id &&
          b.serviceDate === date &&
          (b.status === "pending" || b.status === "confirmed"),
      );
      return { slotId: slot.id, soldOut };
    }),
  }));

  return NextResponse.json({
    date,
    blackout: false,
    slots: availableSlots,
    tables,
  });
}
