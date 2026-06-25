"use client";

import { useState } from "react";
import type { EvidenceRecord, Platform } from "@/types/trend";

const platformOptions: Platform[] = [
  "manual_research",
  "google_trends",
  "tiktok_creative_center",
  "naver_datalab",
  "youtube_charts",
  "other"
];

export function EvidenceForm({ slugs }: { slugs: string[] }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const payload = {
      slug: String(formData.get("slug") || ""),
      sourcePlatform: String(formData.get("sourcePlatform") || "manual_research"),
      sourceUrl: String(formData.get("sourceUrl") || ""),
      evidenceType: String(formData.get("evidenceType") || "link"),
      headline: String(formData.get("headline") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      analystNote: String(formData.get("analystNote") || ""),
      submitter: String(formData.get("submitter") || ""),
      proofStrength: Number(formData.get("proofStrength") || 0.7)
    };

    const response = await fetch("/api/admin/evidence", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { ok?: boolean; message?: string };
    setPending(false);
    setMessage(result.ok ? "证据已提交。" : result.message || "提交失败。");
  }

  return (
    <form
      action={onSubmit}
      className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          趋势 slug
          <select name="slug" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white">
            {slugs.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          来源平台
          <select
            name="sourcePlatform"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
          >
            {platformOptions.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm text-slate-300">
        来源链接
        <input
          name="sourceUrl"
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
          placeholder="https://..."
          required
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          证据类型
          <select
            name="evidenceType"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
          >
            <option value="link">link</option>
            <option value="screenshot">screenshot</option>
            <option value="comment_excerpt">comment_excerpt</option>
            <option value="analyst_note">analyst_note</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          提交人
          <input
            name="submitter"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            placeholder="analyst_name"
            required
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-slate-300">
        标题
        <input
          name="headline"
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
          placeholder="证据标题"
          required
        />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        摘要
        <textarea
          name="excerpt"
          className="min-h-28 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
          placeholder="原文摘录、截图说明、评论摘要"
          required
        />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        研究员备注
        <textarea
          name="analystNote"
          className="min-h-24 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
          placeholder="为什么这条证据重要"
        />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        证据强度
        <input
          name="proofStrength"
          type="number"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.80"
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-cyan-300/30 bg-cyan-300/[0.08] px-4 py-3 text-sm text-cyan-100 disabled:opacity-50"
      >
        {pending ? "提交中..." : "提交证据"}
      </button>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}
