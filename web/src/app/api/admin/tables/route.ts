import { NextRequest, NextResponse } from "next/server";
import { store, uid } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json(store.tables);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const table = {
    id: uid(),
    name: body.name,
    capacity: body.capacity ?? 4,
    type: body.type ?? "table",
    minSpendCents: body.minSpendCents ?? 0,
    active: body.active ?? true,
  };
  store.tables.push(table);
  return NextResponse.json(table, { status: 201 });
}
