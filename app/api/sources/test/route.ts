import { NextRequest, NextResponse } from "next/server";
import { testSources } from "@/lib/sources/testing";
import type { Platform } from "@/types/trend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const platform = new URL(request.url).searchParams.get("platform") as
    | Platform
    | null;
  const results = await testSources(platform || undefined);
  return NextResponse.json(results);
}

