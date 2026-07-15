import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Check, Clock3, Package, Scissors, ShieldCheck, Sparkles, Star, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { MasterQuizDialog } from "@/components/master-quiz/master-quiz-dialog";

type PageKind = "services" | "masters" | "works" | "academy" | "shop" | "about" | "contacts";

const serviceTypes = ["Стрижки", "Борода", "Бритьё", "Уход", "Комплексы"];
const workTypes = ["Все работы", "Fade", "Classic", "Texture", "Curly", "Beard", "Long hair"];
const shopTypes = ["Все товары", "Шампуни", "Стайлинг", "Борода", "Уход", "Наборы"];
const servicesPreview = ["Мужская стрижка", "Стрижка машинкой", "Стрижка + борода", "Моделирование бороды", "Королевское бритьё"];
const masterPreview = ["Классика", "Современная форма", "Fade", "Текстура"];
const workPreview = ["FADE", "TEXTURE", "CLASSIC", "CURLY", "BEARD", "LONG HAIR"];
const academyPreview = ["ОСНОВЫ БАРБЕРИНГА", "СОВРЕМЕННЫЕ ТЕХНИКИ", "FADE И ФОРМА", "РАБОТА С БОРОДОЙ"];
const shopPreview = ["DAILY CARE", "MATTE FINISH", "FIBER CREAM", "BEARD CARE", "SEA SALT", "SKIN COMFORT"];

function PageHero({ eyebrow, title, description, visual = "chair" }: { eyebrow: string; title: React.ReactNode; description: string; visual?: string }) {
  return <section className={`interior-hero visual-${visual}`}><div className="container interior-hero-content"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><div className="button-row"><button className="button">Записаться <ArrowRight size={18} /></button><MasterQuizDialog sourcePage={visual} className="text-link">Не знаете, кого выбрать? <ArrowRight size={18} /></MasterQuizDialog></div></div><div className="interior-visual" aria-hidden="true"><span>THE<br />BAZA</span></div></div></section>;
}

function DataNotice({ entity }: { entity: string }) {
  if (entity === "Услуги и цены") return <div className="service-preview-list">{servicesPreview.map((item) => <article key={item}><div><strong>{item}</strong><span>Форма, техника и уход подбираются индивидуально</span></div><span>По записи</span><button aria-label={`Выбрать ${item}`}><ArrowRight size={18} /></button></article>)}</div>;
  if (entity === "Профили мастеров") return <div className="master-grid">{masterPreview.map((style, index) => <article className="master-card" key={style}><div className={`master-portrait portrait-${index + 1}`}><span>THE<br />BAZA</span></div><div className="master-meta"><p>СПЕЦИАЛИСТ THE BAZA</p><h3>{style}</h3><span>Барбер · индивидуальный подход</span><Link href="/masters" className="text-link">Профиль <ArrowRight size={16} /></Link></div></article>)}</div>;
  if (entity === "Портфолио") return <div className="portfolio-grid">{workPreview.map((style, index) => <article className={`portfolio-card portfolio-${index + 1}`} key={style}><div><span>{style}</span><small>THE BAZA / PORTFOLIO</small></div></article>)}</div>;
  if (entity === "Программы академии") return <div className="course-grid">{academyPreview.map((course, index) => <article className={`course-card course-${index + 1}`} key={course}><span>ПРОГРАММА {String(index + 1).padStart(2,"0")}</span><h3>{course}</h3><p>Теория, демонстрация и практика в структурной программе.</p><Link href="/academy" className="text-link">Подробнее <ArrowRight size={16} /></Link></article>)}</div>;
  return <div className="product-grid">{shopPreview.map((product, index) => <article className="product-card" key={product}><div className={`product-bottle product-${index + 1}`}><span>THE<br />BAZA</span></div><h3>{product}</h3><p>Профессиональный уход и стайлинг</p><button>Подробнее <ArrowRight size={16} /></button></article>)}</div>;
}

function FeatureBand({ items }: { items: [typeof Scissors, string, string][] }) {
  return <section className="feature-band section-light"><div className="container feature-band-grid">{items.map(([Icon, title, text]) => <article key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>;
}

function CtaBand({ title, text, primary = "Записаться онлайн" }: { title: React.ReactNode; text: string; primary?: string }) {
  return <section className="interior-cta"><div className="container"><div><p className="eyebrow">THE BAZA</p><h2>{title}</h2><p>{text}</p></div><div className="button-row"><button className="button">{primary} <ArrowRight size={18} /></button><Link href="/masters" className="text-link">Выбрать мастера <ArrowRight size={18} /></Link></div></div></section>;
}

function ServicesPage() {
  return <><PageHero eyebrow="УСЛУГИ THE BAZA" title={<>УСЛУГИ<br /><em>И ЦЕНЫ</em></>} description="Каждая услуга — это внимание к деталям, точность работы и комфорт в течение всего визита." visual="tools" /><section className="interior-dark-section"><div className="container"><div className="filter-row">{serviceTypes.map((item, index) => <button className={index === 0 ? "filter is-active" : "filter"} key={item}>{item}</button>)}</div><div className="service-table"><div className="service-table-heading"><span>Услуга</span><span>Длительность</span><span>Стоимость</span></div><DataNotice entity="Услуги и цены" /></div></div></section><FeatureBand items={[[Sparkles,"Комфорт","Внимательная консультация и спокойная атмосфера."],[Package,"Профессиональные средства","Используем только средства, выбранные мастерами."],[ShieldCheck,"Стерильный инструмент","Гигиена и безопасность — часть каждого визита."],[BadgeCheck,"Рекомендации","Подскажем, как сохранить результат дома."]]} /><CtaBand title={<>ТВОЙ СТИЛЬ НАЧИНАЕТСЯ<br /><em>С ЗАПИСИ</em></>} text="Выбери удобное время и услугу — остальное возьмём на себя." /></>;
}

function MastersPage() {
  return <><PageHero eyebrow="КОМАНДА THE BAZA" title={<>НАШИ<br /><em>МАСТЕРА</em></>} description="Профессионалы своего дела. У каждого — свой набор техник, эстетика и индивидуальный подход." visual="master" /><section className="interior-dark-section"><div className="container"><div className="filter-row"><button className="filter is-active">Все мастера</button><button className="filter">Барберы</button><button className="filter">Топ-мастера</button><button className="filter">Борода</button><button className="filter">Fade</button></div><DataNotice entity="Профили мастеров" /></div></section><FeatureBand items={[[UsersRound,"Определите цель","Начните с результата, который хотите получить."],[Sparkles,"Изучите стиль","Обратите внимание на специализацию и работы."],[Star,"Проверьте отзывы","Ориентируйтесь на реальные отзывы клиентов."],[CalendarDays,"Выберите время","Выберите удобный способ записи."]]} /><CtaBand title={<>ЗАПИСАТЬСЯ ОНЛАЙН<br /><em>ЗА НЕСКОЛЬКО МИНУТ</em></>} text="Выбери мастера, услугу и подходящее время." /></>;
}

function WorksPage() {
  return <><PageHero eyebrow="ПОРТФОЛИО" title={<>РАБОТЫ<br /><em>ГОВОРЯТ ЛУЧШЕ</em><br />СЛОВ</>} description="Реальные работы мастеров помогут выбрать стиль, который подчеркнёт твою индивидуальность." visual="works" /><section className="interior-dark-section"><div className="container"><div className="filter-row">{workTypes.map((item, index) => <button className={index === 0 ? "filter is-active" : "filter"} key={item}>{item}</button>)}</div><div className="work-empty-grid"><DataNotice entity="Портфолио" /></div></div></section><FeatureBand items={[[Scissors,"Точность","Чистые линии и продуманная форма."],[ShieldCheck,"Качество","Профессиональная техника и средства."],[Sparkles,"Стиль","Образ, который соответствует тебе."],[BadgeCheck,"Доверие","Реальные работы и прозрачный выбор."]]} /><CtaBand title={<>ВЫБЕРИ СВОЕГО МАСТЕРА<br /><em>И ЗАПИШИСЬ ОНЛАЙН</em></>} text="Посмотри профили, работы и выбери удобное время." /></>;
}

function AcademyPage() {
  return <><PageHero eyebrow="THE BAZA ACADEMY" title={<>ОБУЧАЕМ.<br /><em>ВДОХНОВЛЯЕМ.</em><br />РАЗВИВАЕМ.</>} description="Академия для тех, кто хочет освоить профессию и расти в современной индустрии барберинга." visual="academy" /><FeatureBand items={[[Scissors,"Практика","Обучение строится вокруг реальной работы руками."],[UsersRound,"Наставники","Действующие специалисты делятся опытом."],[Sparkles,"Методика","Структурный путь от основ к технике."],[BadgeCheck,"Сертификат","Результат обучения фиксируется в программе."]]} /><section className="interior-dark-section"><div className="container split-title"><div><p className="eyebrow">ПРОГРАММЫ ОБУЧЕНИЯ</p><h2>ВЫБЕРИ СВОЙ ПУТЬ<br /><em>В ПРОФЕССИИ</em></h2><p>От базовых навыков до продвинутых техник — выбирайте направление, которое соответствует вашему опыту.</p></div><DataNotice entity="Программы академии" /></div></section><CtaBand title={<>ГОТОВ НАЧАТЬ СВОЙ ПУТЬ<br /><em>ВМЕСТЕ С THE BAZA?</em></>} text="Оставь заявку, чтобы получить консультацию по направлениям." primary="Оставить заявку" /></>;
}

function ShopPage() {
  return <><PageHero eyebrow="THE BAZA ESSENTIALS" title={<>МАГАЗИН<br /><em>THE BAZA</em></>} description="Профессиональная косметика для мужчин: уход, стайлинг и продукты, которые используют мастера." visual="products" /><section className="shop-filter-section section-light"><div className="container filter-row light">{shopTypes.map((item, index) => <button className={index === 0 ? "filter is-active" : "filter"} key={item}>{item}</button>)}</div></section><section className="interior-dark-section"><div className="container"><p className="eyebrow">ВЕСЬ АССОРТИМЕНТ</p><h2>НАШИ <em>ТОВАРЫ</em></h2><DataNotice entity="Каталог продуктов" /></div></section><FeatureBand items={[[BadgeCheck,"Профессиональное качество","Средства выбираются для реального результата."],[ShieldCheck,"Проверено на практике","В каталог попадают продукты после тестирования."],[Sparkles,"Безопасные составы","Подбор с учётом типа волос и кожи."],[Star,"Идеальный результат","Уход и стайлинг для ежедневного образа."]]} /></>;
}

function AboutPage() {
  return <><PageHero eyebrow="О НАС" title={<>О THE <em>BAZA</em></>} description="THE BAZA — пространство, где стиль становится осознанным выбором, а каждая деталь работает на уверенность." visual="about" /><section className="about-philosophy"><div className="container split-title"><div className="interior-visual" aria-hidden="true"><span>THE<br />BAZA</span></div><div><p className="eyebrow">НАША ИСТОРИЯ</p><h2>ФИЛОСОФИЯ<br />И <em>ПОДХОД</em></h2><p>Мы ценим точность, индивидуальность и уважение к каждому гостю. Детали о команде и салоне публикуются после заполнения в административной панели.</p></div></div></section><FeatureBand items={[[Scissors,"Стиль","Образ, который подчёркивает индивидуальность."],[ShieldCheck,"Качество","Проверенные средства и инструменты."],[Star,"Внимание к деталям","Каждая линия имеет значение."],[UsersRound,"Сервис","Комфорт и уважение к вашему времени."]]} /><CtaBand title={<>ГОТОВ К ЛУЧШЕМУ<br /><em>ОБРАЗУ?</em></>} text="Запишись на стрижку и почувствуй уровень сервиса THE BAZA." /></>;
}

function ContactsPage() {
  return <><PageHero eyebrow="КОНТАКТЫ" title={<>КОНТАКТЫ<br /><em>THE BAZA</em></>} description="Мы всегда на связи и готовы помочь. Выбери удобный способ записи или оставь заявку — команда подскажет всё необходимое." visual="contacts" /><section className="interior-dark-section"><div className="container contact-cards"><article><Clock3 /><h3>Удобное время</h3><p>Выберите время для записи, которое подходит вашему ритму.</p></article><article><UsersRound /><h3>Персональная связь</h3><p>Получите консультацию по услугам, стилю и мастерам.</p></article><article><CalendarDays /><h3>Онлайн-запись</h3><p>Запланируйте визит в несколько шагов.</p></article></div><div className="container map-empty"><div><strong>THE BAZA</strong><p>Пространство для твоего стиля, качества и уверенности.</p></div></div></section><FeatureBand items={[[Clock3,"Удобное время","Выберите подходящий слот."],[Package,"Маршрут","Информация о визите в одном месте."],[Sparkles,"На связи","Команда ответит на ваши вопросы."],[Check,"Запись","Получите подтверждение после оформления."]]} /><CtaBand title={<>ЖДЁМ ТЕБЯ<br /><em>В THE BAZA</em></>} text="Стиль начинается с деталей. Запишись онлайн и выбери своего мастера." /></>;
}

export function InteriorPage({ kind }: { kind: PageKind }) {
  const page = { services: <ServicesPage />, masters: <MastersPage />, works: <WorksPage />, academy: <AcademyPage />, shop: <ShopPage />, about: <AboutPage />, contacts: <ContactsPage /> }[kind];
  return <main className={`interior-page interior-${kind}`}><SiteHeader />{page}<SiteFooter /></main>;
}
