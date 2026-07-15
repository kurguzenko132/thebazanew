import { NextResponse } from "next/server";
import { getMasterQuizConfig } from "@/lib/master-quiz/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const { config, source } = await getMasterQuizConfig();
  return NextResponse.json({ settings: config.settings, questions: config.questions, source });
}
