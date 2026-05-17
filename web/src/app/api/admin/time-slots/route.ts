import { NextRequest, NextResponse } from "next/server";
import { store, uid } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json(store.slots);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slot = {
    id: uid(),
    startTime: body.startTime,
    endTime: body.endTime,
    active: body.active ?? true,
  };
  store.slots.push(slot);
  return NextResponse.json(slot, { status: 201 });
}
