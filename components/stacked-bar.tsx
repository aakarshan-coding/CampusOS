export function StackedBar({ data }: { data: { course: string; hours: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.hours, 0) || 1;
  return (
    <div className="rounded-2xl border border-neutral-200 p-3">
      <div className="flex h-6 w-full overflow-hidden rounded-full">
        {data.map((d, i) => (
          <div
            key={d.course}
            style={{ width: `${(d.hours / total) * 100}%` }}
            className={
              [
                "bg-neutral-900",
                "bg-neutral-700",
                "bg-neutral-500",
                "bg-neutral-300",
              ][i % 4]
            }
            title={`${d.course}: ${d.hours}h`}
            aria-label={`${d.course}: ${d.hours} hours`}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-700 sm:grid-cols-3">
        {data.map((d) => (
          <div key={`legend-${d.course}`} className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded" aria-hidden="true" />
            <span>
              {d.course} – {d.hours}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}