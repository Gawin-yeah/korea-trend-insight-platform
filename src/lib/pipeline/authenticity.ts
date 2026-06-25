import type { TrendMention } from "@/types/trend";

export interface AuthenticitySignals {
  languageRatioKo: number;
  regionConfidence: number;
  localExpressionConfidence: number;
  activityWindowConfidence: number;
  antiRebroadcastConfidence: number;
}

export function computeAuthenticityScore(signals: AuthenticitySignals) {
  return Number(
    (
      signals.languageRatioKo * 0.25 +
      signals.regionConfidence * 0.25 +
      signals.localExpressionConfidence * 0.2 +
      signals.activityWindowConfidence * 0.15 +
      signals.antiRebroadcastConfidence * 0.15
    ).toFixed(2)
  );
}

export function explainAuthenticity(mention: TrendMention) {
  return {
    koreanLanguageRatio: mention.languageRatioKo,
    koreaRegionSignal: mention.regionConfidence,
    koreanExpressionSignal: mention.localExpressionConfidence,
    koreaTimeWindowSignal: mention.activityWindowConfidence,
    antiRebroadcastSignal: mention.antiRebroadcastConfidence
  };
}

