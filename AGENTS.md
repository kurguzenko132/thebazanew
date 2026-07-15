# THE BAZA — repository instructions

## Project

Production website for THE BAZA: men’s salon, booking, academy, cosmetics shop and admin panel. All client-facing copy is Russian.

## Technical rules

- Use pnpm only and strict TypeScript.
- Use Next.js App Router; default to Server Components.
- Keep interactivity in focused Client Components.
- Do not commit secrets or use invented business data.
- Use `next/image` for all site imagery.
- Store Supabase migrations in `supabase/migrations` once the data layer is connected.

## Design

Premium editorial layout: black, graphite, warm ivory, restrained copper; generous vertical sections, large typography, clear hierarchy. Do not turn unrelated sections into a dense card grid.

## Accessibility

Use semantic landmarks, visible focus states, keyboard-accessible controls and respect `prefers-reduced-motion`.
