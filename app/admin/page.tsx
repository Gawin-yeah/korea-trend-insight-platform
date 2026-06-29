import { AdminTable } from "@/components/admin-table";
import Link from "next/link";
import { listTrends } from "@/lib/repositories/trends";
import { getSiteModeSummary } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const trends = await listTrends({ limit: 20 });
  const siteMode = getSiteModeSummary();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="rounded-[36px] border border-white/10 bg-white/5 p-7">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Admin Console</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">趋势审核后台</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          这里展示待审核或已确认的趋势聚类。MVP 提供状态查看与 API 审核入口，便于后续接入真正的分析师工作流。
        </p>
        <div className="mt-5 rounded-[24px] border border-amber-300/20 bg-amber-300/[0.08] p-4">
          <p className="text-sm text-amber-100">更新状态</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{siteMode.description}</p>
          <p className="mt-2 text-xs leading-6 text-slate-300">
            下面的列表已经加入英文解释列摘要，方便英文同事一起审核。
          </p>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/sources"
              className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] px-4 py-2 text-sm text-cyan-100"
            >
              进入数据源配置
            </Link>
            <Link
              href="/admin/evidence"
              className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/[0.08] px-4 py-2 text-sm text-amber-100"
            >
              进入人工证据后台
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <AdminTable items={trends} />
        </div>
      </section>
    </main>
  );
}
