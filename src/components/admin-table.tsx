import { lifecycleLabels } from "@/lib/config";
import { formatScore } from "@/lib/utils";
import type { TrendCluster } from "@/types/trend";

export function AdminTable({ items }: { items: TrendCluster[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
        <thead className="bg-white/5 text-slate-400">
          <tr>
            <th className="px-4 py-3">趋势词</th>
            <th className="px-4 py-3">分类</th>
            <th className="px-4 py-3">状态</th>
            <th className="px-4 py-3">生命周期</th>
            <th className="px-4 py-3">趋势分</th>
            <th className="px-4 py-3">商业化</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-white">{item.primaryTermKo}</p>
                  <p className="text-xs text-slate-400">{item.zhExplanation}</p>
                </div>
              </td>
              <td className="px-4 py-3">{item.primaryCategory}</td>
              <td className="px-4 py-3">{item.reviewStatus}</td>
              <td className="px-4 py-3">{lifecycleLabels[item.lifecycle]}</td>
              <td className="px-4 py-3">{formatScore(item.trendScore)}</td>
              <td className="px-4 py-3">{formatScore(item.commercialPotentialScore)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

