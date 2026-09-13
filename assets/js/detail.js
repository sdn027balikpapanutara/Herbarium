/* =====================================================
   DETAIL — logika halaman detail tanaman (?id=...)
   ===================================================== */
(async function () {
  Utils.qs("#siteTitle").textContent = CONFIG.SITE_TITLE;

  const loading = Utils.qs("#loadingState");
  const errorState = Utils.qs("#errorState");
  const errorMsg = Utils.qs("#errorMessage");
  const card = Utils.qs("#detailCard");

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  function show(text) {
    loading.hidden = true;
    card.hidden = true;
    errorState.hidden = false;
    errorMsg.textContent = text;
  }

  if (!id) {
    show("Parameter ?id= tidak ada pada URL.\nContoh: tanaman.html?id=jahe-01");
    return;
  }

  let plant;
  try {
    plant = await DataStore.getById(id);
  } catch (err) {
    show(err.message);
    return;
  }

  if (!plant) {
    show(`Tanaman dengan id "${id}" tidak ditemukan di spreadsheet.\nPeriksa kembali penulisan kolom id (huruf besar/kecil dianggap sama).`);
    return;
  }

  document.title = `${plant.nama} — ${CONFIG.SITE_TITLE}`;

  Utils.qs("#detailFoto").src = plant.foto;
  Utils.qs("#detailFoto").alt = `Foto ${plant.nama}`;
  Utils.qs("#detailNama").textContent = plant.nama;
  Utils.qs("#detailLatin").textContent = plant.nama_latin;

  // Nama daerah / sinonim
  const namaDaerah = Utils.qs("#detailNamaDaerah");
  namaDaerah.hidden = !plant.nama_daerah;
  namaDaerah.textContent = plant.nama_daerah ? `Nama daerah: ${plant.nama_daerah}` : "";

  const bKat = Utils.qs("#badgeKategori");
  const bFam = Utils.qs("#badgeFamili");
  bKat.hidden = !plant.kategori; bKat.textContent = plant.kategori;
  bFam.hidden = !plant.famili;   bFam.textContent = plant.famili ? `Famili: ${plant.famili}` : "";

  // Deskripsi
  const descPar = Utils.paragraphs(plant.deskripsi);
  Utils.qs("#secDeskripsi").hidden = descPar.length === 0;
  Utils.qs("#deskripsiBody").innerHTML = descPar.map((p) => `<p>${Utils.esc(p)}</p>`).join("");

  // Manfaat
  const manList = Utils.splitList(plant.manfaat);
  Utils.qs("#secManfaat").hidden = manList.length === 0;
  Utils.qs("#manfaatList").innerHTML = manList.map((m) => `<li>${Utils.esc(m)}</li>`).join("");

  // Habitat, perawatan, perbanyakan
  Utils.qs("#secHabitat").hidden = !plant.habitat;
  Utils.qs("#habitatText").textContent = plant.habitat;
  Utils.qs("#secPerawatan").hidden = !plant.perawatan;
  Utils.qs("#perawatanText").textContent = plant.perawatan;
  Utils.qs("#secPerbanyakan").hidden = !plant.perkembangbiakan;
  Utils.qs("#perbanyakanText").textContent = plant.perkembangbiakan;

  // Keterangan tambahan
  const ketPar = Utils.paragraphs(plant.keterangan);
  Utils.qs("#secKeterangan").hidden = ketPar.length === 0;
  Utils.qs("#keteranganBody").innerHTML = ketPar.map((p) => `<p>${Utils.esc(p)}</p>`).join("");

  // Referensi (otomatis jadi link bila berupa URL)
  const ref = plant.referensi || "";
  Utils.qs("#secReferensi").hidden = !ref;
  Utils.qs("#referensiBody").innerHTML = /^https?:\/\//i.test(ref)
    ? `<a href="${Utils.esc(ref)}" target="_blank" rel="noopener noreferrer">${Utils.esc(ref)}</a>`
    : Utils.esc(ref);

  // Tombol QR
  Utils.qs("#qrLink").href = `qr.html?id=${encodeURIComponent(plant.id)}`;

  loading.hidden = true;
  card.hidden = false;
})();