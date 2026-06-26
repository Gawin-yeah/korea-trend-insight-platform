import { NextRequest, NextResponse } from "next/server";
import { exportTrendSourceLinks, exportTrends } from "@/lib/repositories/trends";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";
  const slug = searchParams.get("slug");
  const scope = searchParams.get("scope");

  if (scope === "source_links" && slug) {
    const detail = await exportTrendSourceLinks(slug);

    if (!detail) {
      return NextResponse.json({ message: "Trend not found." }, { status: 404 });
    }

    if (format === "csv") {
      const header = [
        "slug",
        "primaryTermKo",
        "sourceType",
        "sourcePlatform",
        "title",
        "sourceUrl",
        "collectedAt"
      ];
      const lines = [
        header.join(","),
        ...detail.sourceLinks.map((row) =>
          [
            detail.slug,
            detail.primaryTermKo,
            row.sourceType,
            row.sourcePlatform,
            `"${row.title.replaceAll("\"", "\"\"")}"`,
            row.sourceUrl,
            row.collectedAt
          ].join(",")
        )
      ];

      return new NextResponse(lines.join("\n"), {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename=${detail.slug}-source-links.csv`
        }
      });
    }

    return NextResponse.json(detail);
  }

  const rows = await exportTrends();

  if (format === "csv") {
    const header = [
      "slug",
      "primaryTermKo",
      "primaryCategory",
      "trendScore",
      "commercialPotentialScore",
      "authenticityScore"
    ];
    const lines = [
      header.join(","),
      ...rows.map((row) =>
        [
          row.slug,
          row.primaryTermKo,
          row.primaryCategory,
          row.trendScore,
          row.commercialPotentialScore,
          row.authenticityScore
        ].join(",")
      )
    ];

    return new NextResponse(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=trends.csv"
      }
    });
  }

  return NextResponse.json(rows);
}
