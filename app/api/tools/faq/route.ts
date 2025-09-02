import { NextResponse } from "next/server";
const API_KEY = process.env.TOOLS_API_KEY;

export async function GET(req: Request) {
  if (API_KEY && new Headers(req.headers).get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    items: [
      { title: "Preventivní prohlídka", answer: "cca 30 min, hradí pojišťovna" },
      { title: "Plomba", answer: "od ~1500 Kč dle rozsahu" },
      { title: "Registrace nového pacienta", answer: "jméno, adresa, telefon, potvrzení přes SMS" },
      { title: "První návštěva", answer: "úvodní vyšetření + RTG, cca 45 min" },
      { title: "Parkování", answer: "naproti u pošty; přijeďte prosím o pár minut dříve" }
    ]
  });
}

import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET() {
  console.log("[TOOLS] faq HIT");

  const items = [
    { title: "Preventivní prohlídka", answer: "cca 30 minut, hradí pojišťovna" },
    { title: "Parkování", answer: "naproti u pošty" }
  ];

  console.log("[TOOLS] faq RESPOND", items);
  return NextResponse.json({ items });
}

import { NextResponse } from "next/server";
export const runtime = 'nodejs';

export async function GET() {
  console.log("[TOOLS] faq HIT");
  const items = [
    { title:"Preventivní prohlídka", answer:"cca 30 minut, hradí pojišťovna" },
    { title:"Parkování", answer:"naproti u pošty" },
  ];
  console.log("[TOOLS] faq RESPOND", items.length);
  return NextResponse.json({ items });
}
