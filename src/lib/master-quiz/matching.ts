import type { QuizConfig, QuizMaster, QuizRecommendation, QuizResult, SelectedAnswers } from "./types";

type ScoreRow = { score: number; max: number; matched: { title: string; score: number }[] };

function selectedOptions(config: QuizConfig, answers: SelectedAnswers, questionId: string) {
  const question = config.questions.find((item) => item.id === questionId);
  if (!question) return [];
  return question.options.filter((option) => answers[questionId]?.includes(option.id));
}

function preferredScheduleTags(config: QuizConfig, answers: SelectedAnswers) {
  return config.questions
    .filter((question) => question.matchingMode === "availability")
    .flatMap((question) => selectedOptions(config, answers, question.id))
    .flatMap((option) => option.tagWeights.map((tag) => tag.tagKey));
}

function matchesHardFilters(config: QuizConfig, answers: SelectedAnswers, master: QuizMaster) {
  return config.questions
    .filter((question) => question.matchingMode === "hard_filter")
    .every((question) => {
      const tags = selectedOptions(config, answers, question.id).flatMap((option) => option.tagWeights.map((tag) => tag.tagKey));
      return tags.length === 0 || tags.some((tag) => master.services.includes(tag));
    });
}

function scoreMaster(config: QuizConfig, answers: SelectedAnswers, master: QuizMaster): QuizRecommendation {
  const byCategory: Record<string, ScoreRow> = {};

  for (const question of config.questions.filter((item) => item.matchingMode === "soft_score")) {
    const category = byCategory[question.category] ?? { score: 0, max: 0, matched: [] };
    for (const option of selectedOptions(config, answers, question.id)) {
      for (const tag of option.tagWeights) {
        const strength = master.tagWeights[tag.tagKey] ?? 0;
        const maximum = question.weight * Math.abs(tag.weight) * 5;
        const value = question.weight * tag.weight * strength;
        category.max += maximum;
        category.score += value;
        if (value > 0) category.matched.push({ title: option.title, score: value });
      }
    }
    byCategory[question.category] = category;
  }

  let weightedScore = 0;
  let activeWeight = 0;
  Object.entries(byCategory).forEach(([category, row]) => {
    if (!row.max) return;
    const weight = config.settings.categoryWeights[category] ?? 0;
    weightedScore += Math.max(0, Math.min(1, row.score / row.max)) * weight;
    activeWeight += weight;
  });

  let percentage = activeWeight ? (weightedScore / activeWeight) * 100 : 0;
  const scheduleTags = preferredScheduleTags(config, answers);
  const hasPreferredAvailability = scheduleTags.length === 0 || scheduleTags.some((tag) => (master.tagWeights[tag] ?? 0) > 0);
  if (config.settings.includeAvailabilityBonus && hasPreferredAvailability) percentage += 2;
  if (config.settings.includeRatingBonus) percentage += Math.max(0, master.rating - 4.5) * 6;
  percentage = Math.round(Math.max(0, Math.min(100, percentage)));

  const strongest = Object.values(byCategory)
    .flatMap((row) => row.matched)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.title)
    .filter((title, index, all) => all.indexOf(title) === index)
    .slice(0, 3);
  const reasons = strongest.map((title) => `Подходит ваш запрос: ${title.toLocaleLowerCase("ru")}.`);
  if (hasPreferredAvailability) reasons.push("Есть удобное время для записи.");
  if (master.rating >= 4.9) reasons.push("Высокий рейтинг среди гостей THE BAZA.");

  const categoryScores = Object.fromEntries(Object.entries(byCategory).map(([key, row]) => [key, { score: Math.max(0, Math.round(row.score)), max: Math.round(row.max) }]));
  return { masterId: master.id, name: master.name, role: master.role, matchPercent: percentage, rating: master.rating, experienceYears: master.experienceYears, nearestAvailability: master.availability[0] ?? "Время уточняется", bookingUrl: master.bookingUrl, hasPreferredAvailability, reasons: reasons.slice(0, 5), categoryScores };
}

export function validateAnswers(config: QuizConfig, answers: SelectedAnswers) {
  for (const question of config.questions) {
    const selected = answers[question.id] ?? [];
    if (question.isRequired && !selected.length) return `Ответьте на вопрос «${question.title}».`;
    if (question.maxSelections && selected.length > question.maxSelections) return `В вопросе «${question.title}» можно выбрать не более ${question.maxSelections} вариантов.`;
  }
  return null;
}

export function calculateMasterRecommendations(config: QuizConfig, answers: SelectedAnswers): QuizResult {
  const activeMasters = config.masters.filter((master) => master.isActive && master.acceptsNewClients);
  // A service without active masters is blocked by admin validation. This fallback
  // keeps the visitor result-safe if an invalid configuration is published.
  const matchingMasters = activeMasters.filter((master) => matchesHardFilters(config, answers, master));
  const scored = (matchingMasters.length ? matchingMasters : activeMasters)
    .map((master) => scoreMaster(config, answers, master))
    .sort((a, b) => b.matchPercent - a.matchPercent || b.rating - a.rating);
  const topScore = scored[0]?.matchPercent ?? 0;
  const recommendations = scored.filter((item) => item.matchPercent === topScore);
  return { topScore, recommendations, tieCount: recommendations.length };
}
