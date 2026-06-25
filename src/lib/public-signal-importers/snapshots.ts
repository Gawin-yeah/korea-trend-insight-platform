import type { PublicSignalCandidate } from "@/lib/public-signal-importers/base";

const now = new Date("2026-06-25T08:00:00.000Z").toISOString();

export const publicSignalSnapshots: PublicSignalCandidate[] = [
  {
    canonicalTermKo: "글로우 쿠션",
    category: "beauty",
    sourcePlatform: "tiktok_creative_center",
    sourceUrl: "https://ads.tiktok.com/business/creativecenter/",
    signalTitle: "K-beauty dewy base hashtag cluster",
    signalType: "hashtag_rank",
    regionCode: "KR",
    observedRank: 5,
    observedValue: "7d growth +42%",
    summary: "韩国美妆内容里清透底妆与 glow cushion 相关标签连续上升。",
    confidenceScore: 0.84,
    collectedAt: now
  },
  {
    canonicalTermKo: "인생네컷 포즈",
    category: "photography",
    sourcePlatform: "tiktok_creative_center",
    sourceUrl: "https://ads.tiktok.com/business/creativecenter/",
    signalTitle: "Photo booth pose trend cluster",
    signalType: "hashtag_rank",
    regionCode: "KR",
    observedRank: 4,
    observedValue: "Creator use rising",
    summary: "人生四格拍照姿势类内容在韩国年轻用户创意场景中密集出现。",
    confidenceScore: 0.86,
    collectedAt: now
  },
  {
    canonicalTermKo: "쿨톤 보정",
    category: "retouching",
    sourcePlatform: "tiktok_creative_center",
    sourceUrl: "https://ads.tiktok.com/business/creativecenter/",
    signalTitle: "Cool tone preset momentum",
    signalType: "keyword_cluster",
    regionCode: "KR",
    observedValue: "Template tutorials repeating",
    summary: "冷调修图模板、滤镜参数和 before/after 关键词在公开趋势页被反复组合。",
    confidenceScore: 0.77,
    collectedAt: now
  },
  {
    canonicalTermKo: "AI 증명사진",
    category: "ai_play",
    sourcePlatform: "google_trends",
    sourceUrl: "https://trends.google.com/trends/",
    signalTitle: "AI profile / ID photo search breakout",
    signalType: "search_surge",
    regionCode: "KR",
    observedRank: 3,
    observedValue: "Breakout",
    summary: "韩国搜索兴趣中 AI 证件照、AI 头像词组出现突增。",
    confidenceScore: 0.92,
    collectedAt: now
  },
  {
    canonicalTermKo: "사진맛집",
    category: "photography",
    sourcePlatform: "google_trends",
    sourceUrl: "https://trends.google.com/trends/",
    signalTitle: "Photogenic place search interest",
    signalType: "keyword_cluster",
    regionCode: "KR",
    observedValue: "Weekend spike",
    summary: "围绕出片地点、打卡咖啡店和拍照路线的搜索词在周末明显升温。",
    confidenceScore: 0.8,
    collectedAt: now
  },
  {
    canonicalTermKo: "발레코어 출근룩",
    category: "fashion",
    sourcePlatform: "naver_datalab",
    sourceUrl: "https://datalab.naver.com/",
    signalTitle: "Balletcore office look intent",
    signalType: "search_surge",
    regionCode: "KR",
    observedValue: "20s female up",
    summary: "韩国年轻女性搜索中，轻甜通勤穿搭与 balletcore 相关词一起抬升。",
    confidenceScore: 0.78,
    collectedAt: now
  },
  {
    canonicalTermKo: "올영추천",
    category: "beauty",
    sourcePlatform: "naver_datalab",
    sourceUrl: "https://datalab.naver.com/",
    signalTitle: "Olive Young recommendation intent",
    signalType: "keyword_cluster",
    regionCode: "KR",
    observedValue: "Beauty search interest up",
    summary: "Olive Young 推荐词和热门成分词存在明显联动，适合带动 beauty 板块发现。",
    confidenceScore: 0.72,
    collectedAt: now
  },
  {
    canonicalTermKo: "인생네컷 포즈",
    category: "photography",
    sourcePlatform: "youtube_charts",
    sourceUrl: "https://charts.youtube.com/",
    signalTitle: "Short-form pose tutorials surfacing",
    signalType: "editorial_pick",
    regionCode: "KR",
    observedValue: "Shorts discovery lift",
    summary: "Shorts 发现入口里姿势推荐和人生四格构图类视频持续出现。",
    confidenceScore: 0.81,
    collectedAt: now
  },
  {
    canonicalTermKo: "AI 증명사진",
    category: "ai_play",
    sourcePlatform: "youtube_charts",
    sourceUrl: "https://charts.youtube.com/",
    signalTitle: "AI portrait tutorials showing up in discovery",
    signalType: "editorial_pick",
    regionCode: "KR",
    observedValue: "Creator momentum",
    summary: "AI 写真、AI 证件照教程在视频发现层出现频率提升。",
    confidenceScore: 0.76,
    collectedAt: now
  }
];

