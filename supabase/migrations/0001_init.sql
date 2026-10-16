-- Portfolio tables, Row Level Security, aggregate stats, and the public assets bucket.
-- Run this in the Supabase SQL editor (or via the Supabase CLI).

create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 120),
  message text not null check (char_length(message) between 1 and 4000),
  interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint contacts_interests_size check (cardinality(interests) <= 12)
);

create table if not exists public.visitor_interests (
  id uuid primary key default gen_random_uuid(),
  intent text not null check (intent in ('hiring', 'freelance', 'collaboration', 'browsing')),
  topics text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint visitor_interests_topics_size check (cardinality(topics) <= 8)
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_approved_created_idx
  on public.guestbook (created_at desc)
  where approved;

create index if not exists visitor_interests_intent_idx
  on public.visitor_interests (intent);

-- New guestbook rows always wait for approval, including inserts made with the anon key.
create or replace function public.guestbook_force_pending()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.approved := false;
  end if;
  return new;
end;
$$;

drop trigger if exists guestbook_force_pending on public.guestbook;
create trigger guestbook_force_pending
  before insert on public.guestbook
  for each row
  execute function public.guestbook_force_pending();

alter table public.contacts enable row level security;
alter table public.visitor_interests enable row level security;
alter table public.guestbook enable row level security;

drop policy if exists "Public insert contacts" on public.contacts;
create policy "Public insert contacts"
  on public.contacts
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 80
    and char_length(email) between 3 and 120
    and char_length(message) between 1 and 4000
    and cardinality(interests) <= 12
  );

drop policy if exists "Public insert visitor interests" on public.visitor_interests;
create policy "Public insert visitor interests"
  on public.visitor_interests
  for insert
  to anon, authenticated
  with check (
    intent in ('hiring', 'freelance', 'collaboration', 'browsing')
    and cardinality(topics) <= 8
  );

drop policy if exists "Public insert guestbook" on public.guestbook;
create policy "Public insert guestbook"
  on public.guestbook
  for insert
  to anon, authenticated
  with check (
    approved = false
    and char_length(name) between 1 and 80
    and char_length(message) between 1 and 500
  );

drop policy if exists "Public read approved guestbook" on public.guestbook;
create policy "Public read approved guestbook"
  on public.guestbook
  for select
  to anon, authenticated
  using (approved = true);

-- No select policy on contacts or visitor_interests: visitors cannot read individual rows.
-- Approving a guestbook note is an update done in the Supabase dashboard (service role).

create or replace view public.guestbook_approved
with (security_invoker = true) as
select id, name, message, created_at
from public.guestbook
where approved = true;

grant select on public.guestbook_approved to anon, authenticated;

-- Aggregates only. No names, emails, messages, or addresses.
create or replace function public.visitor_interest_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with counts as (
    select intent, count(*)::int as count
    from public.visitor_interests
    group by intent
  ),
  totals as (
    select coalesce(sum(count), 0)::int as total from counts
  ),
  topic_counts as (
    select topic, count(*)::int as count
    from public.visitor_interests
    cross join lateral unnest(topics) as topic
    group by topic
  )
  select jsonb_build_object(
    'total', (select total from totals),
    'intents', coalesce((
      select jsonb_agg(
        jsonb_build_object('intent', intent, 'count', count)
        order by count desc
      )
      from counts
    ), '[]'::jsonb),
    'topics', coalesce((
      select jsonb_agg(
        jsonb_build_object('topic', topic, 'count', count)
        order by count desc
      )
      from topic_counts
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.visitor_interest_stats() from public;
grant execute on function public.visitor_interest_stats() to anon, authenticated, service_role;

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read assets" on storage.objects;
create policy "Public read assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'assets');
