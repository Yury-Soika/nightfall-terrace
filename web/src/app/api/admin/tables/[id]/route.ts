import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/mock-store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = store.tables.findIndex((t) => t.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const body = await req.json();
  store.tables[idx] = { ...store.tables[idx], ...body };
  return NextResponse.json(store.tables[idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = store.tables.findIndex((t) => t.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const [removed] = store.tables.splice(idx, 1);
  return NextResponse.json(removed);
}
