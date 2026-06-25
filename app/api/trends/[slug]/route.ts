import { NextResponse } from "next/server";
import { getTrendDetail } from "@/lib/repositories/trends";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const detail = await getTrendDetail(slug);

  if (!detail) {
    return NextResponse.json({ message: "Trend not found." }, { status: 404 });
  }

  return NextResponse.json(detail);
}

