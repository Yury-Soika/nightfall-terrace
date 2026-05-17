import { NextRequest, NextResponse } from "next/server";
import { MOCK_ADMIN, MOCK_TOKEN } from "@/lib/mock-store";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
    return NextResponse.json({ accessToken: MOCK_TOKEN });
  }
  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
