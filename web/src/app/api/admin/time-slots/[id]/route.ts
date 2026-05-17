import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/mock-store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = store.slots.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const [removed] = store.slots.splice(idx, 1);
  return NextResponse.json(removed);
}
