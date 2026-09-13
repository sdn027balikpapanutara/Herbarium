/* =====================================================
   QR GENERATOR (v2 — pakai qrcodejs dari cdnjs)
   - QR Code menuju halaman detail tanaman
   - Poster siap cetak: LANDSCAPE (1050x700) & PORTRAIT (700x1050)
   - Download PNG resolusi tinggi, cetak, dan batch ZIP
   ===================================================== */
(async function () {
  const select = Utils.qs("#plantSelect");
  const orientSelect = Utils.qs("#orientSelect");
  const mount = Utils.qs("#posterMount");
  const scaleWrap = Utils.qs("#posterScale");
  const viewport = Utils.qs("#posterViewport");
  const urlPreview = Utils.qs("#urlPreview");
  const statusMsg = Utils.qs("#statusMsg");
  const btnDownload = Utils.qs("#btnDownload");
  const btnPrint = Utils.qs("#btnPrint");
  const btnBatch = Utils.qs("#btnBatch");

  Utils.qs("#siteTitle").textContent = CONFIG.SITE_TITLE;

  const DIMS = {
    landscape: { w: 1050, h: 700 },
    portrait: { w: 700, h: 1050 },
  };

  function getStoredOrient() {
    try { return localStorage.getItem("herbarium-orient") || "landscape"; }
    catch (e) { return "landscape"; }
  }
  function storeOrient(v) {
    try { localStorage.setItem("herbarium-orient", v); } catch (e) { /* abaikan */ }
  }

  let orient = DIMS[getStoredOrient()] ? getStoredOrient() : "landscape";
  let plants = [];
  let current = null;

  if (!CONFIG.BASE_URL || CONFIG.BASE_URL.includes("USERNAME-GITHUB")) {
    Utils.qs("#configWarn").hidden = false;
  }

  function plantUrl(p) {
    const base = CONFIG.BASE_URL.replace(/\/+$/, "");
    return `${base}/tanaman.html?id=${encodeURIComponent(p.id)}`;
  }

  /* ---------- Buat dataURL QR (qrcodejs API) ---------- */
  function qrDataUrl(text) {
    return new Promise((resolve, reject) => {
      if (typeof QRCode === "undefined") {
        reject(new Error(
          "Library QRCode gagal dimuat dari CDN. Periksa tag <script> qrcodejs di qr.html, atau koneksi internet Anda."
        ));
        return;
      }
      const holder = document.createElement("div");
      holder.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.appendChild(holder);
      try {
        const lvl = CONFIG.QR_ERROR_LEVEL || "M";
        new QRCode(holder, {
          text: text,
          width: 600,
          height: 600,
          colorDark: "#1c4a00",
          colorLight: "#ffffff",
          correctLevel: (QRCode.CorrectLevel && QRCode.CorrectLevel[lvl]) || QRCode.CorrectLevel.M,
        });
      } catch (e) {
        holder.remove();
        reject(e);
        return;
      }
      // Tunggu satu tick agar canvas selesai digambar
      setTimeout(() => {
        try {
          const canvas = holder.querySelector("canvas");
          const img = holder.querySelector("img");
          let url = null;
          if (canvas) {
            // Tambahkan quiet zone (margin putih) agar mudah dipindai
            const pad = 48;
            const out = document.createElement("canvas");
            out.width = out.height = 600 + pad * 2;
            const ctx = out.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, out.width, out.height);
            ctx.drawImage(canvas, pad, pad, 600, 600);
            url = out.toDataURL("image/png");
          } else if (img && img.src) {
            url = img.src;
          }
          holder.remove();
          if (!url) throw new Error("Canvas QR tidak ditemukan.");
          resolve(url);
        } catch (e) {
          holder.remove();
          reject(e);
        }
      }, 60);
    });
  }

  /* =====================================================
     ORNAMEN SVG
     ===================================================== */
  const SPARK_PATH = "M0-12C1.8-3.6 3.6-1.8 12 0 3.6 1.8 1.8 3.6 0 12-1.8 3.6-3.6 1.8-12 0-3.6-1.8-1.8-3.6 0-12Z";

  function sparkleSVG(cls) {
    return `<svg class="p-spark ${cls}" viewBox="-14 -14 28 28"><path d="${SPARK_PATH}" fill="#3f8f2f"/></svg>`;
  }

  function cornerTopSVG() {
    return `
      <svg class="p-deco p-tl" viewBox="0 0 260 230">
        <path d="M0 0h235c6 52-18 92-64 108-52 18-112 6-171-26V0z" fill="#4d9e3d"/>
        <ellipse cx="96" cy="152" rx="58" ry="42" fill="#8fd07a" transform="rotate(-14 96 152)"/>
        <g stroke="#2c6a12" stroke-width="3" fill="none" stroke-linecap="round">
          <path d="M150 8c10 40 12 78 6 118"/>
          <ellipse cx="130" cy="30" rx="20" ry="8" transform="rotate(-32 130 30)"/>
          <ellipse cx="172" cy="44" rx="20" ry="8" transform="rotate(32 172 44)"/>
          <ellipse cx="128" cy="62" rx="20" ry="8" transform="rotate(-32 128 62)"/>
          <ellipse cx="172" cy="76" rx="20" ry="8" transform="rotate(32 172 76)"/>
          <ellipse cx="130" cy="94" rx="20" ry="8" transform="rotate(-32 130 94)"/>
          <ellipse cx="166" cy="108" rx="18" ry="7" transform="rotate(32 166 108)"/>
        </g>
        <g fill="#2c6a12">
          <path d="M212 58c14 18 22 40 24 64" stroke="#2c6a12" stroke-width="2.5" fill="none"/>
          <circle cx="218" cy="72" r="2.6"/><circle cx="226" cy="86" r="2.6"/>
          <circle cx="231" cy="102" r="2.6"/><circle cx="234" cy="118" r="2.6"/>
          <circle cx="208" cy="80" r="2.6"/><circle cx="214" cy="96" r="2.6"/>
          <circle cx="220" cy="112" r="2.6"/>
        </g>
      </svg>
      <svg class="p-deco p-tr" viewBox="0 0 260 230">
        <path d="M0 0h235c6 52-18 92-64 108-52 18-112 6-171-26V0z" fill="#4d9e3d"/>
        <ellipse cx="96" cy="152" rx="58" ry="42" fill="#8fd07a" transform="rotate(-14 96 152)"/>
        <g stroke="#2c6a12" stroke-width="3" fill="none" stroke-linecap="round">
          <path d="M150 8c10 40 12 78 6 118"/>
          <ellipse cx="130" cy="30" rx="20" ry="8" transform="rotate(-32 130 30)"/>
          <ellipse cx="172" cy="44" rx="20" ry="8" transform="rotate(32 172 44)"/>
          <ellipse cx="128" cy="62" rx="20" ry="8" transform="rotate(-32 128 62)"/>
          <ellipse cx="172" cy="76" rx="20" ry="8" transform="rotate(32 172 76)"/>
          <ellipse cx="130" cy="94" rx="20" ry="8" transform="rotate(-32 130 94)"/>
          <ellipse cx="166" cy="108" rx="18" ry="7" transform="rotate(32 166 108)"/>
        </g>
      </svg>`;
  }

  function cornerBottomSVG() {
    const shape = `
      <svg viewBox="0 0 320 210">
        <path d="M8 96c52-22 96-14 132 22 30 30 66 46 108 48" fill="none" stroke="#2c6a12" stroke-width="3"/>
        <path d="M0 210V118c56-20 100-10 134 26 30 32 68 48 112 50l74 4v12z" fill="#4d9e3d"/>
      </svg>`;
    return `
      <div class="p-deco p-bl" style="width:320px">${shape}</div>
      <div class="p-deco p-br" style="width:320px;transform:scaleX(-1)">${shape}</div>`;
  }

  function chevronsSVG() {
    let inner = "";
    for (let i = 0; i < 5; i++) {
      const x = i * 40;
      inner += `<path d="M${x} 4h14l26 28-26 28h-14l26-28z" fill="none" stroke="#4d9e3d" stroke-width="3"/>`;
    }
    return `
      <svg class="p-chev p-chev-l" viewBox="0 0 200 64">${inner}</svg>
      <svg class="p-chev p-chev-r" viewBox="0 0 200 64">${inner}</svg>`;
  }

  function arrowsSVG() {
    return `
      <svg class="p-arrows" viewBox="0 0 520 26">
        <path d="M0 13h222" stroke="#3f8f2f" stroke-width="2.5"/>
        <path d="M238 13l-16-7v14z" fill="#3f8f2f"/>
        <path d="M520 13H298" stroke="#3f8f2f" stroke-width="2.5"/>
        <path d="M282 13l16-7v14z" fill="#3f8f2f"/>
        <path d="${SPARK_PATH}" transform="translate(260 13) scale(.55)" fill="#3f8f2f"/>
      </svg>`;
  }

  function flowerSVG(uid) {
    let petals = "";
    for (let a = 0; a < 360; a += 72) {
      petals += `<ellipse cx="70" cy="34" rx="24" ry="34" fill="url(#pet${uid})" stroke="#ffffff" stroke-width="2" opacity=".95" transform="rotate(${a} 70 70)"/>`;
    }
    return `
      <svg viewBox="0 0 140 140">
        <defs>
          <linearGradient id="pet${uid}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f7d9e8"/>
            <stop offset=".45" stop-color="#e8e6f7"/>
            <stop offset=".75" stop-color="#d9f0f7"/>
            <stop offset="1" stop-color="#f7efd9"/>
          </linearGradient>
          <radialGradient id="cen${uid}">
            <stop offset="0" stop-color="#f7c56b"/>
            <stop offset="1" stop-color="#e08a2e"/>
          </radialGradient>
        </defs>
        ${petals}
        <circle cx="70" cy="70" r="17" fill="url(#cen${uid})"/>
      </svg>`;
  }

  /* =====================================================
     TEMPLATE POSTER (landscape & portrait)
     ===================================================== */
  function posterHTML(plant, qrData, orientation) {
    const uid = String(plant.id).replace(/[^a-zA-Z0-9]/g, "");
    const logos = (CONFIG.LOGOS || []).filter(Boolean);
    const pillContent = logos.length
      ? logos.map((src) => `<img src="${Utils.esc(src)}" crossorigin="anonymous" alt="logo" />`).join("")
      : `<span class="p-pill-text">${Utils.esc(CONFIG.SITE_TITLE)}</span>`;

    const tags = [];
    if (plant.kategori) tags.push(`<span class="p-tag">${Utils.esc(plant.kategori)}</span>`);
    if (plant.famili) tags.push(`<span class="p-tag alt">${Utils.esc(plant.famili)}</span>`);

    // Footer kecil berisi alamat website (hanya portrait, hanya jika BASE_URL sudah diisi)
    const footerRaw = (CONFIG.BASE_URL || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const footerText = footerRaw && !footerRaw.includes("USERNAME-GITHUB") ? footerRaw : "";

    return `
      <div class="poster ${orientation === "portrait" ? "portrait" : ""}">
        <div class="p-band"></div>
        ${cornerTopSVG()}
        ${cornerBottomSVG()}
        ${chevronsSVG()}
        <div class="p-logo-pill">${pillContent}</div>
        ${arrowsSVG()}
        <h2 class="p-title">SCAN DISINI</h2>
        <div class="p-qr-box">
          ${qrData ? `<img class="p-qr-img" src="${qrData}" alt="QR Code ${Utils.esc(plant.nama)}" />`
                  : `<div class="p-qr-placeholder">QR<br>CODE</div>`}
          ${sparkleSVG("p-spark-tr")}
          ${sparkleSVG("p-spark-bl")}
        </div>
        <div class="p-name">${Utils.esc(plant.nama)}</div>
        <div class="p-latin">${Utils.esc(plant.nama_latin)}</div>
        <div class="p-hint">Pindai untuk informasi lengkap tanaman ini</div>
        <div class="p-tags">${tags.join("")}</div>
        <div class="p-flower p-fl-1">${flowerSVG("a" + uid)}</div>
        <div class="p-flower p-fl-2">${flowerSVG("b" + uid)}</div>
        <div class="p-flower p-fl-3">${flowerSVG("c" + uid)}</div>
        <div class="p-flower p-fl-4">${flowerSVG("d" + uid)}</div>
        ${footerText ? `<div class="p-footer">${Utils.esc(footerText)}</div>` : ""}
      </div>`;
  }

  /* ---------- Skala preview ---------- */
  function fitScale() {
    const d = DIMS[orient];
    const w = viewport.clientWidth || d.w;
    const s = Math.min(1, w / d.w);
    scaleWrap.style.transform = `scale(${s})`;
    viewport.style.height = `${d.h * s}px`;
  }
  window.addEventListener("resize", fitScale);

  /* ---------- Render preview (dengan penanganan error) ---------- */
  async function render(plant) {
    current = plant;
    const url = plantUrl(plant);
    urlPreview.value = url;
    statusMsg.textContent = "Membuat QR…";
    try {
      const qr = await qrDataUrl(url);
      mount.innerHTML = posterHTML(plant, qr, orient);
      await Utils.preload(CONFIG.LOGOS || []);
      fitScale();
      statusMsg.textContent = "";
    } catch (e) {
      statusMsg.textContent = "❌ " + e.message;
    }
  }

  /* ---------- Render poster ke canvas ---------- */
  async function posterToCanvas(node) {
    await document.fonts.ready;
    const d = DIMS[orient];
    return html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ddf2c2",
      logging: false,
      width: d.w,
      height: d.h,
    });
  }

  /* ---------- Download PNG satu tanaman ---------- */
  async function downloadCurrent() {
    if (!current) return;
    statusMsg.textContent = "Merender PNG…";
    btnDownload.disabled = true;
    try {
      const node = mount.querySelector(".poster");
      const canvas = await posterToCanvas(node);
      const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
      Utils.downloadBlob(blob, `QR-${current.id}-${orient}.png`);
      statusMsg.textContent = `✅ QR-${current.id}-${orient}.png berhasil diunduh.`;
    } catch (e) {
      statusMsg.textContent = "❌ Gagal render: " + e.message;
    } finally {
      btnDownload.disabled = false;
    }
  }

  /* ---------- Batch semua tanaman → ZIP ---------- */
  async function downloadBatch() {
    statusMsg.textContent = "Menyiapkan…";
    btnBatch.disabled = true;
    try {
      const zip = new JSZip();
      const folder = zip.folder(`qr-herbarium-${orient}`);
      for (let i = 0; i < plants.length; i++) {
        const p = plants[i];
        statusMsg.textContent = `Memproses ${i + 1}/${plants.length}: ${p.nama}`;
        const qr = await qrDataUrl(plantUrl(p));

        const holder = document.createElement("div");
        holder.className = "offscreen-poster";
        holder.innerHTML = posterHTML(p, qr, orient);
        document.body.appendChild(holder);
        await Utils.preload(CONFIG.LOGOS || []);

        const canvas = await posterToCanvas(holder.querySelector(".poster"));
        const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
        folder.file(`QR-${p.id}-${orient}.png`, blob);
        holder.remove();
      }
      statusMsg.textContent = "Mengemas ZIP…";
      const zipBlob = await zip.generateAsync({ type: "blob" });
      Utils.downloadBlob(zipBlob, `QR-Herbarium-Semua-${orient}.zip`);
      statusMsg.textContent = `✅ ${plants.length} poster QR (${orient}) berhasil diunduh sebagai ZIP.`;
    } catch (e) {
      statusMsg.textContent = "❌ Gagal batch: " + e.message;
    } finally {
      btnBatch.disabled = false;
    }
  }

  /* ---------- Init ---------- */
  btnDownload.addEventListener("click", downloadCurrent);
  btnPrint.addEventListener("click", () => window.print());
  btnBatch.addEventListener("click", downloadBatch);

  select.addEventListener("change", () => {
    const p = plants.find((x) => x.id === select.value);
    if (p) render(p);
  });

  orientSelect.addEventListener("change", () => {
    orient = orientSelect.value;
    storeOrient(orient);
    if (current) render(current);
  });
  orientSelect.value = orient;

  try {
    plants = await DataStore.loadPlants();
  } catch (err) {
    statusMsg.textContent = "❌ " + err.message;
    return;
  }

  select.innerHTML = plants
    .map((p) => `<option value="${Utils.esc(p.id)}">${Utils.esc(p.nama)} (${Utils.esc(p.id)})</option>`)
    .join("");

  const params = new URLSearchParams(location.search);
  const wantId = params.get("id");
  const initial = plants.find((p) => p.id.toLowerCase() === String(wantId).toLowerCase()) || plants[0];
  select.value = initial.id;
  await render(initial);
})();