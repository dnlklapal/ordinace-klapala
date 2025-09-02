import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_KEY = process.env.TOOLS_API_KEY;

export async function POST(req: Request) {
  // ověření API key
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    console.log("[TOOLS] appointments.search UNAUTHORIZED");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0];
  console.log("[TOOLS] appointments.search HIT from", ip);

  // vygeneruj testovací sloty
  const now = new Date();
  const slot1 = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const slot2 = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const slots = [slot1, slot2];

  console.log("[TOOLS] appointments.search RESPOND", slots);
  return NextResponse.json({ slots });
}
