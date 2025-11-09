import { NextResponse } from "next/server";
import { Activity } from "@/lib/types";

export async function GET() {
  const now = new Date();
  const items: Activity[] = [
    { id: "a1", title: "Submitted Lab 5", at: new Date(now.getTime() - 3600_000).toISOString(), type: "assignment" },
    { id: "a2", title: "Viewed Lecture 7", at: new Date(now.getTime() - 7200_000).toISOString(), type: "class" },
    { id: "a3", title: "Study session: CSCE 312", at: new Date(now.getTime() - 10_800_000).toISOString(), type: "study" },
  ];
  return NextResponse.json(items);
}