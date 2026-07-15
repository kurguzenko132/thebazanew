import { NextResponse } from "next/server";
import { saveQuizSession } from "@/lib/master-quiz/repository";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  await saveQuizSession(params.id, "site", "completed");
  return NextResponse.json({ ok: true });
}
