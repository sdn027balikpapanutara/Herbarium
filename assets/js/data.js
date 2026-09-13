/* =====================================================
   DATA STORE — membaca & menormalisasi data dari
   Google Spreadsheet (export CSV). Tanpa backend.
   ===================================================== */
const DataStore = (() => {
  let cache = null;

  function csvUrl() {
    const pub = CONFIG.SHEET_PUBLISHED_CSV_URL || "";
    if (pub && !pub.includes("GANTI")) return pub;

    const id = CONFIG.SHEET_ID || "";
    if (id && !id.includes("GANTI")) {
      const gid = CONFIG.SHEET_GID || "0";
      return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`;
    }
    return null;
  }

  function normalizeRow(r) {
    return {
      id: r.id,
      nama: r.nama || r.nama_tanaman || "",
      nama_latin: r.nama_latin || r.nama_ilmiah || "",
      famili: r.famili || r.keluarga || "",
      kategori: r.kategori || r.kelompok || "",
      nama_daerah: r.nama_daerah || r.sinonim || "",
      deskripsi: r.deskripsi || "",
      manfaat: r.manfaat || "",
      habitat: r.habitat || "",
      perawatan: r.perawatan || r.cara_perawatan || "",
      perkembangbiakan: r.perkembangbiakan || r.perbanyakan || "",
      referensi: r.referensi || r.sumber || "",
      keterangan: r.keterangan || r.tambahan || "",
      foto: Utils.driveToDirect(r.foto || r.foto_url || r.gambar || ""),
    };
  }

  async function loadPlants(force = false) {
    if (cache && !force) return cache;

    const url = csvUrl();
    if (!url) {
      throw new Error(
        "KONFIGURASI BELUM LENGKAP.\nIsi SHEET_ID (atau SHEET_PUBLISHED_CSV_URL) pada file assets/js/config.js terlebih dahulu. Lihat README.md bagian KONFIGURASI."
      );
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(
        `Gagal mengambil data spreadsheet (HTTP ${res.status}).\nPastikan spreadsheet dibagikan dengan akses "Anyone with the link = Viewer", atau gunakan URL Publish to web. Lihat README.md.`
      );
    }

    const text = await res.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    const rows = parsed.data
      .map((row) => {
        const o = {};
        Object.keys(row).forEach((k) => {
          if (k) o[k.trim().toLowerCase()] = String(row[k] ?? "").trim();
        });
        return o;
      })
      .filter((r) => r.id);

    if (!rows.length) {
      throw new Error(
        "Spreadsheet terbaca tetapi tidak ada baris berisi kolom `id`.\nPastikan baris pertama spreadsheet adalah header: id, nama, nama_latin, famili, kategori, nama_daerah, deskripsi, manfaat, habitat, perawatan, perkembangbiakan, referensi, foto, keterangan"
      );
    }

    cache = rows.map(normalizeRow);
    return cache;
  }

  async function getById(id) {
    const all = await loadPlants();
    return all.find((p) => p.id.toLowerCase() === String(id).toLowerCase());
  }

  function categories(all) {
    return [...new Set(all.map((p) => p.kategori).filter(Boolean))].sort();
  }

  return { loadPlants, getById, categories };
})();