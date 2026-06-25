import Link from "next/link";
import { EvidenceForm } from "@/components/evidence-form";
import { EvidenceTable } from "@/components/evidence-table";
import { listRecentEvidence, listTrends } from "@/lib/repositories/trends";

export const dynamic = "force-dynamic";

export default async function AdminEvidencePage() {
  const evidences = await listRecentEvidence(20);
  const trends = await listTrends({ limit: 50 });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-cyan-200">
          返回管理后台
        </Link>
      </div>

      <section className="rounded-[36px] border border-white/10 bg-white/5 p-7">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Evidence Console</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">人工补证据后台</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          当公开趋势站点只告诉我们“这个词在涨”，研究员可以在这里补原始链接、截图、评论摘录和分析备注，让趋势详情页真正可追溯。
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white">提交新证据</h2>
            <div className="mt-4">
              <EvidenceForm slugs={trends.map((item) => item.slug)} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">最近补充的证据</h2>
            <div className="mt-4">
              <EvidenceTable items={evidences} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
