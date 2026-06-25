import type { CollectedMention, LegalSourceAdapter } from "@/lib/sources/base";
import { getPlatformKeywordSeeds } from "@/lib/keywords/kr-seeds";

export const youtubeAdapter: LegalSourceAdapter = {
  name: "youtube",
  description: "Official YouTube Data API adapter for KR region trend capture.",
  async fetchMentions() {
    const keywordSeeds = getPlatformKeywordSeeds("youtube");

    if (!process.env.YOUTUBE_API_KEY) {
      return keywordSeeds.map((seed, index) => ({
        canonicalTermKo: seed.keyword,
        category: seed.category,
        platform: "youtube",
        sourceUrl: `https://demo.local/youtube/${index + 1}`,
        sourceTitle: `${seed.keyword} 데모 수집`,
        sourceAuthorName: "Demo KR Creator",
        sourceAuthorHandle: "@demo",
        sourceAuthorRegionSignal: "KR",
        sourceAuthorLanguageSignal: "ko-KR",
        collectedAt: new Date().toISOString(),
        originalText: `${seed.keyword} 관련 한국어 데모 설명`,
        normalizedText: `${seed.keyword} 관련 한국어 데모 설명`,
        likesCount: 300 + index * 20,
        commentsCount: 25 + index * 3,
        viewsCount: 5000 + index * 500,
        sharesCount: 12 + index
      }));
    }

    const collected: CollectedMention[] = [];
    const regionCode = process.env.YOUTUBE_REGION_CODE || "KR";

    for (const seed of keywordSeeds) {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("type", "video");
      url.searchParams.set("maxResults", "5");
      url.searchParams.set("q", seed.keyword);
      url.searchParams.set("regionCode", regionCode);
      url.searchParams.set("relevanceLanguage", "ko");
      url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

      const response = await fetch(url.toString());
      const payload = await response.json();

      if (!Array.isArray(payload.items)) {
        continue;
      }

      for (const item of payload.items) {
        collected.push({
          canonicalTermKo: seed.keyword,
          category: seed.category,
          platform: "youtube",
          sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          sourceTitle: item.snippet.title,
          sourceAuthorName: item.snippet.channelTitle,
          sourceAuthorHandle: item.snippet.channelTitle,
          sourceAuthorRegionSignal: "KR",
          sourceAuthorLanguageSignal: "ko-KR",
          collectedAt: new Date().toISOString(),
          originalText: item.snippet.description || item.snippet.title,
          normalizedText: (item.snippet.description || item.snippet.title).trim(),
          likesCount: 0,
          commentsCount: 0,
          viewsCount: 0,
          sharesCount: 0
        });
      }
    }

    return collected;
  }
};
