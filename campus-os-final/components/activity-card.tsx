import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/lib/types";
import { motion } from "framer-motion";

const emojiByType: Record<Activity["type"], string> = {
  assignment: "🧪",
  class: "📐",
  study: "💻",
  note: "📝",
};

export function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: index * 0.03 }}>
      <Card>
        <CardContent className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg" aria-hidden="true">{emojiByType[activity.type]}</span>
            <div>
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-neutral-600">
                {new Date(activity.at).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          <Badge variant="secondary" aria-label={`Type: ${activity.type}`}>{activity.type}</Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}