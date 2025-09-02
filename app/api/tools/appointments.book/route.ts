import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = 'nodejs';

const API_KEY = process.env.TOOLS_API_KEY;

export async function POST(req: Request) {
  // API key check, if set
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse request body safely
  const { name, datetime, type } = await req.json().catch(() => ({}));

  // Field validation
  if (!name || !datetime || !type) {
    return NextResponse.json({ ok: false, note: "Missing fields" }, { status: 400 });
  }

  // Generate bookingId
  const bookingId = crypto.randomUUID?.() || ("demo-" + Date.now());
  console.log("[TOOLS] appointments.book HIT", { name, datetime, type });
  console.log("[TOOLS] appointments.book RESPOND", bookingId);

  return NextResponse.json({ ok: true, bookingId, note: "Booked" });
}
