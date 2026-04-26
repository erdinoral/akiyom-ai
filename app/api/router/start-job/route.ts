import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { agentName?: string; prompt?: string; module?: string };

  if (!body.agentName || !body.prompt || !body.module) {
    return NextResponse.json({ error: "agentName, module and prompt are required." }, { status: 400 });
  }

  const jobId = `job_${Date.now()}`;
  return NextResponse.json({
    accepted: true,
    jobId,
    startedAt: new Date().toISOString(),
  });
}
