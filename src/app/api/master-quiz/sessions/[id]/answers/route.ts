import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveQuizSession } from "@/lib/master-quiz/repository";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = z.object({ questionId: z.string().uuid().or(z.string().min(1).max(100)), optionIds: z.array(z.string().max(100)).max(10) }).safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Некорректный ответ." }, { status: 400 });
  await saveQuizSession(params.id, "site", "in_progress", { [payload.data.questionId]: payload.data.optionIds });
  return NextResponse.json({ ok: true });
}
