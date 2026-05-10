# Software Requirements Specification (SRS)
## Platform Digital GenHi

---

| Atribut | Detail |
|---|---|
| **Nama Dokumen** | Software Requirements Specification — Platform Digital GenHi |
| **Versi** | 1.0.0 |
| **Tanggal** | 5 Mei 2026 |
| **Organisasi** | GenHi |
| **Status** | Draft |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Gambaran Umum Sistem](#2-gambaran-umum-sistem)
3. [Karakteristik Pengguna](#3-karakteristik-pengguna)
4. [Kebutuhan Fungsional](#4-kebutuhan-fungsional)
5. [Kebutuhan Non-Fungsional](#5-kebutuhan-non-fungsional)
6. [Antarmuka Sistem](#6-antarmuka-sistem)
7. [Skema Database](#7-skema-database)
8. [Batasan Sistem](#8-batasan-sistem)
9. [Asumsi dan Ketergantungan](#9-asumsi-dan-ketergantungan)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini merupakan spesifikasi kebutuhan perangkat lunak (*Software Requirements Specification*) untuk Platform Digital GenHi. Dokumen ini ditujukan sebagai acuan bagi:

- **Tim Pengembang Internal GenHi** — sebagai panduan implementasi sistem
- **Vendor Mesin Deposit** — sebagai referensi kebutuhan integrasi antara mesin fisik dan platform digital GenHi

### 1.2 Ruang Lingkup Sistem

Platform Digital GenHi adalah sebuah sistem berbasis web yang bertujuan untuk:

1. Menjadi direktori publik seluruh Bank Sampah yang tergabung dalam organisasi GenHi di Kota Yogyakarta
2. Menyediakan dashboard publik yang menampilkan statistik total sampah yang berhasil dikumpulkan oleh seluruh Bank Sampah
3. Memberikan fasilitas bagi masyarakat umum (*Nasabah*) untuk mendaftarkan diri, menyetorkan sampah melalui mesin deposit GenHi, dan mengelola saldo hasil setoran mereka
4. Memberikan fasilitas bagi setiap Bank Sampah untuk mengelola profil dan informasi mereka secara mandiri
5. Terintegrasi dengan mesin deposit sampah plastik milik GenHi sehingga proses pencatatan saldo nasabah dapat berjalan secara otomatis

### 1.3 Definisi dan Akronim

| Istilah | Definisi |
|---|---|
| **GenHi** | Nama organisasi pengelola platform, yang mengasosiasikan Bank Sampah di Kota Yogyakarta |
| **Bank Sampah** | Lembaga atau organisasi yang bergerak di bidang pengelolaan dan pembelian sampah; pengguna tipe kedua di platform ini |
| **Nasabah** | Masyarakat umum yang mendaftar sebagai pengguna platform untuk menyetorkan sampah dan mengelola saldo |
| **Admin** | Tim internal GenHi yang memiliki akses penuh ke seluruh sistem |
| **Mesin Deposit** | Perangkat keras fisik milik GenHi yang menerima setoran sampah plastik dari Nasabah |
| **Saldo** | Nilai uang yang terakumulasi di akun Nasabah sebagai hasil dari setoran sampah melalui mesin deposit |
| **QR Code** | Kode dua dimensi yang digunakan Nasabah untuk autentikasi pada mesin deposit |
| **SRS** | Software Requirements Specification |
| **API** | Application Programming Interface |
| **SSR** | Server-Side Rendering |
| **ISR** | Incremental Static Regeneration |

### 1.4 Gambaran Umum Dokumen

Dokumen ini disusun secara berurutan dari deskripsi umum sistem, karakteristik pengguna, kebutuhan fungsional per modul, kebutuhan non-fungsional, antarmuka sistem, hingga skema database yang direkomendasikan.

---

## 2. Gambaran Umum Sistem

### 2.1 Latar Belakang

GenHi adalah organisasi yang mengasosiasikan Bank Sampah di Kota Yogyakarta. Setiap Bank Sampah yang tergabung memiliki spesialisasi tersendiri dalam jenis sampah yang diterima. Visi GenHi adalah meningkatkan kesadaran masyarakat bahwa sampah yang mereka miliki dapat dimanfaatkan dan diuangkan, sehingga sampah tidak lagi dipandang sebagai barang yang tidak berguna melainkan sebagai barang bernilai ekonomi.

Untuk mewujudkan visi tersebut, GenHi membutuhkan sebuah platform digital yang menghubungkan masyarakat, Bank Sampah, dan mesin deposit sampah dalam satu ekosistem yang terintegrasi.

### 2.2 Arsitektur Sistem Secara Umum

```
┌─────────────────────────────────────────────────────────┐
│                    PENGGUNA (Browser)                    │
│         Nasabah │ Bank Sampah │ Admin │ Publik           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  VPS GenHi (Indonesia)                   │
│                                                          │
│   ┌──────────────┐        ┌──────────────────────────┐  │
│   │  Next.js 14  │        │   Nginx (Reverse Proxy)  │  │
│   │  (Web + API) │◄───────│   + SSL Termination      │  │
│   └──────┬───────┘        └──────────────────────────┘  │
│          │                                               │
└──────────┼──────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase (Cloud - Singapore)            │
│    PostgreSQL Database │ Auth │ Storage (Foto)           │
└─────────────────────────────────────────────────────────┘
           ▲
           │ HTTP / (protokol menyesuaikan vendor)
           │
┌─────────────────────────────────────────────────────────┐
│              Mesin Deposit GenHi (Kalimantan)            │
│         Scan QR → Hitung Sampah → Kirim ke API           │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Framework Web | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL) |
| Penyimpanan File | Supabase Storage |
| Maps | Google Maps API |
| Hosting | VPS (2 GB RAM, 10 GB NVMe) dengan Nginx + PM2 |
| Integrasi IoT | HTTP REST API (atau menyesuaikan dengan vendor mesin) |

---

## 3. Karakteristik Pengguna

Platform ini memiliki empat tipe pengguna dengan hak akses yang berbeda:

### 3.1 Publik (Tidak Login)

Masyarakat umum yang mengakses website tanpa akun. Mereka dapat melihat:
- Halaman beranda dan informasi GenHi
- Katalog dan direktori Bank Sampah
- Peta lokasi Bank Sampah
- Dashboard statistik publik (total sampah terkumpul, jumlah Bank Sampah, dll.)
- Artikel

### 3.2 Nasabah (General User)

Masyarakat yang mendaftar akun untuk menyetorkan sampah melalui mesin deposit GenHi. Mereka dapat:
- Mendaftar dan login
- Menghasilkan QR Code untuk autentikasi di mesin deposit
- Melihat riwayat setoran
- Melihat saldo akun mereka
- Mengajukan penarikan saldo (dicatat di sistem, diproses manual oleh Admin)

### 3.3 Bank Sampah

Lembaga yang mendaftar untuk masuk ke dalam direktori GenHi. Mereka dapat:
- Mendaftar dan login
- Mengelola profil Bank Sampah mereka (nama, alamat, spesialisasi, jam operasional, foto, media sosial)
- Mengelola data statistik bulanan mereka sendiri
- Mengelola saldo/keuangan mereka sendiri di luar platform (tidak terintegrasi)

### 3.4 Admin

Tim internal GenHi. Mereka dapat:
- Memverifikasi dan mengelola pendaftaran Bank Sampah baru
- Melihat seluruh data Nasabah dan Bank Sampah
- Memproses permintaan penarikan saldo Nasabah
- Mengelola konten artikel
- Melihat seluruh riwayat transaksi mesin deposit
- Mengelola data mesin deposit

---

## 4. Kebutuhan Fungsional

### 4.1 Modul Autentikasi dan Manajemen Akun

#### FR-AUTH-01: Registrasi Nasabah
- Sistem harus menyediakan formulir pendaftaran akun Nasabah
- Data yang dibutuhkan: nama lengkap, email, kata sandi, nomor telepon
- Sistem harus mengirimkan konfirmasi email setelah pendaftaran
- Setelah verifikasi email, akun langsung aktif

#### FR-AUTH-02: Registrasi Bank Sampah
- Sistem harus menyediakan formulir pendaftaran multi-langkah untuk Bank Sampah
- Data yang dibutuhkan: nama Bank Sampah, alamat lengkap, nomor WhatsApp penanggung jawab, spesialisasi sampah, jam operasional, deskripsi singkat
- Akun Bank Sampah perlu diverifikasi oleh Admin sebelum muncul di katalog publik
- Status akun saat menunggu verifikasi: *pending*

#### FR-AUTH-03: Login
- Sistem harus menyediakan halaman login untuk semua tipe pengguna menggunakan email dan kata sandi
- Sistem harus membedakan dan mengarahkan pengguna ke dashboard yang sesuai berdasarkan tipe akun setelah login

#### FR-AUTH-04: Manajemen Sesi
- Sistem harus menjaga sesi pengguna yang aktif
- Pengguna yang tidak aktif selama periode tertentu harus diminta login ulang
- Sistem harus menyediakan fungsi logout

---

### 4.2 Modul Halaman Publik

#### FR-PUB-01: Halaman Beranda
- Sistem harus menampilkan halaman beranda yang memuat:
  - Hero section dengan deskripsi singkat GenHi
  - Statistik global (total Bank Sampah terdaftar, total sampah terkumpul, total Nasabah)
  - Cuplikan katalog Bank Sampah unggulan
  - Cuplikan artikel terbaru

#### FR-PUB-02: Katalog Bank Sampah
- Sistem harus menampilkan daftar seluruh Bank Sampah yang telah terverifikasi
- Fitur yang tersedia:
  - Pencarian berdasarkan nama atau alamat
  - Filter berdasarkan spesialisasi
  - Filter berdasarkan status operasional (buka/tutup)
  - Pengurutan (nama, rating)
- Setiap kartu Bank Sampah menampilkan: nama, foto, spesialisasi, status, jam operasional, dan tombol ke halaman detail

#### FR-PUB-03: Halaman Detail Bank Sampah
- Sistem harus menampilkan halaman detail untuk setiap Bank Sampah yang berisi:
  - Informasi lengkap profil
  - Foto
  - Peta lokasi (Google Maps)
  - Tautan ke media sosial
  - Statistik (jika dipublikasikan oleh Bank Sampah)

#### FR-PUB-04: Dashboard Statistik Publik
- Sistem harus menampilkan statistik agregat seluruh organisasi GenHi secara real-time, meliputi:
  - Total jumlah Bank Sampah aktif
  - Total berat sampah yang berhasil dikumpulkan (dalam kg atau ton)
  - Total Nasabah terdaftar
  - Total setoran via mesin deposit

#### FR-PUB-05: Halaman Artikel
- Sistem harus menampilkan daftar dan isi artikel yang dikelola oleh Admin

---

### 4.3 Modul Dashboard Bank Sampah

#### FR-BS-01: Manajemen Profil
- Bank Sampah harus dapat mengedit semua informasi profilnya:
  - Nama, alamat, nomor WhatsApp
  - Deskripsi
  - Spesialisasi sampah yang diterima
  - Jam operasional harian
  - Toggle status buka/tutup secara real-time
  - Tautan media sosial (Instagram, Facebook, YouTube, Website)

#### FR-BS-02: Manajemen Foto
- Bank Sampah harus dapat mengunggah foto utama dan galeri foto Bank Sampah mereka
- Foto disimpan di Supabase Storage

#### FR-BS-03: Input Statistik Bulanan
- Bank Sampah harus dapat menginput data statistik bulanan mereka:
  - Total berat sampah terkumpul (kg)
  - Total pendapatan bulan tersebut
  - Jumlah nasabah baru
- Data ini berkontribusi ke statistik global GenHi

---

### 4.4 Modul Dashboard Nasabah

#### FR-NAS-01: Halaman Beranda Nasabah
- Sistem harus menampilkan ringkasan akun Nasabah:
  - Saldo aktif saat ini
  - Riwayat 5 transaksi terakhir
  - Tombol untuk menghasilkan QR Code

#### FR-NAS-02: Pembuatan QR Code untuk Mesin Deposit
- Nasabah yang sudah login harus dapat menghasilkan QR Code sementara untuk digunakan di mesin deposit
- QR Code harus memiliki masa berlaku terbatas (**5 menit** sejak dibuat)
- QR Code yang sudah digunakan atau kedaluwarsa tidak dapat digunakan kembali
- Setiap satu QR Code hanya berlaku untuk satu sesi setoran

#### FR-NAS-03: Riwayat Transaksi
- Sistem harus menampilkan riwayat seluruh transaksi Nasabah:
  - Setoran via mesin (tanggal, jumlah item, nilai saldo yang ditambahkan)
  - Penarikan saldo (tanggal, jumlah, status: *menunggu* / *diproses* / *selesai*)

#### FR-NAS-04: Pengajuan Penarikan Saldo
- Nasabah harus dapat mengajukan permintaan penarikan saldo melalui platform
- Data yang diinput: jumlah penarikan, nomor rekening/e-wallet tujuan
- Sistem mencatat permintaan dengan status *menunggu*
- Saldo yang diajukan untuk ditarik langsung dikurangi dari saldo aktif dan ditahan
- Admin memproses transfer secara manual di luar platform
- Admin mengubah status permintaan menjadi *selesai* setelah transfer dilakukan

---

### 4.5 Modul Integrasi Mesin Deposit (IoT)

> **Catatan untuk Vendor:** Bagian ini mendeskripsikan alur yang diharapkan dari sisi platform GenHi. Implementasi teknis di sisi mesin (protokol komunikasi, format data) perlu didiskusikan lebih lanjut bersama vendor untuk memastikan kompatibilitas.

#### FR-IOT-01: Autentikasi Nasabah di Mesin via QR Code

**Alur yang diharapkan:**

```
1. Nasabah login di website GenHi (HP/komputer)
2. Nasabah membuka menu "Setor Sampah" dan menghasilkan QR Code
3. Nasabah menampilkan QR Code di depan scanner mesin
4. Mesin membaca QR Code dan mengirimkan token ke API GenHi
5. API GenHi memvalidasi token:
   - Jika valid & belum kedaluwarsa → kirim respons "authorized" beserta nama Nasabah
   - Jika tidak valid / kedaluwarsa → kirim respons "unauthorized"
6. Mesin menampilkan konfirmasi identitas Nasabah
7. Nasabah mulai memasukkan sampah plastik
```

#### FR-IOT-02: Pencatatan Hasil Setoran

**Alur yang diharapkan:**

```
1. Setelah proses deposit selesai, mesin menghitung total sampah
2. Mesin mengirimkan data ke API GenHi:
   - Token QR (sebagai identitas Nasabah)
   - Jumlah item yang disetorkan
   - Berat total (jika mesin memiliki sensor berat)
   - Timestamp
3. API GenHi menghitung nilai saldo berdasarkan data yang diterima
4. API menambahkan saldo ke akun Nasabah
5. API menyimpan record transaksi
6. API mengirimkan respons konfirmasi ke mesin
7. Mesin menampilkan konfirmasi ke Nasabah beserta saldo yang ditambahkan
```

#### FR-IOT-03: Endpoint API untuk Mesin Deposit

Platform GenHi akan menyediakan dua endpoint HTTP REST untuk mesin:

| Endpoint | Method | Fungsi |
|---|---|---|
| `/api/machine/auth` | POST | Validasi QR Code token dari mesin |
| `/api/machine/deposit` | POST | Menerima data setoran dan memperbarui saldo |

Kedua endpoint ini memerlukan **API Key** yang diberikan GenHi kepada vendor sebagai autentikasi mesin.

#### FR-IOT-04: Harga per Satuan Sampah
- Admin harus dapat mengatur harga per item/kg sampah plastik melalui panel admin
- Nilai saldo yang ditambahkan ke akun Nasabah dihitung berdasarkan harga yang diatur Admin

---

### 4.6 Modul Panel Admin

#### FR-ADM-01: Manajemen Bank Sampah
- Admin dapat melihat semua pendaftaran Bank Sampah (terverifikasi dan pending)
- Admin dapat menyetujui atau menolak pendaftaran Bank Sampah baru
- Admin dapat menonaktifkan akun Bank Sampah

#### FR-ADM-02: Manajemen Nasabah
- Admin dapat melihat daftar semua Nasabah
- Admin dapat melihat detail akun dan riwayat transaksi Nasabah

#### FR-ADM-03: Manajemen Penarikan Saldo
- Admin dapat melihat daftar semua permintaan penarikan saldo dengan status *menunggu*
- Admin dapat mengubah status permintaan menjadi *selesai* setelah transfer manual dilakukan
- Admin dapat menambahkan catatan pada setiap permintaan penarikan

#### FR-ADM-04: Manajemen Mesin Deposit
- Admin dapat mendaftarkan mesin deposit baru ke sistem
- Admin dapat melihat status koneksi terakhir setiap mesin
- Admin dapat melihat seluruh riwayat transaksi dari semua mesin

#### FR-ADM-05: Manajemen Konten
- Admin dapat membuat, mengedit, dan menghapus artikel
- Admin dapat mengelola data statistik global GenHi

---

## 5. Kebutuhan Non-Fungsional

### 5.1 Performa

| ID | Kebutuhan |
|---|---|
| NFR-PERF-01 | Halaman publik (katalog, beranda) harus dimuat dalam waktu < 3 detik pada koneksi 4G |
| NFR-PERF-02 | API endpoint untuk mesin deposit harus merespons dalam waktu < 2 detik |
| NFR-PERF-03 | Sistem harus mampu melayani minimal 50 pengguna konkuren tanpa penurunan performa signifikan |

### 5.2 Keamanan

| ID | Kebutuhan |
|---|---|
| NFR-SEC-01 | Seluruh komunikasi harus menggunakan HTTPS (TLS 1.2+) |
| NFR-SEC-02 | QR Code token harus unik, acak, dan memiliki masa berlaku 5 menit |
| NFR-SEC-03 | Endpoint mesin deposit harus dilindungi dengan API Key |
| NFR-SEC-04 | Data pengguna harus dilindungi dengan Row-Level Security (RLS) di database |
| NFR-SEC-05 | Kata sandi pengguna harus di-hash menggunakan algoritma bcrypt (ditangani oleh Supabase Auth) |
| NFR-SEC-06 | Panel Admin harus hanya dapat diakses oleh akun dengan role Admin |

### 5.3 Ketersediaan

| ID | Kebutuhan |
|---|---|
| NFR-AVL-01 | Sistem harus memiliki uptime minimal 95% per bulan |
| NFR-AVL-02 | Proses pembaruan/deployment tidak boleh menyebabkan downtime lebih dari 5 menit |

### 5.4 Kompatibilitas

| ID | Kebutuhan |
|---|---|
| NFR-COMP-01 | Website harus dapat diakses di browser modern (Chrome, Firefox, Safari, Edge) versi terbaru |
| NFR-COMP-02 | Website harus responsif dan dapat digunakan di perangkat mobile (smartphone) |
| NFR-COMP-03 | API mesin harus mendukung format data JSON standar |

### 5.5 Skalabilitas

| ID | Kebutuhan |
|---|---|
| NFR-SCAL-01 | Arsitektur sistem harus memungkinkan penambahan mesin deposit baru tanpa perubahan kode yang signifikan |
| NFR-SCAL-02 | Database harus mampu menampung hingga 10.000 record transaksi tanpa masalah performa |

---

## 6. Antarmuka Sistem

### 6.1 Antarmuka dengan Mesin Deposit (Untuk Vendor)

Platform GenHi mengekspos dua endpoint REST API yang wajib dikomunikasikan oleh mesin deposit.

#### Endpoint 1: Validasi QR Code

```
POST /api/machine/auth
Content-Type: application/json
X-Machine-API-Key: {API_KEY_DARI_GENHI}

Request Body:
{
  "qr_token": "string"  // token yang terbaca dari QR Code Nasabah
}

Response (Berhasil - 200):
{
  "success": true,
  "user_id": "uuid",
  "user_name": "string",
  "message": "Authorized"
}

Response (Gagal - 401):
{
  "success": false,
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

#### Endpoint 2: Kirim Data Setoran

```
POST /api/machine/deposit
Content-Type: application/json
X-Machine-API-Key: {API_KEY_DARI_GENHI}

Request Body:
{
  "qr_token": "string",       // token yang sama dari sesi autentikasi
  "machine_id": "string",     // ID mesin (diberikan oleh GenHi)
  "item_count": number,       // jumlah item yang disetorkan
  "weight_gram": number,      // berat dalam gram (0 jika mesin tidak punya sensor berat)
  "timestamp": "ISO8601"      // waktu setoran di sisi mesin
}

Response (Berhasil - 200):
{
  "success": true,
  "transaction_id": "uuid",
  "balance_added": number,    // nilai saldo yang ditambahkan (dalam Rupiah)
  "new_balance": number,      // total saldo Nasabah setelah transaksi
  "message": "Setoran berhasil dicatat"
}

Response (Gagal - 400/401):
{
  "success": false,
  "message": "string"
}
```

> **Catatan:** Jika mesin vendor memiliki mekanisme komunikasi berbeda (misalnya menggunakan MQTT atau protokol proprietary), format di atas bersifat fleksibel dan dapat disesuaikan bersama antara tim GenHi dan vendor.

### 6.2 Antarmuka Pengguna (UI)

Seluruh antarmuka pengguna diakses melalui browser web. Tidak ada aplikasi mobile native — website dirancang responsif untuk diakses via smartphone.

---

## 7. Skema Database

Berikut adalah tambahan tabel yang diperlukan di atas skema yang sudah ada.

### Tabel yang Sudah Ada (Existing)
- `profiles` — data pengguna (role: `admin`, `bank_sampah`)
- `bank_sampah` — profil Bank Sampah
- `artikel` — konten artikel
- `statistik` — statistik bulanan Bank Sampah
- `global_stats` — statistik agregat GenHi

### Tabel Baru yang Diperlukan

#### `nasabah_profiles`
Data profil tambahan untuk pengguna tipe Nasabah.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key, relasi ke `auth.users` |
| `full_name` | VARCHAR | Nama lengkap |
| `phone_number` | VARCHAR | Nomor telepon |
| `created_at` | TIMESTAMP | Waktu pendaftaran |

#### `saldo`
Menyimpan saldo aktif setiap Nasabah.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK → auth.users) | Pemilik saldo, UNIQUE |
| `balance` | BIGINT | Saldo dalam satuan Rupiah (cents/poin) |
| `updated_at` | TIMESTAMP | Waktu pembaruan terakhir |

#### `qr_tokens`
Token sementara untuk autentikasi Nasabah di mesin deposit.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK → auth.users) | Pemilik token |
| `token` | VARCHAR (UNIQUE) | Token acak yang di-encode ke QR Code |
| `expires_at` | TIMESTAMP | Waktu kedaluwarsa (5 menit sejak dibuat) |
| `is_used` | BOOLEAN | Status penggunaan (default: false) |
| `used_at` | TIMESTAMP | Waktu token digunakan |
| `created_at` | TIMESTAMP | Waktu pembuatan |

#### `mesin_deposit`
Registrasi mesin deposit milik GenHi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `machine_code` | VARCHAR (UNIQUE) | Kode unik mesin (diberikan ke vendor) |
| `api_key_hash` | VARCHAR | Hash dari API Key mesin |
| `location_name` | VARCHAR | Nama/deskripsi lokasi mesin |
| `city` | VARCHAR | Kota tempat mesin berada |
| `is_active` | BOOLEAN | Status aktif mesin |
| `last_ping_at` | TIMESTAMP | Waktu komunikasi terakhir dari mesin |
| `created_at` | TIMESTAMP | Waktu pendaftaran |

#### `transaksi_deposit`
Riwayat seluruh setoran yang berhasil dicatat dari mesin deposit.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK → auth.users) | Nasabah yang melakukan setoran |
| `machine_id` | UUID (FK → mesin_deposit) | Mesin yang digunakan |
| `qr_token_id` | UUID (FK → qr_tokens) | Token QR yang digunakan |
| `item_count` | INTEGER | Jumlah item yang disetorkan |
| `weight_gram` | INTEGER | Berat dalam gram (0 jika tidak ada sensor) |
| `balance_added` | BIGINT | Nilai saldo yang ditambahkan (Rupiah) |
| `unit_price` | BIGINT | Harga per item/gram saat transaksi |
| `deposited_at` | TIMESTAMP | Waktu setoran di sisi mesin |
| `created_at` | TIMESTAMP | Waktu record dibuat di database |

#### `transaksi_penarikan`
Riwayat permintaan penarikan saldo oleh Nasabah.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK → auth.users) | Nasabah yang mengajukan |
| `amount` | BIGINT | Jumlah saldo yang ditarik (Rupiah) |
| `destination_info` | TEXT | Nomor rekening/e-wallet tujuan |
| `status` | ENUM | `menunggu`, `diproses`, `selesai`, `ditolak` |
| `admin_notes` | TEXT | Catatan dari Admin (opsional) |
| `requested_at` | TIMESTAMP | Waktu pengajuan |
| `processed_at` | TIMESTAMP | Waktu Admin memproses |

#### `harga_sampah`
Konfigurasi harga satuan yang dikelola Admin.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID (PK) | Primary key |
| `price_per_item` | BIGINT | Harga per item (Rupiah), jika berbasis hitungan |
| `price_per_gram` | BIGINT | Harga per gram (Rupiah), jika berbasis berat |
| `effective_from` | TIMESTAMP | Berlaku mulai tanggal ini |
| `created_by` | UUID (FK → auth.users) | Admin yang mengatur |
| `created_at` | TIMESTAMP | Waktu dibuat |

---

## 8. Batasan Sistem

1. **Tidak ada payment gateway** — seluruh transfer saldo dilakukan secara manual oleh Admin GenHi di luar platform
2. **Koneksi internet wajib** — mesin deposit tidak dirancang untuk mode offline; seluruh transaksi memerlukan koneksi internet aktif
3. **Integrasi mesin bergantung pada vendor** — kemampuan integrasi sepenuhnya tergantung pada dukungan API/webhook dari vendor mesin
4. **Satu mesin pada peluncuran** — sistem dirancang untuk mendukung banyak mesin, namun hanya satu mesin yang aktif pada saat peluncuran
5. **Pengelolaan saldo Bank Sampah** — saldo/keuangan Bank Sampah tidak dikelola oleh platform ini; Bank Sampah mengelola keuangan mereka secara mandiri
6. **Notifikasi** — sistem tidak mengirim notifikasi email atau WhatsApp pada versi awal

---

## 9. Asumsi dan Ketergantungan

### 9.1 Asumsi

1. Vendor mesin deposit dapat menyediakan integrasi dengan sistem eksternal, baik melalui HTTP, webhook, atau protokol lain yang kompatibel
2. Mesin deposit selalu terhubung ke internet selama beroperasi
3. Nasabah memiliki akses ke smartphone untuk login dan menampilkan QR Code
4. Admin GenHi memiliki kapasitas untuk memproses permintaan penarikan saldo secara manual dalam waktu yang wajar

### 9.2 Ketergantungan Eksternal

| Layanan | Fungsi | Risiko Jika Tidak Tersedia |
|---|---|---|
| Supabase | Database, autentikasi, penyimpanan file | Seluruh sistem tidak berfungsi |
| Google Maps API | Peta lokasi Bank Sampah | Fitur peta tidak tampil |
| VPS GenHi | Hosting website dan API | Seluruh platform tidak dapat diakses |
| Koneksi internet mesin | Komunikasi mesin ke API | Transaksi deposit tidak dapat dicatat |

---

*Dokumen ini bersifat hidup (living document) dan akan diperbarui seiring perkembangan proyek dan hasil diskusi dengan vendor mesin deposit.*

---

**GenHi — Mengubah Sampah Menjadi Nilai**
