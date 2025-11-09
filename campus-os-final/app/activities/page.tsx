"use client";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { PlanPreviewModal } from "@/components/plan-preview-modal";
import { useUIStore } from "@/stores/ui";
import { motion } from "framer-motion";
import { Activity } from "@/lib/types";

export default function ActivitiesPage() {
  const { data, isLoading, isError } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch("/api/mock/activities");
      if (!res.ok) throw new Error("Failed to load activities");
      return (await res.json()) as Activity[];
    },
  });

  const open = useUIStore((s) => s.planPreviewOpen);
  const setOpen = useUIStore((s) => s.setPlanPreviewOpen);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Recent Activities"
        actions={<Button onClick={() => setOpen(true)} aria-label="Auto-Plan My Week">Auto-Plan My Week</Button>}
      />
      {isLoading && <p className="text-sm">Loading...</p>}
      {isError && <p className="text-sm text-red-600">Failed to load activities.</p>}
      {data && data.length === 0 && (
        <p className="text-sm text-neutral-600">No recent activity yet — come back after your first study session!</p>
      )}
      <div className="space-y-3">
        {data?.map((a, i) => (
          <ActivityCard key={a.id} activity={a} index={i} />
        ))}
      </div>
      <PlanPreviewModal open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}