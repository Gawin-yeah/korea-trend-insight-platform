CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_type') THEN
    CREATE TYPE category_type AS ENUM (
      'beauty',
      'photography',
      'retouching',
      'ai_play',
      'fashion',
      'other'
    );
  END IF;
END $$;

ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'youtube_charts';
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'tiktok_creative_center';
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'naver_datalab';
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'manual_research';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lifecycle_stage') THEN
    CREATE TYPE lifecycle_stage AS ENUM (
      'emerging',
      'breakout',
      'steady',
      'cooling'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM (
      'pending',
      'approved',
      'rejected',
      'needs_review'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level') THEN
    CREATE TYPE risk_level AS ENUM (
      'low',
      'medium',
      'high'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_type') THEN
    CREATE TYPE platform_type AS ENUM (
      'youtube',
      'youtube_charts',
      'instagram_authorized',
      'threads_authorized',
      'x_api',
      'tiktok_authorized',
      'tiktok_creative_center',
      'naver',
      'naver_datalab',
      'google_trends',
      'manual_seed',
      'manual_research',
      'other'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS trend_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  primary_term_ko TEXT NOT NULL,
  romanization TEXT NOT NULL,
  zh_explanation TEXT NOT NULL,
  en_explanation TEXT NOT NULL,
  usage_context TEXT NOT NULL,
  tone TEXT NOT NULL,
  example_sentence_ko TEXT NOT NULL,
  example_sentence_zh TEXT NOT NULL,
  primary_category category_type NOT NULL,
  secondary_categories category_type[] NOT NULL DEFAULT ARRAY[]::category_type[],
  related_products TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  related_brands TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  visual_style_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  target_audience TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  source_platforms platform_type[] NOT NULL DEFAULT ARRAY[]::platform_type[],
  trend_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  growth_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  engagement_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  freshness_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  authenticity_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  productization_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  filter_template_fit_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  virality_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  young_women_relevance_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  beauty_feature_fit_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  commercial_potential_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  confidence_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  risk_level risk_level NOT NULL DEFAULT 'low',
  risk_flags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  lifecycle lifecycle_stage NOT NULL DEFAULT 'emerging',
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  collected_source_count INTEGER NOT NULL DEFAULT 0,
  collected_mention_count INTEGER NOT NULL DEFAULT 0,
  public_signal_count INTEGER NOT NULL DEFAULT 0,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  evidence_completeness_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  review_status review_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE trend_clusters
  ADD COLUMN IF NOT EXISTS public_signal_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS evidence_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS evidence_completeness_score NUMERIC(6,2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS trend_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_platform platform_type NOT NULL,
  source_url TEXT NOT NULL,
  source_title TEXT,
  source_author_name TEXT,
  source_author_handle TEXT,
  source_author_region_signal TEXT,
  source_author_language_signal TEXT,
  collected_at TIMESTAMPTZ NOT NULL,
  original_text TEXT NOT NULL,
  normalized_text TEXT NOT NULL,
  language_ratio_ko NUMERIC(5,2) NOT NULL DEFAULT 0,
  region_confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  local_expression_confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  activity_window_confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  anti_rebroadcast_confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  authenticity_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  raw_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trend_cluster_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  mention_id UUID NOT NULL REFERENCES trend_mentions(id) ON DELETE CASCADE,
  match_confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cluster_id, mention_id)
);

CREATE TABLE IF NOT EXISTS trend_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  mention_count INTEGER NOT NULL DEFAULT 0,
  engagement_sum INTEGER NOT NULL DEFAULT 0,
  trend_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  commercial_potential_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cluster_id, metric_date)
);

CREATE TABLE IF NOT EXISTS trend_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  reviewer TEXT NOT NULL,
  status review_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trend_public_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  source_platform platform_type NOT NULL,
  source_url TEXT NOT NULL,
  signal_title TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  region_code TEXT NOT NULL DEFAULT 'KR',
  observed_rank INTEGER,
  observed_value TEXT,
  summary TEXT NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  collected_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trend_evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  source_platform platform_type NOT NULL,
  source_url TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  headline TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  analyst_note TEXT,
  submitter TEXT NOT NULL,
  proof_strength NUMERIC(5,2) NOT NULL DEFAULT 0,
  captured_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_platform platform_type NOT NULL,
  status TEXT NOT NULL,
  fetched_count INTEGER NOT NULL DEFAULT 0,
  accepted_count INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trend_clusters_category ON trend_clusters(primary_category);
CREATE INDEX IF NOT EXISTS idx_trend_clusters_score ON trend_clusters(trend_score DESC);
CREATE INDEX IF NOT EXISTS idx_trend_clusters_lifecycle ON trend_clusters(lifecycle);
CREATE INDEX IF NOT EXISTS idx_trend_mentions_platform ON trend_mentions(source_platform);
CREATE INDEX IF NOT EXISTS idx_trend_mentions_collected_at ON trend_mentions(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_trend_metrics_date ON trend_daily_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_trend_signals_cluster ON trend_public_signals(cluster_id, collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_trend_evidence_cluster ON trend_evidence_items(cluster_id, captured_at DESC);
