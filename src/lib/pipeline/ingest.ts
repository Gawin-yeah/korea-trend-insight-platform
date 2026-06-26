import { seedClusters } from "../../../db/seed-data";
import { enrichTrendIfPossible } from "@/lib/llm";
import { getPool, isDatabaseConfigured } from "@/lib/db";
import { computeAuthenticityScore } from "@/lib/pipeline/authenticity";
import { buildClusterSlug, pickCanonicalTerm } from "@/lib/pipeline/clustering";
import {
  computeCommercialPotentialScore,
  computeTrendScore
} from "@/lib/pipeline/scoring";
import type { PublicSignalCandidate } from "@/lib/public-signal-importers/base";
import { publicSignalImporterRegistry } from "@/lib/public-signal-importers/registry";
import { sourceRegistry } from "@/lib/sources/source-registry";
import type { Category, Platform, RiskLevel } from "@/types/trend";

function pickSeedTemplate(category: Category) {
  return seedClusters.find((item) => item.primaryCategory === category) || seedClusters[0];
}

function roughRomanization(termKo: string) {
  return termKo
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "");
}

function inferRiskLevel(termKo: string): RiskLevel {
  if (/(19금|야한|정치)/.test(termKo)) {
    return "high";
  }

  if (/(ai|필터|보정)/i.test(termKo)) {
    return "medium";
  }

  return "low";
}

async function ensureClusterForTerm(input: {
  canonicalTermKo: string;
  category: Category;
  sourcePlatform: Platform;
  collectedAt: string;
  originalText: string;
  trendScoreBoost?: number;
}) {
  const slug = buildClusterSlug(pickCanonicalTerm(input.canonicalTermKo));
  const template = pickSeedTemplate(input.category);
  const llmHint = await enrichTrendIfPossible(input.canonicalTermKo).catch(() => null);
  const riskLevel = inferRiskLevel(input.canonicalTermKo);
  const romanization = roughRomanization(input.canonicalTermKo);

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const clusterResult = await client.query<{
      id: string;
      source_platforms: Platform[];
    }>("SELECT id, source_platforms FROM trend_clusters WHERE slug = $1 LIMIT 1", [slug]);

    let clusterId = clusterResult.rows[0]?.id;

    if (!clusterId) {
      const insertCluster = await client.query<{ id: string }>(
        `
          INSERT INTO trend_clusters (
            slug, primary_term_ko, romanization, zh_explanation, en_explanation,
            usage_context, tone, example_sentence_ko, example_sentence_zh,
            primary_category, secondary_categories, related_products, related_brands,
            visual_style_tags, target_audience, source_platforms, trend_score, growth_score,
            engagement_score, freshness_score, authenticity_score, productization_score,
            filter_template_fit_score, virality_score, young_women_relevance_score,
            beauty_feature_fit_score, commercial_potential_score, confidence_score,
            risk_level, risk_flags, lifecycle, first_seen_at, last_seen_at,
            collected_source_count, collected_mention_count, public_signal_count,
            evidence_count, evidence_completeness_score, review_status, review_notes
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            $10, $11, $12, $13,
            $14, $15, $16, $17, $18,
            $19, $20, $21, $22,
            $23, $24, $25,
            $26, $27, $28,
            $29, $30, $31, $32, $33,
            $34, $35, $36, $37, $38, $39, $40
          )
          RETURNING id
        `,
        [
          slug,
          input.canonicalTermKo,
          romanization,
          `待人工确认。${llmHint ? "LLM 已生成辅助解释。" : ""} ${template.zhExplanation}`,
          template.enExplanation,
          template.usageContext,
          template.tone,
          input.originalText,
          template.exampleSentenceZh,
          input.category,
          template.secondaryCategories,
          template.relatedProducts,
          template.relatedBrands,
          template.visualStyleTags,
          template.targetAudience,
          [input.sourcePlatform],
          Math.max(template.trendScore, input.trendScoreBoost || 0),
          template.growthScore,
          template.engagementScore,
          template.freshnessScore,
          template.authenticityScore,
          template.productizationScore,
          template.filterTemplateFitScore,
          template.viralityScore,
          template.youngWomenRelevanceScore,
          template.beautyFeatureFitScore,
          template.commercialPotentialScore,
          template.confidenceScore,
          riskLevel,
          riskLevel === "medium" ? ["needs-review"] : [],
          "emerging",
          input.collectedAt,
          input.collectedAt,
          1,
          0,
          0,
          0,
          0,
          "pending",
          "自动导入公开趋势信号，待分析师补证据。"
        ]
      );

      clusterId = insertCluster.rows[0].id;
    } else {
      await client.query(
        `
          UPDATE trend_clusters
          SET
            last_seen_at = $2,
            collected_source_count = collected_source_count + 1,
            trend_score = GREATEST(trend_score, $3),
            source_platforms = (
              SELECT ARRAY(
                SELECT DISTINCT element
                FROM unnest(array_cat(source_platforms, ARRAY[$4]::platform_type[])) AS element
              )
            ),
            updated_at = NOW()
          WHERE id = $1
        `,
        [clusterId, input.collectedAt, input.trendScoreBoost || template.trendScore, input.sourcePlatform]
      );
    }

    await client.query("COMMIT");
    return clusterId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function upsertCollectedTerm(input: {
  canonicalTermKo: string;
  category: Category;
  sourcePlatform: Platform;
  sourceUrl: string;
  sourceTitle: string;
  sourceAuthorName?: string;
  sourceAuthorHandle?: string;
  sourceAuthorRegionSignal?: string;
  sourceAuthorLanguageSignal?: string;
  collectedAt: string;
  originalText: string;
  normalizedText: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
}) {
  const languageRatioKo = 0.95;
  const regionConfidence = input.sourceAuthorRegionSignal === "KR" ? 0.94 : 0.72;
  const localExpressionConfidence = /[가-힣]/.test(input.originalText) ? 0.9 : 0.55;
  const activityWindowConfidence = 0.85;
  const antiRebroadcastConfidence = 0.88;
  const authenticityScore = computeAuthenticityScore({
    languageRatioKo,
    regionConfidence,
    localExpressionConfidence,
    activityWindowConfidence,
    antiRebroadcastConfidence
  });

  const growthScore = 70 + Math.min(input.commentsCount / 10, 20);
  const engagementScore = Math.min(
    55 + (input.likesCount + input.commentsCount + input.sharesCount) / 50,
    99
  );
  const freshnessScore = 88;
  const productizationScore = input.category === "ai_play" ? 98 : 85;
  const filterTemplateFitScore =
    input.category === "retouching" || input.category === "beauty" ? 95 : 78;
  const viralityScore = Math.min(70 + input.sharesCount / 4, 98);
  const youngWomenRelevanceScore =
    input.category === "beauty" || input.category === "fashion" ? 95 : 84;
  const beautyFeatureFitScore =
    input.category === "beauty" || input.category === "retouching" ? 91 : 68;
  const crossPlatformScore = 72;
  const trendScore = computeTrendScore({
    growthScore,
    engagementScore,
    crossPlatformScore,
    authenticityScore: authenticityScore * 100,
    freshnessScore,
    noisePenalty: 4,
    productizationScore,
    filterTemplateFitScore,
    viralityScore,
    youngWomenRelevanceScore,
    beautyFeatureFitScore
  });
  const commercialPotentialScore = computeCommercialPotentialScore({
    growthScore,
    engagementScore,
    crossPlatformScore,
    authenticityScore: authenticityScore * 100,
    freshnessScore,
    productizationScore,
    filterTemplateFitScore,
    viralityScore,
    youngWomenRelevanceScore,
    beautyFeatureFitScore
  });

  const clusterId = await ensureClusterForTerm({
    canonicalTermKo: input.canonicalTermKo,
    category: input.category,
    sourcePlatform: input.sourcePlatform,
    collectedAt: input.collectedAt,
    originalText: input.originalText,
    trendScoreBoost: trendScore
  });

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mentionResult = await client.query<{ id: string }>(
      `
        INSERT INTO trend_mentions (
          source_platform, source_url, source_title, source_author_name,
          source_author_handle, source_author_region_signal, source_author_language_signal,
          collected_at, original_text, normalized_text, language_ratio_ko,
          region_confidence, local_expression_confidence, activity_window_confidence,
          anti_rebroadcast_confidence, authenticity_score, likes_count, comments_count,
          views_count, shares_count
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17, $18,
          $19, $20
        )
        RETURNING id
      `,
      [
        input.sourcePlatform,
        input.sourceUrl,
        input.sourceTitle,
        input.sourceAuthorName || null,
        input.sourceAuthorHandle || null,
        input.sourceAuthorRegionSignal || null,
        input.sourceAuthorLanguageSignal || null,
        input.collectedAt,
        input.originalText,
        input.normalizedText,
        languageRatioKo,
        regionConfidence,
        localExpressionConfidence,
        activityWindowConfidence,
        antiRebroadcastConfidence,
        authenticityScore,
        input.likesCount,
        input.commentsCount,
        input.viewsCount,
        input.sharesCount
      ]
    );

    await client.query(
      `
        INSERT INTO trend_cluster_mentions (cluster_id, mention_id, match_confidence)
        VALUES ($1, $2, $3)
      `,
      [clusterId, mentionResult.rows[0].id, authenticityScore]
    );

    await client.query(
      `
        INSERT INTO trend_daily_metrics (
          cluster_id, metric_date, mention_count, engagement_sum, trend_score,
          commercial_potential_score
        )
        VALUES ($1, CURRENT_DATE, 1, $2, $3, $4)
        ON CONFLICT (cluster_id, metric_date) DO UPDATE SET
          mention_count = trend_daily_metrics.mention_count + 1,
          engagement_sum = trend_daily_metrics.engagement_sum + EXCLUDED.engagement_sum,
          trend_score = GREATEST(trend_daily_metrics.trend_score, EXCLUDED.trend_score),
          commercial_potential_score = GREATEST(
            trend_daily_metrics.commercial_potential_score,
            EXCLUDED.commercial_potential_score
          )
      `,
      [
        clusterId,
        input.likesCount + input.commentsCount + input.sharesCount,
        trendScore,
        commercialPotentialScore
      ]
    );

    await client.query(
      `
        UPDATE trend_clusters
        SET
          collected_mention_count = collected_mention_count + 1,
          trend_score = GREATEST(trend_score, $2),
          commercial_potential_score = GREATEST(commercial_potential_score, $3),
          updated_at = NOW()
        WHERE id = $1
      `,
      [clusterId, trendScore, commercialPotentialScore]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function upsertPublicSignal(signal: PublicSignalCandidate) {
  const trendScoreBoost = Math.round(70 + signal.confidenceScore * 20 + (signal.observedRank ? 10 - Math.min(signal.observedRank, 10) : 5));
  const clusterId = await ensureClusterForTerm({
    canonicalTermKo: signal.canonicalTermKo,
    category: signal.category,
    sourcePlatform: signal.sourcePlatform,
    collectedAt: signal.collectedAt,
    originalText: signal.summary,
    trendScoreBoost
  });

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        INSERT INTO trend_public_signals (
          cluster_id, source_platform, source_url, signal_title, signal_type,
          region_code, observed_rank, observed_value, summary, confidence_score, collected_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11
        )
      `,
      [
        clusterId,
        signal.sourcePlatform,
        signal.sourceUrl,
        signal.signalTitle,
        signal.signalType,
        signal.regionCode,
        signal.observedRank || null,
        signal.observedValue || null,
        signal.summary,
        signal.confidenceScore,
        signal.collectedAt
      ]
    );

    await client.query(
      `
        UPDATE trend_clusters
        SET
          public_signal_count = public_signal_count + 1,
          source_platforms = (
            SELECT ARRAY(
              SELECT DISTINCT element
              FROM unnest(array_cat(source_platforms, ARRAY[$2]::platform_type[])) AS element
            )
          ),
          updated_at = NOW()
        WHERE id = $1
      `,
      [clusterId, signal.sourcePlatform]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function runPublicSignalImportJob() {
  if (!isDatabaseConfigured()) {
    const importerResults: Array<{ platform: Platform; importedCount: number }> = [];
    let importedCount = 0;

    for (const importer of publicSignalImporterRegistry) {
      const signals = await importer.importSignals();
      importedCount += signals.length;
      importerResults.push({
        platform: importer.name,
        importedCount: signals.length
      });
    }

    return {
      source: "public_signal_snapshots",
      importedCount,
      importers: importerResults,
      message:
        "当前为本地预览模式：公开趋势快照已完成模拟导入，但不会持久化到 PostgreSQL。"
    };
  }

  const importerResults: Array<{ platform: Platform; importedCount: number }> = [];
  let importedCount = 0;

  for (const importer of publicSignalImporterRegistry) {
    const signals = await importer.importSignals();
    for (const signal of signals) {
      await upsertPublicSignal(signal);
      importedCount += 1;
    }

    importerResults.push({
      platform: importer.name,
      importedCount: signals.length
    });
  }

  return {
    source: "public_signal_snapshots",
    importedCount,
    importers: importerResults,
    message: "Public signal import completed."
  };
}

export async function runIngestionJob() {
  if (!isDatabaseConfigured()) {
    return {
      source: "database_not_configured",
      fetchedCount: 0,
      acceptedCount: 0
    };
  }

  let fetchedCount = 0;
  let acceptedCount = 0;

  for (const adapter of sourceRegistry) {
    const mentions = await adapter.fetchMentions();
    fetchedCount += mentions.length;

    try {
      const run = await getPool().query<{ id: string }>(
        `
          INSERT INTO ingestion_runs (source_platform, status, fetched_count, accepted_count, message)
          VALUES ($1, 'running', 0, 0, $2)
          RETURNING id
        `,
        [adapter.name, adapter.description]
      );
      const runId = run.rows[0].id;
      let adapterAcceptedCount = 0;

      for (const mention of mentions) {
        if (mention.sourceAuthorRegionSignal === "KR" || mention.platform === "youtube") {
          await upsertCollectedTerm({
            canonicalTermKo: mention.canonicalTermKo,
            category: mention.category,
            sourcePlatform: mention.platform,
            sourceUrl: mention.sourceUrl,
            sourceTitle: mention.sourceTitle,
            sourceAuthorName: mention.sourceAuthorName,
            sourceAuthorHandle: mention.sourceAuthorHandle,
            sourceAuthorRegionSignal: mention.sourceAuthorRegionSignal,
            sourceAuthorLanguageSignal: mention.sourceAuthorLanguageSignal,
            collectedAt: mention.collectedAt,
            originalText: mention.originalText,
            normalizedText: mention.normalizedText,
            likesCount: mention.likesCount,
            commentsCount: mention.commentsCount,
            viewsCount: mention.viewsCount,
            sharesCount: mention.sharesCount
          });
          acceptedCount += 1;
          adapterAcceptedCount += 1;
        }
      }

      await getPool().query(
        `
          UPDATE ingestion_runs
          SET status = 'completed', fetched_count = $2, accepted_count = $3, completed_at = NOW()
          WHERE id = $1
        `,
        [runId, mentions.length, adapterAcceptedCount]
      );
    } catch (error) {
      throw error;
    }
  }

  return {
    source: "legal_sources",
    fetchedCount,
    acceptedCount
  };
}
