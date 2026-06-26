import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniLineChart } from "@/components/mini-line-chart";
import {
  lifecycleLabels,
  platformAbbreviations,
  platformLabels,
  sourceTypeLabels
} from "@/lib/config";
import { getTrendDetail } from "@/lib/repositories/trends";

export const dynamic = "force-dynamic";

export default async function TrendDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getTrendDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-cyan-200">
          返回 Dashboard
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
            {detail.primaryCategory}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{detail.primaryTermKo}</h1>
          <p className="mt-2 text-lg text-slate-300">{detail.romanization}</p>
          <p className="mt-6 text-lg leading-8 text-slate-100">{detail.zhExplanation}</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">{detail.enExplanation}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-slate-400">使用场景</p>
              <p className="mt-2 leading-7 text-white">{detail.usageContext}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-slate-400">情绪/语气</p>
              <p className="mt-2 leading-7 text-white">{detail.tone}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-slate-400">示例句</p>
              <p className="mt-2 leading-7 text-white">{detail.exampleSentenceKo}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{detail.exampleSentenceZh}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-slate-400">目标受众</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.targetAudience.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[30px] border border-cyan-300/20 bg-cyan-300/[0.08] p-5">
            <p className="text-sm text-cyan-100">趋势评分</p>
            <p className="mt-2 text-4xl font-semibold text-white">{detail.trendScore.toFixed(1)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
              <div>
                <p className="text-slate-400">商业化</p>
                <p className="mt-1 text-white">{detail.commercialPotentialScore.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-slate-400">证据完整度</p>
                <p className="mt-1 text-white">{detail.evidenceCompletenessScore.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-slate-400">生命周期</p>
                <p className="mt-1 text-white">{lifecycleLabels[detail.lifecycle]}</p>
              </div>
              <div>
                <p className="text-slate-400">风险等级</p>
                <p className="mt-1 text-white">{detail.riskLevel}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex flex-wrap gap-3">
                <a
                  href="#source-links"
                  className="inline-flex rounded-full border border-cyan-300/30 bg-slate-950/30 px-4 py-2 text-sm text-cyan-100"
                >
                  查看这条热点的全部来源链接
                </a>
                <a
                  href={`/api/export?format=json&slug=${detail.slug}&scope=source_links`}
                  className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
                >
                  导出链接 JSON
                </a>
                <a
                  href={`/api/export?format=csv&slug=${detail.slug}&scope=source_links`}
                  className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
                >
                  导出链接 CSV
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">近期热度曲线</p>
            <div className="mt-3">
              <MiniLineChart values={detail.metrics.map((item) => item.trendScore)} />
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">来源平台</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.sourcePlatforms.map((platform) => (
                <span key={platform} className="rounded-full border border-white/10 px-3 py-1">
                  {platformLabels[platform]}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-400">视觉风格标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.visualStyleTags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-400">公开信号数量 / 已补证据</p>
            <p className="mt-2 text-sm text-white">
              {detail.publicSignalCount} / {detail.evidenceCount}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">相关产品与品牌</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">related_products</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.relatedProducts.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">related_brands</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.relatedBrands.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">公开趋势信号</h2>
          <div className="mt-5 space-y-4">
            {detail.signals.map((signal) => (
              <a
                key={signal.id}
                href={signal.sourceUrl}
                className="block rounded-[24px] border border-white/10 bg-black/10 p-4"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {signal.signalTitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {platformLabels[signal.sourcePlatform]} · {signal.regionCode}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    置信度 {(signal.confidenceScore * 100).toFixed(0)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-200">{signal.summary}</p>
                {signal.observedValue ? (
                  <p className="mt-2 text-xs text-cyan-200">{signal.observedValue}</p>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="source-links"
        className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">原始链接清单</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              这里把这条热点对应的公开趋势信号、原始提及和人工证据全部拆开列出，方便你逐条点开核对。
            </p>
          </div>
          <div className="rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] px-4 py-2 text-sm text-cyan-100">
            共 {detail.sourceLinks.length} 条链接
          </div>
        </div>
        <div className="mt-5 grid gap-4">
          {detail.sourceLinks.map((item) => (
            <a
              key={`${item.sourceType}-${item.id}`}
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-[24px] border border-white/10 bg-black/10 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {platformLabels[item.sourcePlatform]} · {sourceTypeLabels[item.sourceType]} ·{" "}
                    {new Date(item.collectedAt).toLocaleString("zh-CN", {
                      hour12: false
                    })}
                  </p>
                  {item.subtitle ? (
                    <p className="mt-3 text-sm leading-7 text-slate-200">{item.subtitle}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-cyan-100">
                    {platformAbbreviations[item.sourcePlatform]}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {sourceTypeLabels[item.sourceType]}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-cyan-100">
                    打开原链接
                  </span>
                </div>
              </div>
              <p className="mt-3 break-all text-xs text-slate-500">{item.sourceUrl}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">人工补证据</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          这部分不是自动抓出来的，而是研究员为了让趋势可追溯、可解释，手工补进来的链接、截图、评论摘录和分析备注。
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {detail.evidences.map((evidence) => (
            <a
              key={evidence.id}
              href={evidence.sourceUrl}
              className="block rounded-[24px] border border-white/10 bg-black/10 p-4"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{evidence.headline}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {platformLabels[evidence.sourcePlatform]} · {evidence.submitter}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {evidence.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200">{evidence.excerpt}</p>
              {evidence.analystNote ? (
                <p className="mt-2 text-xs leading-6 text-cyan-200">{evidence.analystNote}</p>
              ) : null}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
