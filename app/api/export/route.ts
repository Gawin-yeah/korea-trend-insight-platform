import { NextRequest, NextResponse } from "next/server";
import { exportTrends } from "@/lib/repositories/trends";

export async function GET(request: NextRequest) {
  const format = new URL(request.url).searchParams.get("format") || "json";
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

