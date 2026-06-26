import type { SourceCapability } from "@/types/trend";

function availableEnv(requiredEnv: string[]) {
  return requiredEnv.filter((key) => Boolean(process.env[key]));
}

function buildCapability(
  input: Omit<SourceCapability, "availableEnv" | "status">
): SourceCapability {
  const available = availableEnv(input.requiredEnv);
  const status =
    input.requiredEnv.length === 0
      ? input.supportsIngestion
        ? "ready"
        : "planned"
      : available.length === input.requiredEnv.length
        ? "ready"
        : "config_needed";

  return {
    ...input,
    availableEnv: available,
    status
  };
}

export function getSourceCapabilities(): SourceCapability[] {
  return [
    buildCapability({
      platform: "youtube",
      displayName: "YouTube Data API",
      accessModel: "official_api",
      supportsIngestion: true,
      supportsKeywordSearch: true,
      supportsComments: false,
      supportsMetrics: true,
      requiredEnv: ["YOUTUBE_API_KEY"],
      legalBoundary:
        "仅使用官方 YouTube Data API；按 regionCode=KR、韩语关键词、公开视频元数据采集。",
      notes:
        "MVP 已实现搜索型接入，可扩展视频详情、频道信号和评论拉取。",
      docsUrl: "https://developers.google.com/youtube/v3"
    }),
    buildCapability({
      platform: "instagram_authorized",
      displayName: "Instagram Graph API",
      accessModel: "authorized_account",
      supportsIngestion: true,
      supportsKeywordSearch: false,
      supportsComments: true,
      supportsMetrics: true,
      requiredEnv: [
        "INSTAGRAM_ACCESS_TOKEN",
        "INSTAGRAM_BUSINESS_ACCOUNT_ID"
      ],
      legalBoundary:
        "仅接入授权的商业/创作者账号及其公开内容、评论和互动指标；不做未授权搜索或抓取。",
      notes:
        "适合品牌自有号、合作 KOL/KOC、授权创作者样本池，不适合作为全网发现接口。",
      docsUrl: "https://developers.facebook.com/docs/instagram-platform"
    }),
    buildCapability({
      platform: "threads_authorized",
      displayName: "Threads API",
      accessModel: "authorized_account",
      supportsIngestion: true,
      supportsKeywordSearch: false,
      supportsComments: true,
      supportsMetrics: true,
      requiredEnv: ["THREADS_ACCESS_TOKEN", "THREADS_USER_ID"],
      legalBoundary:
        "仅接入官方 Threads API 可访问的授权账号内容与互动；不设计未授权广场抓取。",
      notes:
        "适合观察韩国创作者/品牌的文本梗、评论语气和话题演化，需结合授权账号池。",
      docsUrl: "https://developers.facebook.com/docs/threads"
    }),
    buildCapability({
      platform: "x_api",
      displayName: "X API",
      accessModel: "official_api",
      supportsIngestion: true,
      supportsKeywordSearch: true,
      supportsComments: true,
      supportsMetrics: true,
      requiredEnv: ["X_BEARER_TOKEN"],
      legalBoundary:
        "仅使用 X 官方 API 与开发者条款允许的搜索、用户、对话和指标字段。",
      notes:
        "适合补充实时文本趋势、转发语境和热点对话，但要控制成本与速率。",
      docsUrl: "https://developer.x.com/en/docs/x-api"
    }),
    buildCapability({
      platform: "naver",
      displayName: "Naver Search API",
      accessModel: "official_api",
      supportsIngestion: true,
      supportsKeywordSearch: true,
      supportsComments: false,
      supportsMetrics: false,
      requiredEnv: ["NAVER_CLIENT_ID", "NAVER_CLIENT_SECRET"],
      legalBoundary:
        "仅使用 Naver Open API 返回的博客/搜索结果；按客户端凭证调用，不做网页抓取。",
      notes:
        "MVP 先落地 Blog Search，后续可按授权范围扩展 Cafe/Search 等公开接口。",
      docsUrl: "https://developers.naver.com/docs/serviceapi/search/blog/blog.md"
    }),
    buildCapability({
      platform: "tiktok_authorized",
      displayName: "TikTok Authorized",
      accessModel: "authorized_account",
      supportsIngestion: false,
      supportsKeywordSearch: false,
      supportsComments: false,
      supportsMetrics: false,
      requiredEnv: [],
      legalBoundary:
        "预留给 TikTok 官方授权接口或数据合作，不使用违规 scraping。",
      notes:
        "当前仅保留平台位和数据模型兼容性。",
      docsUrl: "https://developers.tiktok.com/"
    })
  ];
}
