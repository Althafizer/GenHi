# GenHi — Platform Digital Bank Sampah

## Project Overview

GenHi is a web platform for managing and discovering **Bank Sampah** (waste banks) in Yogyakarta, Indonesia. It connects the general public (Nasabah), waste banks, and IoT deposit machines in one integrated ecosystem.

Built as part of a KKN (community service) project.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| File Storage | Supabase Storage |
| Maps | Leaflet / React Leaflet (+ Google Maps API for embed) |
| Hosting target | VPS + Nginx + PM2 (or Vercel) |

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/public key
NEXT_PUBLIC_GOOGLE_MAPS_KEY=     # Google Maps API key
NEXT_PUBLIC_GOOGLE_MAP_ID=       # Google Maps Map ID
```

Copy `.env.local.example` → `.env.local` and fill in values.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    ← Landing page (public)
│   ├── layout.tsx
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx          ← Login (all user types)
│   │   ├── login/actions.ts        ← Server actions for login
│   │   ├── register/page.tsx       ← Register (Bank Sampah)
│   │   └── success/page.tsx        ← Post-registration confirmation
│   ├── bank-sampah/
│   │   └── [slug]/page.tsx         ← Public Bank Sampah detail page
│   └── dashboard/
│       ├── page.tsx                ← Dashboard shell (server component)
│       └── DashboardClient.tsx     ← Profile edit (client component)
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── StatsSection.tsx            ← Global stats from `global_stats` view
│   ├── CatalogSection.tsx          ← Filterable catalog of Bank Sampah
│   ├── BankCard.tsx                ← Card component for each bank
│   ├── AboutSection.tsx
│   ├── ArticlesSection.tsx
│   ├── RegisterSection.tsx
│   ├── MapSection.tsx              ← Leaflet map of bank locations
│   └── Footer.tsx
└── lib/
    ├── types.ts                    ← All TypeScript interfaces
    └── (supabase clients in app/ via @supabase/ssr)

supabase/
├── schema.sql                      ← Full DB schema + RLS + seed data
└── fix_signup.sql                  ← Patch for signup edge cases
```

## User Roles

| Role | Access |
|---|---|
| **Public** | Landing page, catalog, bank detail, stats, articles |
| **bank_sampah** | Dashboard — edit own profile, upload photos, toggle open/closed |
| **admin** | Verify/approve banks, manage articles, manage withdrawals, view all data |

Role is stored in the `profiles.role` column (default: `bank_sampah`). To make a user admin, manually set `role = 'admin'` in the `profiles` table via Supabase.

## Database Schema (Key Tables)

- `profiles` — extends `auth.users`; stores `role`
- `bank_sampah` — waste bank profiles; `verified` flag controls catalog visibility
- `artikel` — articles/news; `published` flag controls public visibility
- `statistik` — monthly stats per bank (sampah_kg, pendapatan, nasabah_baru)
- `global_stats` — computed view aggregating stats across all banks

Planned tables (not yet implemented):
- `nasabah_profiles` — for general public users
- `saldo` — wallet balance per Nasabah
- `qr_tokens` — 5-minute tokens for deposit machine auth
- `mesin_deposit` — registered IoT deposit machines
- `transaksi_deposit` — deposit history from machines
- `transaksi_penarikan` — withdrawal requests
- `harga_sampah` — Admin-configured price per item/gram

## Middleware

`src/middleware.ts` — refreshes the Supabase session cookie on every request. Does not do route-level auth gating (add redirects here when needed).

## Authentication Flow

1. Bank Sampah registers at `/auth/register` → status `verified = false`
2. Admin approves in Supabase SQL or (future) admin panel
3. Login at `/auth/login` → redirects to `/dashboard` based on role
4. Session managed by `@supabase/ssr` via cookies

## IoT Machine API (Planned)

Two endpoints for the physical deposit machine vendor:

- `POST /api/machine/auth` — validates QR token (5-min expiry, single-use)
- `POST /api/machine/deposit` — records deposit, adds balance to Nasabah

Both require `X-Machine-API-Key` header. See `SRS_GenHi.md` for full request/response spec.

## Development

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + Maps keys
npm run dev                        # http://localhost:3000
```

## What's Done vs. Planned

**Done:**
- Full landing page (hero, stats, catalog with filters, articles, map, footer)
- Login / Register flow for Bank Sampah
- Dashboard: edit profile, upload photos, toggle open/closed status
- Row Level Security (each bank can only edit its own data)
- Bank Sampah detail page (`/bank-sampah/[slug]`)

**Planned / In Progress:**
- Admin panel (verify banks, manage withdrawals, manage articles)
- Nasabah (general user) registration + QR code generation
- Deposit machine API endpoints
- Monthly stats input from dashboard
- Withdrawal request flow
