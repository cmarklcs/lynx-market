/* Store aisles: product grid with flip-to-label cards. */
(async function () {
  const { esc, money, loadData, packageFront, nutritionLabel } = Lynx;
  const data = await loadData();
  const root = document.getElementById("store");
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const card = p => `
    <article class="product" id="p-${esc(p.id)}" data-search="${esc([p.name, p.brand, p.claim, p.aisle].join(" ").toLowerCase())}">
      <div class="flip" data-id="${esc(p.id)}">
        <div class="flip-inner">
          <div class="face face--front">${packageFront(p)}</div>
          <div class="face face--back" aria-hidden="true" inert>${nutritionLabel(p)}</div>
        </div>
      </div>
      <div class="shelf-tag">
        <span class="pname">${esc(p.name)}</span>
        <span><span class="price">${money(p.price)}</span><span class="per">per serving</span></span>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn--primary flip-btn" aria-pressed="false" data-id="${esc(p.id)}">Flip to label</button>
      </div>
    </article>`;

  root.innerHTML = `
    <div class="toolbar">
      <div class="search">
        <label for="q">Search the store</label>
        <input id="q" type="search" placeholder="Try “yogurt” or “bar”" autocomplete="off">
      </div>
      <button type="button" class="btn" id="flip-all" aria-pressed="false">Flip all to labels</button>
    </div>
    <nav class="aisle-jump" aria-label="Jump to an aisle">
      ${data.aisles.map(a => `<a href="#aisle-${slug(a)}">${esc(a)}</a>`).join("")}
    </nav>
    <p id="search-status" class="visually-hidden" aria-live="polite"></p>
    ${data.aisles.map((a, i) => {
      const items = data.products.filter(p => p.aisle === a);
      return `<section class="aisle" id="aisle-${slug(a)}" aria-labelledby="h-${slug(a)}">
        <h2 class="aisle-sign" id="h-${slug(a)}"><span class="aisle-num">Aisle ${i + 1}</span> ${esc(a)}</h2>
        <div class="grid">${items.map(card).join("")}</div>
      </section>`;
    }).join("")}`;

  function setFlipped(id, flipped) {
    const art = document.getElementById("p-" + id);
    if (!art) return;
    const flip = art.querySelector(".flip");
    const [front, back] = art.querySelectorAll(".face");
    flip.classList.toggle("is-flipped", flipped);
    front.toggleAttribute("inert", flipped);
    front.setAttribute("aria-hidden", String(flipped));
    back.toggleAttribute("inert", !flipped);
    back.setAttribute("aria-hidden", String(!flipped));
    const btn = art.querySelector(".flip-btn");
    btn.setAttribute("aria-pressed", String(flipped));
    btn.textContent = flipped ? "Flip to front" : "Flip to label";
  }
  const isFlipped = id => document.querySelector(`#p-${CSS.escape(id)} .flip`).classList.contains("is-flipped");

  root.addEventListener("click", e => {
    const flipArea = e.target.closest(".flip");
    const flipBtn = e.target.closest(".flip-btn");
    if (flipArea || flipBtn) {
      const id = (flipArea || flipBtn).dataset.id;
      setFlipped(id, !isFlipped(id));
    }
  });

  const flipAll = document.getElementById("flip-all");
  flipAll.addEventListener("click", () => {
    const on = flipAll.getAttribute("aria-pressed") !== "true";
    data.products.forEach(p => setFlipped(p.id, on));
    flipAll.setAttribute("aria-pressed", String(on));
    flipAll.textContent = on ? "Flip all to fronts" : "Flip all to labels";
  });

  const q = document.getElementById("q");
  const status = document.getElementById("search-status");
  q.addEventListener("input", () => {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll(".product").forEach(el => {
      const match = !term || el.dataset.search.includes(term);
      el.hidden = !match;
      if (match) shown++;
    });
    document.querySelectorAll(".aisle").forEach(sec => {
      sec.hidden = !sec.querySelector(".product:not([hidden])");
    });
    status.textContent = term ? `${shown} product${shown === 1 ? "" : "s"} found` : "";
  });

  // Links like index.html#granola (from the meal logs) open that product's label.
  function openFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id || !data.byId[id]) return;
    const art = document.getElementById("p-" + id);
    setFlipped(id, true);
    art.classList.remove("highlight");
    void art.offsetWidth;
    art.classList.add("highlight");
    art.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    art.querySelector(".flip-btn").focus({ preventScroll: true });
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
