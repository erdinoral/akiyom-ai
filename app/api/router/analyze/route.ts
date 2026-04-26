import { NextRequest, NextResponse } from "next/server";
import { detectIntentFromPrompt } from "../_lib";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { prompt?: string };
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  const analysis = detectIntentFromPrompt(prompt);
  return NextResponse.json(analysis);
}
