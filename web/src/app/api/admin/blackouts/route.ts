import { NextRequest, NextResponse } from "next/server";
import { store, uid } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json(store.blackouts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const blackout = {
    id: uid(),
    date: body.date,
    startTime: body.startTime ?? null,
    endTime: body.endTime ?? null,
    reason: body.reason ?? null,
  };
  store.blackouts.push(blackout);
  return NextResponse.json(blackout, { status: 201 });
}
