# 🌿 GenHi — Panduan Deploy & Setup CMS

## Overview Arsitektur

```
GitHub Repo (Althafizer/GenHi)
        ↓  push/commit
Netlify (hosting + build)
        ↓  Git Gateway
DecapCMS (/admin)
        ↓  edit konten
content/*.json  ←  dibaca oleh GenHi.html
```

---

## BAGIAN 1 — Deploy ke Netlify

### Step 1: Push project ke GitHub

```bash
# Clone atau masuk ke folder project
cd GenHi

# Pastikan semua file sudah ada
git add .
git commit -m "feat: add DecapCMS + netlify config"
git push origin main
```

### Step 2: Connect Netlify ke GitHub

1. Buka **[netlify.com](https://netlify.com)** → Login / Sign Up
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** → Authorize Netlify
4. Pilih repo **`Althafizer/GenHi`**
5. Build settings:
   - **Branch:** `main`
   - **Build command:** *(kosongkan)*
   - **Publish directory:** `.`
6. Klik **"Deploy site"**
7. Tunggu ~30 detik → site live! 🎉

### Step 3: Set custom domain (opsional)

- Di Netlify dashboard → **Domain settings**
- Tambah domain kamu, misal: `genhi.id`
- Update DNS sesuai instruksi Netlify

---

## BAGIAN 2 — Setup DecapCMS

### Step 1: Aktifkan Netlify Identity

1. Di Netlify dashboard → **Site configuration → Identity**
2. Klik **"Enable Identity"**
3. Di bagian **Registration** → pilih **"Invite only"** ⚠️ (PENTING! Jangan biarkan open)
4. Di bagian **External providers** → biarkan kosong (kita pakai email/password)

### Step 2: Aktifkan Git Gateway

1. Masih di Identity settings
2. Scroll ke bawah → **Services → Git Gateway**
3. Klik **"Enable Git Gateway"**
4. Ini yang memungkinkan CMS menulis ke GitHub repo

### Step 3: Update site URL di config.yml

Buka `admin/config.yml`, ganti baris ini:
```yaml
site_url: https://genhi.netlify.app
display_url: https://genhi.netlify.app
```
Dengan URL Netlify site kamu yang sebenarnya.

### Step 4: Tambah Netlify Identity widget ke GenHi.html

Tambahkan script ini sebelum `</body>` di `GenHi.html`:

```html
<!-- Netlify Identity -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

---

## BAGIAN 3 — Undang Tim Media Bank Sampah

### Cara undang user baru:

1. Netlify dashboard → **Identity → Invite users**
2. Masukkan email tim media bank sampah
3. Mereka akan dapat email undangan
4. Mereka set password sendiri
5. Login di: `https://[site-kamu].netlify.app/admin/`

### Role management:
- **Default:** semua user bisa edit semua konten
- Untuk restrict per bank sampah → perlu upgrade ke Netlify Pro
  atau gunakan Strapi (future upgrade)

---

## BAGIAN 4 — Cara Kerja CMS

### Alur edit konten:

```
Tim media login di /admin/
        ↓
Edit data bank sampah / artikel
        ↓
Klik "Publish" / "Save"
        ↓
DecapCMS commit ke GitHub
        ↓
Netlify auto-rebuild (< 1 menit)
        ↓
Website update otomatis ✅
```

### Struktur file konten:

```
content/
├── bank-sampah/          ← satu file .json per bank sampah
│   ├── bank-sampah-mandiri-sejahtera.json
│   ├── bank-sampah-hijau-mandiri.json
│   └── ...
├── artikel/              ← satu file .json per artikel
│   ├── 2026-04-18-cara-memilah-sampah.json
│   └── ...
├── statistik.json        ← data dashboard publik
└── settings.json         ← info organisasi GenHi
```

---

## BAGIAN 5 — Update Frontend (fetch dari CMS)

Setelah CMS setup, update `components/Catalog.jsx` untuk fetch data dari
`/content/bank-sampah/*.json` alih-alih hardcoded.

Contoh fetch:
```javascript
async function loadBankSampah() {
  const res = await fetch('/content/bank-sampah-index.json');
  const data = await res.json();
  return data.bank_sampah;
}
```

> ⚠️ Perlu generate `bank-sampah-index.json` via Netlify build step
> atau pakai Netlify Functions untuk aggregate semua file.
> Ini akan disetup di tahap berikutnya.

---

## BAGIAN 6 — Environment Variables

Di Netlify dashboard → **Environment variables**, tambahkan:

```
GOOGLE_MAPS_KEY = AIzaSyAsj6An1AW-wbMFmgVLpH4Dx6ZUTdWk87c
GOOGLE_MAP_ID   = d46836a28dac693bd56f100c
```

> ⚠️ Jangan commit API key ke GitHub! Pindahkan ke env vars.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| CMS tidak bisa login | Pastikan Netlify Identity & Git Gateway aktif |
| Konten tidak update | Cek Netlify deploy log, pastikan build sukses |
| Foto tidak muncul | Pastikan `media_folder` di config.yml benar |
| 404 di `/admin/` | Pastikan folder `admin/` ada di root project |

---

## Kontak Support

Email: info@genhi.id  
GitHub Issues: github.com/Althafizer/GenHi/issues
