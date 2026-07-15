import type { QuizConfig } from "./types";

export type QuizConfigurationCheck = { level: "ok" | "warning"; title: string; detail: string };

export function validateQuizConfiguration(config: QuizConfig): QuizConfigurationCheck[] {
  const checks: QuizConfigurationCheck[] = [];
  const totalWeight = Object.values(config.settings.categoryWeights).reduce((sum, value) => sum + value, 0);
  checks.push(totalWeight === 100
    ? { level: "ok", title: "Весовые категории сбалансированы", detail: "Сумма влияния профессиональных и личных факторов равна 100%." }
    : { level: "warning", title: "Весовые категории требуют настройки", detail: `Текущая сумма: ${totalWeight}%. Необходимо ровно 100%.` });

  const inactiveQuestion = config.questions.find((question) => !question.options.length);
  checks.push(!inactiveQuestion
    ? { level: "ok", title: "Вопросы заполнены вариантами", detail: `${config.questions.length} активных вопросов готовы к показу.` }
    : { level: "warning", title: "Есть пустой вопрос", detail: `Добавьте варианты ответа для «${inactiveQuestion.title}».` });

  const optionWithoutTags = config.questions.flatMap((question) => question.options).find((option) => !option.tagWeights.length);
  checks.push(!optionWithoutTags
    ? { level: "ok", title: "Варианты связаны с тегами", detail: "Каждый активный вариант влияет на подбор или доступность." }
    : { level: "warning", title: "Есть вариант без тегов", detail: `Проверьте «${optionWithoutTags.title}» или пометьте его как информационный.` });

  const incompleteMaster = config.masters.find((master) => !master.services.length || !Object.keys(master.tagWeights).length);
  checks.push(!incompleteMaster
    ? { level: "ok", title: "Профили мастеров заполнены", detail: `${config.masters.length} мастера участвуют в подборе.` }
    : { level: "warning", title: "Профиль мастера неполный", detail: `Заполните услуги и теги для «${incompleteMaster.name}».` });

  const serviceTags = new Set(config.questions.filter((question) => question.matchingMode === "hard_filter").flatMap((question) => question.options).flatMap((option) => option.tagWeights.map((tag) => tag.tagKey)));
  const unsupportedService = Array.from(serviceTags).find((tag) => !config.masters.some((master) => master.isActive && master.services.includes(tag)));
  checks.push(!unsupportedService
    ? { level: "ok", title: "Для услуг есть доступные мастера", detail: "Жёсткие фильтры не оставят клиента без результата." }
    : { level: "warning", title: "Для одной из услуг нет мастера", detail: `Ни один активный мастер не выполняет «${unsupportedService}».` });
  return checks;
}
