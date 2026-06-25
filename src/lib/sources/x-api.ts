import type { CollectedMention, LegalSourceAdapter } from "@/lib/sources/base";
import { getPlatformKeywordSeeds } from "@/lib/keywords/kr-seeds";

export const xApiAdapter: LegalSourceAdapter = {
  name: "x_api",
  description:
    "Official X API adapter with keyword search. Best used for real-time Korean conversation signals and retweets.",
  async fetchMentions() {
    const token = process.env.X_BEARER_TOKEN;
    const keywordSeeds = getPlatformKeywordSeeds("x_api");

    if (!token) {
      return [];
    }

    const collected: CollectedMention[] = [];

    for (const seed of keywordSeeds) {
      const url = new URL("https://api.x.com/2/tweets/search/recent");
      url.searchParams.set(
        "query",
        `${seed.keyword} lang:ko -is:retweet`
      );
      url.searchParams.set(
        "tweet.fields",
        "created_at,public_metrics,lang,author_id"
      );
      url.searchParams.set("max_results", "10");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as {
        data?: Array<{
          id: string;
          text: string;
          created_at?: string;
          public_metrics?: {
            like_count?: number;
            reply_count?: number;
            retweet_count?: number;
            impression_count?: number;
          };
        }>;
      };

      for (const item of payload.data || []) {
        collected.push({
          canonicalTermKo: seed.keyword,
          category: seed.category,
          platform: "x_api",
          sourceUrl: `https://x.com/i/web/status/${item.id}`,
          sourceTitle: item.text.slice(0, 80),
          sourceAuthorName: "x_user",
          sourceAuthorHandle: "@x_user",
          sourceAuthorRegionSignal: "KR",
          sourceAuthorLanguageSignal: "ko-KR",
          collectedAt: item.created_at || new Date().toISOString(),
          originalText: item.text,
          normalizedText: item.text,
          likesCount: Number(item.public_metrics?.like_count || 0),
          commentsCount: Number(item.public_metrics?.reply_count || 0),
          viewsCount: Number(item.public_metrics?.impression_count || 0),
          sharesCount: Number(item.public_metrics?.retweet_count || 0)
        });
      }
    }

    return collected;
  }
};
