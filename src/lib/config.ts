export const appConfig = {
  appName: "韩国流行词与趋势洞察平台",
  categories: [
    "beauty",
    "photography",
    "retouching",
    "ai_play",
    "fashion",
    "other"
  ] as const,
  dashboardTopLimit: 50,
  categoryBoardLimit: 5
};

export const categoryLabels = {
  beauty: "美妆趋势榜",
  photography: "拍照姿势/场景趋势榜",
  retouching: "修图滤镜/模板趋势榜",
  ai_play: "AI 玩法趋势榜",
  fashion: "韩国穿搭趋势榜",
  other: "其他趋势"
} as const;

export const lifecycleLabels = {
  emerging: "新出现",
  breakout: "爆发",
  steady: "稳定",
  cooling: "衰退"
} as const;

export const platformLabels = {
  youtube: "YouTube",
  youtube_charts: "YouTube Charts",
  instagram_authorized: "Instagram 授权",
  threads_authorized: "Threads 授权",
  x_api: "X API",
  tiktok_authorized: "TikTok 授权",
  tiktok_creative_center: "TikTok Creative Center",
  naver: "Naver",
  naver_datalab: "Naver DataLab",
  google_trends: "Google Trends KR",
  manual_seed: "演示种子",
  manual_research: "人工研究",
  other: "其他"
} as const;

export const platformAbbreviations = {
  youtube: "YT",
  youtube_charts: "YC",
  instagram_authorized: "IG",
  threads_authorized: "TH",
  x_api: "X",
  tiktok_authorized: "TT",
  tiktok_creative_center: "TC",
  naver: "NV",
  naver_datalab: "ND",
  google_trends: "GT",
  manual_seed: "SD",
  manual_research: "MR",
  other: "OT"
} as const;

export const sourceTypeLabels = {
  mention: "原始提及",
  public_signal: "公开信号",
  evidence: "人工证据"
} as const;
