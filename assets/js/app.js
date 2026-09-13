/* =====================================================
   APP — logika halaman utama (daftar, pencarian, filter)
   ===================================================== */
(async function () {
  const grid = Utils.qs("#plantGrid");
  const loading = Utils.qs("#loadingState");
  const errorState = Utils.qs("#errorState");
  const errorMsg = Utils.qs("#errorMessage");
  const emptyState = Utils.qs("#emptyState");
  const searchInput = Utils.qs("#searchInput");
  const chipsWrap = Utils.qs("#categoryChips");

  Utils.qs("#siteTitle").textContent = CONFIG.SITE_TITLE;
  Utils.qs("#heroTitle").textContent = CONFIG.SITE_TITLE;
  Utils.qs("#heroTagline").textContent = CONFIG.SITE_TAGLINE;
  document.title = CONFIG.SITE_TITLE;

  let plants = [];
  let activeCategory = "semua";
  let query = "";

  function matches(p) {
    const inCat = activeCategory === "semua" || p.kategori === activeCategory;
    if (!inCat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return [p.nama, p.nama_latin, p.kategori, p.famili, p.deskripsi]
      .join(" ")
      .toLowerCase()
      .includes(q);
  }

  function cardHTML(p) {
    return `
      <article class="card">
        <a href="tanaman.html?id=${encodeURIComponent(p.id)}" class="card-link">
          <div class="card-media">
            <img src="${Utils.esc(p.foto)}" alt="Foto ${Utils.esc(p.nama)}" loading="lazy"
                 onerror="this.onerror=null;this.src='${Utils.PLACEHOLDER}';" />
            ${p.kategori ? `<span class="badge">${Utils.esc(p.kategori)}</span>` : ""}
          </div>
          <div class="card-body">
            <h3 class="card-title">${Utils.esc(p.nama)}</h3>
            <p class="card-latin">${Utils.esc(p.nama_latin)}</p>
            <span class="card-cta">Lihat detail →</span>
          </div>
        </a>
      </article>`;
  }

  function renderChips(cats) {
    const items = ["semua", ...cats];
    chipsWrap.innerHTML = items
      .map(
        (c) =>
          `<button class="chip ${c === activeCategory ? "chip-active" : ""}" data-cat="${Utils.esc(c)}">
             ${c === "semua" ? "Semua" : Utils.esc(c)}
           </button>`
      )
      .join("");
    chipsWrap.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        renderChips(cats);
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const list = plants.filter(matches);
    emptyState.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    grid.innerHTML = list.map(cardHTML).join("");
  }

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim();
    renderGrid();
  });

  try {
    plants = await DataStore.loadPlants();
    renderChips(DataStore.categories(plants));
    renderGrid();
  } catch (err) {
    loading.hidden = true;
    errorState.hidden = false;
    errorMsg.textContent = err.message;
    return;
  }
  loading.hidden = true;
})();