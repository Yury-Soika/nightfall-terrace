import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/mock-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const booking = store.bookings.find((b) => b.bookingCode === code);
  if (!booking) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const table = store.tables.find((t) => t.id === booking.tableId);
  const slot = store.slots.find((s) => s.id === booking.slotId);

  return NextResponse.json({
    ...booking,
    table: { name: table?.name ?? "Unknown" },
    slot: { startTime: slot?.startTime ?? "", endTime: slot?.endTime ?? "", date: "1970-01-01" },
  });
}
