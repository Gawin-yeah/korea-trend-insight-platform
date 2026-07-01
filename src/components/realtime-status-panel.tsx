"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toAppPath } from "@/lib/site";
import type { RealtimeStatus } from "@/types/trend";

function formatDateTime(value?: string | null) {
  if (!value) {
    return "暂无";
  }

  return new Date(value).toLocaleString("zh-CN", {
    hour12: false
  });
}

export function RealtimeStatusPanel({
  initialStatus
}: {
  initialStatus: RealtimeStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const latestSeenRef = useRef(
    initialStatus.latestDataAt || initialStatus.lastSuccessfulRefreshAt || ""
  );

  useEffect(() => {
    setStatus(initialStatus);
    latestSeenRef.current =
      initialStatus.latestDataAt || initialStatus.lastSuccessfulRefreshAt || "";
  }, [initialStatus]);

  useEffect(() => {
    if (!status.autoRefreshEnabled) {
      return;
    }

    const intervalMs = Math.max(status.refreshIntervalSeconds, 15) * 1000;
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(
          toAppPath(
            `/api/dashboard?refresh=auto&staleAfterMinutes=${status.staleAfterMinutes}`
          ),
          {
            cache: "no-store"
          }
        );

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { realtimeStatus?: RealtimeStatus };
        if (!payload.realtimeStatus) {
          return;
        }

        setStatus(payload.realtimeStatus);
        const latestDataAt =
          payload.realtimeStatus.latestDataAt ||
          payload.realtimeStatus.lastSuccessfulRefreshAt ||
          "";

        if (latestDataAt && latestDataAt !== latestSeenRef.current) {
          latestSeenRef.current = latestDataAt;
          router.refresh();
        }
      } catch {
        // Keep the current UI state when background polling fails.
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [router, status.autoRefreshEnabled, status.refreshIntervalSeconds, status.staleAfterMinutes]);

  async function runManualRefresh() {
    setManualRefreshing(true);

    try {
      await fetch(toAppPath("/api/ingestion/run?kind=full_refresh"), {
        method: "POST"
      });
      router.refresh();
    } finally {
      setManualRefreshing(false);
    }
  }

  const modeLabel =
    status.mode === "dynamic_live"
      ? "动态实时"
      : status.mode === "dynamic_demo"
        ? "动态演示"
        : "静态演示";

  return (
    <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.08] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-emerald-100">实时更新状态</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">
            {modeLabel} · 每 {status.refreshIntervalSeconds} 秒检查一次 · 数据超过{" "}
            {status.staleAfterMinutes} 分钟会触发刷新
          </p>
        </div>
        {status.mode !== "static_demo" ? (
          <button
            type="button"
            onClick={runManualRefresh}
            disabled={manualRefreshing}
            className="rounded-full border border-emerald-300/30 bg-slate-950/40 px-4 py-2 text-sm text-emerald-100 disabled:opacity-50"
          >
            {manualRefreshing ? "刷新中..." : "立即刷新"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] border border-white/10 bg-black/10 p-3">
          <p className="text-xs text-slate-400">最新数据时间</p>
          <p className="mt-2 text-sm text-white">{formatDateTime(status.latestDataAt)}</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-black/10 p-3">
          <p className="text-xs text-slate-400">最近成功刷新</p>
          <p className="mt-2 text-sm text-white">
            {formatDateTime(status.lastSuccessfulRefreshAt)}
          </p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-black/10 p-3">
          <p className="text-xs text-slate-400">可用 live 来源</p>
          <p className="mt-2 text-sm text-white">
            {status.activeSources.length ? status.activeSources.join(", ") : "暂无"}
          </p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-black/10 p-3">
          <p className="text-xs text-slate-400">snapshot 兜底</p>
          <p className="mt-2 text-sm text-white">
            {status.snapshotSources.length ? status.snapshotSources.join(", ") : "无"}
          </p>
        </div>
      </div>

      {status.lastRefreshMessage ? (
        <p className="mt-3 text-xs leading-6 text-slate-300">{status.lastRefreshMessage}</p>
      ) : null}
    </div>
  );
}
