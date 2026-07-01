import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import {
  clampConfidenceScore,
  extractXmlTag,
  fallbackSnapshotSignals,
  inferCategoryFromText,
  uniqueSignals
} from "@/lib/public-signal-importers/utils";

export const googleTrendsImporter: PublicSignalImporter = {
  name: "google_trends",
  displayName: "Google Trends Snapshot Importer",
  getMode() {
    return "hybrid";
  },
  async importSignals() {
    const rssUrl =
      process.env.GOOGLE_TRENDS_RSS_URL || "https://trends.google.com/trending/rss?geo=KR";

    try {
      const response = await fetch(rssUrl, {
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml"
        }
      });

      if (!response.ok) {
        throw new Error(`Google Trends RSS ${response.status}`);
      }

      const xml = await response.text();
      const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
      const collectedAt = new Date().toISOString();

      const signals = items.slice(0, 10).map((item, index) => {
        const title = extractXmlTag(item, "title");
        const traffic = extractXmlTag(item, "ht:approx_traffic") || extractXmlTag(item, "approx_traffic");
        const link = extractXmlTag(item, "link");
        const description = extractXmlTag(item, "description");
        const canonicalTermKo = title.split(",")[0]?.trim() || title.trim();

        return {
          canonicalTermKo,
          category: inferCategoryFromText(`${title} ${description}`),
          sourcePlatform: "google_trends" as const,
          sourceUrl:
            link ||
            `https://trends.google.com/trends/explore?geo=KR&q=${encodeURIComponent(canonicalTermKo)}`,
          signalTitle: title || canonicalTermKo,
          signalType: "search_surge" as const,
          regionCode: "KR",
          observedRank: index + 1,
          observedValue: traffic || "Trending",
          summary: description || `${canonicalTermKo} 在 Google Trends KR 热门趋势中出现。`,
          confidenceScore: clampConfidenceScore(0.92 - index * 0.02),
          collectedAt
        };
      });

      if (signals.length > 0) {
        return uniqueSignals(signals);
      }
    } catch {
      // Fall back to built-in snapshots when the public feed is unavailable.
    }

    return fallbackSnapshotSignals("google_trends");
  }
};
