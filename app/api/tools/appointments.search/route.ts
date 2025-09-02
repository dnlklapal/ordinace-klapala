import { NextResponse } from "next/server";
const API_KEY = process.env.TOOLS_API_KEY;

export async function POST(req: Request) {
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const slot1 = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const slot2 = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  return NextResponse.json({ slots: [slot1, slot2] });
}

import { NextResponse } from "next/server";

export const runtime = 'nodejs'; // zajistí, že se logy ukážou v runtime logu

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0];
  console.log("[TOOLS] appointments.search HIT from", ip);

  // tvůj původní kód – zatím jen fake sloty:
  const slots = ["2025-09-02T09:00:00.000Z", "2025-09-03T08:30:00.000Z"];

  console.log("[TOOLS] appointments.search RESPOND", slots);
  return NextResponse.json({ slots });
}

import { NextResponse } from "next/server";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  console.log("[TOOLS] appointments.search HIT");
  const slots = ["2025-09-02T09:00:00.000Z","2025-09-03T08:30:00.000Z"];
  console.log("[TOOLS] appointments.search RESPOND", slots);
  return NextResponse.json({ slots });
}
