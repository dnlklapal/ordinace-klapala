import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_KEY = process.env.TOOLS_API_KEY;

export async function POST(req: Request) {
  // Základní diagnostické informace
  const timestamp = new Date().toISOString();
  const headers = Object.fromEntries(req.headers.entries());
  const url = req.url;
  
  console.log("=== APPOINTMENTS.SEARCH DEBUG START ===");
  console.log("Timestamp:", timestamp);
  console.log("URL:", url);
  console.log("Method:", req.method);
  console.log("Headers:", JSON.stringify(headers, null, 2));
  
  // Kontrola API klíče s detailním logováním
  const providedKey = req.headers.get("x-api-key");
  const expectedKey = API_KEY;
  
  console.log("API Key Check:");
  console.log("- Expected key exists:", !!expectedKey);
  console.log("- Expected key value:", expectedKey ? "[HIDDEN]" : "NOT_SET");
  console.log("- Provided key exists:", !!providedKey);
  console.log("- Provided key value:", providedKey ? "[HIDDEN]" : "NOT_PROVIDED");
  console.log("- Keys match:", providedKey === expectedKey);
  
  if (API_KEY && providedKey !== API_KEY) {
    console.log("❌ AUTHENTICATION FAILED");
    console.log("=== APPOINTMENTS.SEARCH DEBUG END ===");
    return NextResponse.json({ 
      error: "Unauthorized",
      debug: {
        timestamp,
        keyProvided: !!providedKey,
        keyExpected: !!expectedKey
      }
    }, { status: 401 });
  }

  // Získání IP adresy
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
  
  console.log("Request Info:");
  console.log("- IP:", ip);
  console.log("- X-Forwarded-For:", forwardedFor);
  console.log("- X-Real-IP:", realIp);

  // Parsování body (pokud existuje)
  let body = null;
  try {
    body = await req.json();
    console.log("Request Body:", JSON.stringify(body, null, 2));
  } catch (e) {
    console.log("No JSON body or parsing failed:", e);
  }

  // Generování testovacích slotů
  const now = new Date();
  const slot1 = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const slot2 = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const slot3 = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

  const slots = [slot1, slot2, slot3];
  
  console.log("Generated Slots:");
  slots.forEach((slot, i) => {
    console.log(`- Slot ${i + 1}:`, slot);
  });

  const response = {
    slots,
    debug: {
      timestamp,
      ip,
      authenticated: true,
      slotsCount: slots.length
    }
  };

  console.log("Response:", JSON.stringify(response, null, 2));
  console.log("✅ SUCCESS - Returning slots");
  console.log("=== APPOINTMENTS.SEARCH DEBUG END ===");

  return NextResponse.json(response);
}

// Přidáme i GET endpoint pro testování
export async function GET(req: Request) {
  console.log("=== GET REQUEST TO APPOINTMENTS.SEARCH ===");
  console.log("This should be POST, not GET");
  return NextResponse.json({
    error: "Method not allowed - use POST",
    method: req.method,
    url: req.url
  }, { status: 405 });
}
