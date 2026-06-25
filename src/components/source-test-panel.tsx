import type { SourceTestResult } from "@/lib/sources/testing";
import { cn } from "@/lib/utils";

const statusStyles = {
  ok: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  error: "border-rose-300/30 bg-rose-300/10 text-rose-100",
  skipped: "border-slate-300/20 bg-white/5 text-slate-200",
  ready: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  config_needed: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  planned: "border-slate-300/20 bg-white/5 text-slate-200"
} as const;

export function SourceTestPanel({ results }: { results: SourceTestResult[] }) {
  return (
    <div className="grid gap-4">
      {results.map((result) => (
        <div key={result.platform} className="rounded-[24px] border border-white/10 bg-black/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">{result.platform}</p>
              <p className="mt-1 text-sm text-slate-400">{result.message}</p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                statusStyles[result.status]
              )}
            >
              {result.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-300">fetchedCount: {result.fetchedCount}</p>
          {result.sampleTerms.length ? (
            <p className="mt-2 text-sm text-slate-300">
              sampleTerms: {result.sampleTerms.join(", ")}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

