-- Simplified six-question matcher schema (the public API is server-only).
create table if not exists public.master_quiz_questions (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  question_type text not null check (question_type in ('single_choice','multiple_choice','limited_multiple_choice')),
  is_required boolean not null default false, max_selections integer, weight numeric not null default 1 check (weight >= 0),
  sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.master_quiz_options (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.master_quiz_questions(id) on delete cascade,
  title text not null, description text, icon text, image_url text, internal_key text not null unique,
  sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.master_quiz_master_options (
  id uuid primary key default gen_random_uuid(), master_id uuid not null, option_id uuid not null references public.master_quiz_options(id) on delete cascade,
  strength integer not null default 1 check (strength between 1 and 5), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(master_id, option_id)
);
create table if not exists public.master_quiz_sessions (
  id uuid primary key default gen_random_uuid(), anonymous_id uuid not null unique,
  status text not null default 'started' check (status in ('started','completed','booking_clicked')),
  started_at timestamptz not null default now(), completed_at timestamptz, source_page text, result_score integer,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.master_quiz_answers (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.master_quiz_sessions(id) on delete cascade,
  question_id uuid not null references public.master_quiz_questions(id) on delete cascade,
  option_id uuid not null references public.master_quiz_options(id) on delete cascade, created_at timestamptz not null default now(), unique(session_id, question_id, option_id)
);
create table if not exists public.master_quiz_results (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.master_quiz_sessions(id) on delete cascade,
  master_id uuid not null, score numeric not null, match_percent integer not null check (match_percent between 0 and 100),
  is_top_match boolean not null default false, position integer not null, matching_reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), unique(session_id, master_id)
);
alter table if exists public.masters add column if not exists participates_in_quiz boolean not null default false;
alter table if exists public.masters add column if not exists booking_url text;
alter table if exists public.masters add column if not exists quiz_priority integer not null default 0;
alter table public.master_quiz_questions enable row level security;
alter table public.master_quiz_options enable row level security;
alter table public.master_quiz_master_options enable row level security;
alter table public.master_quiz_sessions enable row level security;
alter table public.master_quiz_answers enable row level security;
alter table public.master_quiz_results enable row level security;
drop policy if exists "read active simplified quiz questions" on public.master_quiz_questions;
drop policy if exists "read active simplified quiz options" on public.master_quiz_options;
create policy "read active simplified quiz questions" on public.master_quiz_questions for select using (is_active);
create policy "read active simplified quiz options" on public.master_quiz_options for select using (is_active);
