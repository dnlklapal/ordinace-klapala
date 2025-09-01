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
