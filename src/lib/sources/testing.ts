import { getSourceCapabilities } from "@/lib/sources/catalog";
import { sourceRegistry } from "@/lib/sources/source-registry";
import type { Platform } from "@/types/trend";

export interface SourceTestResult {
  platform: Platform;
  status: "ready" | "config_needed" | "planned" | "ok" | "error" | "skipped";
  fetchedCount: number;
  sampleUrls: string[];
  sampleTerms: string[];
  message: string;
}

export async function testSources(
  platform?: Platform
): Promise<SourceTestResult[]> {
  const capabilities = getSourceCapabilities();
  const adapters = sourceRegistry.filter((adapter) =>
    platform ? adapter.name === platform : true
  );

  const results: SourceTestResult[] = [];

  for (const adapter of adapters) {
    const capability = capabilities.find((item) => item.platform === adapter.name);

    if (!capability) {
      results.push({
        platform: adapter.name,
        status: "skipped",
        fetchedCount: 0,
        sampleUrls: [],
        sampleTerms: [],
        message: "No capability metadata found."
      });
      continue;
    }

    if (capability.status !== "ready") {
      results.push({
        platform: adapter.name,
        status: capability.status,
        fetchedCount: 0,
        sampleUrls: [],
        sampleTerms: [],
        message:
          capability.status === "config_needed"
            ? `Missing env: ${capability.requiredEnv
                .filter((key) => !capability.availableEnv.includes(key))
                .join(", ")}`
            : "Platform is planned but not enabled yet."
      });
      continue;
    }

    try {
      const mentions = await adapter.fetchMentions();
      results.push({
        platform: adapter.name,
        status: "ok",
        fetchedCount: mentions.length,
        sampleUrls: mentions.slice(0, 3).map((item) => item.sourceUrl),
        sampleTerms: mentions.slice(0, 5).map((item) => item.canonicalTermKo),
        message:
          mentions.length > 0
            ? "Source fetch succeeded."
            : "Source responded, but no matching keyword mentions were collected."
      });
    } catch (error) {
      results.push({
        platform: adapter.name,
        status: "error",
        fetchedCount: 0,
        sampleUrls: [],
        sampleTerms: [],
        message: error instanceof Error ? error.message : "Unknown source test error."
      });
    }
  }

  return results;
}

