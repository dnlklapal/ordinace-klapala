import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_KEY = process.env.TOOLS_API_KEY;

export async function GET(req: Request) {
  // kontrola API klíče
  if (API_KEY && new Headers(req.headers).get("x-api-key") !== API_KEY) {
    console.log("[TOOLS] faq UNAUTHORIZED");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[TOOLS] faq HIT");

  const items = [
    { title: "Preventivní prohlídka", answer: "cca 30 minut, hradí pojišťovna" },
    { title: "Plomba", answer: "od ~1500 Kč dle rozsahu" },
    { title: "Registrace nového pacienta", answer: "jméno, adresa, telefon, potvrzení přes SMS" },
    { title: "První návštěva", answer: "úvodní vyšetření + RTG, cca 45 min" },
    { title: "Parkování", answer: "naproti u pošty; přijeďte prosím o pár minut dříve" }
  ];

  console.log("[TOOLS] faq RESPOND", items.length);
  return NextResponse.json({ items });
}
