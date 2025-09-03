import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const API_KEY = process.env.TOOLS_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: Request) {
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("data")
      .eq("id", "main")
      .single();
    if (error) throw error;
    return NextResponse.json(data.data);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to load settings", details: e?.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { error } = await supabase
      .from("settings")
      .update({ data: body })
      .eq("id", "main");
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to save settings", details: e?.message }, { status: 500 });
  }
}
