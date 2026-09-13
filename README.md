# 🌿 Herbarium Tanaman — Website + QR Code Siap Cetak

Website herbarium digital yang **sepenuhnya statis** (hosting gratis di **GitHub Pages**),
dengan data dikelola lewat **Google Spreadsheet** dan foto dari **Google Drive**.
Setiap tanaman punya halaman detail ber-ID unik, serta **poster QR Code siap cetak**
sesuai template desain institusi.

## ✨ Fitur
- Halaman daftar tanaman + **pencarian** & **filter kategori** otomatis.
- Halaman detail tanaman (`tanaman.html?id=...`) — URL unik per tanaman.
- Data **100% dari Google Spreadsheet** — tambah tanaman cukup tambah baris.
- Foto dari **Google Drive** (tempel link share biasa ke spreadsheet).
- **Generator QR Code** dengan desain poster siap cetak (ornamen, logo, "SCAN DISINI", nama tanaman).
- **Download PNG** resolusi tinggi (2100×1400), **cetak langsung**, dan **batch ZIP** semua tanaman.
- Responsive desktop & mobile. Tanpa backend, tanpa biaya.

## 🧰 Teknologi
HTML + CSS + JavaScript murni (kompatibel GitHub Pages). Library via CDN:
| Library | Fungsi |
|---|---|
| PapaParse | Membaca CSV export spreadsheet |
| qrcode | Membuat QR Code |
| html2canvas | Render poster → PNG |
| JSZip | Download batch semua QR |

## 📁 Struktur Folder
```
herbarium-web/
├── index.html          # Daftar tanaman
├── tanaman.html        # Detail tanaman (?id=...)
├── qr.html             # Generator QR siap cetak
├── README.md
└── assets/
    ├── css/style.css, poster.css
    ├── js/config.js, utils.js, data.js, app.js, detail.js, qr-generator.js
    └── img/placeholder.svg, favicon.svg
```

---

## 🚀 MENJALANKAN LOCAL
1. Install semua file sesuai struktur di atas.
2. Jalankan server lokal sederhana (disarankan, agar fetch data lancar):
   ```bash
   python -m http.server 8000
   # atau: npx serve
   ```
3. Buka `http://localhost:8000`.
   (Bisa juga buka `index.html` langsung, tetapi beberapa browser membatasi fetch dari `file://`.)

---

## 📊 KONFIGURASI SPREADSHEET (WAJIB)

### 1. Buat spreadsheet dengan header baris pertama PERSIS:
| id | nama | nama_latin | famili | kategori | nama_daerah | deskripsi | manfaat | habitat | perawatan | perkembangbiakan | referensi | foto | keterangan |
|----|------|-----------|--------|----------|-------------|-----------|---------|---------|-----------|------------------|-----------|------|------------|

- Kolom **wajib**: `id`, `nama`. Sisanya opsional (section otomatis disembunyikan bila kosong).
- `nama_daerah`, `perkembangbiakan`, `referensi` adalah kolom opsional tambahan; `referensi` otomatis menjadi link bila berisi URL.

Contoh 1 baris data:
| jahe-01 | Jahe | Zingiber officinale | Zingiberaceae | Rempah & Obat | Jahe adalah rimpang… | Menghangatkan tubuh, Meredakan mual, Antiinflamasi | Dataran rendah–tinggi, lembap | Siram 2x sehari, tanah gembur | *(link Drive)* | Tanaman toga populer |

Aturan penting:
- **`id` wajib unik**, tanpa spasi (contoh: `jahe-01`, `kunyit-02`). ID inilah yang menjadi URL & nama file QR.
- `manfaat` boleh beberapa item dipisah **koma / titik koma / enter dalam sel**.
- Baris baru = tanaman baru. **Tidak perlu mengubah kode website.**
- Kolom opsional boleh dikosongkan (section otomatis disembunyikan).

### 2. Bagikan spreadsheet
`Share` → **Anyone with the link** → **Viewer**.

### 3. Ambil ID spreadsheet
Dari URL: `https://docs.google.com/spreadsheets/d/`**`1AbC...XYZ`**`/edit#gid=0`
- Bagian setelah `/d/` = **SHEET_ID**
- Angka setelah `gid=` = **SHEET_GID** (sheet pertama biasanya `0`)

### 4. (Alternatif) Publish to web
`File → Share → Publish to web` → pilih sheet → format **CSV** → Publish.
Tempel URL `...pub?output=csv` ke `SHEET_PUBLISHED_CSV_URL` di `config.js`.

---

## 🖼 FOTO GOOGLE DRIVE
1. Upload foto ke Google Drive.
2. Klik kanan file → **Share** → **Anyone with the link** → **Viewer**.
3. Copy link (format apa pun didukung), contoh:
   `https://drive.google.com/file/d/1AbC.../view?usp=sharing`
4. Tempel **link apa adanya** ke kolom `foto` di spreadsheet.
   Website otomatis mengubahnya menjadi link gambar langsung.

---

## ⚙️ FILE KONFIGURASI (`assets/js/config.js`)
| Kunci | Wajib? | Isi |
|---|---|---|
| `BASE_URL` | ✅ | URL GitHub Pages Anda, mis. `https://username.github.io/herbarium-web/` |
| `SHEET_ID` | ✅* | ID spreadsheet (*atau gunakan `SHEET_PUBLISHED_CSV_URL`) |
| `SHEET_GID` | ❌ | ID tab sheet (default `0`) |
| `SHEET_PUBLISHED_CSV_URL` | ❌ | Alternatif SHEET_ID |
| `LOGOS` | ❌ | Array URL logo untuk poster, mis. `["assets/img/logo1.png"]` |
| `SITE_TITLE`, `SITE_TAGLINE`, `QR_ERROR_LEVEL` | ❌ | Kustomisasi tampilan |

> ⚠️ **Isi `BASE_URL` SEBELUM mencetak QR**, karena QR mengkodekan URL tersebut.

---

## 🌐 DEPLOY KE GITHUB PAGES
1. Buat repository baru di GitHub (mis. `herbarium-web`).
2. Upload seluruh file project (commit ke branch `main`).
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Tunggu 1–2 menit, situs tayang di `https://USERNAME.github.io/NAMA-REPO/`.
5. **Update `BASE_URL` di `config.js` sesuai URL tersebut**, commit & push ulang.
6. Uji: buka `tanaman.html?id=jahe-01` dari URL publik.

---

## 🖨 MEMBUAT & MENCETAK QR
1. Buka `qr.html` di situs yang sudah deploy.
2. Pilih tanaman → preview poster muncul (desain sesuai template).
3. **⬇ Unduh PNG** → file `QR-<id>.png` (2100×1400 px, cocok cetak A5/A4/label poster).
4. **📦 Unduh Semua QR (.zip)** → semua poster sekaligus untuk cetak massal.
5. **🖨 Cetak** → mencetak poster langsung dari browser (hanya area poster).
6. Tempel PNG pada media/poster tanaman. Saat dipindai → terbuka halaman detail tanaman.

---

## ➕ MENAMBAH TANAMAN BARU (alur harian non-programmer)
1. Upload foto ke Drive → set sharing → copy link.
2. Buka spreadsheet → tambah baris baru isi semua kolom (id unik!).
3. Simpan. Selesai — website & generator QR otomatis membaca data baru
   (reload halaman; tidak perlu deploy ulang).

---

## 🛠 TROUBLESHOOTING
| Masalah | Solusi |
|---|---|
| Data tidak muncul / error konfigurasi | Isi `SHEET_ID` di `config.js`; pastikan sheet sudah di-share "Anyone with the link = Viewer". |
| Foto tidak tampil | Pastikan file Drive di-share "Anyone with the link"; cek link di kolom `foto`. |
| QR mengarah ke halaman salah | Isi `BASE_URL` dengan benar (pakai `https://` dan akhiran `/`), lalu push ulang. |
| QR tidak bisa dipindai ke situs | Situs harus sudah **deploy publik** (URL localhost tidak bisa dipindai dari HP lain). |
| Logo tidak muncul di hasil PNG | Gunakan file logo didalam repo (`assets/img/...`) agar bebas masalah CORS. |
| Data spreadsheet tidak update | Browser/cache CDN CSV; reload hard (Ctrl+F5). Perubahan sheet butuh beberapa detik. |
| Hasil cetak terpotong | Pakai kertas landscape / scale "Fit to page"; atau unduh PNG lalu cetak dari aplikasi gambar. |

---

## 🎨 KUSTOMISASI DESAIN
- Warna global: variabel `:root` di `assets/css/style.css`.
- Desain poster QR: `assets/css/poster.css` + fungsi `posterHTML()` / ornamen SVG di `assets/js/qr-generator.js`.
- Ukuran poster: konstanta `POSTER_W/POSTER_H` (jaga rasio saat mengubah).

## 📄 Lisensi
Bebas digunakan & dikembangkan untuk keperluan institusi/pendidikan.