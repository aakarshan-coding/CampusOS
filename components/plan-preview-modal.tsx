"use client";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlanSession } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export function PlanPreviewModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data, isLoading, isError } = useQuery<{ sessions: PlanSession[] }>({
    queryKey: ["plan-preview"],
    queryFn: async () => {
      const res = await fetch("/api/mock/planPreview");
      if (!res.ok) throw new Error("Failed to load preview");
      const sessions = (await res.json()) as PlanSession[];
      return { sessions };
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="plan-preview-description">
        <DialogHeader>
          <h2 className="text-lg font-semibold">Auto-Plan Preview</h2>
          <p id="plan-preview-description" className="text-sm text-neutral-600">
            Review your suggested study sessions for next week.
          </p>
        </DialogHeader>
        <div className="space-y-2">
          {isLoading && <p className="text-sm">Loading plan...</p>}
          {isError && <p className="text-sm text-red-600">Failed to load plan.</p>}
          {data?.sessions?.length ? (
            <div className="space-y-2">
              {data.sessions.map((s, i) => (
                <motion.div key={`${s.title}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }} className="rounded-2xl border border-neutral-200 p-3">
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-neutral-600">
                    {new Date(s.start).toLocaleString()} – {new Date(s.end).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="secondary" aria-label="Close plan preview">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}