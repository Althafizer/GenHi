-- Fix: artikel-thumbnails storage bucket has no RLS policies, so admin
-- thumbnail uploads silently fail (storage.objects RLS is on by default).
-- Run this in Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('artikel-thumbnails', 'artikel-thumbnails', true)
on conflict (id) do nothing;

drop policy if exists "artikel_thumbnails_public_read" on storage.objects;
create policy "artikel_thumbnails_public_read" on storage.objects
  for select using (bucket_id = 'artikel-thumbnails');

drop policy if exists "artikel_thumbnails_admin_write" on storage.objects;
create policy "artikel_thumbnails_admin_write" on storage.objects
  for insert with check (
    bucket_id = 'artikel-thumbnails'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "artikel_thumbnails_admin_delete" on storage.objects;
create policy "artikel_thumbnails_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'artikel-thumbnails'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
