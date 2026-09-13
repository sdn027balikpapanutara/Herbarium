/* =====================================================
   UTILS — kumpulan fungsi bantuan umum
   ===================================================== */
const Utils = (() => {
  const PLACEHOLDER = "assets/img/placeholder.svg";

  /* Mengubah link Google Drive (format apa pun) menjadi link
     yang bisa ditampilkan langsung di <img>. */
  function driveToDirect(url) {
    if (!url || !url.trim()) return PLACEHOLDER;
    url = url.trim();

    // Sudah link langsung yang aman
    if (
      url.includes("lh3.googleusercontent.com/d/") ||
      url.includes("drive.google.com/thumbnail") ||
      url.includes("uc?export=view") ||
      url.includes("uc?id=")
    ) {
      return url;
    }

    // Ekstrak ID file dari berbagai format link Drive
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
      /[?&]id=([a-zA-Z0-9_-]{10,})/,
      /\/d\/([a-zA-Z0-9_-]{10,})/,
      /\/open\?id=([a-zA-Z0-9_-]{10,})/,
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m && m[1]) {
        return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1600`;
      }
    }

    // Bukan link Drive → anggap URL gambar langsung
    return url;
  }

  // Escape HTML agar aman dari karakter khusus
  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Pecah teks manfaat/keterangan menjadi daftar (pisah: enter, ;, atau ,)
  function splitList(text) {
    return String(text || "")
      .split(/\n|;|,/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Paragraf dari teks multi-baris
  function paragraphs(text) {
    return String(text || "")
      .split(/\n+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  // Trigger download file dari Blob
  function downloadBlob(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // Preload gambar cross-origin (penting agar html2canvas tidak gagal)
  function preload(urls = []) {
    return Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          })
      )
    );
  }

  return { driveToDirect, esc, splitList, paragraphs, qs, downloadBlob, preload, PLACEHOLDER };
})();