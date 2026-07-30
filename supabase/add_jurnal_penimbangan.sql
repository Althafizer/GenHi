-- Add: jurnal_penimbangan (weighing journal / ledger)
-- Run this in Supabase SQL Editor.
--
-- Each row is one line-item weigh-in transaction. The existing `statistik`
-- table (monthly aggregate, used by global_stats + the public bank profile
-- page) is kept in sync automatically via trigger whenever entries here are
-- inserted, updated, or deleted — no manual monthly input needed anymore.

create table if not exists jurnal_penimbangan (
  id              uuid default uuid_generate_v4() primary key,
  bank_sampah_id  uuid references bank_sampah(id) on delete cascade not null,
  tanggal         date not null default current_date,
  nama_nasabah    text,
  jenis_sampah    text,
  berat_kg        numeric(10,2) not null check (berat_kg > 0),
  harga_per_kg    numeric(12,0) not null default 0,
  total           numeric(14,0) generated always as (berat_kg * harga_per_kg) stored,
  catatan         text,
  created_at      timestamptz default now()
);

create or replace function resync_statistik(p_bank uuid, p_periode date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  agg_kg numeric;
  agg_total numeric;
  agg_nasabah integer;
begin
  select coalesce(sum(berat_kg), 0), coalesce(sum(total), 0), count(distinct nullif(nama_nasabah, ''))
    into agg_kg, agg_total, agg_nasabah
  from jurnal_penimbangan
  where bank_sampah_id = p_bank and date_trunc('month', tanggal)::date = p_periode;

  update statistik set sampah_kg = agg_kg, pendapatan = agg_total, nasabah_baru = agg_nasabah
    where bank_sampah_id = p_bank and periode = p_periode;

  if not found then
    insert into statistik (bank_sampah_id, periode, sampah_kg, pendapatan, nasabah_baru)
    values (p_bank, p_periode, agg_kg, agg_total, agg_nasabah);
  end if;
end;
$$;

create or replace function jurnal_penimbangan_sync_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'DELETE' then
    perform resync_statistik(old.bank_sampah_id, date_trunc('month', old.tanggal)::date);
    return old;
  end if;

  perform resync_statistik(new.bank_sampah_id, date_trunc('month', new.tanggal)::date);

  if TG_OP = 'UPDATE' and (old.bank_sampah_id <> new.bank_sampah_id or date_trunc('month', old.tanggal) <> date_trunc('month', new.tanggal)) then
    perform resync_statistik(old.bank_sampah_id, date_trunc('month', old.tanggal)::date);
  end if;

  return new;
end;
$$;

drop trigger if exists jurnal_penimbangan_after_change on jurnal_penimbangan;
create trigger jurnal_penimbangan_after_change
  after insert or update or delete on jurnal_penimbangan
  for each row execute procedure jurnal_penimbangan_sync_trigger();

alter table jurnal_penimbangan enable row level security;

drop policy if exists "jurnal_penimbangan_owner_all" on jurnal_penimbangan;
create policy "jurnal_penimbangan_owner_all" on jurnal_penimbangan
  for all using (
    exists (
      select 1 from bank_sampah
      where id = bank_sampah_id and user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from bank_sampah
      where id = bank_sampah_id and user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.jurnal_penimbangan to authenticated;
