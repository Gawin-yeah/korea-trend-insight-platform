"use client";

import { useState } from "react";
import { isStaticSite } from "@/lib/site";

interface ImportResult {
  source?: string;
  importedCount?: number;
  message?: string;
  importers?: Array<{
    platform: string;
    mode?: "live" | "snapshot" | "hybrid" | "disabled";
    importedCount: number;
  }>;
}

export function PublicSignalImportPanel() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const staticSite = isStaticSite();

  async function runImport() {
    setPending(true);
    setResult(null);

    const response = await fetch("/api/ingestion/run?kind=public_signals", {
      method: "POST"
    });
    const data = (await response.json()) as ImportResult;
    setResult(data);
    setPending(false);
  }

  return (
    <div className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/[0.08] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-100">公开趋势信号导入</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            当前导入器会优先尝试 live 数据源；当公开源不可用或缺少凭证时，再回退到内置 snapshot，统一写入 `trend_public_signals`。
          </p>
        </div>
        {staticSite ? (
          <span className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200">
            公网版为只读演示
          </span>
        ) : (
          <button
            type="button"
            onClick={runImport}
            disabled={pending}
            className="rounded-full border border-cyan-300/30 bg-slate-950/50 px-4 py-2 text-sm text-cyan-100 disabled:opacity-50"
          >
            {pending ? "导入中..." : "一键导入公开信号"}
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-2 font-mono text-sm text-white">
        <code>npm run import:signals</code>
        <code>{staticSite ? "公网版不执行 POST 导入" : "POST /api/ingestion/run?kind=public_signals"}</code>
      </div>

      {result ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-200">
          <p>message: {result.message || "-"}</p>
          <p className="mt-1">importedCount: {result.importedCount ?? 0}</p>
          {result.importers?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.importers.map((item) => (
                <span key={item.platform} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {item.platform} {item.mode ? `(${item.mode})` : ""} {item.importedCount}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
