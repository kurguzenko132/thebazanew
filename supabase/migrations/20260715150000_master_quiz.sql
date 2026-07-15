-- THE BAZA master matching quiz.  All public writes go through server routes
-- using the service role; RLS keeps configuration and analytics private.
create extension if not exists pgcrypto;

create table if not exists public.matching_tags (
  id uuid primary key default gen_random_uuid(), name text not null, key text not null unique,
  category text not null check (category in ('service','hair_type','beard_type','style','communication','interest','personality','professional_strength','client_priority','schedule','location')),
  description text, is_active boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quiz_settings (
  id uuid primary key default gen_random_uuid(), title text not null default 'ПОДОБРАТЬ МАСТЕРА',
  description text not null default 'Ответьте на несколько вопросов — это займёт около двух минут.',
  button_label text not null default 'Подобрать мастера', result_limit integer not null default 3 check (result_limit between 1 and 3),
  minimum_match_percent integer not null default 55 check (minimum_match_percent between 0 and 100),
  include_rating_bonus boolean not null default true, include_availability_bonus boolean not null default true,
  session_retention_days integer not null default 30 check (session_retention_days between 1 and 365),
  category_weights jsonb not null default '{"professional":40,"style":20,"hair":15,"priority":10,"communication":8,"interest":5,"availability":2}'::jsonb,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  question_type text not null check (question_type in ('single_choice','multiple_choice','limited_multiple_choice','scale','text','date_preference','time_preference')),
  matching_mode text not null check (matching_mode in ('hard_filter','soft_score','availability','informational')),
  category text not null default 'professional', is_required boolean not null default false,
  max_selections integer check (max_selections is null or max_selections > 0), weight numeric(5,2) not null default 1 check (weight >= 0),
  sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.quiz_questions(id) on delete cascade,
  title text not null, description text, icon text, image_url text, sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quiz_option_tag_weights (
  id uuid primary key default gen_random_uuid(), option_id uuid not null references public.quiz_options(id) on delete cascade,
  tag_id uuid not null references public.matching_tags(id) on delete cascade, weight integer not null check (weight between -5 and 5),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(option_id, tag_id)
);

-- A lightweight public profile is intentionally separate from the future CMS masters table.
-- master_id is the stable ID used by booking/CMS integration.
create table if not exists public.master_quiz_profiles (
  master_id uuid primary key, display_name text not null, role text not null default 'Барбер', rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  experience_years integer not null default 0 check (experience_years >= 0), services text[] not null default '{}', availability text[] not null default '{}', booking_url text, quiz_priority integer not null default 0,
  is_active boolean not null default true, accepts_new_clients boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.master_tag_weights (
  id uuid primary key default gen_random_uuid(), master_id uuid not null references public.master_quiz_profiles(master_id) on delete cascade,
  tag_id uuid not null references public.matching_tags(id) on delete cascade, weight integer not null check (weight between 0 and 5),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(master_id, tag_id)
);

create table if not exists public.quiz_branch_rules (
  id uuid primary key default gen_random_uuid(), source_question_id uuid not null references public.quiz_questions(id) on delete cascade,
  source_option_id uuid references public.quiz_options(id) on delete cascade,
  operator text not null check (operator in ('equals','not_equals','contains','not_contains')),
  target_question_id uuid references public.quiz_questions(id) on delete cascade,
  action text not null check (action in ('show_question','hide_question','go_to_question','finish_quiz')),
  priority integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(), anonymous_session_id uuid not null unique, user_id uuid,
  status text not null default 'started' check (status in ('started','in_progress','completed','abandoned','converted')),
  started_at timestamptz not null default now(), completed_at timestamptz, source_page text,
  selected_service_id uuid, recommended_master_id uuid, converted_to_booking boolean not null default false, booking_id uuid,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade, option_id uuid references public.quiz_options(id) on delete set null,
  text_value text, numeric_value numeric, created_at timestamptz not null default now()
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  master_id uuid not null, raw_score numeric not null, normalized_score numeric not null check (normalized_score between 0 and 100),
  position integer not null check (position > 0), professional_score numeric, style_score numeric, communication_score numeric,
  interest_score numeric, availability_score numeric, explanation_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), unique(session_id, master_id)
);

create index if not exists quiz_options_question_idx on public.quiz_options(question_id, sort_order);
create index if not exists quiz_answers_session_idx on public.quiz_answers(session_id);
create index if not exists quiz_results_session_idx on public.quiz_results(session_id, position);

alter table public.matching_tags enable row level security;
alter table public.quiz_settings enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_option_tag_weights enable row level security;
alter table public.master_quiz_profiles enable row level security;
alter table public.master_tag_weights enable row level security;
alter table public.quiz_branch_rules enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.quiz_results enable row level security;

-- Only active public configuration can be read by anon; sessions/results remain server-only.
create policy "read active quiz settings" on public.quiz_settings for select using (is_active);
create policy "read active quiz questions" on public.quiz_questions for select using (is_active);
create policy "read active quiz options" on public.quiz_options for select using (is_active);
create policy "read active matching tags" on public.matching_tags for select using (is_active);
create policy "read active master quiz profiles" on public.master_quiz_profiles for select using (is_active and accepts_new_clients);
