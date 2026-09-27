-- Waitlist for the marketing site.
-- Written only by the Next.js server action using the service role key.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and char_length(email) <= 254),
  target text,
  source text,
  created_at timestamptz not null default now()
);

-- RLS on with no policies: the anon and authenticated roles can't read or write.
alter table public.waitlist enable row level security;
