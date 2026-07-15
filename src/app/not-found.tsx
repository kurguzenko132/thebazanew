import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">THE BAZA</p>
      <h1>СТРАНИЦА<br />НЕ НАЙДЕНА</h1>
      <Link href="/" className="button">На главную <span>→</span></Link>
    </main>
  );
}
