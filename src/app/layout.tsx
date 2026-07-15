import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE BAZA — мужской салон",
  description: "Мужской салон, академия барберинга и профессиональная косметика THE BAZA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
