# 🚀 GenHi Next.js — Panduan Deploy

## Stack
- **Frontend + API:** Next.js 14 (App Router)
- **Database + Auth + Storage:** Supabase (gratis)
- **Hosting:** Vercel (gratis)

---

## STEP 1 — Setup Supabase

1. Buka [supabase.com](https://supabase.com) → New Project
2. Nama project: `genhi`, pilih region: **Southeast Asia (Singapore)**
3. Tunggu project siap (~2 menit)
4. Buka **SQL Editor** → paste isi file `supabase/schema.sql` → klik **Run**
5. Catat dua nilai dari **Project Settings → API**:
   - `Project URL` → masuk ke `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → masuk ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Aktifkan Email Auth:
- Authentication → Providers → Email → **Enable** ✓
- Authentication → Email Templates → sesuaikan template (opsional)

---

## STEP 2 — Setup Local

```bash
# Clone repo
git clone https://github.com/Althafizer/GenHi.git
cd GenHi/nextjs-app

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local dan isi nilai dari Supabase

# Jalankan development server
npm run dev
# Buka http://localhost:3000
```

---

## STEP 3 — Deploy ke Vercel

### Cara 1 — Via CLI (paling cepat):
```bash
npm i -g vercel
cd nextjs-app
vercel

# Ikuti instruksi:
# - Set up project? Y
# - Root directory: nextjs-app
# - Framework: Next.js
```

### Cara 2 — Via GitHub:
1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repo `Althafizer/GenHi`
4. **Root Directory:** `nextjs-app`
5. **Environment Variables** — tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...
   NEXT_PUBLIC_GOOGLE_MAP_ID=d46836a2...
   ```
6. Klik **Deploy** → selesai!

---

## STEP 4 — Setup Admin GenHi

Setelah deploy, buat akun admin:
1. Daftar akun biasa di `/auth/register`
2. Buka Supabase → Table Editor → `profiles`
3. Cari row dengan email kamu → ubah `role` dari `bank_sampah` → `admin`
4. Admin bisa approve/verify semua bank sampah

---

## STEP 5 — Verifikasi Bank Sampah Baru

Bank sampah yang baru daftar status `aktif = false`.
Untuk approve:
```sql
-- Di Supabase SQL Editor
UPDATE bank_sampah SET aktif = true, verified = true
WHERE id = 'uuid-bank-sampah-disini';
```
Atau buat halaman admin di `/admin` (next development step).

---

## Struktur Folder

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Homepage
│   │   ├── auth/
│   │   │   ├── login/page.tsx    ← Login
│   │   │   ├── register/page.tsx ← Daftar bank sampah
│   │   │   └── success/page.tsx  ← Konfirmasi
│   │   └── dashboard/
│   │       ├── page.tsx          ← Server component
│   │       └── DashboardClient.tsx ← Edit profil
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── StatsSection.tsx
│   │   ├── CatalogSection.tsx
│   │   ├── BankCard.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ArticlesSection.tsx
│   │   ├── RegisterSection.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── types.ts              ← TypeScript types
│       └── supabase/
│           ├── client.ts         ← Browser client
│           └── server.ts         ← Server client
├── supabase/
│   └── schema.sql                ← Database schema + RLS + seed
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Fitur yang Sudah Siap

- ✅ Landing page lengkap (hero, stats, katalog, artikel, footer)
- ✅ Filter katalog (spesialisasi, jam, search, sort)
- ✅ Login / Register bank sampah
- ✅ Dashboard edit profil (nama, alamat, WA, spesialisasi, foto, medsos)
- ✅ Upload foto ke Supabase Storage
- ✅ Real-time status buka/tutup toggle
- ✅ Row Level Security (tiap bank sampah hanya edit datanya sendiri)
- ✅ Responsive + mobile-ready
- ✅ TypeScript + Tailwind CSS

## Next Development Steps

- [ ] Halaman detail per bank sampah (`/bank-sampah/[slug]`)
- [ ] Halaman admin GenHi untuk approve/verify
- [ ] Input statistik bulanan dari dashboard
- [ ] Peta Google Maps terintegrasi
- [ ] Halaman artikel lengkap
- [ ] Push notification saat ada bank sampah baru
