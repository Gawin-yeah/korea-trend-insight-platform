import { NextResponse } from "next/server";
import { ensureFreshTrendData } from "@/lib/pipeline/ingest";
import { getDashboardData } from "@/lib/repositories/trends";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const refreshMode = url.searchParams.get("refresh");
  const staleAfterMinutes = Number(url.searchParams.get("staleAfterMinutes") || "");

  if (refreshMode === "auto" || refreshMode === "now") {
    await ensureFreshTrendData(
      Number.isFinite(staleAfterMinutes) && staleAfterMinutes > 0
        ? staleAfterMinutes
        : undefined
    );
  }

  const data = await getDashboardData();
  return NextResponse.json(data);
}
