"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Menu,
  MessageCircle,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const services = [
  ["Мужская стрижка", "Форма, которая подходит именно тебе"],
  ["Стрижка машинкой", "Точная работа с длиной и контуром"],
  ["Стрижка + борода", "Цельный образ за один визит"],
  ["Моделирование бороды", "Аккуратная форма и чистые линии"],
  ["Камуфляж седины", "Естественный и сдержанный результат"],
  ["Королевское бритьё", "Ритуал ухода и расслабления"],
  ["Уход за волосами", "Забота о коже головы и волосах"],
];

const benefits = [
  [CircleUserRound, "Индивидуальный подход", "Учитываем черты, стиль жизни и пожелания — чтобы образ был твоим."],
  [Scissors, "Мастерство", "Техника, вкус и постоянное развитие в каждой детали."],
  [ShieldCheck, "Качество", "Профессиональные средства и чистый инструмент для уверенного результата."],
  [Sparkles, "Атмосфера", "Время для себя: спокойный интерьер, сервис и внимательное отношение."],
];

const visitSteps = [
  ["01", MessageCircle, "Консультация", "Обсудим ожидания, подберём стиль и расскажем, как добиться нужного результата."],
  ["02", Scissors, "Стрижка", "Работаем аккуратно и внимательно — без спешки и лишнего шума."],
  ["03", Sparkles, "Уход", "Подберём средства для волос, кожи головы и бороды, если это необходимо."],
  ["04", Check, "Результат", "Покажем укладку и поможем сохранить образ дома."],
];

const quizSteps = [
  { question: "Какая услуга вам нужна?", options: ["Стрижка", "Борода", "Стрижка + борода", "Бритьё", "Уход", "Нужна консультация"] },
  { question: "Какой стиль вам ближе?", options: ["Классика", "Современный", "Креативный", "Минималистичный", "Не уверен"] },
  { question: "Что особенно важно в мастере?", options: ["Опыт и точность", "Общение", "Скорость", "Работа с бородой", "Длинные волосы", "Креативность"] },
  { question: "Когда вам удобно?", options: ["Сегодня", "Завтра", "На этой неделе", "В выходные", "Время неважно"] },
];

const faqs = [
  ["Как записаться на стрижку?", "Выберите удобный способ записи — кнопка на сайте приведёт к форме или внешней системе бронирования."],
  ["Сколько стоят услуги?", "Актуальные цены и длительность услуг будут опубликованы после заполнения каталога в административной панели."],
  ["Можно ли перенести запись?", "Да. Перенос и отмена доступны через администратора или сервис записи."],
  ["Как выбрать мастера?", "Посмотрите портфолио или пройдите короткий опрос — он поможет сузить выбор."],
];

const nav = [
  ["О нас", "/about"],
  ["Услуги", "/services"],
  ["Мастера", "/masters"],
  ["Академия", "/academy"],
  ["Магазин", "/shop"],
  ["Контакты", "/contacts"],
];

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setQuizOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || quizOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, quizOpen]);

  const chooseAnswer = (answer: string) => {
    const next = [...answers];
    next[quizIndex] = answer;
    setAnswers(next);
  };

  const closeQuiz = () => {
    setQuizOpen(false);
    setQuizIndex(0);
    setAnswers([]);
  };

  return (
    <main>
      <header className="header">
        <Link href="/" className="brand" aria-label="THE BAZA — главная">THE BAZA</Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <button className="outline-button header-booking">Записаться</button>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><Menu /></button>
      </header>

      <section className="hero section-dark">
        <Image src="/images/home/hero.jpg" alt="Клиент THE BAZA в кресле у мойки" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content container">
          <p className="eyebrow">THE BAZA / МУЖСКОЙ САЛОН</p>
          <h1>МЕСТО, ГДЕ<br />МУЖЧИНА <em>СОЗДАЁТ</em><br />СВОЙ СТИЛЬ.</h1>
          <p className="hero-copy">THE BAZA — мужской салон для тех, кто ценит качество, характер и детали.<br /><br />Стрижки. Уход. Атмосфера.<br />Всё для твоего лучшего образа.</p>
          <div className="button-row">
            <button className="button">Записаться <ArrowRight size={18} /></button>
            <Link href="/services" className="text-link">Посмотреть услуги <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="intro section-light">
        <div className="container intro-head">
          <div><p className="eyebrow">НАША ФИЛОСОФИЯ</p><h2>БОЛЬШЕ,<br />ЧЕМ СТРИЖКА</h2></div>
          <p>Мы создаём не просто стрижки, а уверенность, стиль и привычки. Каждый визит — это опыт, который ты почувствуешь и увидишь.</p>
        </div>
        <div className="container benefit-grid">
          {benefits.map(([Icon, title, text]) => {
            const FeatureIcon = Icon as typeof Scissors;
            return <article className="benefit" key={title as string}><FeatureIcon /><h3>{title as string}</h3><p>{text as string}</p></article>;
          })}
        </div>
      </section>

      <section className="section-dark visit">
        <div className="container"><p className="eyebrow">КАК ПРОХОДИТ ТВОЙ ВИЗИТ</p><h2>4 ШАГА К ТВОЕМУ ЛУЧШЕМУ ОБРАЗУ</h2></div>
        <div className="container steps-grid">
          {visitSteps.map(([number, Icon, title, text]) => {
            const StepIcon = Icon as typeof Scissors;
            return <article className="step" key={number as string}><span>{number as string}</span><div className="step-icon"><StepIcon /></div><h3>{title as string}</h3><p>{text as string}</p></article>;
          })}
        </div>
      </section>

      <section className="section-light services-section" id="services">
        <div className="container services-layout">
          <div className="services-copy"><p className="eyebrow">УСЛУГИ И ЦЕНЫ</p><h2>КАЧЕСТВО,<br />КОТОРОЕ ВИДНО</h2><p>Все услуги и стоимость управляются через административную панель. Здесь будет только актуальная информация.</p><button className="button">Записаться <ArrowRight size={18} /></button></div>
          <div className="service-list" aria-label="Основные услуги">
            {services.map(([name, description]) => <Link href="/services" key={name} className="service-row"><div><strong>{name}</strong><span>{description}</span></div><ArrowRight size={18} /></Link>)}
            <p className="service-note">Цены и продолжительность появятся после подключения базы данных.</p>
          </div>
        </div>
      </section>

      <section className="quiz-section section-dark">
        <div className="quiz-background" />
        <div className="container quiz-teaser"><div><p className="eyebrow">ВАШ ИДЕАЛЬНЫЙ МАСТЕР</p><h2>ПОДБЕРЁМ МАСТЕРА<br /><em>ПОД ВАШ ЗАПРОС</em></h2><p>Ответьте на несколько вопросов — и мы предложим мастеров, которые лучше подойдут под ваш стиль и пожелания.</p><button className="button" onClick={() => setQuizOpen(true)}>Пройти опрос <ArrowRight size={18} /></button><small>Это займёт около двух минут</small></div><div className="quiz-preview"><span>ПОДБОР МАСТЕРА</span><div className="progress"><i /></div><p>Услуга · Стиль · Приоритеты · Время</p><div className="quiz-chips"><b>Стрижка</b><b>Современный</b><b>Точность</b></div></div></div>
      </section>

      <section className="care-section section-dark">
        <div className="container care-layout"><div className="product-stage" aria-hidden="true"><div className="bottle bottle-tall" /><div className="bottle" /><div className="jar" /><div className="tube" /><span>THE<br />BAZA</span></div><div><p className="eyebrow">БОЛЬШЕ, ЧЕМ СТРИЖКА</p><h2>РИТУАЛ<br /><em>ЗАБОТЫ О СЕБЕ</em></h2><p>Профессиональный уход — это не роскошь, а часть твоего образа. Подберём средства и процедуры, которые работают именно для тебя.</p><div className="button-row"><Link className="button" href="/shop">Узнать больше <ArrowRight size={18} /></Link><button className="text-link">Записаться на уход <ArrowRight size={18} /></button></div></div></div>
      </section>

      <section className="academy-section section-dark">
        <div className="academy-image"><div className="academy-tint" /><p>THE<br />BAZA<br />ACADEMY</p></div>
        <div className="academy-copy"><p className="eyebrow">THE BAZA ACADEMY</p><h2>ОБУЧАЕМ.<br /><em>ВДОХНОВЛЯЕМ.</em><br />РАЗВИВАЕМ.</h2><p>Школа барберов нового поколения. Здесь учат не просто стричь, а создавать стиль, понимать человека и строить карьеру в индустрии.</p><div className="academy-features"><span><Scissors />Практика</span><span><CircleUserRound />Наставники</span><span><BadgeCheck />Сертификат</span></div><div className="button-row"><Link href="/academy" className="button">Об академии <ArrowRight size={18} /></Link><Link href="/academy" className="text-link">Программы <ArrowRight size={18} /></Link></div></div>
      </section>

      <section className="works-section section-dark"><div className="container works-heading"><div><p className="eyebrow">НАШИ РАБОТЫ</p><h2>СТИЛЬ В<br /><em>ДЕТАЛЯХ</em></h2><p>Каждая стрижка — это характер, индивидуальность и внимание к деталям.</p></div><Link href="/works" className="text-link">Смотреть все работы <ArrowRight size={18} /></Link></div><div className="container work-grid">{["FADE", "TEXTURE", "CLASSIC", "CURLY"].map((name, index) => <Link href="/works" className={`work-card work-${index + 1}`} key={name}><span>{name}</span></Link>)}</div></section>

      <section className="reviews section-dark"><div className="container reviews-heading"><div><p className="eyebrow">ОТЗЫВЫ НАШИХ КЛИЕНТОВ</p><h2>ВАШЕ МНЕНИЕ —<br /><em>НАША ГОРДОСТЬ</em></h2></div><Link href="/" className="text-link">Все отзывы <ArrowRight size={18} /></Link></div><div className="container review-grid">{["Алексей", "Дмитрий", "Игорь"].map((name) => <article className="review" key={name}><div className="stars">★★★★★</div><p>Отзывы клиентов появятся здесь после подключения базы данных. Мы покажем только подтверждённые впечатления о визите.</p><strong>{name}</strong><span>Клиент THE BAZA</span></article>)}</div></section>

      <section className="masters section-dark"><div className="container masters-layout"><div><p className="eyebrow">НАША КОМАНДА</p><h2>НАШИ<br /><em>МАСТЕРА</em></h2><p>Профессионалы своего дела. Стиль, техника и внимание к деталям — в каждом мастере THE BAZA.</p><Link href="/masters" className="text-link">Все мастера <ArrowRight size={18} /></Link></div><div className="master-placeholder"><span>ПОРТФОЛИО<br />КОМАНДЫ</span><p>Карточки мастеров появятся после загрузки реальных фотографий и данных.</p></div></div></section>

      <section className="booking-banner section-dark"><Image src="/images/home/hero.jpg" alt="Уход за волосами в THE BAZA" fill sizes="100vw" className="booking-image" /><div className="booking-shade" /><div className="container booking-content"><div><p className="eyebrow">ОНЛАЙН-ЗАПИСЬ</p><h2>ТВОЙ ЛУЧШИЙ ОБРАЗ<br /><em>НАЧИНАЕТСЯ СЕЙЧАС</em></h2><p>Запишись онлайн и доверься профессионалам THE BAZA.</p></div><button className="button">Записаться онлайн <ArrowRight size={18} /></button></div></section>

      <section className="faq section-light"><div className="container faq-layout"><div><p className="eyebrow">ВОПРОС — ОТВЕТ</p><h2>ОТВЕТЫ НА ВАЖНЫЕ <em>ВОПРОСЫ</em></h2><p>Если у тебя остались вопросы — напиши нам в удобном мессенджере. Мы всегда на связи.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={openFaq === index ? "faq-item is-open" : "faq-item"} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><span>{openFaq === index ? "−" : "+"}</span></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></div></section>

      <section className="contacts section-dark"><div className="container contacts-layout"><div><p className="eyebrow">КОНТАКТЫ</p><h2>МЫ РЯДОМ,<br /><em>КОГДА НУЖНО</em></h2><p>Адрес, телефон, часы работы и ссылки на мессенджеры будут заполнены в административной панели.</p><button className="button">Записаться <ArrowRight size={18} /></button></div><div className="map-placeholder"><div><span>THE BAZA</span><p>Карта и маршрут будут подключены после добавления фактического адреса.</p></div><i /></div></div></section>

      <footer className="footer section-dark"><div className="container footer-grid"><div><Link href="/" className="brand">THE BAZA</Link><p>Мужской салон для тех, кто ценит качество, характер и детали.</p></div><div><strong>НАВИГАЦИЯ</strong>{nav.slice(0, 4).map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div><div><strong>УСЛУГИ</strong><Link href="/services">Стрижки</Link><Link href="/services">Борода</Link><Link href="/services">Уход</Link></div><div><strong>КОНТАКТЫ</strong><span>Данные уточняются</span><span>Настраиваются в панели</span></div></div><div className="container footer-bottom">© THE BAZA, 2026 <span>Премиальный мужской салон</span></div></footer>

      {menuOpen && <div className="mobile-menu" role="dialog" aria-modal="true"><button onClick={() => setMenuOpen(false)} className="close-button" aria-label="Закрыть меню"><X /></button><Link href="/" className="brand">THE BAZA</Link><nav>{nav.map(([label, href]) => <Link href={href} onClick={() => setMenuOpen(false)} key={href}>{label}</Link>)}</nav><button className="button">Записаться <ArrowRight size={18} /></button></div>}

      {quizOpen && <div className="quiz-modal-backdrop" role="presentation"><section className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title"><button className="close-button" onClick={closeQuiz} aria-label="Закрыть опрос"><X /></button><p className="eyebrow">ПОДБОР МАСТЕРА</p><h2 id="quiz-title">{quizIndex === quizSteps.length ? "ГОТОВО" : `ШАГ ${quizIndex + 1} ИЗ ${quizSteps.length}`}</h2><div className="progress"><i style={{ width: `${((quizIndex + 1) / quizSteps.length) * 100}%` }} /></div>{quizIndex === quizSteps.length ? <div className="quiz-result"><h3>Спасибо за ответы</h3><p>Подходящих мастеров покажем после подключения базы и расписания.</p><button className="button" onClick={closeQuiz}>Закрыть <X size={17} /></button></div> : <><h3>{quizSteps[quizIndex].question}</h3><div className="answer-grid">{quizSteps[quizIndex].options.map((option) => <button className={answers[quizIndex] === option ? "answer is-selected" : "answer"} onClick={() => chooseAnswer(option)} key={option}>{answers[quizIndex] === option && <Check size={16} />}{option}</button>)}</div><div className="modal-actions"><button className="outline-button" onClick={() => setQuizIndex(Math.max(0, quizIndex - 1))} disabled={quizIndex === 0}>Назад</button><button className="button" disabled={!answers[quizIndex]} onClick={() => setQuizIndex(quizIndex + 1)}>Далее <ArrowRight size={18} /></button></div></>}</section></div>}
    </main>
  );
}
