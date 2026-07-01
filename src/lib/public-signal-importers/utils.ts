import { getAllKeywordSeeds } from "@/lib/keywords/kr-seeds";
import { publicSignalSnapshots } from "@/lib/public-signal-importers/snapshots";
import type { PublicSignalCandidate } from "@/lib/public-signal-importers/base";
import type { Category, Platform } from "@/types/trend";

export function fallbackSnapshotSignals(platform: Platform) {
  return publicSignalSnapshots
    .filter((item) => item.sourcePlatform === platform)
    .map((item) => ({
      ...item,
      collectedAt: new Date().toISOString()
    }));
}

export function inferCategoryFromText(text: string): Category {
  const normalized = text.toLowerCase();
  const seeds = getAllKeywordSeeds();

  for (const seed of seeds) {
    const keyword = seed.keyword.toLowerCase();
    if (normalized.includes(keyword)) {
      return seed.category;
    }

    if (seed.tags.some((tag) => normalized.includes(tag.toLowerCase()))) {
      return seed.category;
    }
  }

  return "other";
}

export function sanitizeXmlText(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractXmlTag(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? sanitizeXmlText(match[1]) : "";
}

export function clampConfidenceScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0.75;
  }

  return Math.max(0.5, Math.min(0.99, value));
}

export function uniqueSignals(signals: PublicSignalCandidate[]) {
  const deduped = new Map<string, PublicSignalCandidate>();

  for (const signal of signals) {
    const key = [
      signal.sourcePlatform,
      signal.canonicalTermKo,
      signal.signalTitle,
      signal.sourceUrl
    ].join("::");

    if (!deduped.has(key)) {
      deduped.set(key, signal);
    }
  }

  return Array.from(deduped.values());
}
