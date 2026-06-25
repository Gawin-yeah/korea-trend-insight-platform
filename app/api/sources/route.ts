import { NextResponse } from "next/server";
import { listSourceCapabilities } from "@/lib/repositories/trends";

export async function GET() {
  const data = await listSourceCapabilities();
  return NextResponse.json(data);
}
