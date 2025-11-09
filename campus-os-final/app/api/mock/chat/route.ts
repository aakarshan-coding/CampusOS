import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const message = String(body?.message ?? "").trim();
  const reply = message
    ? `I hear you: “${message}”. Try breaking tasks into small chunks and focus for 25 minutes.`
    : "Could you share more details? I can help plan your study blocks.";
  return NextResponse.json({ reply });
}