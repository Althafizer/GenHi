# Diagram Hak Paten — Sistem Manajemen Jaringan Informasi dan Komunikasi Digital antar Pengumpul dan Pengelola Sampah Berbasis Web

> Diagram disusun menyesuaikan **Uraian Gambar** dan **Uraian Lengkap Invensi** pada dokumen paten.
> Penomoran komponen mengacu pada deskripsi: server aplikasi (101), basis data (102), antarmuka web pengguna (103), modul pemetaan lokasi (104), modul komunikasi digital (105), modul pengelolaan data sampah (106), dan modul pelaporan (107).
>
> Catatan: sesuai kaidah penulisan paten, diagram menggunakan **istilah fungsional generik** (bukan nama teknologi tertentu) agar invensi tidak terikat pada implementasi spesifik.

---

## Gambar 1 — Diagram Arsitektur Sistem

*Diagram arsitektur sistem manajemen jaringan informasi dan komunikasi digital antar pengumpul dan pengelola sampah berbasis web.*

```mermaid
graph TB

    subgraph PENGGUNA["Pengguna Sistem"]
        U1["Masyarakat"]
        U2["Pengumpul Sampah"]
        U3["Bank Sampah"]
        U4["Pengelola Sampah"]
    end

    UI["Antarmuka Web Pengguna (103)\ndiakses via komputer / telepon pintar\nterhubung jaringan internet"]

    SERVER["Server Aplikasi (101)\nmengelola seluruh proses pertukaran data\n& komunikasi antar pengguna"]

    subgraph MODUL["Modul-Modul Sistem"]
        M104["Modul Pemetaan Lokasi (104)"]
        M105["Modul Komunikasi Digital (105)"]
        M106["Modul Pengelolaan Data Sampah (106)"]
        M107["Modul Pelaporan (107)"]
    end

    DB["Basis Data (102)\ndata pengguna · data bank sampah\ndata jenis sampah · data transaksi\nriwayat komunikasi"]

    %% Pengguna mengakses sistem
    U1 --> UI
    U2 --> UI
    U3 --> UI
    U4 --> UI

    %% Antarmuka ke server
    UI <--> SERVER

    %% Server mengelola modul
    SERVER <--> M104
    SERVER <--> M105
    SERVER <--> M106
    SERVER <--> M107

    %% Server & modul ke basis data
    SERVER <--> DB
    M104 --> DB
    M105 --> DB
    M106 --> DB
    M107 --> DB

    style SERVER fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style DB fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style UI fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
```

**Uraian:** Sistem terdiri atas server aplikasi (101) sebagai pusat pengelola seluruh proses, basis data (102) sebagai penyimpan data, antarmuka web pengguna (103) sebagai sarana akses, serta empat modul fungsional (104, 105, 106, 107). Seluruh pengguna — masyarakat, pengumpul sampah, bank sampah, dan pengelola sampah — mengakses sistem melalui antarmuka web pengguna (103) yang terhubung ke server aplikasi (101).

---

### Rincian Komponen Gambar 1

> Sub-bagian berikut menguraikan setiap komponen pada Gambar 1 secara lebih rinci beserta penomoran sub-komponennya.

#### 1.101 — Server Aplikasi (101)

```mermaid
graph TB

    SERVER["Server Aplikasi (101)"]

    subgraph DETAIL101["Sub-komponen Server Aplikasi (101)"]
        S1["Pengelola Permintaan (101-1)\nmenerima & mengarahkan permintaan\ndari antarmuka web pengguna"]
        S2["Pengelola Sesi & Autentikasi (101-2)\nmemverifikasi identitas\n& hak akses pengguna"]
        S3["Pemroses Logika Sistem (101-3)\nmenjalankan proses pertukaran data\n& komunikasi antar pengguna"]
        S4["Pengatur Modul (101-4)\nmengkoordinasi modul 104–107"]
        S5["Penghubung Basis Data (101-5)\nmembaca & menulis data\nke basis data (102)"]
    end

    SERVER --> S1
    SERVER --> S2
    SERVER --> S3
    SERVER --> S4
    SERVER --> S5

    S1 --> S2 --> S3 --> S4
    S3 --> S5

    style SERVER fill:#dbeafe,stroke:#2563eb,stroke-width:2px
```

**Uraian:** Server aplikasi (101) terdiri atas pengelola permintaan (101-1), pengelola sesi & autentikasi (101-2), pemroses logika sistem (101-3), pengatur modul (101-4), dan penghubung basis data (101-5). Komponen ini berfungsi mengelola seluruh proses pertukaran data dan komunikasi antar pengguna sistem.

---

#### 1.102 — Basis Data (102)

```mermaid
graph TB

    DB["Basis Data (102)"]

    subgraph DETAIL102["Sub-komponen Basis Data (102)"]
        D1["Data Pengguna (102-1)\nidentitas & jenis pengguna"]
        D2["Data Bank Sampah (102-2)\nprofil: alamat, kontak, jam operasional"]
        D3["Data Jenis Sampah (102-3)\nkategori sampah & kapasitas layanan"]
        D4["Data Transaksi (102-4)\nsetoran & aktivitas pengelolaan"]
        D5["Riwayat Komunikasi (102-5)\npesan antar pengguna"]
    end

    DB --> D1
    DB --> D2
    DB --> D3
    DB --> D4
    DB --> D5

    style DB fill:#dcfce7,stroke:#16a34a,stroke-width:2px
```

**Uraian:** Basis data (102) menyimpan data pengguna (102-1), data bank sampah (102-2), data jenis sampah (102-3), data transaksi (102-4), serta riwayat komunikasi (102-5).

---

#### 1.103 — Antarmuka Web Pengguna (103)

```mermaid
graph TB

    UI["Antarmuka Web Pengguna (103)\ndiakses via komputer / telepon pintar"]

    subgraph DETAIL103["Sub-komponen Antarmuka Web Pengguna (103)"]
        A1["Halaman Registrasi & Login (103-1)\nsarana masuk pengguna"]
        A2["Halaman Pencarian Bank Sampah (103-2)\nmenampilkan lokasi & profil"]
        A3["Halaman Komunikasi (103-3)\npertukaran pesan"]
        A4["Halaman Pengelolaan Data (103-4)\npencatatan aktivitas sampah"]
        A5["Halaman Laporan (103-5)\npenyajian laporan & statistik"]
    end

    UI --> A1
    UI --> A2
    UI --> A3
    UI --> A4
    UI --> A5

    style UI fill:#fef9c3,stroke:#ca8a04,stroke-width:2px
```

**Uraian:** Antarmuka web pengguna (103) dapat diakses menggunakan komputer maupun telepon pintar yang terhubung internet, dan menyediakan halaman registrasi & login (103-1), halaman pencarian bank sampah (103-2), halaman komunikasi (103-3), halaman pengelolaan data (103-4), serta halaman laporan (103-5).

---

#### 1.104 — Modul Pemetaan Lokasi (104)

```mermaid
graph TB

    M104["Modul Pemetaan Lokasi (104)"]

    subgraph DETAIL104["Sub-komponen Modul Pemetaan Lokasi (104)"]
        L1["Pengenal Lokasi Pengguna (104-1)\nmengidentifikasi posisi geografis"]
        L2["Penentu Radius Pencarian (104-2)\nmenetapkan jangkauan pencarian"]
        L3["Pencari Bank Sampah (104-3)\nmenyaring bank sampah dalam radius"]
        L4["Penyaji Peta & Daftar (104-4)\nmenampilkan hasil pencarian"]
        L5["Penyaji Profil Bank Sampah (104-5)\nalamat, kontak, jenis sampah,\nkapasitas, jam operasional"]
    end

    M104 --> L1 --> L2 --> L3 --> L4 --> L5
```

**Uraian:** Modul pemetaan lokasi (104) terdiri atas pengenal lokasi pengguna (104-1), penentu radius pencarian (104-2), pencari bank sampah (104-3), penyaji peta & daftar (104-4), dan penyaji profil bank sampah (104-5). Modul ini mengidentifikasi lokasi pengguna dan menampilkan daftar bank sampah pada radius tertentu beserta profilnya.

---

#### 1.105 — Modul Komunikasi Digital (105)

```mermaid
graph TB

    M105["Modul Komunikasi Digital (105)"]

    subgraph DETAIL105["Sub-komponen Modul Komunikasi Digital (105)"]
        K1["Pembentuk Saluran Komunikasi (105-1)\nmenghubungkan masyarakat & pengelola"]
        K2["Pengirim & Penerima Pesan (105-2)\npertukaran pesan dua arah"]
        K3["Konfirmasi Penyetoran (105-3)\nverifikasi rencana setoran sampah"]
        K4["Penyampai Informasi Layanan (105-4)\ninformasi terkait layanan"]
        K5["Pencatat Riwayat Komunikasi (105-5)\nmenyimpan ke basis data (102)"]
    end

    M105 --> K1 --> K2
    K2 --> K3
    K2 --> K4
    K2 --> K5
```

**Uraian:** Modul komunikasi digital (105) terdiri atas pembentuk saluran komunikasi (105-1), pengirim & penerima pesan (105-2), konfirmasi penyetoran (105-3), penyampai informasi layanan (105-4), dan pencatat riwayat komunikasi (105-5). Modul ini memungkinkan komunikasi langsung antara masyarakat dengan pengelola bank sampah secara real-time.

---

#### 1.106 — Modul Pengelolaan Data Sampah (106)

```mermaid
graph TB

    M106["Modul Pengelolaan Data Sampah (106)"]

    subgraph DETAIL106["Sub-komponen Modul Pengelolaan Data Sampah (106)"]
        P1["Pencatat Jenis Sampah (106-1)\nkategori sampah yang diterima"]
        P2["Pencatat Jumlah Setoran (106-2)\nbobot / kuantitas sampah"]
        P3["Pencatat Aktivitas Pengelolaan (106-3)\nproses pengelolaan tiap bank sampah"]
        P4["Penyimpan Data Transaksi (106-4)\nmenyimpan ke basis data (102)"]
    end

    M106 --> P1 --> P2 --> P3 --> P4
```

**Uraian:** Modul pengelolaan data sampah (106) terdiri atas pencatat jenis sampah (106-1), pencatat jumlah setoran (106-2), pencatat aktivitas pengelolaan (106-3), dan penyimpan data transaksi (106-4). Modul ini mencatat jenis sampah yang diterima, jumlah sampah yang disetorkan, serta aktivitas pengelolaan yang dilakukan oleh masing-masing bank sampah.

---

#### 1.107 — Modul Pelaporan (107)

```mermaid
graph TB

    M107["Modul Pelaporan (107)"]

    subgraph DETAIL107["Sub-komponen Modul Pelaporan (107)"]
        R1["Pengambil Data (107-1)\nmengambil data dari basis data (102)"]
        R2["Pengolah & Agregasi Data (107-2)\nmengolah data menjadi ringkasan"]
        R3["Penyusun Laporan Aktivitas (107-3)\nlaporan aktivitas pengelolaan"]
        R4["Penyusun Statistik (107-4)\nstatistik sampah & pengguna aktif"]
        R5["Penyaji Laporan (107-5)\nmenampilkan via antarmuka (103)"]
    end

    M107 --> R1 --> R2
    R2 --> R3
    R2 --> R4
    R3 --> R5
    R4 --> R5
```

**Uraian:** Modul pelaporan (107) terdiri atas pengambil data (107-1), pengolah & agregasi data (107-2), penyusun laporan aktivitas (107-3), penyusun statistik (107-4), dan penyaji laporan (107-5). Modul ini menghasilkan laporan aktivitas, statistik pengelolaan sampah, jumlah pengguna aktif, serta data transaksi yang tersimpan dalam sistem.

---

## Gambar 2 — Diagram Alir Registrasi dan Autentikasi Pengguna

```mermaid
flowchart TD

    A(["Mulai"]) --> B["Pengguna mengakses\nAntarmuka Web Pengguna (103)"]
    B --> C{"Sudah memiliki akun?"}

    C -->|"Belum"| D["Pengguna memilih\nproses registrasi"]
    D --> E["Pengguna mengisi data identitas\n& memilih jenis pengguna"]
    E --> F["Server Aplikasi (101)\nmemproses data registrasi"]
    F --> G["Basis Data (102)\nmenyimpan data pengguna baru"]
    G --> H["Akun pengguna terbentuk"]
    H --> I["Pengguna melakukan proses login"]

    C -->|"Sudah"| I

    I --> J["Server Aplikasi (101)\nmemverifikasi identitas\nterhadap Basis Data (102)"]
    J --> K{"Identitas valid?"}
    K -->|"Tidak"| L["Sistem menolak akses\n& menampilkan pemberitahuan"]
    L --> I
    K -->|"Ya"| M["Sistem memberikan hak akses\nsesuai jenis pengguna"]
    M --> N["Pengguna masuk ke\nhalaman layanan sesuai perannya"]
    N --> O(["Selesai"])
```

**Uraian:** Pengguna mengakses antarmuka web pengguna (103). Jika belum memiliki akun, pengguna melakukan registrasi yang diproses server aplikasi (101) dan disimpan pada basis data (102). Pada saat login, server aplikasi (101) memverifikasi identitas terhadap basis data (102) dan memberikan hak akses sesuai jenis pengguna.

---

## Gambar 3 — Diagram Alir Pencarian Bank Sampah Berdasarkan Lokasi Pengguna

```mermaid
flowchart TD

    A(["Mulai"]) --> B["Pengguna mengakses\nAntarmuka Web Pengguna (103)"]
    B --> C["Pengguna mengaktifkan\npencarian bank sampah"]
    C --> D["Modul Pemetaan Lokasi (104)\nmengidentifikasi lokasi pengguna"]
    D --> E["Modul Pemetaan Lokasi (104)\nmenentukan radius pencarian"]
    E --> F["Server Aplikasi (101)\nmengambil data bank sampah\ndari Basis Data (102)"]
    F --> G{"Terdapat bank sampah\ndalam radius?"}

    G -->|"Tidak"| H["Sistem menampilkan\npemberitahuan tidak ditemukan"]
    H --> I["Pengguna memperluas\nradius pencarian"]
    I --> E

    G -->|"Ya"| J["Sistem menampilkan daftar\nbank sampah terdekat"]
    J --> K["Pengguna memilih\nsalah satu bank sampah"]
    K --> L["Sistem menampilkan profil:\nalamat, kontak, jenis sampah,\nkapasitas layanan, jam operasional"]
    L --> M(["Selesai"])
```

**Uraian:** Modul pemetaan lokasi (104) mengidentifikasi lokasi pengguna dan menentukan radius pencarian. Server aplikasi (101) mengambil data bank sampah dari basis data (102) yang berada dalam radius tersebut, lalu menampilkan daftarnya. Setiap bank sampah memiliki profil informasi yang memuat alamat, kontak, jenis sampah yang diterima, kapasitas layanan, dan jam operasional.

---

## Gambar 4 — Diagram Alir Komunikasi antara Masyarakat dan Pengelola Bank Sampah

```mermaid
flowchart TD

    A(["Mulai"]) --> B["Masyarakat mengakses\nAntarmuka Web Pengguna (103)"]
    B --> C["Masyarakat memilih bank sampah\n& membuka komunikasi"]
    C --> D["Modul Komunikasi Digital (105)\nmembentuk saluran komunikasi"]
    D --> E["Masyarakat mengirim pesan\n(pertanyaan / konfirmasi penyetoran)"]
    E --> F["Server Aplikasi (101)\nmeneruskan pesan"]
    F --> G["Basis Data (102)\nmenyimpan riwayat komunikasi"]
    G --> H["Pengelola Bank Sampah\nmenerima pesan"]
    H --> I["Pengelola Bank Sampah\nmemberikan balasan / informasi layanan"]
    I --> J["Server Aplikasi (101)\nmeneruskan balasan ke masyarakat"]
    J --> K{"Komunikasi dilanjutkan?"}
    K -->|"Ya"| E
    K -->|"Tidak"| L["Pertukaran informasi selesai\nsecara real-time"]
    L --> M(["Selesai"])
```

**Uraian:** Modul komunikasi digital (105) membentuk saluran komunikasi langsung antara masyarakat dengan pengelola bank sampah. Server aplikasi (101) meneruskan pesan dan basis data (102) menyimpan riwayat komunikasi. Komunikasi mencakup pertukaran pesan, konfirmasi penyetoran sampah, dan penyampaian informasi layanan secara real-time.

---

## Gambar 5 — Diagram Alir Pengelolaan Data dan Pelaporan Aktivitas Persampahan

```mermaid
flowchart TD

    A(["Mulai"]) --> B["Bank Sampah / Pengelola Sampah\nmengakses Antarmuka Web Pengguna (103)"]
    B --> C["Modul Pengelolaan Data Sampah (106)\nmencatat aktivitas:\njenis sampah, jumlah setoran,\naktivitas pengelolaan"]
    C --> D["Server Aplikasi (101)\nmemproses data aktivitas"]
    D --> E["Basis Data (102)\nmenyimpan data transaksi\n& aktivitas pengelolaan"]

    E --> F["Modul Pelaporan (107)\nmengambil data dari Basis Data (102)"]
    F --> G["Modul Pelaporan (107)\nmengolah & mengagregasi data"]
    G --> H["Sistem menghasilkan laporan:\naktivitas pengelolaan, statistik sampah,\njumlah pengguna aktif, data transaksi"]
    H --> I["Laporan ditampilkan melalui\nAntarmuka Web Pengguna (103)"]
    I --> J(["Selesai"])
```

**Uraian:** Modul pengelolaan data sampah (106) mencatat jenis sampah yang diterima, jumlah sampah yang disetorkan, serta aktivitas pengelolaan, yang kemudian disimpan pada basis data (102) melalui server aplikasi (101). Modul pelaporan (107) mengambil dan mengolah data tersebut untuk menghasilkan laporan aktivitas, statistik pengelolaan sampah, jumlah pengguna aktif, serta data transaksi, yang ditampilkan melalui antarmuka web pengguna (103).

---

## Daftar Komponen (Referensi Penomoran)

| No. | Komponen | Fungsi |
|---|---|---|
| **101** | Server Aplikasi | Mengelola seluruh proses pertukaran data dan komunikasi antar pengguna sistem |
| **102** | Basis Data | Menyimpan data pengguna, data bank sampah, data jenis sampah, data transaksi, serta riwayat komunikasi |
| **103** | Antarmuka Web Pengguna | Sarana akses sistem melalui komputer maupun telepon pintar yang terhubung internet |
| **104** | Modul Pemetaan Lokasi | Mengidentifikasi lokasi pengguna dan menampilkan bank sampah dalam radius tertentu |
| **105** | Modul Komunikasi Digital | Memungkinkan komunikasi langsung antara masyarakat dengan pengelola bank sampah |
| **106** | Modul Pengelolaan Data Sampah | Mencatat jenis, jumlah, dan aktivitas pengelolaan sampah |
| **107** | Modul Pelaporan | Menghasilkan laporan aktivitas, statistik, jumlah pengguna aktif, dan data transaksi |
