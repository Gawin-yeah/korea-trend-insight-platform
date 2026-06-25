import type { Category, Platform } from "@/types/trend";

export interface CollectedMention {
  canonicalTermKo: string;
  category: Category;
  platform: Platform;
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
}

export interface LegalSourceAdapter {
  name: Platform;
  description: string;
  fetchMentions(): Promise<CollectedMention[]>;
}
