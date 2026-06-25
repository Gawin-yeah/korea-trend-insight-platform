import { platformLabels } from "@/lib/config";
import type { EvidenceRecord } from "@/types/trend";

export function EvidenceTable({ items }: { items: EvidenceRecord[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
        <thead className="bg-white/5 text-slate-400">
          <tr>
            <th className="px-4 py-3">证据</th>
            <th className="px-4 py-3">平台</th>
            <th className="px-4 py-3">提交人</th>
            <th className="px-4 py-3">强度</th>
            <th className="px-4 py-3">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-white">{item.headline}</p>
                  <p className="text-xs text-slate-400">{item.excerpt}</p>
                </div>
              </td>
              <td className="px-4 py-3">{platformLabels[item.sourcePlatform]}</td>
              <td className="px-4 py-3">{item.submitter}</td>
              <td className="px-4 py-3">{item.proofStrength.toFixed(2)}</td>
              <td className="px-4 py-3">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

