-- Fix: signup + bank_sampah RLS errors
-- Run this in Supabase SQL Editor

-- ── PROFILES ─────────────────────────────────────────────
drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  raise warning 'handle_new_user failed: %', sqlerrm;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter function public.handle_new_user() owner to postgres;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on public.profiles to postgres, service_role;
grant select, insert, update on public.profiles to authenticated;

-- ── BANK_SAMPAH ──────────────────────────────────────────
-- Replace overly-broad "for all" policy with explicit per-action policies
drop policy if exists "bank_sampah_owner_all" on bank_sampah;
drop policy if exists "bank_sampah_admin_all" on bank_sampah;
drop policy if exists "bank_sampah_public_read" on bank_sampah;
drop policy if exists "bank_sampah_insert_own" on bank_sampah;
drop policy if exists "bank_sampah_update_own" on bank_sampah;
drop policy if exists "bank_sampah_delete_own" on bank_sampah;
drop policy if exists "bank_sampah_select_own" on bank_sampah;

-- Public can read active rows
create policy "bank_sampah_public_read" on bank_sampah
  for select using (aktif = true);

-- Owner can read their own rows (even when aktif = false / pending verification)
create policy "bank_sampah_select_own" on bank_sampah
  for select using (auth.uid() = user_id);

-- Owner insert: requires WITH CHECK
create policy "bank_sampah_insert_own" on bank_sampah
  for insert with check (auth.uid() = user_id);

create policy "bank_sampah_update_own" on bank_sampah
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "bank_sampah_delete_own" on bank_sampah
  for delete using (auth.uid() = user_id);

-- Admin overrides
create policy "bank_sampah_admin_all" on bank_sampah
  for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

grant select, insert, update, delete on public.bank_sampah to authenticated;
