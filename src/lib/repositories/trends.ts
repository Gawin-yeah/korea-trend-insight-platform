import {
  seedClusters,
  seedEvidences,
  seedMentions,
  seedMetrics,
  seedSignals
} from "../../../db/seed-data";
import { appConfig } from "@/lib/config";
import { isDatabaseConfigured, query } from "@/lib/db";
import { publicTrendSites } from "@/lib/public-trend-sites";
import { getSourceCapabilities } from "@/lib/sources/catalog";
import type {
  Category,
  DashboardData,
  EvidenceRecord,
  PublicTrendSite,
  SourceCapability,
  TrendCluster,
  TrendDailyMetric,
  TrendDetail,
  TrendListFilters,
  TrendMention,
  TrendSignal
} from "@/types/trend";

function mapCluster(row: Record<string, unknown>): TrendCluster {
  return {
    id: String(row.id),
    slug: String(row.slug),
    primaryTermKo: String(row.primary_term_ko),
    romanization: String(row.romanization),
    zhExplanation: String(row.zh_explanation),
    enExplanation: String(row.en_explanation),
    usageContext: String(row.usage_context),
    tone: String(row.tone),
    exampleSentenceKo: String(row.example_sentence_ko),
    exampleSentenceZh: String(row.example_sentence_zh),
    primaryCategory: row.primary_category as Category,
    secondaryCategories: (row.secondary_categories as Category[]) || [],
    relatedProducts: (row.related_products as string[]) || [],
    relatedBrands: (row.related_brands as string[]) || [],
    visualStyleTags: (row.visual_style_tags as string[]) || [],
    targetAudience: (row.target_audience as string[]) || [],
    sourcePlatforms: row.source_platforms as TrendCluster["sourcePlatforms"],
    trendScore: Number(row.trend_score),
    growthScore: Number(row.growth_score),
    engagementScore: Number(row.engagement_score),
    freshnessScore: Number(row.freshness_score),
    authenticityScore: Number(row.authenticity_score),
    productizationScore: Number(row.productization_score),
    filterTemplateFitScore: Number(row.filter_template_fit_score),
    viralityScore: Number(row.virality_score),
    youngWomenRelevanceScore: Number(row.young_women_relevance_score),
    beautyFeatureFitScore: Number(row.beauty_feature_fit_score),
    commercialPotentialScore: Number(row.commercial_potential_score),
    confidenceScore: Number(row.confidence_score),
    riskLevel: row.risk_level as TrendCluster["riskLevel"],
    riskFlags: (row.risk_flags as string[]) || [],
    lifecycle: row.lifecycle as TrendCluster["lifecycle"],
    firstSeenAt: String(row.first_seen_at),
    lastSeenAt: String(row.last_seen_at),
    collectedSourceCount: Number(row.collected_source_count),
    collectedMentionCount: Number(row.collected_mention_count),
    publicSignalCount: Number(row.public_signal_count || 0),
    evidenceCount: Number(row.evidence_count || 0),
    evidenceCompletenessScore: Number(row.evidence_completeness_score || 0),
    reviewStatus: row.review_status as TrendCluster["reviewStatus"],
    reviewNotes: row.review_notes ? String(row.review_notes) : null
  };
}

function mapMention(row: Record<string, unknown>): TrendMention {
  return {
    id: String(row.id),
    clusterSlug: String(row.cluster_slug),
    sourcePlatform: row.source_platform as TrendMention["sourcePlatform"],
    sourceUrl: String(row.source_url),
    sourceTitle: row.source_title ? String(row.source_title) : undefined,
    sourceAuthorName: row.source_author_name
      ? String(row.source_author_name)
      : undefined,
    sourceAuthorHandle: row.source_author_handle
      ? String(row.source_author_handle)
      : undefined,
    sourceAuthorRegionSignal: row.source_author_region_signal
      ? String(row.source_author_region_signal)
      : undefined,
    sourceAuthorLanguageSignal: row.source_author_language_signal
      ? String(row.source_author_language_signal)
      : undefined,
    collectedAt: String(row.collected_at),
    originalText: String(row.original_text),
    normalizedText: String(row.normalized_text),
    languageRatioKo: Number(row.language_ratio_ko),
    regionConfidence: Number(row.region_confidence),
    localExpressionConfidence: Number(row.local_expression_confidence),
    activityWindowConfidence: Number(row.activity_window_confidence),
    antiRebroadcastConfidence: Number(row.anti_rebroadcast_confidence),
    authenticityScore: Number(row.authenticity_score),
    likesCount: Number(row.likes_count),
    commentsCount: Number(row.comments_count),
    viewsCount: Number(row.views_count),
    sharesCount: Number(row.shares_count)
  };
}

function mapMetric(row: Record<string, unknown>): TrendDailyMetric {
  return {
    clusterSlug: String(row.cluster_slug),
    metricDate: String(row.metric_date),
    mentionCount: Number(row.mention_count),
    engagementSum: Number(row.engagement_sum),
    trendScore: Number(row.trend_score),
    commercialPotentialScore: Number(row.commercial_potential_score)
  };
}

function mapSignal(row: Record<string, unknown>): TrendSignal {
  return {
    id: String(row.id),
    clusterSlug: String(row.cluster_slug),
    sourcePlatform: row.source_platform as TrendSignal["sourcePlatform"],
    sourceUrl: String(row.source_url),
    signalTitle: String(row.signal_title),
    signalType: row.signal_type as TrendSignal["signalType"],
    regionCode: String(row.region_code),
    observedRank: row.observed_rank ? Number(row.observed_rank) : undefined,
    observedValue: row.observed_value ? String(row.observed_value) : undefined,
    summary: String(row.summary),
    confidenceScore: Number(row.confidence_score),
    collectedAt: String(row.collected_at)
  };
}

function mapEvidence(row: Record<string, unknown>): EvidenceRecord {
  return {
    id: String(row.id),
    clusterSlug: String(row.cluster_slug),
    sourcePlatform: row.source_platform as EvidenceRecord["sourcePlatform"],
    sourceUrl: String(row.source_url),
    evidenceType: row.evidence_type as EvidenceRecord["evidenceType"],
    headline: String(row.headline),
    excerpt: String(row.excerpt),
    analystNote: row.analyst_note ? String(row.analyst_note) : undefined,
    submitter: String(row.submitter),
    proofStrength: Number(row.proof_strength),
    capturedAt: String(row.captured_at),
    status: row.status as EvidenceRecord["status"]
  };
}

function applyFilters(data: TrendCluster[], filters: TrendListFilters) {
  const filtered = data.filter((item) => {
    const matchesCategory = !filters.category || item.primaryCategory === filters.category;
    const matchesLifecycle = !filters.lifecycle || item.lifecycle === filters.lifecycle;
    const matchesSearch =
      !filters.search ||
      item.primaryTermKo.includes(filters.search) ||
      item.zhExplanation.includes(filters.search);

    return matchesCategory && matchesLifecycle && matchesSearch;
  });

  const sortKey = filters.sort || "trend_score";
  const mappedKey =
    sortKey === "commercial_potential_score"
      ? "commercialPotentialScore"
      : sortKey === "growth_score"
        ? "growthScore"
        : sortKey === "freshness_score"
          ? "freshnessScore"
          : "trendScore";

  return filtered
    .sort((a, b) => (b[mappedKey] as number) - (a[mappedKey] as number))
    .slice(0, filters.limit ?? appConfig.dashboardTopLimit);
}

function buildEvidenceCoverageSummary(clusters: TrendCluster[]) {
  return [
    {
      bucket: "strong" as const,
      count: clusters.filter((item) => item.evidenceCompletenessScore >= 85).length
    },
    {
      bucket: "medium" as const,
      count: clusters.filter(
        (item) =>
          item.evidenceCompletenessScore >= 60 && item.evidenceCompletenessScore < 85
      ).length
    },
    {
      bucket: "weak" as const,
      count: clusters.filter((item) => item.evidenceCompletenessScore < 60).length
    }
  ];
}

function buildPublicSignalSummary(signals: TrendSignal[]) {
  const counts = new Map<string, number>();
  for (const signal of signals) {
    counts.set(signal.sourcePlatform, (counts.get(signal.sourcePlatform) || 0) + 1);
  }

  return Array.from(counts.entries()).map(([platform, count]) => ({
    platform: platform as DashboardData["publicSignalSummary"][number]["platform"],
    count
  }));
}

function buildDashboardFromMemory(
  clusters: TrendCluster[],
  signals: TrendSignal[]
): DashboardData {
  const top50 = [...clusters].sort((a, b) => b.trendScore - a.trendScore).slice(0, 50);
  const fastestRising = [...clusters]
    .sort((a, b) => b.growthScore - a.growthScore)
    .slice(0, 5);

  const categories = Object.fromEntries(
    appConfig.categories.map((category) => [
      category,
      applyFilters(clusters, { category, limit: 5 })
    ])
  ) as DashboardData["categoryBoards"];

  const commercializationBoards = Object.fromEntries(
    appConfig.categories.map((category) => [
      category,
      applyFilters(clusters, {
        category,
        limit: 5,
        sort: "commercial_potential_score"
      })
    ])
  ) as DashboardData["commercializationBoards"];

  const lifecycleSummary = ["emerging", "breakout", "steady", "cooling"].map((lifecycle) => ({
    lifecycle: lifecycle as DashboardData["lifecycleSummary"][number]["lifecycle"],
    count: clusters.filter((item) => item.lifecycle === lifecycle).length
  }));

  const platformCounts = new Map<string, number>();
  for (const cluster of clusters) {
    for (const platform of cluster.sourcePlatforms) {
      platformCounts.set(platform, (platformCounts.get(platform) || 0) + 1);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    top50,
    fastestRising,
    categoryBoards: categories,
    commercializationBoards,
    lifecycleSummary,
    platformSummary: Array.from(platformCounts.entries()).map(([platform, count]) => ({
      platform: platform as DashboardData["platformSummary"][number]["platform"],
      count
    })),
    evidenceCoverageSummary: buildEvidenceCoverageSummary(clusters),
    publicSignalSummary: buildPublicSignalSummary(signals)
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!isDatabaseConfigured()) {
    return buildDashboardFromMemory(seedClusters, seedSignals);
  }

  try {
    const [clusterResult, signalResult] = await Promise.all([
      query("SELECT * FROM trend_clusters ORDER BY trend_score DESC LIMIT 50"),
      query(
        `
          SELECT tps.*, tc.slug AS cluster_slug
          FROM trend_public_signals tps
          JOIN trend_clusters tc ON tc.id = tps.cluster_id
        `
      )
    ]);

    const clusters = clusterResult.rows.map((row) => mapCluster(row as Record<string, unknown>));
    const signals = signalResult.rows.map((row) => mapSignal(row as Record<string, unknown>));
    return buildDashboardFromMemory(clusters, signals);
  } catch {
    return buildDashboardFromMemory(seedClusters, seedSignals);
  }
}

export async function listTrends(filters: TrendListFilters = {}) {
  if (!isDatabaseConfigured()) {
    return applyFilters(seedClusters, filters);
  }

  try {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.category) {
      values.push(filters.category);
      conditions.push(`primary_category = $${values.length}`);
    }

    if (filters.lifecycle) {
      values.push(filters.lifecycle);
      conditions.push(`lifecycle = $${values.length}`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(
        `(primary_term_ko ILIKE $${values.length} OR zh_explanation ILIKE $${values.length})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sortColumn =
      filters.sort === "commercial_potential_score"
        ? "commercial_potential_score"
        : filters.sort === "growth_score"
          ? "growth_score"
          : filters.sort === "freshness_score"
            ? "freshness_score"
            : "trend_score";
    values.push(filters.limit ?? 50);

    const result = await query(
      `SELECT * FROM trend_clusters ${where} ORDER BY ${sortColumn} DESC LIMIT $${values.length}`,
      values
    );

    return result.rows.map((row) => mapCluster(row as Record<string, unknown>));
  } catch {
    return applyFilters(seedClusters, filters);
  }
}

export async function getTrendDetail(slug: string): Promise<TrendDetail | null> {
  if (!isDatabaseConfigured()) {
    const cluster = seedClusters.find((item) => item.slug === slug);
    if (!cluster) {
      return null;
    }

    return {
      ...cluster,
      mentions: seedMentions.filter((item) => item.clusterSlug === slug),
      metrics: seedMetrics.filter((item) => item.clusterSlug === slug),
      signals: seedSignals.filter((item) => item.clusterSlug === slug),
      evidences: seedEvidences.filter((item) => item.clusterSlug === slug)
    };
  }

  try {
    const clusterResult = await query("SELECT * FROM trend_clusters WHERE slug = $1 LIMIT 1", [
      slug
    ]);
    const clusterRow = clusterResult.rows[0];

    if (!clusterRow) {
      return null;
    }

    const mentionResult = await query(
      `
        SELECT
          tm.*,
          tc.slug AS cluster_slug
        FROM trend_mentions tm
        JOIN trend_cluster_mentions tcm ON tcm.mention_id = tm.id
        JOIN trend_clusters tc ON tc.id = tcm.cluster_id
        WHERE tc.slug = $1
        ORDER BY tm.collected_at DESC
        LIMIT 20
      `,
      [slug]
    );

    const metricResult = await query(
      `
        SELECT
          tdm.*,
          tc.slug AS cluster_slug
        FROM trend_daily_metrics tdm
        JOIN trend_clusters tc ON tc.id = tdm.cluster_id
        WHERE tc.slug = $1
        ORDER BY metric_date ASC
      `,
      [slug]
    );

    const signalResult = await query(
      `
        SELECT
          tps.*,
          tc.slug AS cluster_slug
        FROM trend_public_signals tps
        JOIN trend_clusters tc ON tc.id = tps.cluster_id
        WHERE tc.slug = $1
        ORDER BY tps.collected_at DESC
      `,
      [slug]
    );

    const evidenceResult = await query(
      `
        SELECT
          tei.*,
          tc.slug AS cluster_slug
        FROM trend_evidence_items tei
        JOIN trend_clusters tc ON tc.id = tei.cluster_id
        WHERE tc.slug = $1
        ORDER BY tei.captured_at DESC
      `,
      [slug]
    );

    return {
      ...mapCluster(clusterRow as Record<string, unknown>),
      mentions: mentionResult.rows.map((row) => mapMention(row as Record<string, unknown>)),
      metrics: metricResult.rows.map((row) => mapMetric(row as Record<string, unknown>)),
      signals: signalResult.rows.map((row) => mapSignal(row as Record<string, unknown>)),
      evidences: evidenceResult.rows.map((row) => mapEvidence(row as Record<string, unknown>))
    };
  } catch {
    const cluster = seedClusters.find((item) => item.slug === slug);
    if (!cluster) {
      return null;
    }

    return {
      ...cluster,
      mentions: seedMentions.filter((item) => item.clusterSlug === slug),
      metrics: seedMetrics.filter((item) => item.clusterSlug === slug),
      signals: seedSignals.filter((item) => item.clusterSlug === slug),
      evidences: seedEvidences.filter((item) => item.clusterSlug === slug)
    };
  }
}

export async function exportTrends() {
  return listTrends({ limit: 100 });
}

export async function listSourceCapabilities(): Promise<SourceCapability[]> {
  return getSourceCapabilities();
}

export async function listPublicTrendSites(): Promise<PublicTrendSite[]> {
  return publicTrendSites;
}

export async function listRecentEvidence(limit = 20): Promise<EvidenceRecord[]> {
  if (!isDatabaseConfigured()) {
    return seedEvidences.slice(0, limit);
  }

  try {
    const result = await query(
      `
        SELECT tei.*, tc.slug AS cluster_slug
        FROM trend_evidence_items tei
        JOIN trend_clusters tc ON tc.id = tei.cluster_id
        ORDER BY tei.captured_at DESC
        LIMIT $1
      `,
      [limit]
    );

    return result.rows.map((row) => mapEvidence(row as Record<string, unknown>));
  } catch {
    return seedEvidences.slice(0, limit);
  }
}

export async function upsertReview(input: {
  slug: string;
  reviewer: string;
  status: TrendCluster["reviewStatus"];
  notes?: string;
}) {
  if (!isDatabaseConfigured()) {
    return { ok: false, message: "Review persistence requires PostgreSQL." };
  }

  const clusterResult = await query("SELECT id FROM trend_clusters WHERE slug = $1 LIMIT 1", [
    input.slug
  ]);
  const cluster = clusterResult.rows[0] as { id: string } | undefined;

  if (!cluster) {
    return { ok: false, message: "Trend cluster not found." };
  }

  await query(
    `
      INSERT INTO trend_reviews (cluster_id, reviewer, status, notes)
      VALUES ($1, $2, $3, $4)
    `,
    [cluster.id, input.reviewer, input.status, input.notes || null]
  );

  await query(
    `
      UPDATE trend_clusters
      SET review_status = $2, review_notes = $3, updated_at = NOW()
      WHERE id = $1
    `,
    [cluster.id, input.status, input.notes || null]
  );

  return { ok: true };
}

export async function createEvidence(input: {
  slug: string;
  sourcePlatform: EvidenceRecord["sourcePlatform"];
  sourceUrl: string;
  evidenceType: EvidenceRecord["evidenceType"];
  headline: string;
  excerpt: string;
  analystNote?: string;
  submitter: string;
  proofStrength: number;
}) {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      message: "Manual evidence persistence requires PostgreSQL. You can still preview the workflow with seed data."
    };
  }

  const clusterResult = await query("SELECT id, evidence_count FROM trend_clusters WHERE slug = $1 LIMIT 1", [
    input.slug
  ]);
  const cluster = clusterResult.rows[0] as { id: string; evidence_count: number } | undefined;

  if (!cluster) {
    return { ok: false, message: "Trend cluster not found." };
  }

  await query(
    `
      INSERT INTO trend_evidence_items (
        cluster_id, source_platform, source_url, evidence_type, headline, excerpt,
        analyst_note, submitter, proof_strength, captured_at, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, NOW(), 'pending'
      )
    `,
    [
      cluster.id,
      input.sourcePlatform,
      input.sourceUrl,
      input.evidenceType,
      input.headline,
      input.excerpt,
      input.analystNote || null,
      input.submitter,
      input.proofStrength
    ]
  );

  const nextEvidenceCount = Number(cluster.evidence_count || 0) + 1;
  const completeness = Math.min(100, nextEvidenceCount * 22 + input.proofStrength * 10);

  await query(
    `
      UPDATE trend_clusters
      SET
        evidence_count = evidence_count + 1,
        evidence_completeness_score = GREATEST(evidence_completeness_score, $2),
        updated_at = NOW()
      WHERE id = $1
    `,
    [cluster.id, completeness]
  );

  return { ok: true };
}
