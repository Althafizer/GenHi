# Panduan Menggambar Gambar 1 di Lucid (lucid.app)

> Kerangka tata letak, legenda alur bernomor, dan saran ikon untuk **Gambar 1 — Diagram Arsitektur Sistem** (versi paten, generik).
> Semua ikon bersifat **konseptual generik** (bukan logo produk) agar tetap sesuai kaidah paten.

---

## 1. Peta Tata Letak (Layout) di Kanvas

Susun mengalir **kiri → kanan**, dengan Server Aplikasi (101) sebagai pusat dan Basis Data (102) di bawah-tengah sebagai fondasi yang diakses semua.

```
┌─────────────┐   ┌──────────────┐   ┌───────────────┐   ┌────────────────────────────┐
│  PENGGUNA   │   │  ANTARMUKA   │   │    SERVER     │   │     MODUL-MODUL SISTEM      │
│  (kotak     │   │  WEB (103)   │   │  APLIKASI     │   │  (kotak putus-putus)        │
│  putus-     │   │              │   │    (101)      │   │  ┌──────────┐ ┌──────────┐  │
│  putus)     │──▶│  💻 / 📱     │◀─▶│   ⚙️ pusat   │◀─▶│  │ 104 📍   │ │ 105 💬   │  │
│  👤 Masy.   │   │              │   │              │   │  └──────────┘ └──────────┘  │
│  👤 Pengump.│   │              │   │              │   │  ┌──────────┐ ┌──────────┐  │
│  👤 Bank S. │   │              │   │              │   │  │ 106 ♻️   │ │ 107 📊   │  │
│  👤 Pengel. │   │              │   │              │   │  └──────────┘ └──────────┘  │
└─────────────┘   └──────────────┘   └──────┬───────┘   └────────────┬───────────────┘
                                            │                        │
                                             ▼                        ▼
                                   ┌─────────────────────────────────────┐
                                   │      BASIS DATA (102)  🗄️           │
                                   │  (diakses server & seluruh modul)   │
                                   └─────────────────────────────────────┘
```

**Prinsip penataan:**
- **Kotak luar (garis solid)** = batas sistem keseluruhan (bila ingin, bungkus 101–107 dalam satu kotak besar bernama "Sistem")
- **Kotak dalam (garis putus-putus)** = pengelompokan: "Pengguna", "Modul-Modul Sistem"
- **Server Aplikasi (101)** diletakkan di tengah karena menjadi penghubung semua
- **Basis Data (102)** di bawah-tengah, ditarik garis dari 101 dan tiap modul
- Jaga ikon **seukuran**, gunakan grid/snap Lucid agar sejajar

---

## 2. Legenda Alur Bernomor

> Pasang daftar ini di bawah/samping gambar. Angka dalam lingkaran (①②③…) diletakkan di **garis panah** sesuai langkah.

**Aturan jenis panah:**
- **↔ Bolak-balik** — interaksi yang menuntut respons balik: akses pengguna, permintaan-jawaban, dan **pembacaan data** (minta data → data dikembalikan).
- **→ Satu arah** — aliran satu sisi: **penyimpanan data** ke basis data (tulis), dan penyajian keluaran akhir.

| No. | Alur | Dari ↔/→ Ke | Jenis Panah |
|---|---|---|---|
| **①** | Pengguna mengakses sistem (kirim aksi, terima tampilan) | Pengguna ↔ Antarmuka Web Pengguna (103) | ↔ **Bolak-balik** |
| **②** | Antarmuka meneruskan permintaan & menerima respons | Antarmuka (103) ↔ Server Aplikasi (101) | ↔ **Bolak-balik** |
| **③** | Server memverifikasi identitas (baca data pengguna) | Server (101) ↔ Basis Data (102) | ↔ **Bolak-balik** |
| **④** | Permintaan pencarian diproses & hasil dikembalikan | Server (101) ↔ Modul Pemetaan Lokasi (104) | ↔ **Bolak-balik** |
| **⑤** | Modul pemetaan membaca data bank sampah terdekat | Modul Pemetaan (104) ↔ Basis Data (102) | ↔ **Bolak-balik** |
| **⑥** | Permintaan komunikasi diteruskan & dijawab | Server (101) ↔ Modul Komunikasi Digital (105) | ↔ **Bolak-balik** |
| **⑦** | Riwayat komunikasi **disimpan** | Modul Komunikasi (105) → Basis Data (102) | → Satu arah |
| **⑧** | Pencatatan aktivitas diproses & dikonfirmasi | Server (101) ↔ Modul Pengelolaan Data Sampah (106) | ↔ **Bolak-balik** |
| **⑨** | Data transaksi & aktivitas **disimpan** | Modul Pengelolaan (106) → Basis Data (102) | → Satu arah |
| **⑩** | Modul pelaporan **membaca** & mengolah data | Modul Pelaporan (107) ↔ Basis Data (102) | ↔ **Bolak-balik** |
| **⑪** | Hasil/laporan **ditampilkan** ke pengguna (keluaran) | Server (101) → Antarmuka (103) → Pengguna | → Satu arah* |

\* *Langkah ⑪ adalah jalur keluaran. Jika panah ① dan ② sudah Anda gambar bolak-balik (↔), ⑪ **tidak perlu panah baru** — keluaran mengalir kembali lewat panah ② lalu ①. Gambar panah satu arah terpisah hanya bila ingin menegaskan arah keluaran.*

---

### Ringkasan cepat — daftar panah

**↔ Panah bolak-balik (7 koneksi):**
1. Pengguna ↔ Antarmuka Web Pengguna (103)
2. Antarmuka (103) ↔ Server Aplikasi (101)
3. Server (101) ↔ Basis Data (102)
4. Server (101) ↔ Modul Pemetaan Lokasi (104)
5. Server (101) ↔ Modul Komunikasi Digital (105)
6. Server (101) ↔ Modul Pengelolaan Data Sampah (106)
7. Modul Pemetaan (104) ↔ Basis Data (102), dan Modul Pelaporan (107) ↔ Basis Data (102) *(keduanya pembacaan data)*

**→ Panah satu arah (penyimpanan / keluaran):**
- Modul Komunikasi (105) → Basis Data (102) *(simpan riwayat)*
- Modul Pengelolaan (106) → Basis Data (102) *(simpan transaksi)*
- Server (101) → Antarmuka (103) → Pengguna *(keluaran laporan, opsional)*

> **Pola mudah diingat:** semua yang menyentuh **Server Aplikasi (101)** = bolak-balik (↔), karena server selalu meminta dan menerima. Panah ke **Basis Data (102)** tergantung niatnya: **membaca = ↔**, **menyimpan = →**.

---

## 3. Saran Ikon (Generik) + Kata Kunci Pencarian di Lucid

> Di Lucid: panel kiri → **Shapes** → kotak pencarian → ketik kata kunci di bawah. Pilih ikon **garis sederhana (line/outline)** agar konsisten dan netral untuk paten.

| Komponen | Ikon yang disarankan | Kata kunci di Lucid | Warna saran |
|---|---|---|---|
| **Server Aplikasi (101)** | Server rack / roda gigi (gear) / CPU | `server`, `gear`, `processor` | Biru |
| **Basis Data (102)** | Silinder database | `database`, `cylinder`, `storage` | Hijau |
| **Antarmuka Web Pengguna (103)** | Monitor + smartphone | `browser`, `web`, `monitor`, `smartphone` | Kuning/oranye |
| **Modul Pemetaan Lokasi (104)** | Pin lokasi / peta | `location pin`, `map`, `gps` | Ungu |
| **Modul Komunikasi Digital (105)** | Gelembung chat / pesan | `chat`, `message`, `bubble` | Merah muda |
| **Modul Pengelolaan Data Sampah (106)** | Daur ulang / clipboard | `recycle`, `clipboard`, `checklist` | Hijau tua |
| **Modul Pelaporan (107)** | Grafik batang / dokumen laporan | `chart`, `report`, `analytics`, `document` | Oranye |
| **Pengguna (Masyarakat dll.)** | Orang / sekumpulan orang | `user`, `person`, `people` | Abu-abu |

---

## 4. Tips Khusus Lucid (lucid.app)

1. **Container/Group** — gunakan menu *Shapes → Containers*. Tarik ikon ke dalamnya supaya "menempel" & ikut berpindah saat kotak digeser. Inilah cara mengotak-kotakkan seperti gambar AWS.
2. **Garis solid vs putus-putus** — klik border kotak → panel kanan → *Line* → pilih *Dashed* untuk sub-kelompok, *Solid* untuk batas utama.
3. **Badge bernomor** — pakai shape **lingkaran** kecil, isi warna gelap, teks angka putih. Letakkan menempel di garis panah.
4. **Connector pintar** — tarik panah dari titik biru di tepi ikon; Lucid otomatis menjaga sambungan saat ikon digeser. Pakai panah **dua arah (↔)** untuk komunikasi bolak-balik (101↔103, 101↔modul), **satu arah (→)** untuk alur searah (modul→102).
5. **Judul kotak** — taruh teks di pojok kiri-atas tiap container (contoh: "Pengguna Sistem", "Modul-Modul Sistem").
6. **Penomoran komponen** — tulis "(101)", "(102)" dst. tepat di bawah/samping label tiap ikon agar konsisten dengan deskripsi paten.
7. **Rapikan** — pilih beberapa objek → *Align* (rata kiri/tengah) & *Distribute* (jarak sama) di toolbar atas. Ini kunci tampilan profesional.
8. **Konsistensi gaya ikon** — jangan campur ikon flat berwarna dengan ikon garis. Pilih satu gaya (disarankan outline) untuk semua.

---

## 5. Catatan untuk Gambar 2–5

Teknik yang sama berlaku untuk diagram alir (Gambar 2–5), hanya bentuknya **flowchart**:
- Pakai shape **belah ketupat** untuk keputusan ("Identitas valid?"), **persegi membulat** untuk proses, **oval** untuk Mulai/Selesai.
- Tetap sisipkan nomor komponen (101–107) di langkah yang relevan.
- Alur atas → bawah, satu kolom utama, cabang keputusan ke samping.
