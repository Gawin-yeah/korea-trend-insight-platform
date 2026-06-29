import Link from "next/link";
import {
  lifecycleLabels,
  platformAbbreviations,
  platformLabels,
  sourceTypeLabels
} from "@/lib/config";
import { cn, formatScore } from "@/lib/utils";
import type { TrendCluster } from "@/types/trend";

export function TrendCard({
  trend,
  compact = false
}: {
  trend: TrendCluster;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/50 hover:bg-white/[0.08]",
        compact ? "min-h-[170px]" : "min-h-[240px]"
      )}
    >
      <Link href={`/trends/${trend.slug}`} className="group block">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              {trend.primaryCategory}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{trend.primaryTermKo}</h3>
            <p className="mt-1 text-sm text-slate-400">{trend.romanization}</p>
          </div>
          <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            Score {formatScore(trend.trendScore)}
          </div>
        </div>
        <p
          className="mt-4 text-sm leading-6 text-slate-200"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {trend.zhExplanation}
        </p>
        <p
          className="mt-2 text-xs leading-6 text-slate-400"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          EN: {trend.enExplanation}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-white/10 px-3 py-1">
            {lifecycleLabels[trend.lifecycle]}
          </span>
          {trend.sourcePlatforms.slice(0, 2).map((platform) => (
            <span key={platform} className="rounded-full border border-white/10 px-3 py-1">
              {platformLabels[platform]}
            </span>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div>
            <p className="text-slate-500">商业化潜力</p>
            <p className="mt-1 text-base text-white">
              {formatScore(trend.commercialPotentialScore)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">证据完整度</p>
            <p className="mt-1 text-base text-white">
              {formatScore(trend.evidenceCompletenessScore)}
            </p>
          </div>
        </div>
      </Link>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            已收集 {trend.collectedSourceCount} 条来源线索
          </p>
          {trend.topSourceLinks?.length ? (
            <div className="grid gap-2">
              {trend.topSourceLinks.map((item) => (
                <a
                  key={`${item.sourceType}-${item.id}`}
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-200"
                >
                  <span className="inline-flex min-w-8 justify-center rounded-full border border-white/10 px-2 py-1 text-[11px] text-cyan-100">
                    {platformAbbreviations[item.sourcePlatform]}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-300">
                    {sourceTypeLabels[item.sourceType]}
                  </span>
                  <span
                    className="max-w-[240px] truncate text-slate-200"
                    title={item.title}
                  >
                    {item.title}
                  </span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/trends/${trend.slug}`}
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
          >
            查看详情
          </Link>
          <Link
            href={`/trends/${trend.slug}#source-links`}
            className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] px-4 py-2 text-sm text-cyan-100"
          >
            来源链接
          </Link>
        </div>
      </div>
    </div>
  );
}
