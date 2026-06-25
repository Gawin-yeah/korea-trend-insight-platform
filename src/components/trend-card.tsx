import Link from "next/link";
import { lifecycleLabels, platformLabels } from "@/lib/config";
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
    <Link
      href={`/trends/${trend.slug}`}
      className={cn(
        "group rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/50 hover:bg-white/[0.08]",
        compact ? "min-h-[170px]" : "min-h-[240px]"
      )}
    >
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
  );
}
