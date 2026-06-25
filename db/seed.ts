import {
  seedClusters,
  seedEvidences,
  seedMentions,
  seedMetrics,
  seedSignals
} from "./seed-data";
import { getPool } from "@/lib/db";

async function main() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const cluster of seedClusters) {
      await client.query(
        `
          INSERT INTO trend_clusters (
            id, slug, primary_term_ko, romanization, zh_explanation, en_explanation,
            usage_context, tone, example_sentence_ko, example_sentence_zh, primary_category,
            secondary_categories, related_products, related_brands, visual_style_tags,
            target_audience, source_platforms, trend_score, growth_score, engagement_score,
            freshness_score, authenticity_score, productization_score, filter_template_fit_score,
            virality_score, young_women_relevance_score, beauty_feature_fit_score,
            commercial_potential_score, confidence_score, risk_level, risk_flags,
            lifecycle, first_seen_at, last_seen_at, collected_source_count,
            collected_mention_count, public_signal_count, evidence_count,
            evidence_completeness_score, review_status, review_notes
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11,
            $12, $13, $14, $15,
            $16, $17, $18, $19, $20,
            $21, $22, $23, $24,
            $25, $26, $27,
            $28, $29, $30, $31,
            $32, $33, $34, $35,
            $36, $37, $38, $39,
            $40, $41, $42
          )
          ON CONFLICT (slug) DO UPDATE SET
            trend_score = EXCLUDED.trend_score,
            growth_score = EXCLUDED.growth_score,
            engagement_score = EXCLUDED.engagement_score,
            freshness_score = EXCLUDED.freshness_score,
            authenticity_score = EXCLUDED.authenticity_score,
            commercial_potential_score = EXCLUDED.commercial_potential_score,
            public_signal_count = EXCLUDED.public_signal_count,
            evidence_count = EXCLUDED.evidence_count,
            evidence_completeness_score = EXCLUDED.evidence_completeness_score,
            updated_at = NOW()
        `,
        [
          cluster.id,
          cluster.slug,
          cluster.primaryTermKo,
          cluster.romanization,
          cluster.zhExplanation,
          cluster.enExplanation,
          cluster.usageContext,
          cluster.tone,
          cluster.exampleSentenceKo,
          cluster.exampleSentenceZh,
          cluster.primaryCategory,
          cluster.secondaryCategories,
          cluster.relatedProducts,
          cluster.relatedBrands,
          cluster.visualStyleTags,
          cluster.targetAudience,
          cluster.sourcePlatforms,
          cluster.trendScore,
          cluster.growthScore,
          cluster.engagementScore,
          cluster.freshnessScore,
          cluster.authenticityScore,
          cluster.productizationScore,
          cluster.filterTemplateFitScore,
          cluster.viralityScore,
          cluster.youngWomenRelevanceScore,
          cluster.beautyFeatureFitScore,
          cluster.commercialPotentialScore,
          cluster.confidenceScore,
          cluster.riskLevel,
          cluster.riskFlags,
          cluster.lifecycle,
          cluster.firstSeenAt,
          cluster.lastSeenAt,
          cluster.collectedSourceCount,
          cluster.collectedMentionCount,
          cluster.publicSignalCount,
          cluster.evidenceCount,
          cluster.evidenceCompletenessScore,
          cluster.reviewStatus,
          cluster.reviewNotes || null
        ]
      );
    }

    const clusterMap = new Map<string, string>(
      seedClusters.map((cluster) => [cluster.slug, cluster.id])
    );

    for (const mention of seedMentions) {
      await client.query(
        `
          INSERT INTO trend_mentions (
            id, source_platform, source_url, source_title, source_author_name,
            source_author_handle, source_author_region_signal, source_author_language_signal,
            collected_at, original_text, normalized_text, language_ratio_ko,
            region_confidence, local_expression_confidence, activity_window_confidence,
            anti_rebroadcast_confidence, authenticity_score, likes_count, comments_count,
            views_count, shares_count
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8,
            $9, $10, $11, $12,
            $13, $14, $15,
            $16, $17, $18, $19,
            $20, $21
          )
          ON CONFLICT (id) DO NOTHING
        `,
        [
          mention.id,
          mention.sourcePlatform,
          mention.sourceUrl,
          mention.sourceTitle || null,
          mention.sourceAuthorName || null,
          mention.sourceAuthorHandle || null,
          mention.sourceAuthorRegionSignal || null,
          mention.sourceAuthorLanguageSignal || null,
          mention.collectedAt,
          mention.originalText,
          mention.normalizedText,
          mention.languageRatioKo,
          mention.regionConfidence,
          mention.localExpressionConfidence,
          mention.activityWindowConfidence,
          mention.antiRebroadcastConfidence,
          mention.authenticityScore,
          mention.likesCount,
          mention.commentsCount,
          mention.viewsCount,
          mention.sharesCount
        ]
      );

      await client.query(
        `
          INSERT INTO trend_cluster_mentions (cluster_id, mention_id, match_confidence)
          VALUES ($1, $2, $3)
          ON CONFLICT (cluster_id, mention_id) DO NOTHING
        `,
        [clusterMap.get(mention.clusterSlug), mention.id, mention.authenticityScore]
      );
    }

    for (const metric of seedMetrics) {
      await client.query(
        `
          INSERT INTO trend_daily_metrics (
            cluster_id, metric_date, mention_count, engagement_sum, trend_score,
            commercial_potential_score
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (cluster_id, metric_date) DO UPDATE SET
            mention_count = EXCLUDED.mention_count,
            engagement_sum = EXCLUDED.engagement_sum,
            trend_score = EXCLUDED.trend_score,
            commercial_potential_score = EXCLUDED.commercial_potential_score
        `,
        [
          clusterMap.get(metric.clusterSlug),
          metric.metricDate,
          metric.mentionCount,
          metric.engagementSum,
          metric.trendScore,
          metric.commercialPotentialScore
        ]
      );
    }

    for (const signal of seedSignals) {
      await client.query(
        `
          INSERT INTO trend_public_signals (
            id, cluster_id, source_platform, source_url, signal_title, signal_type,
            region_code, observed_rank, observed_value, summary, confidence_score, collected_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12
          )
          ON CONFLICT (id) DO NOTHING
        `,
        [
          signal.id,
          clusterMap.get(signal.clusterSlug),
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
    }

    for (const evidence of seedEvidences) {
      await client.query(
        `
          INSERT INTO trend_evidence_items (
            id, cluster_id, source_platform, source_url, evidence_type, headline,
            excerpt, analyst_note, submitter, proof_strength, captured_at, status
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12
          )
          ON CONFLICT (id) DO NOTHING
        `,
        [
          evidence.id,
          clusterMap.get(evidence.clusterSlug),
          evidence.sourcePlatform,
          evidence.sourceUrl,
          evidence.evidenceType,
          evidence.headline,
          evidence.excerpt,
          evidence.analystNote || null,
          evidence.submitter,
          evidence.proofStrength,
          evidence.capturedAt,
          evidence.status
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Seed data inserted.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
