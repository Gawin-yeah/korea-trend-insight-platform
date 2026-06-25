import { NextRequest, NextResponse } from "next/server";
import { listTrends } from "@/lib/repositories/trends";
import type { Category, Lifecycle } from "@/types/trend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = await listTrends({
    category: (searchParams.get("category") as Category | null) || undefined,
    lifecycle: (searchParams.get("lifecycle") as Lifecycle | null) || undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    search: searchParams.get("search") || undefined,
    sort:
      (searchParams.get("sort") as
        | "trend_score"
        | "commercial_potential_score"
        | "growth_score"
        | "freshness_score"
        | null) || undefined
  });

  return NextResponse.json(data);
}

