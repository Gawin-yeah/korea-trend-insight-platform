import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function ok() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString()
  });
}

export async function GET() {
  return ok();
}

export async function HEAD() {
  return new Response(null, {
    status: 200
  });
}
