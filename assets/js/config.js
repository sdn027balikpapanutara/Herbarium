/* =====================================================
   KONFIGURASI WEBSITE HERBARIUM
   -----------------------------------------------------
   ISI BAGIAN YANG BERTANDA ⚠️ WAJIB SEBELUM DEPLOY.
   Penjelasan lengkap ada di README.md
   ===================================================== */

const CONFIG = {
  // Judul website (tampil di header & tab browser)
  SITE_TITLE: "Herbarium Tanaman",

  // Subjudul di halaman utama
  SITE_TAGLINE: "Koleksi digital tanaman — pindai QR, jelajahi informasi.",

  /* ⚠️ WAJIB DIISI #1 — URL PUBLIC WEBSITE ANDA (GitHub Pages)
     Format: https://USERNAME-GITHUB.github.io/NAMA-REPO/
     Contoh : https://budi-herbarium.github.io/herbarium-web/
     Dipakai untuk membuat URL yang dikodekan ke dalam QR Code. */
  BASE_URL: "https://github.com/sdn027balikpapanutara/Herbarium",

  /* ⚠️ WAJIB DIISI #2 — ID GOOGLE SPREADSHEET
     Ambil dari URL spreadsheet:
     https://docs.google.com/spreadsheets/d/<<ID_INI>>/edit#gid=0
     Spreadsheet HARUS dibagikan: Anyone with the link → Viewer. */
  SHEET_ID: "",

  // ID tab sheet (lihat parameter gid= di URL spreadsheet). Sheet pertama biasanya 0.
  SHEET_GID: "0",

  /* OPSIONAL (Alternatif SHEET_ID):
     Jika Anda memakai menu File → Share → Publish to web → CSV,
     tempel URL pub?output=csv di sini. Jika diisi, SHEET_ID diabaikan. */
  SHEET_PUBLISHED_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vShIEH7IeaXDUHTJQMvqwQWgLf_IdjTIBpwe2lxVoXibA8Uex7qvErGdKNlcZLvXTvk0HZRR5njZmrZ/pub?output=csv",

  /* OPSIONAL — Logo institusi pada poster QR (baris logo di bagian atas).
     Isi dengan URL/file gambar, contoh: ["assets/img/logo1.png", ...].
     Kosongkan [] untuk menampilkan teks judul saja. */
  LOGOS: [],

  /* OPSIONAL — Tingkat koreksi kesalahan QR (L/M/Q/H). H = paling tahan tertutup kotoran. */
  QR_ERROR_LEVEL: "M",
};