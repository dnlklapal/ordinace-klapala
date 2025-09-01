import { NextResponse } from "next/server";
import crypto from "crypto";
const API_KEY = process.env.TOOLS_API_KEY;

export async function POST(req: Request) {
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, datetime, type } = await req.json();

  if (!name || !datetime || !type) {
    return NextResponse.json({ ok: false, note: "Missing fields" }, { status: 400 });
  }

  const bookingId = crypto.randomUUID();
  return NextResponse.json({ ok: true, bookingId, note: "Booked" });
}
