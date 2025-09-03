import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
const API_KEY = process.env.TOOLS_API_KEY;
const filePath = join(process.cwd(), "settings.json");

export async function GET(req: Request) {
  if (API_KEY && new Headers(req.headers).get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const settings = JSON.parse(readFileSync(filePath, "utf-8"));
    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json({ error: "Settings file missing or invalid", details: e?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (API_KEY && new Headers(req.headers).get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    writeFileSync(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to save settings", details: e?.message }, { status: 500 });
  }
}
