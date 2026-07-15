import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

const sections = {
  about: ["О THE BAZA", "Бренд, философия и команда мужского салона."],
  services: ["УСЛУГИ И ЦЕНЫ", "Каталог услуг, длительность процедур и актуальная стоимость из базы данных."],
  masters: ["НАШИ МАСТЕРА", "Портфолио, специализация, опыт и удобная запись к своему мастеру."],
  works: ["РАБОТЫ", "Стрижки и образы мастеров THE BAZA."],
  academy: ["АКАДЕМИЯ", "Программы обучения, преподаватели, расписание и заявки."],
  shop: ["МАГАЗИН", "Профессиональная косметика для ежедневного ухода и укладки."],
  cart: ["КОРЗИНА", "Выбранные товары и оформление заказа."],
  checkout: ["ОФОРМЛЕНИЕ ЗАКАЗА", "Доставка, самовывоз и данные получателя."],
  contacts: ["КОНТАКТЫ", "Адрес салона, связь, карта и удобная онлайн-запись."],
  privacy: ["ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ", "Условия обработки персональных данных."],
  terms: ["ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ", "Правила использования сайта и сервисов THE BAZA."],
  admin: ["АДМИНИСТРАТИВНАЯ ПАНЕЛЬ", "Вход и управление контентом будут подключены через Supabase Auth."],
} as const;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default function SectionPage({ params }: { params: { section: string } }) {
  const content = sections[params.section as keyof typeof sections];
  if (!content) notFound();

  return (
    <main className="section-page">
      <header className="inner-header">
        <Link href="/" className="brand">THE BAZA</Link>
        <Link href="/" className="text-link">На главную <ArrowRight size={17} /></Link>
      </header>
      <section className="section-page-hero">
        <p className="eyebrow">THE BAZA</p>
        <h1>{content[0]}</h1>
        <p>{content[1]}</p>
        <Link href="/" className="button">Вернуться на главную <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}
