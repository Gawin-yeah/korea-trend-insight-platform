import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { seedClusters } from "../db/seed-data";
import { exportTrendSourceLinks, exportTrends } from "../src/lib/repositories/trends";
import type { TrendCluster, TrendSourceLink } from "../src/types/trend";

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  return text;
}

function toCsv<T extends Record<string, unknown>>(rows: T[], columns: Array<keyof T>) {
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(","));
  return [header, ...body].join("\n");
}

function mapTrendRow(item: TrendCluster) {
  return {
    slug: item.slug,
    primaryTermKo: item.primaryTermKo,
    romanization: item.romanization,
    primaryCategory: item.primaryCategory,
    trendScore: item.trendScore,
    commercialPotentialScore: item.commercialPotentialScore,
    lifecycle: item.lifecycle,
    confidenceScore: item.confidenceScore,
    riskLevel: item.riskLevel
  };
}

function mapSourceLinkRow(item: TrendSourceLink) {
  return {
    id: item.id,
    sourceType: item.sourceType,
    sourcePlatform: item.sourcePlatform,
    sourceUrl: item.sourceUrl,
    title: item.title,
    subtitle: item.subtitle || "",
    collectedAt: item.collectedAt
  };
}

async function main() {
  const root = path.join(process.cwd(), "public", "exports");
  const sourceLinksDir = path.join(root, "source-links");

  await rm(root, { recursive: true, force: true });
  await mkdir(sourceLinksDir, { recursive: true });

  const trends = await exportTrends();
  await writeFile(path.join(root, "trends.json"), `${JSON.stringify(trends, null, 2)}\n`);
  await writeFile(
    path.join(root, "trends.csv"),
    `${toCsv(trends.map(mapTrendRow), [
      "slug",
      "primaryTermKo",
      "romanization",
      "primaryCategory",
      "trendScore",
      "commercialPotentialScore",
      "lifecycle",
      "confidenceScore",
      "riskLevel"
    ])}\n`
  );

  for (const cluster of seedClusters) {
    const data = await exportTrendSourceLinks(cluster.slug);

    if (!data) {
      continue;
    }

    await writeFile(
      path.join(sourceLinksDir, `${cluster.slug}.json`),
      `${JSON.stringify(data, null, 2)}\n`
    );
    await writeFile(
      path.join(sourceLinksDir, `${cluster.slug}.csv`),
      `${toCsv(data.sourceLinks.map(mapSourceLinkRow), [
        "id",
        "sourceType",
        "sourcePlatform",
        "sourceUrl",
        "title",
        "subtitle",
        "collectedAt"
      ])}\n`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
