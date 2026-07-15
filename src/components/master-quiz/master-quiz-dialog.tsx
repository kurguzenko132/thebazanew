"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, RefreshCw, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { QuizConfig, QuizResult, SelectedAnswers } from "@/lib/master-quiz/types";

type Props = { sourcePage: string; className?: string; children?: React.ReactNode };
type DialogState = "idle" | "loading" | "intro" | "resume" | "questions" | "submitting" | "results" | "error";
const draftKey = "the-baza-master-quiz-draft-v1";

function readDraft() {
  try {
    const value = sessionStorage.getItem(draftKey);
    return value ? JSON.parse(value) as { sessionId: string; answers: SelectedAnswers; sourcePage: string } : null;
  } catch { return null; }
}

export function MasterQuizDialog({ sourcePage, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("idle");
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = () => { setOpen(false); setDialogState("idle"); requestAnimationFrame(() => openerRef.current?.focus()); };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); window.clearTimeout(timer); };
  }, [open]);

  async function createSession() {
    const response = await fetch("/api/master-quiz/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sourcePage }) });
    if (!response.ok) throw new Error("Не удалось начать опрос.");
    const payload = await response.json() as { sessionId: string };
    return payload.sessionId;
  }

  async function openQuiz() {
    setOpen(true); setDialogState("loading"); setError(null); setResult(null);
    try {
      const response = await fetch("/api/master-quiz", { cache: "no-store" });
      if (!response.ok) throw new Error("Не удалось загрузить опрос.");
      const payload = await response.json() as QuizConfig;
      setConfig(payload);
      const draft = readDraft();
      if (draft?.sessionId && Object.keys(draft.answers).length) {
        setSessionId(draft.sessionId); setAnswers(draft.answers); setDialogState("resume");
      } else {
        setSessionId(await createSession()); setAnswers({}); setStep(0); setDialogState("intro");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось открыть опрос."); setDialogState("error"); }
  }

  function persist(nextAnswers: SelectedAnswers, id = sessionId) {
    if (id) sessionStorage.setItem(draftKey, JSON.stringify({ sessionId: id, answers: nextAnswers, sourcePage }));
  }

  function selectOption(optionId: string) {
    const question = config?.questions[step];
    if (!question) return;
    const current = answers[question.id] ?? [];
    let next: string[];
    if (question.questionType === "single_choice" || question.questionType === "date_preference" || question.questionType === "time_preference") next = [optionId];
    else if (current.includes(optionId)) next = current.filter((item) => item !== optionId);
    else if (question.maxSelections && current.length >= question.maxSelections) next = current;
    else next = [...current, optionId];
    const nextAnswers = { ...answers, [question.id]: next };
    setAnswers(nextAnswers); persist(nextAnswers);
  }

  async function saveCurrentAnswer() {
    const question = config?.questions[step];
    if (!sessionId || !question) return;
    await fetch(`/api/master-quiz/sessions/${sessionId}/answers`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: question.id, optionIds: answers[question.id] ?? [] }) });
  }

  async function next() {
    const question = config?.questions[step];
    if (!question || !config) return;
    const selected = answers[question.id] ?? [];
    if (question.isRequired && !selected.length) { setError("Выберите хотя бы один вариант, чтобы продолжить."); return; }
    setError(null); await saveCurrentAnswer();
    if (step < config.questions.length - 1) { setStep((value) => value + 1); return; }
    if (!sessionId) return;
    setDialogState("submitting");
    try {
      const response = await fetch(`/api/master-quiz/sessions/${sessionId}/complete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
      const payload = await response.json() as QuizResult & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Не удалось рассчитать результат.");
      setResult(payload); sessionStorage.removeItem(draftKey); setDialogState("results");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось рассчитать результат."); setDialogState("error"); }
  }

  function restart() { sessionStorage.removeItem(draftKey); setAnswers({}); setStep(0); setResult(null); setError(null); setDialogState("questions"); }
  function recordBookingClick() { if (sessionId) void fetch(`/api/master-quiz/sessions/${sessionId}/booking-click`, { method: "POST" }); }

  const question = config?.questions[step];
  const progress = config ? Math.round(((step + 1) / config.questions.length) * 100) : 0;

  return <>
    <button ref={openerRef} className={className ?? "button"} onClick={openQuiz}>{children ?? <>Подобрать мастера <ArrowRight size={18} /></>}</button>
    {open && <div className="master-quiz-backdrop" role="presentation">
      <section className="master-quiz-dialog" role="dialog" aria-modal="true" aria-labelledby="master-quiz-title" onClick={(event) => event.stopPropagation()}>
        <button ref={closeRef} className="close-button" type="button" onClick={close} aria-label="Закрыть опрос"><X /></button>
        {dialogState === "loading" && <div className="master-quiz-loading"><LoaderCircle className="is-spinning" /><p>Готовим вопросы для подбора…</p></div>}
        {dialogState === "intro" && <div className="master-quiz-intro"><p className="eyebrow">ПОДБОР МАСТЕРА</p><h2 id="master-quiz-title">НАЙДЁМ МАСТЕРА,<br /><em>С КОТОРЫМ ВАМ БУДЕТ КОМФОРТНО</em></h2><p>Ответьте на несколько вопросов о своих интересах, характере и предпочтениях.<br /><br />Мы сравним ваши ответы с профилями мастеров и покажем, с кем у вас больше всего совпадений.</p><div className="quiz-facts"><span>6 вопросов</span><span>Около 2 минут</span><span>Без регистрации</span></div><div className="modal-actions"><button className="button" onClick={() => setDialogState("questions")}>Начать опрос <ArrowRight size={17} /></button></div></div>}
        {dialogState === "resume" && <div className="master-quiz-intro"><p className="eyebrow">ПОДБОР МАСТЕРА</p><h2 id="master-quiz-title">У ВАС ЕСТЬ<br /><em>НЕЗАВЕРШЁННЫЙ ОПРОС</em></h2><p>Ответы сохранены в этом браузере. Продолжите с того места, где остановились, или начните заново.</p><div className="modal-actions"><button className="outline-button" onClick={restart}>Начать заново <RefreshCw size={17} /></button><button className="button" onClick={() => setDialogState("questions")}>Продолжить <ArrowRight size={17} /></button></div></div>}
        {dialogState === "questions" && question && <div className="master-quiz-question"><p className="eyebrow">ПОДБОР МАСТЕРА · ШАГ {step + 1} ИЗ {config?.questions.length}</p><div className="progress" aria-label={`Прогресс: ${progress}%`}><i style={{ width: `${progress}%` }} /></div><h2 id="master-quiz-title">{question.title}</h2>{question.description && <p className="question-description">{question.description}</p>}{question.maxSelections && <p className="selection-limit">Можно выбрать до {question.maxSelections} вариантов</p>}<div className="master-quiz-options">{question.options.map((option) => { const selected = (answers[question.id] ?? []).includes(option.id); return <button type="button" className={selected ? "is-selected" : ""} onClick={() => selectOption(option.id)} aria-pressed={selected} key={option.id}><span className="option-check">{selected && <Check size={15} />}</span><span>{option.title}</span>{option.description && <small>{option.description}</small>}</button>; })}</div>{error && <p className="quiz-error" role="alert">{error}</p>}<div className="modal-actions"><button className="outline-button" type="button" onClick={() => { setError(null); setStep((value) => Math.max(0, value - 1)); }} disabled={step === 0}><ArrowLeft size={17} /> Назад</button><button className="button" type="button" onClick={next}>{step === (config?.questions.length ?? 1) - 1 ? "Показать результат" : "Далее"} <ArrowRight size={17} /></button></div></div>}
        {dialogState === "submitting" && <div className="master-quiz-loading"><Sparkles className="is-spinning" /><h2>ПОДБИРАЕМ МАСТЕРОВ</h2><p>Сравниваем ваши пожелания, специализации и доступное время.</p></div>}
        {dialogState === "results" && result && <div className="master-quiz-results"><p className="eyebrow">ВАШ РЕЗУЛЬТАТ</p><h2 id="master-quiz-title">{result.tieCount > 1 ? <>У ВАС НЕСКОЛЬКО<br /><em>ОТЛИЧНЫХ СОВПАДЕНИЙ</em></> : <>ВАШ МАСТЕР<br /><em>НАЙДЕН</em></>}</h2><p className="result-lead">{result.tieCount > 1 ? "Эти мастера набрали одинаковое количество совпадений. Выберите того, чей стиль и работы понравятся вам больше." : `Больше всего совпадений у вас с ${result.recommendations[0]?.name ?? "мастером"}.`}</p><div className="recommendation-list">{result.recommendations.map((item) => <article className="recommendation is-primary" key={item.masterId}><div><p>ЛУЧШЕЕ СОВПАДЕНИЕ</p><h3>{item.name}</h3><span>{item.role} · ★ {item.rating.toFixed(1)} · {item.experienceYears} лет опыта</span></div><strong>{item.matchPercent}%<small>совпадение</small></strong><ul>{item.reasons.map((reason) => <li key={reason}><Check size={14} />{reason}</li>)}</ul><div className="button-row"><a href={item.bookingUrl ?? process.env.NEXT_PUBLIC_BOOKING_URL ?? "/contacts"} target="_blank" rel="noreferrer" className="button" onClick={recordBookingClick}>Записаться к {item.name} <ArrowRight size={17} /></a><Link href={`/masters?master=${item.masterId}`} className="text-link">Посмотреть профиль <ArrowRight size={17} /></Link></div></article>)}</div><div className="modal-actions"><button className="outline-button" onClick={() => { setStep(0); setDialogState("questions"); }}>Изменить ответы</button><button className="text-link" onClick={restart}>Пройти заново <RefreshCw size={16} /></button></div></div>}
        {dialogState === "error" && <div className="master-quiz-intro"><p className="eyebrow">НЕ УДАЛОСЬ ЗАВЕРШИТЬ</p><h2 id="master-quiz-title">ПОПРОБУЙТЕ<br /><em>ЕЩЁ РАЗ</em></h2><p role="alert">{error ?? "Ваши ответы сохранены — попробуйте ещё раз."}</p><div className="modal-actions"><button className="outline-button" onClick={close}>Закрыть</button><button className="button" onClick={() => setDialogState("questions")}>Вернуться к опросу <ArrowRight size={17} /></button></div></div>}
      </section>
    </div>}
  </>;
}
