-- ============================================================
-- GenHi — Supabase Schema
-- Paste seluruh file ini di Supabase SQL Editor → Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── ENUM TYPES ───────────────────────────────────────────
create type kecamatan_enum as enum (
  'Gedongtengen','Jetis','Gondokusuman','Danurejan','Pakualaman',
  'Gondomanan','Ngampilan','Wirobrajan','Mantrijeron','Kraton',
  'Mergangsan','Umbulharjo','Kotagede','Tegalrejo','Depok'
);

create type spesialisasi_enum as enum (
  'Plastik','Kertas','Kardus','Logam','Botol Kaca',
  'Elektronik','Baterai','Minyak Jelantah','Tekstil','Organik'
);

-- ── PROFILES (extend auth.users) ─────────────────────────
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  role        text default 'bank_sampah' check (role in ('admin','bank_sampah')),
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── BANK SAMPAH ──────────────────────────────────────────
create table bank_sampah (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete set null,
  nama          text not null,
  slug          text unique not null,
  alamat        text not null,
  kecamatan     kecamatan_enum not null,
  spesialisasi  spesialisasi_enum[] default '{}',
  jam           text,
  buka          boolean default true,
  wa            text,
  email         text,
  website       text,
  instagram     text,
  facebook      text,
  youtube       text,
  rating        numeric(3,1) default 4.5 check (rating >= 1 and rating <= 5),
  reviews       integer default 0,
  lat           numeric(10,7),
  lng           numeric(10,7),
  foto_url      text,
  galeri        text[] default '{}',
  deskripsi     text,
  aktif         boolean default true,
  verified      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger bank_sampah_updated_at
  before update on bank_sampah
  for each row execute procedure update_updated_at();

-- ── ARTIKEL ──────────────────────────────────────────────
create table artikel (
  id              uuid default uuid_generate_v4() primary key,
  bank_sampah_id  uuid references bank_sampah(id) on delete set null,
  user_id         uuid references auth.users(id) on delete set null,
  judul           text not null,
  slug            text unique not null,
  konten          text,
  excerpt         text,
  thumbnail_url   text,
  tag             text check (tag in ('Tips & Trik','Kisah Sukses','Edukasi','Berita','Program')),
  penulis         text default 'Tim GenHi',
  read_time       integer default 5,
  published       boolean default false,
  published_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create trigger artikel_updated_at
  before update on artikel
  for each row execute procedure update_updated_at();

-- ── STATISTIK ────────────────────────────────────────────
create table statistik (
  id              uuid default uuid_generate_v4() primary key,
  bank_sampah_id  uuid references bank_sampah(id) on delete cascade,
  periode         date not null,
  sampah_kg       numeric(10,2) default 0,
  pendapatan      numeric(12,0) default 0,
  nasabah_baru    integer default 0,
  created_at      timestamptz default now()
);

-- ── GLOBAL STATS VIEW ────────────────────────────────────
create or replace view global_stats as
select
  count(*) filter (where aktif = true)          as total_bank_aktif,
  count(distinct kecamatan)                      as total_kecamatan,
  coalesce(sum(s.sampah_kg), 0)                  as total_sampah_kg,
  coalesce(sum(s.nasabah_baru), 0)               as total_nasabah
from bank_sampah b
left join statistik s on s.bank_sampah_id = b.id
  and s.periode >= date_trunc('month', now());

-- ── ROW LEVEL SECURITY ───────────────────────────────────

-- Profiles
alter table profiles enable row level security;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Bank Sampah: public read, owner write
alter table bank_sampah enable row level security;

create policy "bank_sampah_public_read" on bank_sampah
  for select using (aktif = true);

create policy "bank_sampah_owner_all" on bank_sampah
  for all using (auth.uid() = user_id);

create policy "bank_sampah_admin_all" on bank_sampah
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Artikel: public read (published only), owner write
alter table artikel enable row level security;

create policy "artikel_public_read" on artikel
  for select using (published = true);

create policy "artikel_owner_all" on artikel
  for all using (auth.uid() = user_id);

create policy "artikel_admin_all" on artikel
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Statistik: owner read/write
alter table statistik enable row level security;

create policy "statistik_owner_all" on statistik
  for all using (
    exists (
      select 1 from bank_sampah
      where id = bank_sampah_id and user_id = auth.uid()
    )
  );

-- Global stats: public read
grant select on global_stats to anon, authenticated;

-- ── STORAGE BUCKETS ──────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('bank-sampah-photos', 'bank-sampah-photos', true);

insert into storage.buckets (id, name, public)
values ('artikel-thumbnails', 'artikel-thumbnails', true);

-- Storage policies
create policy "photos_public_read" on storage.objects
  for select using (bucket_id = 'bank-sampah-photos');

create policy "photos_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'bank-sampah-photos' and auth.role() = 'authenticated'
  );

create policy "photos_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'bank-sampah-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── SEED DATA ────────────────────────────────────────────
insert into bank_sampah (nama, slug, alamat, kecamatan, spesialisasi, jam, buka, wa, rating, reviews, lat, lng, aktif, verified)
values
  ('Bank Sampah Mandiri Sejahtera','bank-sampah-mandiri-sejahtera','Jl. Malioboro No. 12, Gedongtengen','Gedongtengen','{Plastik,Kertas}','Sen–Jum 08:00–16:00',true,'081234567890',4.8,124,-7.7921,110.3644,true,true),
  ('Bank Sampah Hijau Mandiri','bank-sampah-hijau-mandiri','Jl. Kaliurang Km 5, Depok','Depok','{Botol Kaca,Elektronik}','Sen–Sab 07:00–15:00',true,'081345678901',4.6,98,-7.7611,110.3917,true,true),
  ('Sahabat Sampah Kotagede','sahabat-sampah-kotagede','Jl. Kemasan No. 5, Kotagede','Kotagede','{Logam,Plastik}','Sel–Sab 09:00–17:00',false,'081456789012',4.5,77,-7.8311,110.4008,true,false),
  ('Bank Sampah Kraton Lestari','bank-sampah-kraton-lestari','Jl. Ngadisuryan No. 3, Kraton','Kraton','{Kertas,Kardus}','Sen–Jum 08:00–14:00',true,'081567890123',4.7,156,-7.8050,110.3636,true,true),
  ('Eco Bank Gondokusuman','eco-bank-gondokusuman','Jl. Suroto No. 8, Gondokusuman','Gondokusuman','{Plastik,"Minyak Jelantah"}','Sen–Sab 07:30–15:30',true,'081678901234',4.9,201,-7.7834,110.3812,true,true);
