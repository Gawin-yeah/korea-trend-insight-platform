export type Category =
  | "beauty"
  | "photography"
  | "retouching"
  | "ai_play"
  | "fashion"
  | "other";

export type Platform =
  | "youtube"
  | "youtube_charts"
  | "instagram_authorized"
  | "threads_authorized"
  | "x_api"
  | "tiktok_authorized"
  | "tiktok_creative_center"
  | "naver"
  | "naver_datalab"
  | "google_trends"
  | "manual_seed"
  | "manual_research"
  | "other";

export type Lifecycle = "emerging" | "breakout" | "steady" | "cooling";
export type ReviewStatus = "pending" | "approved" | "rejected" | "needs_review";
export type RiskLevel = "low" | "medium" | "high";

export interface TrendCluster {
  id: string;
  slug: string;
  primaryTermKo: string;
  romanization: string;
  zhExplanation: string;
  enExplanation: string;
  usageContext: string;
  tone: string;
  exampleSentenceKo: string;
  exampleSentenceZh: string;
  primaryCategory: Category;
  secondaryCategories: Category[];
  relatedProducts: string[];
  relatedBrands: string[];
  visualStyleTags: string[];
  targetAudience: string[];
  sourcePlatforms: Platform[];
  trendScore: number;
  growthScore: number;
  engagementScore: number;
  freshnessScore: number;
  authenticityScore: number;
  productizationScore: number;
  filterTemplateFitScore: number;
  viralityScore: number;
  youngWomenRelevanceScore: number;
  beautyFeatureFitScore: number;
  commercialPotentialScore: number;
  confidenceScore: number;
  riskLevel: RiskLevel;
  riskFlags: string[];
  lifecycle: Lifecycle;
  firstSeenAt: string;
  lastSeenAt: string;
  collectedSourceCount: number;
  collectedMentionCount: number;
  publicSignalCount: number;
  evidenceCount: number;
  evidenceCompletenessScore: number;
  reviewStatus: ReviewStatus;
  reviewNotes?: string | null;
}

export interface TrendMention {
  id: string;
  clusterSlug: string;
  sourcePlatform: Platform;
  sourceUrl: string;
  sourceTitle?: string;
  sourceAuthorName?: string;
  sourceAuthorHandle?: string;
  sourceAuthorRegionSignal?: string;
  sourceAuthorLanguageSignal?: string;
  collectedAt: string;
  originalText: string;
  normalizedText: string;
  languageRatioKo: number;
  regionConfidence: number;
  localExpressionConfidence: number;
  activityWindowConfidence: number;
  antiRebroadcastConfidence: number;
  authenticityScore: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
}

export interface TrendDailyMetric {
  clusterSlug: string;
  metricDate: string;
  mentionCount: number;
  engagementSum: number;
  trendScore: number;
  commercialPotentialScore: number;
}

export interface TrendSignal {
  id: string;
  clusterSlug: string;
  sourcePlatform: Platform;
  sourceUrl: string;
  signalTitle: string;
  signalType: "hashtag_rank" | "search_surge" | "editorial_pick" | "keyword_cluster";
  regionCode: string;
  observedRank?: number;
  observedValue?: string;
  summary: string;
  confidenceScore: number;
  collectedAt: string;
}

export interface EvidenceRecord {
  id: string;
  clusterSlug: string;
  sourcePlatform: Platform;
  sourceUrl: string;
  evidenceType: "link" | "screenshot" | "comment_excerpt" | "analyst_note";
  headline: string;
  excerpt: string;
  analystNote?: string;
  submitter: string;
  proofStrength: number;
  capturedAt: string;
  status: "pending" | "verified" | "rejected";
}

export interface TrendDetail extends TrendCluster {
  mentions: TrendMention[];
  metrics: TrendDailyMetric[];
  signals: TrendSignal[];
  evidences: EvidenceRecord[];
}

export interface TrendListFilters {
  category?: Category;
  lifecycle?: Lifecycle;
  limit?: number;
  search?: string;
  sort?:
    | "trend_score"
    | "commercial_potential_score"
    | "growth_score"
    | "freshness_score";
}

export interface DashboardData {
  generatedAt: string;
  top50: TrendCluster[];
  fastestRising: TrendCluster[];
  categoryBoards: Record<Category, TrendCluster[]>;
  commercializationBoards: Record<Category, TrendCluster[]>;
  lifecycleSummary: Array<{ lifecycle: Lifecycle; count: number }>;
  platformSummary: Array<{ platform: Platform; count: number }>;
  evidenceCoverageSummary: Array<{
    bucket: "strong" | "medium" | "weak";
    count: number;
  }>;
  publicSignalSummary: Array<{ platform: Platform; count: number }>;
}

export interface SourceCapability {
  platform: Platform;
  displayName: string;
  status: "ready" | "config_needed" | "planned";
  accessModel: "official_api" | "authorized_account" | "licensed_data" | "manual";
  supportsIngestion: boolean;
  supportsKeywordSearch: boolean;
  supportsComments: boolean;
  supportsMetrics: boolean;
  requiredEnv: string[];
  availableEnv: string[];
  legalBoundary: string;
  notes: string;
}

export interface PublicTrendSite {
  platform: Platform;
  displayName: string;
  signalRole: string;
  accessMode: "public_page" | "open_tool" | "official_chart";
  coverage: string;
  bestFor: string[];
  limitations: string;
  regionHint?: string;
}
