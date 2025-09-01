import { NextResponse } from "next/server";
const API_KEY = process.env.TOOLS_API_KEY;

const MOCK = [
  { id: "p1", name: "Jan Novák", phone: "+420777000111", lastVisit: "2025-05-16T09:00:00.000Z" },
  { id: "p2", name: "Eva Dvořáková", phone: "+420777000222", lastVisit: "2025-06-10T13:30:00.000Z" }
];

export async function POST(req: Request) {
  if (API_KEY && req.headers.get("x-api-key") !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { q } = await req.json();
  const search = (q || "").toLowerCase();

  const patients = MOCK.filter(
    (p) => p.name.toLowerCase().includes(search) || p.phone.includes(search)
  );

  return NextResponse.json({ patients });
}
