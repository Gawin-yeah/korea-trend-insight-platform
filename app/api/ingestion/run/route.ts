import { NextRequest, NextResponse } from "next/server";
import {
  runIngestionJob,
  runPublicSignalImportJob
} from "@/lib/pipeline/ingest";

export async function POST(request: NextRequest) {
  const kind = new URL(request.url).searchParams.get("kind");
  const result =
    kind === "public_signals"
      ? await runPublicSignalImportJob()
      : kind === "full_refresh"
        ? {
            publicSignals: await runPublicSignalImportJob(),
            mentions: await runIngestionJob()
          }
        : await runIngestionJob();
  return NextResponse.json(result);
}
