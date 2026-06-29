-- ============================================================
-- Migration: Nasabah tables (nasabah_profiles, saldo, qr_tokens)
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── nasabah_profiles ─────────────────────────────────────
create table nasabah_profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     varchar(255) not null,
  phone_number  varchar(20),
  created_at    timestamptz default now()
);

-- ── saldo ────────────────────────────────────────────────
create table saldo (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade unique not null,
  balance     bigint default 0 check (balance >= 0),
  updated_at  timestamptz default now()
);

-- Auto-update updated_at on saldo
create trigger saldo_updated_at
  before update on saldo
  for each row execute procedure update_updated_at();

-- ── qr_tokens ────────────────────────────────────────────
create table qr_tokens (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  token       varchar(64) unique not null,
  expires_at  timestamptz not null,
  is_used     boolean default false,
  used_at     timestamptz,
  created_at  timestamptz default now()
);

-- Index for fast token lookups by the machine API
create index qr_tokens_token_idx on qr_tokens (token);
create index qr_tokens_user_id_idx on qr_tokens (user_id);

-- ── ROW LEVEL SECURITY ───────────────────────────────────

-- nasabah_profiles: own read/write + admin read all
alter table nasabah_profiles enable row level security;

create policy "nasabah_profiles_select_own" on nasabah_profiles
  for select using (auth.uid() = id);

create policy "nasabah_profiles_insert_own" on nasabah_profiles
  for insert with check (auth.uid() = id);

create policy "nasabah_profiles_update_own" on nasabah_profiles
  for update using (auth.uid() = id);

create policy "nasabah_profiles_admin_all" on nasabah_profiles
  for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- saldo: own read/write + admin read all
alter table saldo enable row level security;

create policy "saldo_select_own" on saldo
  for select using (auth.uid() = user_id);

create policy "saldo_insert_own" on saldo
  for insert with check (auth.uid() = user_id);

create policy "saldo_update_own" on saldo
  for update using (auth.uid() = user_id);

create policy "saldo_admin_all" on saldo
  for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- qr_tokens: own read/write only (machine API uses service_role)
alter table qr_tokens enable row level security;

create policy "qr_tokens_select_own" on qr_tokens
  for select using (auth.uid() = user_id);

create policy "qr_tokens_insert_own" on qr_tokens
  for insert with check (auth.uid() = user_id);

create policy "qr_tokens_admin_all" on qr_tokens
  for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── GRANTS ───────────────────────────────────────────────
grant select, insert, update on public.nasabah_profiles to authenticated;
grant select, insert, update on public.saldo to authenticated;
grant select, insert on public.qr_tokens to authenticated;

-- ── UPDATE handle_new_user TRIGGER ───────────────────────
-- Now reads role from signup metadata so nasabah registration
-- can pass role: 'nasabah' and it will be set correctly.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role role_enum;
begin
  -- Read role from metadata, default to 'bank_sampah' if not provided
  v_role := coalesce(
    (new.raw_user_meta_data->>'role')::role_enum,
    'bank_sampah'::role_enum
  );

  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    v_role
  )
  on conflict (id) do nothing;

  return new;
exception when others then
  raise warning 'handle_new_user failed: %', sqlerrm;
  return new;
end;
$$;
