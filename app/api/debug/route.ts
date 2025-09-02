// app/api/debug/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_KEY = process.env.TOOLS_API_KEY;

export async function GET(req: Request) {
  const timestamp = new Date().toISOString();
  
  console.log("=== DEBUG ENDPOINT HIT ===");
  console.log("Timestamp:", timestamp);
  
  const debugInfo = {
    timestamp,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_KEY_SET: !!API_KEY,
      API_KEY_LENGTH: API_KEY?.length || 0
    },
    runtime: "nodejs",
    nextjs: true
  };
  
  console.log("Debug info:", JSON.stringify(debugInfo, null, 2));
  console.log("=== DEBUG ENDPOINT END ===");
  
  return NextResponse.json(debugInfo);
}

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  
  console.log("=== DEBUG ENDPOINT POST ===");
  
  let body = null;
  try {
    body = await req.json();
  } catch (e) {
    body = { error: "Could not parse JSON" };
  }
  
  const debugInfo = {
    timestamp,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    body,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      API_KEY_SET: !!API_KEY,
    }
  };
  
  console.log("POST Debug info:", JSON.stringify(debugInfo, null, 2));
  
  return NextResponse.json(debugInfo);
}
