import type { CollectedMention, LegalSourceAdapter } from "@/lib/sources/base";
import { getPlatformKeywordSeeds } from "@/lib/keywords/kr-seeds";

export const instagramAuthorizedAdapter: LegalSourceAdapter = {
  name: "instagram_authorized",
  description:
    "Meta official API placeholder. Only authorized creator or business account data is supported.",
  async fetchMentions() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!token || !businessId) {
      return [];
    }

    const url = new URL(`https://graph.facebook.com/v22.0/${businessId}/media`);
    url.searchParams.set(
      "fields",
      "id,caption,media_type,media_product_type,permalink,timestamp,comments_count,like_count,username"
    );
    url.searchParams.set("limit", "25");
    url.searchParams.set("access_token", token);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as {
      data?: Array<Record<string, unknown>>;
    };
    const keywordMap = getPlatformKeywordSeeds("instagram_authorized");

    const collected: CollectedMention[] = [];

    for (const item of payload.data || []) {
      const caption = String(item.caption || "").trim();
      const matched = keywordMap.find((seed) => caption.includes(seed.keyword));

      if (!matched) {
        continue;
      }

      collected.push({
        canonicalTermKo: matched.keyword,
        category: matched.category,
        platform: "instagram_authorized",
        sourceUrl: String(item.permalink || ""),
        sourceTitle: caption.slice(0, 80) || matched.keyword,
        sourceAuthorName: String(item.username || "instagram_user"),
        sourceAuthorHandle: `@${String(item.username || "instagram_user")}`,
        sourceAuthorRegionSignal: "KR",
        sourceAuthorLanguageSignal: "ko-KR",
        collectedAt: String(item.timestamp || new Date().toISOString()),
        originalText: caption || matched.keyword,
        normalizedText: caption || matched.keyword,
        likesCount: Number(item.like_count || 0),
        commentsCount: Number(item.comments_count || 0),
        viewsCount: 0,
        sharesCount: 0
      });
    }

    return collected;
  }
};
