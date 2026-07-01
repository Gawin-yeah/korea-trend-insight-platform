import { PublicSignalImportPanel } from "@/components/public-signal-import-panel";
import { RealtimeStatusPanel } from "@/components/realtime-status-panel";
import Link from "next/link";
import { PublicTrendSiteCard } from "@/components/public-trend-site-card";
import { SourceStatusCard } from "@/components/source-status-card";
import { SourceTestPanel } from "@/components/source-test-panel";
import {
  getDashboardData,
  listPublicTrendSites,
  listSourceCapabilities
} from "@/lib/repositories/trends";
import { testSources } from "@/lib/sources/testing";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const capabilities = await listSourceCapabilities();
  const publicSites = await listPublicTrendSites();
  const testResults = await testSources();
  const dashboard = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-cyan-200">
          返回管理后台
        </Link>
      </div>

      <section className="rounded-[36px] border border-white/10 bg-white/5 p-7">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Source Settings</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">数据源配置与连通性</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          这里把“公开趋势发现层”和“深度授权采集层”分开看。前者不用申请也能先跑，后者等需要更深数据时再补凭证。
        </p>
        <div className="mt-6">
          <RealtimeStatusPanel initialStatus={dashboard.realtimeStatus} />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white">公开趋势发现层</h2>
          <div className="mt-4">
            <PublicSignalImportPanel />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {publicSites.map((site) => (
              <PublicTrendSiteCard key={site.platform} site={site} />
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-cyan-300/20 bg-cyan-300/[0.08] p-5">
          <p className="text-sm text-cyan-100">推荐测试命令</p>
          <div className="mt-3 grid gap-2 font-mono text-sm text-white">
            <code>npm run test:sources</code>
            <code>npm run test:sources -- youtube</code>
            <code>npm run test:sources -- instagram_authorized</code>
            <code>npm run test:sources -- threads_authorized</code>
            <code>npm run test:sources -- x_api</code>
            <code>npm run test:sources -- naver</code>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white">实时测试结果</h2>
          <div className="mt-4">
            <SourceTestPanel results={testResults} />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-white">深度授权采集层</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {capabilities.map((source) => (
              <SourceStatusCard key={source.platform} source={source} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
