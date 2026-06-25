import type { CollectedMention, LegalSourceAdapter } from "@/lib/sources/base";
import { getPlatformKeywordSeeds } from "@/lib/keywords/kr-seeds";

export const threadsAuthorizedAdapter: LegalSourceAdapter = {
  name: "threads_authorized",
  description:
    "Meta Threads API adapter. Only authorized account content is eligible; no unauthorized public scraping.",
  async fetchMentions() {
    const token = process.env.THREADS_ACCESS_TOKEN;
    const userId = process.env.THREADS_USER_ID;
    const topicSeeds = getPlatformKeywordSeeds("threads_authorized");

    if (!token || !userId) {
      return [];
    }

    const url = new URL(`https://graph.threads.net/v1.0/${userId}/threads`);
    url.searchParams.set(
      "fields",
      "id,text,timestamp,permalink,media_type,reply_count,reposts_count,quote_post_count,views,username"
    );
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

    const collected: CollectedMention[] = [];

    for (const item of payload.data || []) {
      const text = String(item.text || "").trim();
      const matched = topicSeeds.find((seed) => text.includes(seed.keyword));

      if (!matched) {
        continue;
      }

      collected.push({
        canonicalTermKo: matched.keyword,
        category: matched.category,
        platform: "threads_authorized",
        sourceUrl: String(item.permalink || ""),
        sourceTitle: text.slice(0, 80) || matched.keyword,
        sourceAuthorName: String(item.username || "threads_user"),
        sourceAuthorHandle: `@${String(item.username || "threads_user")}`,
        sourceAuthorRegionSignal: "KR",
        sourceAuthorLanguageSignal: "ko-KR",
        collectedAt: String(item.timestamp || new Date().toISOString()),
        originalText: text || matched.keyword,
        normalizedText: text || matched.keyword,
        likesCount: 0,
        commentsCount: Number(item.reply_count || 0),
        viewsCount: Number(item.views || 0),
        sharesCount:
          Number(item.reposts_count || 0) + Number(item.quote_post_count || 0)
      });
    }

    return collected;
  }
};
