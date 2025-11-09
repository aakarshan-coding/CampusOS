import { NextResponse } from "next/server";
import { PlanSession } from "@/lib/types";

export async function GET() {
  const start = new Date();
  const sessions: PlanSession[] = [
    { title: "CSCE 312 Problem Set", start: new Date(start.getTime() + 24 * 3600_000).toISOString(), end: new Date(start.getTime() + 24 * 3600_000 + 2 * 3600_000).toISOString(), source: "CSCE Lab 5" },
    { title: "Math 221 Review", start: new Date(start.getTime() + 48 * 3600_000).toISOString(), end: new Date(start.getTime() + 48 * 3600_000 + 1.5 * 3600_000).toISOString() },
    { title: "Chem 101 Reading", start: new Date(start.getTime() + 72 * 3600_000).toISOString(), end: new Date(start.getTime() + 72 * 3600_000 + 1 * 3600_000).toISOString() },
  ];
  return NextResponse.json(sessions);
}