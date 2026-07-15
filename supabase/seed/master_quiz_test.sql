-- TEST DATA ONLY. Run manually in a non-production Supabase project.
-- This file is deliberately separate from migrations and is never applied automatically.
insert into public.quiz_settings (title, description, button_label)
select 'ПОДОБРАТЬ МАСТЕРА', 'Ответьте на несколько вопросов — это займёт около двух минут.', 'Подобрать мастера'
where not exists (select 1 from public.quiz_settings);

-- Add tags, questions, options and master profiles through /admin/master-quiz.
-- The application uses an explicit in-code test fixture until this configuration is published.
