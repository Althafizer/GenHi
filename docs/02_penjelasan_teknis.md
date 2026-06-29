# GenHi — Penjelasan Teknis Sistem

---

## 1. Arsitektur Sistem

Sistem GenHi dibangun dalam tiga lapisan utama yang saling terhubung.

### Lapisan Client (Pengguna)
Ada empat jenis entitas yang mengakses sistem:
- **Masyarakat / Publik** — mengakses halaman landing, katalog, dan detail bank sampah tanpa perlu login
- **Pengelola Bank Sampah** — login untuk mengelola profil bank mereka sendiri via dashboard
- **Admin GenHi** — login untuk mengelola seluruh platform (verifikasi bank, artikel, penarikan)
- **Mesin Deposit IoT** — perangkat fisik yang berkomunikasi lewat REST API khusus menggunakan `X-Machine-API-Key`

### Lapisan Aplikasi (Next.js 14)
Next.js berfungsi sebagai layer presentasi sekaligus server-side rendering. Semua request dari browser masuk terlebih dahulu ke **Middleware** yang bertugas me-refresh session cookie Supabase dan menjaga route yang dilindungi. Jika pengguna belum terautentikasi namun mencoba mengakses `/dashboard`, `/admin`, atau `/nasabah`, middleware langsung men-redirect mereka ke halaman login.

Halaman-halaman yang ada:
- `/` — landing page publik (hero, stats, katalog, peta, artikel)
- `/bank-sampah/[slug]` — detail bank sampah (publik, tanpa login)
- `/auth/login` dan `/auth/register` — autentikasi
- `/dashboard` — khusus pengelola bank sampah
- `/admin` — khusus admin *(sedang dibangun)*
- `/nasabah` — khusus nasabah *(sedang dibangun)*
- `/api/machine/auth` dan `/api/machine/deposit` — endpoint untuk mesin IoT *(direncanakan)*

### Lapisan Backend (Supabase)
Supabase digunakan sebagai Backend as a Service (BaaS) yang menangani tiga hal sekaligus:
- **Auth** — manajemen sesi berbasis JWT yang disimpan di cookie, dikelola via library `@supabase/ssr`
- **PostgreSQL** — menyimpan semua data: profil pengguna, data bank sampah, artikel, statistik bulanan, dan view agregasi global
- **Storage** — menyimpan file foto dan galeri bank sampah di bucket `bank-sampah-photos`, serta thumbnail artikel di `artikel-thumbnails`
- **Row Level Security (RLS)** — kebijakan keamanan di level database yang memastikan setiap pengguna hanya bisa membaca atau mengubah data miliknya sendiri

---

## 2. Alur Registrasi & Autentikasi Pengguna

### Registrasi Bank Sampah
1. Pengelola mengakses `/auth/register` dan mengisi form berisi `full_name`, `email`, `password`, serta data bank sampah
2. Sistem memanggil `supabase.auth.signUp()` dengan menyertakan metadata `full_name`
3. Supabase memicu **database trigger** `handle_new_user()` yang meng-insert baris baru ke tabel `profiles` dengan `role = 'bank_sampah'`
4. Data bank disimpan ke tabel `bank_sampah` dengan flag `verified = false` — bank belum tampil di katalog publik
5. Pengguna diarahkan ke `/auth/success` sambil menunggu verifikasi admin
6. Admin mengubah `bank_sampah.verified = true` agar bank tampil di katalog

### Registrasi Nasabah *(direncanakan)*
Alur identik dengan bank sampah namun role yang tersimpan di `profiles` adalah `nasabah`. Halaman registrasi di `/auth/register/nasabah`.

### Proses Login (Semua Role)
1. Pengguna mengakses `/auth/login` dan mengisi kredensial
2. Server action `loginAction()` memanggil `supabase.auth.signInWithPassword()`
3. Jika gagal, pesan error dikembalikan ke client
4. Jika berhasil, sistem melakukan query `profiles.role` dari database:
   - `role = 'admin'` → redirect ke `/admin`
   - `role = 'nasabah'` → redirect ke `/nasabah`
   - `role = 'bank_sampah'` → redirect ke `/dashboard`

---

## 3. Alur Komunikasi Masyarakat & Pengelola Bank Sampah

### Fase Discovery (Sudah Berjalan)
1. Masyarakat mengakses halaman utama — sistem melakukan query `SELECT * FROM bank_sampah WHERE verified = true AND aktif = true`
2. Data ditampilkan dalam bentuk katalog dengan filter kecamatan dan spesialisasi, serta peta interaktif Leaflet.js
3. Masyarakat mengklik detail bank untuk mengakses `/bank-sampah/[slug]` — sistem mengambil profil lengkap beserta galeri dan statistik
4. Kontak langsung dilakukan di luar platform via WhatsApp atau Instagram menggunakan link yang tersimpan di kolom `wa` dan `instagram` tabel `bank_sampah`

### Fase Deposit via Mesin IoT *(Direncanakan)*
1. Nasabah login dan men-generate QR Token — sistem menyimpan token ke tabel `qr_tokens` dengan TTL 5 menit dan flag `is_used = false`
2. Nasabah menempel QR Code ke mesin deposit
3. Mesin mengirim `POST /api/machine/auth` dengan header `X-Machine-API-Key` dan body berisi token
4. Server memvalidasi token: belum expired dan `is_used = false`
5. Mesin menerima sampah, lalu mengirim `POST /api/machine/deposit` berisi `user_id`, `jenis`, `kg`, dan `mesin_id`
6. Server meng-insert ke `transaksi_deposit`, mengupdate `saldo` nasabah, dan memperbarui `statistik` bank yang bersangkutan
7. Mesin menampilkan saldo terbaru atau mencetak struk

### Fase Penarikan Saldo *(Direncanakan)*
1. Nasabah mengajukan penarikan — sistem meng-insert ke `transaksi_penarikan` dengan `status = 'pending'`
2. Admin melihat daftar transaksi pending di panel admin
3. Setelah approve, sistem mengupdate status menjadi `approved` dan mendeduct saldo nasabah

---

## 4. Alur Pengelolaan Data & Pelaporan

### Sumber Input Data

**Pengelola Bank Sampah (via Dashboard)**
Pengelola melakukan CRUD pada profil banknya sendiri melalui `/dashboard`. Data tersimpan ke tabel `bank_sampah`. File foto diunggah ke Supabase Storage bucket `bank-sampah-photos` dan URL-nya disimpan di kolom `foto_url` dan array `galeri`. Database trigger `bank_sampah_updated_at` memperbarui kolom `updated_at` secara otomatis pada setiap perubahan.

Di masa mendatang, pengelola juga akan menginput data statistik bulanan ke tabel `statistik` berisi `sampah_kg`, `pendapatan`, dan `nasabah_baru` per `periode` (tanggal awal bulan).

**Mesin Deposit IoT**
Setiap transaksi deposit secara otomatis meng-update tabel `statistik` tanpa input manual dari pengelola.

**Admin GenHi**
Admin mengelola konten tabel `artikel` (CRUD penuh) dan melakukan update flag `verified` pada tabel `bank_sampah`. Hanya artikel dengan `published = true` yang dapat dibaca publik via RLS policy `artikel_public_read`.

### Lapisan Keamanan Data (Row Level Security)
Setiap query ke database difilter oleh RLS policy:
- `bank_sampah_owner_all` — pengelola hanya bisa mengubah baris di mana `user_id = auth.uid()`
- `bank_sampah_public_read` — publik hanya bisa membaca bank dengan `aktif = true`
- `statistik_owner_all` — pengelola hanya bisa mengakses statistik bank miliknya
- `artikel_admin_all` — admin memiliki akses penuh ke semua artikel
- `bank_sampah_admin_all` — admin memiliki akses penuh ke semua data bank

### Output & Pelaporan

**Statistik Global (Landing Page)**
Database view `global_stats` melakukan agregasi otomatis:
- `total_bank_aktif` — COUNT bank dengan `aktif = true`
- `total_kecamatan` — COUNT DISTINCT kecamatan
- `total_sampah_kg` — SUM `sampah_kg` dari `statistik` bulan berjalan
- `total_nasabah` — SUM `nasabah_baru` dari `statistik` bulan berjalan

View ini di-grant ke role `anon` dan `authenticated` sehingga bisa diakses publik.

**Katalog & Detail Bank**
Data bank difilter via RLS `bank_sampah_public_read` (`aktif = true`) dan hanya bank dengan `verified = true` yang ditampilkan di katalog. Halaman detail `/bank-sampah/[slug]` mengambil profil lengkap termasuk galeri dan statistik terkini.

**Dashboard Pengelola**
Pengelola melihat dan mengubah data banknya sendiri. Akses dibatasi oleh RLS `bank_sampah_owner_all` sehingga tidak ada risiko cross-data access.

**Panel Admin *(direncanakan)***
Admin akan mendapatkan akses ke laporan agregat per bank per periode, daftar transaksi penarikan pending, manajemen artikel, dan approval bank sampah baru — semua diakses via RLS policy `*_admin_all`.

---

## Status Implementasi

| Komponen | Status |
|---|---|
| Landing page, katalog, peta, artikel | Selesai |
| Login & register Bank Sampah | Selesai |
| Dashboard edit profil bank | Selesai |
| Row Level Security seluruh tabel | Selesai |
| Middleware route guard | Selesai |
| Register & dashboard Nasabah | Sedang dibangun |
| Panel Admin | Sedang dibangun |
| Input statistik bulanan dari dashboard | Direncanakan |
| QR token & mesin deposit IoT | Direncanakan |
| Penarikan saldo Nasabah | Direncanakan |
