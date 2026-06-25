import type { LegalSourceAdapter } from "@/lib/sources/base";
import { getPlatformKeywordSeeds } from "@/lib/keywords/kr-seeds";

export const naverAdapter: LegalSourceAdapter = {
  name: "naver",
  description:
    "Reserved adapter for Naver official APIs or licensed data ingestion.",
  async fetchMentions() {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return [];
    }
    const keywordSeeds = getPlatformKeywordSeeds("naver");

    const collected = [];

    for (const seed of keywordSeeds) {
      const url = new URL("https://openapi.naver.com/v1/search/blog.json");
      url.searchParams.set("query", seed.keyword);
      url.searchParams.set(
        "display",
        process.env.NAVER_SEARCH_DISPLAY || "10"
      );
      url.searchParams.set("sort", "date");

      const response = await fetch(url.toString(), {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as {
        items?: Array<{
          title: string;
          description: string;
          link: string;
          bloggername?: string;
          postdate?: string;
        }>;
      };

      for (const item of payload.items || []) {
        const originalText = `${item.title} ${item.description}`
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        collected.push({
          canonicalTermKo: seed.keyword,
          category: seed.category,
          platform: "naver" as const,
          sourceUrl: item.link,
          sourceTitle: item.title.replace(/<[^>]+>/g, "").trim(),
          sourceAuthorName: item.bloggername || "naver_blog",
          sourceAuthorHandle: item.bloggername || "naver_blog",
          sourceAuthorRegionSignal: "KR",
          sourceAuthorLanguageSignal: "ko-KR",
          collectedAt: item.postdate
            ? `${item.postdate.slice(0, 4)}-${item.postdate.slice(4, 6)}-${item.postdate.slice(6, 8)}T00:00:00.000Z`
            : new Date().toISOString(),
          originalText,
          normalizedText: originalText,
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
