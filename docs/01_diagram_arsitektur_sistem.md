# GenHi — Diagram Arsitektur & Alur Sistem

---

## 1. Diagram Arsitektur Sistem

Diagram menampilkan struktur sistem secara umum: kotak "Sistem GenHi" berisi tiga lapisan container (Frontend, Middleware, Backend). Aktor pengguna berada di luar sistem, dan layanan eksternal menjadi sandaran sistem.

```mermaid
graph TB

    IOT["🤖 Mesin Deposit IoT ⚠️"]

    subgraph CLIENT["👥 Pengguna (Client / Browser)"]
        PUB["🌐 Masyarakat"]
        BS_USER["🏭 Pengelola"]
        ADM["🛡️ Admin"]
    end

    subgraph SYSTEM["📦 Sistem GenHi"]
        direction TB

        subgraph MIDDLEWARE["⚙️ Middleware — Next.js"]
            MW["Session Refresh + Route Guard\n+ Server Actions (login)"]
        end

        subgraph FRONTEND["🖥️ Frontend — Next.js 14"]
            PAGES["Halaman Web\nPublik · Auth · Dashboard\nAdmin Panel · Nasabah"]
            API_MACHINE["API Routes ⚠️\n/api/machine/* (planned)"]
        end

        subgraph BACKEND["🗄️ Backend — Supabase"]
            SB_AUTH["Auth\nJWT + Cookie"]
            SB_DB["PostgreSQL\n+ Row Level Security"]
            SB_STORAGE["File Storage"]
        end
    end

    EXTERNAL["🗺️ Leaflet / Google Maps\nPeta & lokasi"]

    PUB     --> MW
    BS_USER --> MW
    ADM     --> MW
    IOT     --> API_MACHINE

    MW --> PAGES
    PAGES       --> SB_AUTH
    PAGES       --> SB_DB
    PAGES       --> SB_STORAGE
    API_MACHINE --> SB_DB
    PAGES --> EXTERNAL

    style SYSTEM fill:#f8fafc,stroke:#2563eb,stroke-width:3px
    style FRONTEND fill:#eff6ff,stroke:#3b82f6
    style MIDDLEWARE fill:#fef9c3,stroke:#ca8a04
    style BACKEND fill:#f0fdf4,stroke:#16a34a
    style CLIENT fill:#faf5ff,stroke:#9333ea
```

**Keterangan:**
- **👥 Pengguna** — masyarakat, pengelola, dan admin lewat browser; **mesin IoT** perangkat di luar browser yang langsung memanggil API
- **⚙️ Middleware** — pintu masuk semua request: refresh sesi, blokir route protected jika belum login, jalankan Server Action login
- **🖥️ Frontend** — seluruh halaman Next.js + API Routes mesin (⚠️ planned)
- **🗄️ Backend** — Supabase: Auth, PostgreSQL (dengan RLS), File Storage
- **🗺️ Layanan Eksternal** — Leaflet & Google Maps
- ⚠️ = masih dalam tahap perencanaan

---

## 2. Diagram Use Case

Menggambarkan **siapa bisa melakukan apa** di sistem. Tiap aktor terhubung ke fungsi (use case) yang boleh ia akses. Garis putus-putus `..>` menandai relasi `«include»` (use case wajib dijalankan lebih dulu).

```mermaid
graph LR

    MASYARAKAT(["👤 Masyarakat / Publik"])
    PENGELOLA(["👤 Pengelola Bank Sampah"])
    ADMIN(["👤 Admin GenHi"])
    NASABAH(["👤 Nasabah"])
    MESIN(["🤖 Mesin Deposit IoT ⚠️"])

    subgraph GENHI["Sistem GenHi"]
        UC_CARI(("Cari & filter\nbank sampah"))
        UC_DETAIL(("Lihat detail\nbank sampah"))
        UC_ARTIKEL(("Baca artikel\nedukasi"))
        UC_PETA(("Lihat peta\nlokasi"))

        UC_REG(("Registrasi\nakun"))
        UC_LOGIN(("Login"))

        UC_PROFIL(("Kelola profil\nbank sampah"))
        UC_FOTO(("Upload foto\n& galeri"))
        UC_BUKA(("Atur status\nbuka/tutup"))

        UC_VERIF(("Verifikasi\nbank sampah"))
        UC_KELOLA_ART(("Kelola &\npublish artikel"))

        UC_SALDO(("Lihat saldo\n& riwayat ⚠️"))
        UC_QR(("Generate\nQR token ⚠️"))
        UC_SETOR(("Setor sampah\notomatis ⚠️"))
    end

    %% Masyarakat (tanpa login)
    MASYARAKAT --- UC_CARI
    MASYARAKAT --- UC_DETAIL
    MASYARAKAT --- UC_ARTIKEL
    MASYARAKAT --- UC_PETA
    MASYARAKAT --- UC_REG

    %% Pengelola
    PENGELOLA --- UC_LOGIN
    PENGELOLA --- UC_PROFIL
    PENGELOLA --- UC_FOTO
    PENGELOLA --- UC_BUKA

    %% Admin
    ADMIN --- UC_LOGIN
    ADMIN --- UC_VERIF
    ADMIN --- UC_KELOLA_ART

    %% Nasabah
    NASABAH --- UC_LOGIN
    NASABAH --- UC_SALDO
    NASABAH --- UC_QR

    %% Mesin IoT
    MESIN --- UC_SETOR

    %% include relationships
    UC_PROFIL -.->|"«include»"| UC_LOGIN
    UC_VERIF -.->|"«include»"| UC_LOGIN
    UC_SALDO -.->|"«include»"| UC_LOGIN
    UC_SETOR -.->|"«include»"| UC_QR

    style GENHI fill:#f8fafc,stroke:#2563eb,stroke-width:2px
```

**Keterangan:**
- **Masyarakat** — akses publik tanpa login: cari, lihat detail, baca artikel, lihat peta, dan registrasi
- **Pengelola** — setelah login: kelola profil bank, upload foto, atur status buka/tutup
- **Admin** — setelah login: verifikasi bank sampah & kelola artikel
- **Nasabah** ⚠️ — setelah login: lihat saldo, generate QR token
- **Mesin IoT** ⚠️ — setor sampah otomatis (memvalidasi QR token nasabah)
- ⚠️ = use case masih dalam tahap perencanaan

---

## 3. Diagram Alir Registrasi & Autentikasi Pengguna

```mermaid
flowchart TD

    START(["Pengguna Buka Browser"])
    --> CHOOSE{"Siapa pengguna?"}

    CHOOSE -->|"Pengelola Bank Sampah\n(belum punya akun)"| REG_BS
    CHOOSE -->|"Masyarakat / Nasabah\n(belum punya akun)"| REG_NAS
    CHOOSE -->|"Sudah punya akun"| LOGIN_PAGE

    subgraph REGISTRASI_BS["Registrasi Bank Sampah"]
        REG_BS["/auth/register\nIsi: nama, email, password,\nnama bank, alamat, kecamatan"]
        REG_BS --> SIGNUP_BS["Backend: supabase.auth.signUp()\n+ metadata full_name"]
        SIGNUP_BS --> TRIGGER_BS["DB Trigger: handle_new_user()\nAuto-insert profiles\nrole = 'bank_sampah'"]
        TRIGGER_BS --> INSERT_BANK["Insert bank_sampah\nverified = false"]
        INSERT_BANK --> SUCCESS_PAGE["/auth/success\n'Menunggu verifikasi admin'"]
    end

    subgraph REGISTRASI_NAS["Registrasi Nasabah"]
        REG_NAS["/auth/register/nasabah\nIsi: nama, email, password"]
        REG_NAS --> SIGNUP_NAS["Backend: supabase.auth.signUp()\n+ metadata full_name"]
        SIGNUP_NAS --> TRIGGER_NAS["DB Trigger: handle_new_user()\nAuto-insert profiles\nrole = 'nasabah'"]
        TRIGGER_NAS --> LOGIN_PAGE
    end

    subgraph VERIFIKASI_ADMIN["Verifikasi oleh Admin"]
        SUCCESS_PAGE -->|"Admin buka /admin/bank-sampah"| ADMIN_APPROVE["Admin set\nbank_sampah.verified = true"]
        ADMIN_APPROVE --> TAMPIL["Bank muncul di katalog publik"]
    end

    subgraph LOGIN["Login — Semua Role"]
        LOGIN_PAGE["/auth/login\nIsi: email + password"]
        LOGIN_PAGE --> ACTION["Server Action: loginAction()"]
        ACTION --> SIGN_IN["Backend: supabase.auth.signInWithPassword()"]
        SIGN_IN -->|"Gagal"| ERR["Tampil pesan error"]
        ERR --> LOGIN_PAGE
        SIGN_IN -->|"Berhasil"| GET_ROLE["Query profiles.role"]
        GET_ROLE -->|"role = admin"| GO_ADMIN["/admin"]
        GET_ROLE -->|"role = nasabah"| GO_NAS["/nasabah"]
        GET_ROLE -->|"role = bank_sampah"| GO_DASH["/dashboard"]
    end
```

---

## 4. Diagram Alir Komunikasi Masyarakat ↔ Pengelola Bank Sampah

```mermaid
sequenceDiagram
    actor Masyarakat
    participant FE as Frontend (Next.js)
    participant MW as Middleware
    participant BE as Backend (Supabase DB)
    participant BankAdmin as Pengelola Bank Sampah
    actor IoT as Mesin Deposit IoT

    Note over Masyarakat,BankAdmin: ── DISCOVERY — Sudah Berjalan ──

    Masyarakat->>FE: Buka halaman utama /
    FE->>BE: SELECT bank_sampah WHERE verified=true AND aktif=true
    BE-->>FE: Daftar bank sampah
    FE-->>Masyarakat: Tampil katalog + peta Leaflet

    Masyarakat->>FE: Klik bank → /bank-sampah/[slug]
    FE->>BE: SELECT detail + galeri + statistik
    BE-->>FE: Profil lengkap bank
    FE-->>Masyarakat: Tampil jam, spesialisasi, kontak, lokasi, galeri

    Masyarakat->>Masyarakat: Hubungi langsung via WhatsApp / Instagram

    Note over BankAdmin,BE: ── VERIFIKASI BANK — Sudah Berjalan ──

    BankAdmin->>MW: Akses /admin/bank-sampah
    MW->>MW: Cek sesi + role = admin
    MW-->>FE: Izinkan akses
    FE->>BE: SELECT bank_sampah WHERE verified=false
    BE-->>FE: Daftar bank menunggu verifikasi
    BankAdmin->>FE: Klik approve bank
    FE->>BE: UPDATE bank_sampah SET verified=true
    BE-->>FE: OK
    FE-->>BankAdmin: Bank tampil di katalog

    Note over Masyarakat,IoT: ── DEPOSIT via MESIN — Planned ⚠️ ──

    Masyarakat->>FE: Login sebagai Nasabah → minta QR Token
    FE->>BE: INSERT qr_tokens (TTL 5 menit, single-use)
    BE-->>FE: token string
    FE-->>Masyarakat: Tampil QR Code

    Masyarakat->>IoT: Tempel QR Code di mesin deposit
    IoT->>FE: POST /api/machine/auth { token } + X-Machine-API-Key
    FE->>BE: Validasi token (not expired, not used)
    BE-->>FE: valid / invalid
    FE-->>IoT: { valid: true, user_id }

    IoT->>Masyarakat: Timbang & terima sampah
    IoT->>FE: POST /api/machine/deposit { user_id, jenis, kg, mesin_id }
    FE->>BE: INSERT transaksi_deposit + UPDATE saldo + UPDATE statistik
    BE-->>FE: OK
    FE-->>IoT: { success: true, saldo_baru }
    IoT-->>Masyarakat: Cetak struk / tampil saldo baru

    Note over Masyarakat,BankAdmin: ── PENARIKAN SALDO — Planned ⚠️ ──

    Masyarakat->>FE: Ajukan penarikan saldo di /nasabah
    FE->>BE: INSERT transaksi_penarikan (status: pending)
    BankAdmin->>FE: Login → lihat daftar penarikan di /admin
    BankAdmin->>FE: Approve penarikan
    FE->>BE: UPDATE status=approved + DEDUCT saldo nasabah
    FE-->>Masyarakat: Notifikasi penarikan berhasil
```

---

## 5. Diagram Alir Pengelolaan Data

Menggambarkan **alur masuknya data** ke sistem: dari sumber data (pengelola, admin, mesin) → halaman input → melewati pemeriksaan keamanan → tersimpan di database.

```mermaid
flowchart TD

    subgraph ENTITAS_INPUT["Entitas Sumber Data"]
        E_BANK["Pengelola Bank Sampah"]
        E_ADMIN["Admin GenHi"]
        E_IOT["Mesin Deposit IoT ⚠️"]
    end

    subgraph FRONTEND_INPUT["Frontend — Halaman Input"]
        F_DASH["Dashboard /dashboard\nEdit profil, foto, buka/tutup"]
        F_STAT["Dashboard /dashboard\nInput statistik bulanan ⚠️"]
        F_ADMIN_BANK["Admin /admin/bank-sampah\nVerifikasi bank"]
        F_ADMIN_ART["Admin /admin/artikel\nKelola & publish artikel"]
        F_IOT_API["API /api/machine/deposit ⚠️\nTerima data dari mesin"]
    end

    subgraph MIDDLEWARE_LAYER["Middleware — Keamanan Akses"]
        M_GUARD["Route Guard\nCek sesi + role sebelum akses halaman"]
        M_RLS["Row Level Security\nFilter query di level database"]
    end

    subgraph BACKEND_DB["Backend — Supabase Database"]
        DB_BANK[("bank_sampah\nprofil, lokasi, galeri, verified")]
        DB_STAT[("statistik\nperiode, sampah_kg,\npendapatan, nasabah_baru")]
        DB_ART[("artikel\njudul, konten, published")]
        DB_FILE[("Storage Bucket\nfoto & galeri")]
    end

    %% Input flow
    E_BANK  --> F_DASH
    E_BANK  --> F_STAT
    E_ADMIN --> F_ADMIN_BANK
    E_ADMIN --> F_ADMIN_ART
    E_IOT   --> F_IOT_API

    %% Middleware guard akses
    E_BANK  --> M_GUARD
    E_ADMIN --> M_GUARD
    M_GUARD --> F_DASH
    M_GUARD --> F_ADMIN_BANK
    M_GUARD --> F_ADMIN_ART

    %% Frontend → Database (lewat RLS)
    F_DASH       --> M_RLS
    F_STAT       --> M_RLS
    F_ADMIN_BANK --> M_RLS
    F_ADMIN_ART  --> M_RLS
    F_IOT_API    --> M_RLS

    M_RLS --> DB_BANK
    M_RLS --> DB_STAT
    M_RLS --> DB_ART
    F_DASH --> DB_FILE
```

**Keterangan:**
- Semua akses ke halaman input protected melewati **Route Guard** (cek sesi + role) lebih dulu
- Semua perubahan data difilter **Row Level Security** — pengelola hanya bisa menulis data miliknya sendiri, admin punya akses penuh
- File foto/galeri disimpan terpisah di **Storage Bucket**, hanya URL-nya yang masuk ke tabel
- ⚠️ = fitur masih dalam tahap perencanaan

---

## 6. Diagram Alir Pelaporan Aktivitas Persampahan

Menggambarkan **alur keluarnya data** menjadi laporan: dari data tersimpan → agregasi otomatis → ditampilkan di halaman output sesuai hak akses tiap pengguna.

```mermaid
flowchart TD

    subgraph BACKEND_DB["Backend — Supabase Database"]
        DB_BANK[("bank_sampah\nprofil, verified, aktif")]
        DB_STAT[("statistik\nsampah_kg, pendapatan,\nnasabah_baru")]
        DB_ART[("artikel\npublished")]
        DB_FILE[("Storage Bucket\nfoto & galeri")]
        DB_VIEW[("VIEW: global_stats\nAggregasi otomatis bulanan")]
    end

    subgraph MIDDLEWARE_LAYER["Middleware — Filter Akses"]
        M_RLS["Row Level Security\nFilter data sesuai role"]
    end

    subgraph FRONTEND_OUTPUT["Frontend — Halaman Output / Laporan"]
        O_LANDING["Landing Page /\n4 angka global otomatis:\ntotal bank, kecamatan,\nkg sampah, nasabah"]
        O_CATALOG["Katalog /\nFilter kecamatan & spesialisasi\nhanya bank verified=true"]
        O_DETAIL["Detail Bank /bank-sampah/[slug]\nGaleri, statistik, kontak"]
        O_DASH["Dashboard /dashboard\nBank lihat data sendiri"]
        O_ADMIN["Admin Panel /admin\nSemua data, approval, laporan"]
    end

    %% Agregasi otomatis
    DB_BANK --> DB_VIEW
    DB_STAT --> DB_VIEW

    %% Laporan publik (tanpa RLS, hanya data terbuka)
    DB_VIEW --> O_LANDING
    DB_BANK --> O_CATALOG
    DB_BANK --> O_DETAIL
    DB_FILE --> O_DETAIL
    DB_STAT --> O_DETAIL

    %% Laporan ter-proteksi (lewat RLS)
    DB_BANK --> M_RLS
    DB_STAT --> M_RLS
    DB_ART  --> M_RLS
    M_RLS --> O_DASH
    M_RLS --> O_ADMIN
```

**Keterangan:**
- **Laporan publik** (Landing, Katalog, Detail) — menampilkan data terbuka tanpa perlu login; angka global dihitung otomatis oleh view `global_stats`
- **Laporan ter-proteksi** (Dashboard, Admin) — difilter **Row Level Security**: pengelola hanya melihat data banknya sendiri, admin melihat semua
- `global_stats` mengagregasi data dari `bank_sampah` dan `statistik` secara otomatis tanpa input manual
