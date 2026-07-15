import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateMasterRecommendations, validateAnswers } from "@/lib/master-quiz/matching";
import { getMasterQuizConfig, saveQuizSession } from "@/lib/master-quiz/repository";
import type { SelectedAnswers } from "@/lib/master-quiz/types";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = z.object({ answers: z.record(z.string().max(100), z.array(z.string().max(100)).max(10)) }).safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Не удалось прочитать ответы." }, { status: 400 });
  const { config } = await getMasterQuizConfig();
  const answers = payload.data.answers as SelectedAnswers;
  const validationError = validateAnswers(config, answers);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 422 });
  const result = calculateMasterRecommendations(config, answers);
  await saveQuizSession(params.id, "site", "completed", answers);
  return NextResponse.json(result);
}
