import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/mock-store";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const booking = store.bookings.find((b) => b.id === id);
  if (!booking) return NextResponse.json({ message: "Not found" }, { status: 404 });
  booking.status = "confirmed";
  return NextResponse.json(booking);
}
