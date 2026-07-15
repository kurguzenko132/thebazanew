import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveQuizSession } from "@/lib/master-quiz/repository";

export async function POST(request: NextRequest) {
  const payload = z.object({ sourcePage: z.string().max(100).optional() }).safeParse(await request.json().catch(() => ({})));
  if (!payload.success) return NextResponse.json({ error: "Некорректный источник опроса." }, { status: 400 });
  const sessionId = crypto.randomUUID();
  await saveQuizSession(sessionId, payload.data.sourcePage ?? "unknown", "started");
  return NextResponse.json({ sessionId });
}
