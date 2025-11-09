"use client";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { StackedBar } from "@/components/stacked-bar";
import { WeeklyReport } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function ReportPage() {
  const { data } = useQuery<WeeklyReport>({
    queryKey: ["weekly-report"],
    queryFn: async () => {
      const res = await fetch("/api/mock/report");
      if (!res.ok) throw new Error("Failed to load report");
      return (await res.json()) as WeeklyReport;
    },
  });

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  const range = `${start.toLocaleString(undefined, { month: "short", day: "numeric" })}–${now.toLocaleString(undefined, { month: "short", day: "numeric" })}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Weekly Report" subtitle={range} />
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Study Hours" value={`${data?.kpis.studyHours ?? 0}h`} />
        <KpiCard label="Assignments Completed" value={`${data?.kpis.assignmentsCompleted ?? 0}`} />
        <KpiCard label="Consistency Streak" value={`${data?.kpis.streakDays ?? 0} days`} />
      </div>
      <div className="mt-6">
        <StackedBar data={data?.timeByCourse ?? []} />
      </div>
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-medium">Highlights</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
          {(data?.highlights ?? ["You focused most on CSCE 312.", "You left 1 assignment for the last 24 hours.", "Best study window: 7–9 PM."]).map((h, i) => (
            <li key={`h-${i}`}>{h}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}