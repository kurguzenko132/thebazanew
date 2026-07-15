import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Check, Clock3, Package, Scissors, ShieldCheck, Sparkles, Star, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";

type PageKind = "services" | "masters" | "works" | "academy" | "shop" | "about" | "contacts";

const serviceTypes = ["Стрижки", "Борода", "Бритьё", "Уход", "Комплексы"];
const workTypes = ["Все работы", "Fade", "Classic", "Texture", "Curly", "Beard", "Long hair"];
const shopTypes = ["Все товары", "Шампуни", "Стайлинг", "Борода", "Уход", "Наборы"];

function PageHero({ eyebrow, title, description, visual = "chair" }: { eyebrow: string; title: React.ReactNode; description: string; visual?: string }) {
  return <section className={`interior-hero visual-${visual}`}><div className="container interior-hero-content"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><button className="button">Записаться <ArrowRight size={18} /></button></div><div className="interior-visual" aria-hidden="true"><span>THE<br />BAZA</span></div></div></section>;
}

function DataNotice({ entity }: { entity: string }) {
  return <div className="data-notice"><Package size={24} /><div><strong>{entity} появятся здесь после подключения каталога</strong><p>В production отображаем только данные, которые подтверждены и добавлены через административную панель.</p></div></div>;
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
  return <><PageHero eyebrow="КОМАНДА THE BAZA" title={<>НАШИ<br /><em>МАСТЕРА</em></>} description="Профессионалы своего дела. Стили, техники и специализации каждого мастера будут представлены в подтверждённых профилях." visual="master" /><section className="interior-dark-section"><div className="container"><div className="filter-row"><button className="filter is-active">Все мастера</button><button className="filter">Барберы</button><button className="filter">Топ-мастера</button><button className="filter">Борода</button><button className="filter">Fade</button></div><DataNotice entity="Профили мастеров" /></div></section><FeatureBand items={[[UsersRound,"Определите цель","Начните с результата, который хотите получить."],[Sparkles,"Изучите стиль","Обратите внимание на специализацию и работы."],[Star,"Проверьте отзывы","Ориентируйтесь на реальные отзывы клиентов."],[CalendarDays,"Выберите время","Запись покажет доступные слоты."]]} /><CtaBand title={<>ЗАПИСАТЬСЯ ОНЛАЙН<br /><em>ЗА НЕСКОЛЬКО МИНУТ</em></>} text="Запись и расписание подключим после настройки мастеров и услуг." /></>;
}

function WorksPage() {
  return <><PageHero eyebrow="ПОРТФОЛИО" title={<>РАБОТЫ<br /><em>ГОВОРЯТ ЛУЧШЕ</em><br />СЛОВ</>} description="Реальные работы мастеров помогут выбрать стиль, который подчеркнёт твою индивидуальность." visual="works" /><section className="interior-dark-section"><div className="container"><div className="filter-row">{workTypes.map((item, index) => <button className={index === 0 ? "filter is-active" : "filter"} key={item}>{item}</button>)}</div><div className="work-empty-grid"><DataNotice entity="Портфолио" /></div></div></section><FeatureBand items={[[Scissors,"Точность","Чистые линии и продуманная форма."],[ShieldCheck,"Качество","Профессиональная техника и средства."],[Sparkles,"Стиль","Образ, который соответствует тебе."],[BadgeCheck,"Доверие","Реальные работы и прозрачный выбор."]]} /><CtaBand title={<>ВЫБЕРИ СВОЕГО МАСТЕРА<br /><em>И ЗАПИШИСЬ ОНЛАЙН</em></>} text="Посмотри профили, работы и выбери удобное время." /></>;
}

function AcademyPage() {
  return <><PageHero eyebrow="THE BAZA ACADEMY" title={<>ОБУЧАЕМ.<br /><em>ВДОХНОВЛЯЕМ.</em><br />РАЗВИВАЕМ.</>} description="Академия для тех, кто хочет освоить профессию и расти в современной индустрии барберинга." visual="academy" /><FeatureBand items={[[Scissors,"Практика","Обучение строится вокруг реальной работы руками."],[UsersRound,"Наставники","Действующие специалисты делятся опытом."],[Sparkles,"Методика","Структурный путь от основ к технике."],[BadgeCheck,"Сертификат","Итоговые условия публикуются в карточке курса."]]} /><section className="interior-dark-section"><div className="container split-title"><div><p className="eyebrow">ПРОГРАММЫ ОБУЧЕНИЯ</p><h2>ВЫБЕРИ СВОЙ ПУТЬ<br /><em>В ПРОФЕССИИ</em></h2><p>Актуальные программы, даты и условия обучения будут добавляться администратором.</p></div><DataNotice entity="Программы академии" /></div></section><CtaBand title={<>ГОТОВ НАЧАТЬ СВОЙ ПУТЬ<br /><em>ВМЕСТЕ С THE BAZA?</em></>} text="Оставь заявку — мы свяжемся после публикации реальных программ." primary="Оставить заявку" /></>;
}

function ShopPage() {
  return <><PageHero eyebrow="THE BAZA ESSENTIALS" title={<>МАГАЗИН<br /><em>THE BAZA</em></>} description="Профессиональная косметика для мужчин: уход, стайлинг и продукты, которые используют мастера." visual="products" /><section className="shop-filter-section section-light"><div className="container filter-row light">{shopTypes.map((item, index) => <button className={index === 0 ? "filter is-active" : "filter"} key={item}>{item}</button>)}</div></section><section className="interior-dark-section"><div className="container"><p className="eyebrow">ВЕСЬ АССОРТИМЕНТ</p><h2>НАШИ <em>ТОВАРЫ</em></h2><DataNotice entity="Каталог продуктов" /></div></section><FeatureBand items={[[BadgeCheck,"Профессиональное качество","Средства выбираются для реального результата."],[ShieldCheck,"Проверено на практике","В каталог попадают продукты после тестирования."],[Sparkles,"Безопасные составы","Подбор с учётом типа волос и кожи."],[Star,"Идеальный результат","Уход и стайлинг для ежедневного образа."]]} /></>;
}

function AboutPage() {
  return <><PageHero eyebrow="О НАС" title={<>О THE <em>BAZA</em></>} description="THE BAZA — пространство, где стиль становится осознанным выбором, а каждая деталь работает на уверенность." visual="about" /><section className="about-philosophy"><div className="container split-title"><div className="interior-visual" aria-hidden="true"><span>THE<br />BAZA</span></div><div><p className="eyebrow">НАША ИСТОРИЯ</p><h2>ФИЛОСОФИЯ<br />И <em>ПОДХОД</em></h2><p>Мы ценим точность, индивидуальность и уважение к каждому гостю. Детали о команде и салоне публикуются после заполнения в административной панели.</p></div></div></section><FeatureBand items={[[Scissors,"Стиль","Образ, который подчёркивает индивидуальность."],[ShieldCheck,"Качество","Проверенные средства и инструменты."],[Star,"Внимание к деталям","Каждая линия имеет значение."],[UsersRound,"Сервис","Комфорт и уважение к вашему времени."]]} /><CtaBand title={<>ГОТОВ К ЛУЧШЕМУ<br /><em>ОБРАЗУ?</em></>} text="Запишись на стрижку и почувствуй уровень сервиса THE BAZA." /></>;
}

function ContactsPage() {
  return <><PageHero eyebrow="КОНТАКТЫ" title={<>КОНТАКТЫ<br /><em>THE BAZA</em></>} description="Мы всегда на связи и готовы помочь. Актуальные каналы связи и адрес появятся после заполнения общих настроек." visual="contacts" /><section className="interior-dark-section"><div className="container contact-cards"><article><Clock3 /><h3>Режим работы</h3><p>Настраивается в панели управления</p></article><article><UsersRound /><h3>Мессенджеры</h3><p>Ссылки добавляются владельцем салона</p></article><article><CalendarDays /><h3>Онлайн-запись</h3><p>Будет доступна после подключения расписания</p></article></div><div className="container map-empty"><div><strong>THE BAZA</strong><p>Карта появится после утверждения фактического адреса.</p></div></div></section><FeatureBand items={[[Clock3,"Удобное время","Выберите слот в расписании мастера."],[Package,"Как добраться","Маршрут появится вместе с картой."],[Sparkles,"На связи","Ответим через утверждённые каналы связи."],[Check,"Запись","Подтверждение придёт после оформления."]]} /><CtaBand title={<>ЖДЁМ ТЕБЯ<br /><em>В THE BAZA</em></>} text="Стиль начинается с деталей. Запишись онлайн и выбери своего мастера." /></>;
}

export function InteriorPage({ kind }: { kind: PageKind }) {
  const page = { services: <ServicesPage />, masters: <MastersPage />, works: <WorksPage />, academy: <AcademyPage />, shop: <ShopPage />, about: <AboutPage />, contacts: <ContactsPage /> }[kind];
  return <main className={`interior-page interior-${kind}`}><SiteHeader />{page}<SiteFooter /></main>;
}
