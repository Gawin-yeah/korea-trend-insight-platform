import { NextResponse } from "next/server";
import { upsertReview } from "@/lib/repositories/trends";
import type { ReviewStatus } from "@/types/trend";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    slug?: string;
    reviewer?: string;
    status?: ReviewStatus;
    notes?: string;
  };

  if (!body.slug || !body.reviewer || !body.status) {
    return NextResponse.json(
      { message: "slug, reviewer and status are required." },
      { status: 400 }
    );
  }

  const result = await upsertReview({
    slug: body.slug,
    reviewer: body.reviewer,
    status: body.status,
    notes: body.notes
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}

