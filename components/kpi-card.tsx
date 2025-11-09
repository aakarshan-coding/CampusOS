import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-neutral-600">{label}</p>
      </CardContent>
    </Card>
  );
}