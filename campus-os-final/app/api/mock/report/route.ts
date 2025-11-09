import { NextResponse } from "next/server";
import { WeeklyReport } from "@/lib/types";

export async function GET() {
  const payload: WeeklyReport = {
    kpis: { studyHours: 7.5, assignmentsCompleted: 4, streakDays: 3 },
    timeByCourse: [
      { course: "CSCE 312", hours: 3.5 },
      { course: "Math 221", hours: 2 },
      { course: "Chem 101", hours: 2 },
    ],
    highlights: [
      "You focused most on CSCE 312.",
      "You left 1 assignment for the last 24 hours.",
      "Best study window: 7–9 PM.",
    ],
  };
  return NextResponse.json(payload);
}