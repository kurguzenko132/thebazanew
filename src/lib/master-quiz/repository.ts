import { createClient } from "@supabase/supabase-js";
import { demoQuizConfig } from "./demo";
import type { QuizConfig } from "./types";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

/**
 * Uses Supabase only on the server. Until the migration is applied and the quiz
 * is populated, the explicitly test-only fixture keeps preview environments usable.
 */
export async function getMasterQuizConfig(): Promise<{ config: QuizConfig; source: "supabase" | "test" }> {
  const supabase = serverClient();
  if (!supabase) return { config: demoQuizConfig, source: "test" };

  const [settingsResult, questionsResult, optionsResult, optionTagsResult, profilesResult, masterTagsResult] = await Promise.all([
    supabase.from("quiz_settings").select("*").eq("is_active", true).limit(1).maybeSingle(),
    supabase.from("quiz_questions").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("quiz_options").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("quiz_option_tag_weights").select("option_id, weight, matching_tags(key)"),
    supabase.from("master_quiz_profiles").select("*").eq("is_active", true).eq("accepts_new_clients", true),
    supabase.from("master_tag_weights").select("master_id, weight, matching_tags(key)"),
  ]);

  if (settingsResult.error || questionsResult.error || optionsResult.error || optionTagsResult.error || profilesResult.error || masterTagsResult.error || !settingsResult.data || !questionsResult.data.length || !profilesResult.data.length) {
    return { config: demoQuizConfig, source: "test" };
  }

  const optionTags = new Map<string, { tagKey: string; weight: number }[]>();
  for (const row of optionTagsResult.data as unknown as Array<{ option_id: string; weight: number; matching_tags: { key: string } | { key: string }[] | null }>) {
    const tag = Array.isArray(row.matching_tags) ? row.matching_tags[0] : row.matching_tags;
    if (!tag?.key) continue;
    optionTags.set(row.option_id, [...(optionTags.get(row.option_id) ?? []), { tagKey: tag.key, weight: row.weight }]);
  }
  const optionsByQuestion = new Map<string, Array<{ id: string; title: string; description?: string; tagWeights: { tagKey: string; weight: number }[] }>>();
  for (const row of optionsResult.data) {
    optionsByQuestion.set(row.question_id, [...(optionsByQuestion.get(row.question_id) ?? []), { id: row.id, title: row.title, description: row.description ?? undefined, tagWeights: optionTags.get(row.id) ?? [] }]);
  }
  const masterTags = new Map<string, Record<string, number>>();
  for (const row of masterTagsResult.data as unknown as Array<{ master_id: string; weight: number; matching_tags: { key: string } | { key: string }[] | null }>) {
    const tag = Array.isArray(row.matching_tags) ? row.matching_tags[0] : row.matching_tags;
    if (!tag?.key) continue;
    masterTags.set(row.master_id, { ...(masterTags.get(row.master_id) ?? {}), [tag.key]: row.weight });
  }
  const config: QuizConfig = {
    settings: {
      id: settingsResult.data.id, title: settingsResult.data.title, description: settingsResult.data.description, buttonLabel: settingsResult.data.button_label, resultLimit: settingsResult.data.result_limit, minimumMatchPercent: settingsResult.data.minimum_match_percent, includeRatingBonus: settingsResult.data.include_rating_bonus, includeAvailabilityBonus: settingsResult.data.include_availability_bonus, isActive: settingsResult.data.is_active, categoryWeights: settingsResult.data.category_weights ?? demoQuizConfig.settings.categoryWeights,
    },
    questions: questionsResult.data.map((row) => ({ id: row.id, title: row.title, description: row.description ?? undefined, questionType: row.question_type, matchingMode: row.matching_mode, category: row.category, isRequired: row.is_required, maxSelections: row.max_selections ?? undefined, weight: row.weight, options: optionsByQuestion.get(row.id) ?? [] })),
    masters: profilesResult.data.map((row) => ({ id: row.master_id, name: row.display_name, role: row.role, rating: Number(row.rating), experienceYears: row.experience_years, isActive: row.is_active, acceptsNewClients: row.accepts_new_clients, services: row.services, tagWeights: masterTags.get(row.master_id) ?? {}, availability: row.availability ?? [], bookingUrl: row.booking_url ?? undefined })),
  };
  return { config, source: "supabase" };
}

export async function saveQuizSession(id: string, sourcePage: string, status: "started" | "in_progress" | "completed", answers?: Record<string, string[]>) {
  const supabase = serverClient();
  if (!supabase) return;
  await supabase.from("quiz_sessions").upsert({ id, anonymous_session_id: id, source_page: sourcePage, status, completed_at: status === "completed" ? new Date().toISOString() : null }, { onConflict: "id" });
  if (!answers) return;
  const { data: questions } = await supabase.from("quiz_questions").select("id");
  const optionRows = Object.entries(answers).flatMap(([questionId, optionIds]) => optionIds.map((optionId) => ({ session_id: id, question_id: questionId, option_id: optionId })));
  if (questions && optionRows.length) {
    await supabase.from("quiz_answers").delete().eq("session_id", id);
    await supabase.from("quiz_answers").insert(optionRows);
  }
}
