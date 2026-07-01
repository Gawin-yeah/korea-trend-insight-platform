import type { PublicSignalImporter } from "@/lib/public-signal-importers/base";
import { getPlatformKeywordSeeds } from "@/lib/keywords/kr-seeds";
import {
  fallbackSnapshotSignals,
  uniqueSignals
} from "@/lib/public-signal-importers/utils";

export const youtubeChartsImporter: PublicSignalImporter = {
  name: "youtube_charts",
  displayName: "YouTube Charts Snapshot Importer",
  getMode() {
    return process.env.YOUTUBE_API_KEY ? "live" : "snapshot";
  },
  async importSignals() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return fallbackSnapshotSignals("youtube_charts");
    }

    const regionCode = process.env.YOUTUBE_REGION_CODE || "KR";
    const keywordSeeds = getPlatformKeywordSeeds("youtube");
    const collectedAt = new Date().toISOString();
    const signals = [];

    for (const seed of keywordSeeds.slice(0, 8)) {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("type", "video");
      url.searchParams.set("order", "date");
      url.searchParams.set("maxResults", "3");
      url.searchParams.set("q", seed.keyword);
      url.searchParams.set("regionCode", regionCode);
      url.searchParams.set("relevanceLanguage", "ko");
      url.searchParams.set("key", apiKey);

      try {
        const response = await fetch(url.toString());
        if (!response.ok) {
          continue;
        }

        const payload = (await response.json()) as {
          items?: Array<{
            id?: { videoId?: string };
            snippet?: {
              title?: string;
              description?: string;
              publishedAt?: string;
            };
          }>;
        };

        const topItem = payload.items?.[0];
        if (!topItem?.id?.videoId || !topItem.snippet?.title) {
          continue;
        }

        signals.push({
          canonicalTermKo: seed.keyword,
          category: seed.category,
          sourcePlatform: "youtube_charts" as const,
          sourceUrl: `https://www.youtube.com/watch?v=${topItem.id.videoId}`,
          signalTitle: topItem.snippet.title,
          signalType: "editorial_pick" as const,
          regionCode,
          observedValue: topItem.snippet.publishedAt
            ? `Newest video ${topItem.snippet.publishedAt}`
            : "Latest KR video discovery",
          summary:
            topItem.snippet.description?.trim() ||
            `${seed.keyword} 的韩语视频正在 YouTube KR 搜索与发现层活跃出现。`,
          confidenceScore: 0.83,
          collectedAt
        });
      } catch {
        continue;
      }
    }

    return signals.length > 0
      ? uniqueSignals(signals)
      : fallbackSnapshotSignals("youtube_charts");
  }
};
