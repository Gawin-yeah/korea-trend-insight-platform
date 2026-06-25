interface TrendScoreInput {
  growthScore: number;
  engagementScore: number;
  crossPlatformScore: number;
  authenticityScore: number;
  freshnessScore: number;
  noisePenalty: number;
  productizationScore: number;
  filterTemplateFitScore: number;
  viralityScore: number;
  youngWomenRelevanceScore: number;
  beautyFeatureFitScore: number;
}

export function computeTrendScore(input: TrendScoreInput) {
  const base =
    input.growthScore * 0.18 +
    input.engagementScore * 0.16 +
    input.crossPlatformScore * 0.12 +
    input.authenticityScore * 0.16 +
    input.freshnessScore * 0.1 +
    input.productizationScore * 0.08 +
    input.filterTemplateFitScore * 0.06 +
    input.viralityScore * 0.06 +
    input.youngWomenRelevanceScore * 0.05 +
    input.beautyFeatureFitScore * 0.03;

  return Number(Math.max(base - input.noisePenalty, 0).toFixed(2));
}

export function computeCommercialPotentialScore(input: Omit<TrendScoreInput, "noisePenalty">) {
  return Number(
    (
      input.productizationScore * 0.32 +
      input.filterTemplateFitScore * 0.2 +
      input.viralityScore * 0.16 +
      input.youngWomenRelevanceScore * 0.16 +
      input.beautyFeatureFitScore * 0.16
    ).toFixed(2)
  );
}

