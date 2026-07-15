import Link from "next/link";
import { BadgeCheck, CircleAlert, ListChecks, SlidersHorizontal, Tags, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { getMasterQuizConfig } from "@/lib/master-quiz/repository";
import { validateQuizConfiguration } from "@/lib/master-quiz/validation";

export const dynamic = "force-dynamic";

export default async function MasterQuizAdminPage() {
  const { config, source } = await getMasterQuizConfig();
  const checks = validateQuizConfiguration(config);
  const navigation = [[SlidersHorizontal, "Общие настройки", "Тексты, порог совпадения и вклад категорий"], [ListChecks, "Вопросы", `${config.questions.length} активных вопросов и порядок показа`], [Tags, "Теги и варианты", "Связи ответов с весами от −5 до +5"], [UsersRound, "Настройка мастеров", `${config.masters.length} активных профиля совместимости`]];
  return <main className="admin-page"><SiteHeader /><section className="admin-hero"><div className="container"><p className="eyebrow">ADMIN / MASTER QUIZ</p><h1>ПОДБОР<br /><em>МАСТЕРА</em></h1><p>Управление вопросами, тегами, профилями мастеров и правилами расчёта. Расчёт рекомендаций выполняется только на сервере.</p>{source === "test" && <div className="admin-source"><CircleAlert size={17} />Сейчас показана явно тестовая конфигурация. Примените миграцию и заполните Supabase для публикации данных.</div>}</div></section><section className="admin-content section-light"><div className="container"><div className="admin-nav-grid">{navigation.map(([Icon, title, text]) => { const ItemIcon = Icon as typeof SlidersHorizontal; return <article key={title as string}><ItemIcon /><h2>{title as string}</h2><p>{text as string}</p><span>Открыть редактор →</span></article>; })}</div><div className="admin-checks"><div><p className="eyebrow">ПРОВЕРКА НАСТРОЙКИ</p><h2>ГОТОВНОСТЬ<br /><em>ОПРОСНИКА</em></h2><p>Проверки выполняются перед публикацией, чтобы клиент не получил некорректную рекомендацию.</p></div><div>{checks.map((check) => <article className={check.level === "ok" ? "is-ok" : "is-warning"} key={check.title}>{check.level === "ok" ? <BadgeCheck /> : <CircleAlert />}<div><h3>{check.title}</h3><p>{check.detail}</p></div></article>)}</div></div><div className="admin-test-panel"><div><p className="eyebrow">ТЕСТОВЫЙ РЕЖИМ</p><h2>ПРОВЕРЬТЕ ЛОГИКУ<br /><em>ДО ПУБЛИКАЦИИ</em></h2><p>Пройдите клиентский сценарий, чтобы сверить рекомендации, причины совпадения и ближайшее время.</p></div><Link href="/" className="button">Открыть опросник <span>→</span></Link></div></div></section><SiteFooter /></main>;
}
