import { categoryLabels } from "@/lib/config";
import type { Category, TrendCluster } from "@/types/trend";
import { TrendCard } from "./trend-card";

export function BoardSection({
  category,
  items
}: {
  category: Category;
  items: TrendCluster[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Vertical</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {categoryLabels[category]}
          </h2>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((trend) => (
          <TrendCard key={trend.id} trend={trend} compact />
        ))}
      </div>
    </section>
  );
}

