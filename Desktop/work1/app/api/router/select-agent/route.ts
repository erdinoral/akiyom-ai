import { NextRequest, NextResponse } from "next/server";
import { ChatModule, getAgentSelection, Priority } from "../_lib";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { module?: ChatModule; priority?: Priority };

  if (!body.module || !body.priority) {
    return NextResponse.json({ error: "Module and priority are required." }, { status: 400 });
  }

  const selection = getAgentSelection(body.module, body.priority);
  return NextResponse.json(selection);
}
