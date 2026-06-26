import type { PublicTrendSite } from "@/types/trend";

export const publicTrendSites: PublicTrendSite[] = [
  {
    platform: "tiktok_creative_center",
    displayName: "TikTok Creative Center",
    signalRole: "发现短视频热门标签、创意方向、音频与行业趋势",
    accessMode: "public_page",
    coverage: "公开趋势站点，偏营销与创意洞察",
    bestFor: ["hashtag momentum", "beauty microtrend", "visual style discovery"],
    limitations: "更适合发现信号，不等于完整原始帖子证据链。",
    regionHint: "支持国家维度切换，可优先观察 KR",
    officialUrl: "https://ads.tiktok.com/business/creativecenter/"
  },
  {
    platform: "google_trends",
    displayName: "Google Trends",
    signalRole: "发现韩国搜索热度、短期突增话题与关键词关联",
    accessMode: "open_tool",
    coverage: "Google Search / YouTube 搜索兴趣",
    bestFor: ["search surge", "keyword validation", "timeliness check"],
    limitations: "给的是相对热度，不是社交平台原文内容。 ",
    regionHint: "优先使用 KR",
    officialUrl: "https://trends.google.com/trends/"
  },
  {
    platform: "naver_datalab",
    displayName: "Naver DataLab",
    signalRole: "补韩国本土搜索与消费兴趣趋势",
    accessMode: "open_tool",
    coverage: "韩国本土搜索趋势与人群维度",
    bestFor: ["local intent", "female audience trend", "fashion/beauty validation"],
    limitations: "偏搜索意图，不直接给帖子/评论原文。",
    regionHint: "韩国本土信号强",
    officialUrl: "https://datalab.naver.com/"
  },
  {
    platform: "youtube_charts",
    displayName: "YouTube Charts / Explore",
    signalRole: "发现 Shorts/视频类热门主题与内容风格",
    accessMode: "official_chart",
    coverage: "分类榜单与视频发现入口",
    bestFor: ["creator topic discovery", "video topic monitoring", "music/visual crossover"],
    limitations: "2025 年后不再是统一 Trending 总榜，更偏分类入口。",
    officialUrl: "https://charts.youtube.com/"
  }
];
