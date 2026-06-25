import { NextResponse } from "next/server";
import { createEvidence } from "@/lib/repositories/trends";
import type { EvidenceRecord } from "@/types/trend";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    slug?: string;
    sourcePlatform?: EvidenceRecord["sourcePlatform"];
    sourceUrl?: string;
    evidenceType?: EvidenceRecord["evidenceType"];
    headline?: string;
    excerpt?: string;
    analystNote?: string;
    submitter?: string;
    proofStrength?: number;
  };

  if (
    !body.slug ||
    !body.sourcePlatform ||
    !body.sourceUrl ||
    !body.evidenceType ||
    !body.headline ||
    !body.excerpt ||
    !body.submitter
  ) {
    return NextResponse.json(
      { message: "slug, sourcePlatform, sourceUrl, evidenceType, headline, excerpt, submitter are required." },
      { status: 400 }
    );
  }

  const result = await createEvidence({
    slug: body.slug,
    sourcePlatform: body.sourcePlatform,
    sourceUrl: body.sourceUrl,
    evidenceType: body.evidenceType,
    headline: body.headline,
    excerpt: body.excerpt,
    analystNote: body.analystNote,
    submitter: body.submitter,
    proofStrength: typeof body.proofStrength === "number" ? body.proofStrength : 0.8
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
