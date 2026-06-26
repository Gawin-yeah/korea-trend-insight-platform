import { cn } from "@/lib/utils";
import Link from "next/link";
import type { SourceCapability } from "@/types/trend";

const statusStyles = {
  ready: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  config_needed: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  planned: "border-slate-300/20 bg-white/5 text-slate-200"
} as const;

export function SourceStatusCard({ source }: { source: SourceCapability }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
            {source.accessModel}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{source.displayName}</h3>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs",
            statusStyles[source.status]
          )}
        >
          {source.status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{source.legalBoundary}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{source.notes}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-white/10 px-3 py-1">
          采集 {source.supportsIngestion ? "yes" : "no"}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          搜索 {source.supportsKeywordSearch ? "yes" : "no"}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          评论 {source.supportsComments ? "yes" : "no"}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1">
          指标 {source.supportsMetrics ? "yes" : "no"}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Required Env</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {source.requiredEnv.length ? (
            source.requiredEnv.map((key) => (
              <span
                key={key}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  source.availableEnv.includes(key)
                    ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                    : "border-white/10 text-slate-300"
                )}
              >
                {key}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              无
            </span>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {source.docsUrl ? (
          <a
            href={source.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] px-4 py-2 text-sm text-cyan-100"
          >
            查看官方文档
          </a>
        ) : null}
        <Link
          href="/admin/sources"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
        >
          前往数据源配置
        </Link>
      </div>
    </div>
  );
}
