import type { Category, Platform } from "@/types/trend";

export interface PublicSignalCandidate {
  canonicalTermKo: string;
  category: Category;
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

export interface PublicSignalImporter {
  name: Platform;
  displayName: string;
  importSignals(): Promise<PublicSignalCandidate[]>;
}

