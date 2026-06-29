import { PublicTrendSiteCard } from "@/components/public-trend-site-card";
import { SourceStatusCard } from "@/components/source-status-card";
import { BoardSection } from "@/components/board-section";
import { TrendCard } from "@/components/trend-card";
import { categoryLabels, lifecycleLabels, platformLabels } from "@/lib/config";
import {
  getDashboardData,
  listPublicTrendSites,
  listSourceCapabilities
} from "@/lib/repositories/trends";
import { getSiteModeSummary, isStaticSite } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const sources = await listSourceCapabilities();
  const publicSites = await listPublicTrendSites();
  const siteMode = getSiteModeSummary();
  const staticSite = isStaticSite();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.06] p-7">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            Korea Local Trend Intelligence
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white lg:text-6xl">
            用公开趋势信号先发现，再用人工证据把韩流趋势讲清楚。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            平台默认中文界面，保留韩语原词、罗马音、来源站点、证据链接与分析师备注。重点板块覆盖美妆、拍照、修图、AI 玩法与服装趋势，支持先从 TikTok Creative Center、Google Trends、Naver DataLab、YouTube Charts 发现趋势。
          </p>
          <div className="mt-6 rounded-[24px] border border-amber-300/20 bg-amber-300/[0.08] p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-amber-300/30 px-3 py-1 text-xs text-amber-100">
                当前模式 · {siteMode.label}
              </span>
              <span className="text-sm text-amber-50/90">
                {siteMode.description}
              </span>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-300">
              English-ready: 首页卡片、后台列表和详情页都展示英文解释，方便非中文同事直接阅读。
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/[0.08] p-4">
              <p className="text-sm text-cyan-100">今日 Top 趋势</p>
              <p className="mt-2 text-3xl font-semibold text-white">{dashboard.top50.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">上升最快</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {dashboard.fastestRising[0]?.primaryTermKo ?? "-"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">公开信号站点</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {dashboard.publicSignalSummary.length}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">
                {staticSite ? "页面生成时间" : "数据更新时间"}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {new Date(dashboard.generatedAt).toLocaleString("zh-CN", {
                  hour12: false
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/5 p-7">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Lifecycle</p>
          <div className="mt-5 space-y-4">
            {dashboard.lifecycleSummary.map((item) => (
              <div
                key={item.lifecycle}
                className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/10 px-4 py-3"
              >
                <span className="text-slate-200">{lifecycleLabels[item.lifecycle]}</span>
                <span className="text-xl font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-cyan-200">
            Evidence Coverage
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {dashboard.evidenceCoverageSummary.map((item) => (
              <span
                key={item.bucket}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                {item.bucket} {item.count}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Top 50</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">今日韩国热词 Top 榜</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {dashboard.top50.slice(0, 6).map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8">
        {(Object.keys(dashboard.categoryBoards) as Array<keyof typeof dashboard.categoryBoards>)
          .filter((category) => category !== "other")
          .map((category) => (
            <BoardSection
              key={category}
              category={category}
              items={dashboard.categoryBoards[category]}
            />
          ))}
      </section>

      <section className="mt-12 rounded-[36px] border border-white/10 bg-white/5 p-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
              Signal Layer
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              公开趋势站点发现层
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          这些站点适合帮助我们合法发现韩国正在升温的话题，但不直接替代原始社交证据，所以平台会把它们和人工补证据分开展示。
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {publicSites.map((site) => (
            <PublicTrendSiteCard key={site.platform} site={site} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[36px] border border-white/10 bg-white/5 p-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
              Public Signal Mix
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              公开信号来源分布
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {dashboard.publicSignalSummary.map((item) => (
            <div key={item.platform} className="rounded-[28px] border border-white/10 bg-black/10 p-5">
              <h3 className="text-lg font-semibold text-white">
                {platformLabels[item.platform]}
              </h3>
              <p className="mt-4 text-5xl font-semibold text-cyan-100">{item.count}</p>
              <p className="mt-2 text-sm text-slate-400">当前种子样本中，这个公开信号站点贡献了 {item.count} 条趋势信号。</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[36px] border border-white/10 bg-white/5 p-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
              Source Connectors
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              平台接入状态与合规边界
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          这部分说明哪些平台适合做深度授权采集，哪些仍然需要凭证。你现在完全可以不申请它们，先用上面的公开趋势站点跑发现层。
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {sources.map((source) => (
            <SourceStatusCard key={source.platform} source={source} />
          ))}
        </div>
      </section>
    </main>
  );
}
