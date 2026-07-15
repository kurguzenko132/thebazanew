"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MasterQuizDialog } from "@/components/master-quiz/master-quiz-dialog";

const links = [
  ["О нас", "/about"],
  ["Услуги", "/services"],
  ["Мастера", "/masters"],
  ["Работы", "/works"],
  ["Академия", "/academy"],
  ["Магазин", "/shop"],
  ["Контакты", "/contacts"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return <>
    <header className="site-header">
      <Link href="/" className="brand">THE BAZA</Link>
      <nav aria-label="Основная навигация">
        {links.map(([label, href]) => <Link className={pathname === href ? "is-active" : ""} href={href} key={href}>{label}</Link>)}
      </nav>
      <div className="site-actions"><Link href="/cart" className="cart-link" aria-label="Корзина"><ShoppingBag size={19} /><i>0</i></Link><button className="outline-button">Записаться</button></div>
      <button className="mobile-toggle" onClick={() => setOpen(true)} aria-label="Открыть меню"><Menu /></button>
    </header>
    {open && <div className="site-mobile-menu" role="dialog" aria-modal="true"><button className="close-button" onClick={() => setOpen(false)} aria-label="Закрыть меню"><X /></button><Link href="/" className="brand">THE BAZA</Link><nav>{links.map(([label, href]) => <Link href={href} onClick={() => setOpen(false)} key={href}>{label}</Link>)}</nav><MasterQuizDialog sourcePage="mobile-menu">Не знаете, кого выбрать?</MasterQuizDialog><button className="button">Записаться</button></div>}
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container site-footer-grid">
      <div><Link href="/" className="brand">THE BAZA</Link><p>Мужской салон для тех, кто ценит качество, характер и детали.</p></div>
      <div><strong>НАВИГАЦИЯ</strong><Link href="/about">О нас</Link><Link href="/services">Услуги</Link><Link href="/masters">Мастера</Link><Link href="/works">Работы</Link></div>
      <div><strong>НАПРАВЛЕНИЯ</strong><Link href="/academy">Академия</Link><Link href="/shop">Магазин</Link><Link href="/contacts">Контакты</Link><Link href="/privacy">Политика</Link></div>
      <div><strong>КОНТАКТЫ</strong><span>Данные появятся после настройки</span><Link href="/contacts">Перейти к контактам</Link></div>
    </div>
  </footer>;
}
