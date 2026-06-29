-- ============================================================
-- Migration: Convert profiles.role from TEXT+CHECK to ENUM
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop all RLS policies that reference profiles.role
--         (they block the column type change)
drop policy if exists "bank_sampah_admin_all" on bank_sampah;
drop policy if exists "artikel_admin_all" on artikel;
drop policy if exists "statistik_admin_all" on statistik;

-- Step 2: Create the new enum type
create type role_enum as enum ('admin', 'bank_sampah', 'nasabah');

-- Step 3: Drop the old check constraint
alter table profiles
  drop constraint if exists profiles_role_check;

-- Step 4: Convert the column (drop default first, cast, then restore)
alter table profiles
  alter column role drop default;

alter table profiles
  alter column role type role_enum
  using role::role_enum;

alter table profiles
  alter column role set default 'bank_sampah'::role_enum;

-- Step 5: Recreate all dropped admin policies
create policy "bank_sampah_admin_all" on bank_sampah
  for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "artikel_admin_all" on artikel
  for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Step 6: Update handle_new_user trigger to use the typed enum
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    'bank_sampah'::role_enum
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  raise warning 'handle_new_user failed: %', sqlerrm;
  return new;
end;
$$;

-- Verify
-- select column_name, data_type, udt_name, column_default
-- from information_schema.columns
-- where table_name = 'profiles' and column_name = 'role';
