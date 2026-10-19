/* Lynx Market — shared helpers: data loading, package fronts, Nutrition Facts labels, cart storage. */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => "$" + Number(n).toFixed(2);

  async function loadData() {
    try {
      const res = await fetch("data/products.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      data.byId = Object.fromEntries(data.products.map(p => [p.id, p]));
      applySettings(data);
      return data;
    } catch (err) {
      const main = document.querySelector("main");
      if (main) main.innerHTML = `<div class="notice notice--error" role="alert">
        <h2>The store shelves are empty!</h2>
        <p>We couldn't load <code>data/products.json</code>. If you opened this file directly from your computer,
        run it with a small web server instead (see the README). If you just edited the data file,
        check it for a missing or extra comma.</p></div>`;
      throw err;
    }
  }

  function applySettings(data) {
    const show = (data.settings && data.settings.showInNav) || {};
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (show[a.dataset.nav] === false) a.closest("li").hidden = true;
    });
    data.cartEnabled = show.cart !== false;
    const pill = document.getElementById("cart-pill");
    if (pill && !data.cartEnabled) pill.hidden = true;
    updateCartPill(data);
  }

  /* ---------- Package front ---------- */
  const PACK_NAMES = { box: "box", wideBox: "box", bag: "bag", pouch: "pouch", breadBag: "bag", cup: "cup", tub: "tub",
    pint: "pint container", bottle: "bottle", carton: "carton", canister: "canister", can: "can", jar: "jar",
    wrapper: "wrapper", tray: "deli tray", bowl: "deli bowl", clamshell: "clear container", produceBag: "bag", loose: "" };

  // "NET WT 12.7 OZ (360g)" worked out from serving size × servings per container.
  function netContents(p) {
    const n = parseFloat(String(p.servingsPerContainer).replace(/[^0-9.]/g, "")) || 1;
    const s = p.servingSize || "";
    const floz = s.match(/([\d.]+)\s*fl oz/i), ml = s.match(/([\d.]+)\s*mL\)/i), gr = s.match(/([\d.]+)g\)/);
    const r1 = v => String(Math.round(v * 10) / 10);
    if (floz) { const t = +floz[1] * n; return `${r1(t)} FL OZ (${Math.round(t * 29.57)}mL)`; }
    if (ml) { const t = +ml[1] * n; return `${r1(t / 29.57)} FL OZ (${Math.round(t)}mL)`; }
    if (gr) { const t = +gr[1] * n; return `NET WT ${r1(t / 28.35)} OZ (${Math.round(t)}g)`; }
    return "";
  }

  function packageFront(p) {
    const a = p.art || {};
    const style = a.style || "store";
    const key = LynxArt.PACKS[a.pack] ? a.pack : "box";
    const pack = LynxArt.PACKS[key];
    const vars = `--pk-bg:${a.bg || "#fbf6ea"};--pk-bg2:${a.bg2 || "#ddd"};--pk-ink:${a.ink || "#222"};--pk-accent:${a.accent || "#c8432b"}`;
    const lynx = (style === "store" || style === "fresh" || style === "deli") ? `<img class="pkg-lynx" src="img/lynx.svg" alt="">` : "";
    const brand = `<div class="pkg-brand">${lynx}<span>${esc(p.brand)}</span></div>`;
    const name = `<div class="pkg-name">${esc(p.frontName || p.name)}</div>`;
    const claim = p.claim ? `<div class="pkg-claim"><span>${esc(p.claim)}</span></div>` : "";
    const note = a.note ? `<div class="pkg-note">${esc(a.note)}</div>` : "";
    const net = key === "loose" ? "" : netContents(p);
    const netEl = net ? `<div class="pkg-net">${esc(net)}</div>` : "";
    const seal = a.seal ? `<div class="pkg-seal" aria-hidden="true"><span>${esc(a.seal)}</span></div>` : "";
    const over = typeof pack.over === "function" ? pack.over(p) : pack.over;
    const what = PACK_NAMES[key] ? `${p.brand} ${PACK_NAMES[key]}` : p.name;
    const alt = `${what}. Picture: ${LynxArt.iconAlt(a.icon)}.`;
    const svg = (cls, body, label) => `<svg class="${cls}" viewBox="0 0 ${pack.w} ${pack.h}" preserveAspectRatio="none"
      ${label ? `role="img" aria-label="${esc(label)}"` : `aria-hidden="true"`} focusable="false">${body}</svg>`;

    let text;
    if (pack.mode === "sticker") {
      text = `<div class="pk-sticker">${brand}${name}${claim}${netEl}</div>`;
    } else {
      const [t, r, b, l] = pack.face;
      const img = pack.mode === "full" ? `<div class="pkg-art">${LynxArt.iconSVG(a.icon)}</div>` : "";
      text = `<div class="pk-face" style="top:${t}%;right:${r}%;bottom:${b}%;left:${l}%">
        ${seal}${brand}${name}${pack.row ? `<div class="pk-col">${claim}</div>` : ""}${img}${pack.row ? "" : claim}${note}${netEl}</div>`;
    }
    return `<div class="pkg">
      <div class="pk pk--${key} st--${esc(style)}" style="${vars};--ar:${pack.w}/${pack.h}">
        ${svg("pk-shape", pack.under(p), alt)}
        ${text}
        ${over ? svg("pk-over", over) : ""}
      </div>
    </div>`;
  }

  /* ---------- Nutrition Facts label (standard US layout) ---------- */
  const DV = { fat: 78, sat: 20, chol: 300, sodium: 2300, carb: 275, fiber: 28, added: 50 };
  const pct = (v, dv) => Math.round((v / dv) * 100) + "%";
  const g = v => (Number.isInteger(v) ? v : v.toFixed(1).replace(/\.0$/, "")) + "g";

  function nutritionLabel(p) {
    const spc = String(p.servingsPerContainer);
    const servingsLine = spc === "1" ? "1 serving per container" : `${esc(spc)} servings per container`;
    const contains = (p.contains || []).length ? `<p class="nf-contains"><b>Contains:</b> ${esc(p.contains.join(", "))}</p>` : "";
    return `<section class="nf" aria-label="Nutrition Facts for ${esc(p.name)}">
      <h4 class="nf-title">Nutrition Facts</h4>
      <p class="nf-servings">${servingsLine}</p>
      <p class="nf-size"><b>Serving size</b><b>${esc(p.servingSize)}</b></p>
      <div class="nf-bar nf-bar--thick"></div>
      <p class="nf-amt">Amount per serving</p>
      <p class="nf-cal"><b>Calories</b><b>${p.calories}</b></p>
      <div class="nf-bar nf-bar--med"></div>
      <p class="nf-dvhead"><b>% Daily Value*</b></p>
      <dl class="nf-rows">
        <div class="nf-row"><dt><b>Total Fat</b> ${g(p.totalFatG)}</dt><dd><b>${pct(p.totalFatG, DV.fat)}</b></dd></div>
        <div class="nf-row nf-i1"><dt>Saturated Fat ${g(p.satFatG)}</dt><dd><b>${pct(p.satFatG, DV.sat)}</b></dd></div>
        <div class="nf-row nf-i1"><dt><i>Trans</i> Fat ${g(p.transFatG)}</dt><dd></dd></div>
        <div class="nf-row"><dt><b>Cholesterol</b> ${p.cholesterolMg}mg</dt><dd><b>${pct(p.cholesterolMg, DV.chol)}</b></dd></div>
        <div class="nf-row"><dt><b>Sodium</b> ${p.sodiumMg}mg</dt><dd><b>${pct(p.sodiumMg, DV.sodium)}</b></dd></div>
        <div class="nf-row"><dt><b>Total Carbohydrate</b> ${g(p.carbsG)}</dt><dd><b>${pct(p.carbsG, DV.carb)}</b></dd></div>
        <div class="nf-row nf-i1"><dt>Dietary Fiber ${g(p.fiberG)}</dt><dd><b>${pct(p.fiberG, DV.fiber)}</b></dd></div>
        <div class="nf-row nf-i1"><dt>Total Sugars ${g(p.totalSugarsG)}</dt><dd></dd></div>
        <div class="nf-row nf-i2"><dt>Includes ${g(p.addedSugarsG)} Added Sugars</dt><dd><b>${pct(p.addedSugarsG, DV.added)}</b></dd></div>
        <div class="nf-row nf-protein"><dt><b>Protein</b> ${g(p.proteinG)}</dt><dd></dd></div>
      </dl>
      <div class="nf-bar nf-bar--thick"></div>
      <p class="nf-foot">* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</p>
      ${contains}
    </section>`;
  }

  /* ---------- Cart (kept only in this browser tab; nothing is sent anywhere) ---------- */
  const CART_KEY = "lynx-market-cart";
  const Cart = {
    load() {
      try { return JSON.parse(sessionStorage.getItem(CART_KEY)) || { persona: null, carts: {} }; }
      catch { return { persona: null, carts: {} }; }
    },
    save(state) {
      try { sessionStorage.setItem(CART_KEY, JSON.stringify(state)); } catch { /* storage blocked: cart lasts until page closes */ }
    },
    items(state) { return state.persona ? (state.carts[state.persona] || {}) : {}; },
    change(state, productId, delta) {
      if (!state.persona) return false;
      const cart = state.carts[state.persona] = state.carts[state.persona] || {};
      const next = (cart[productId] || 0) + delta;
      if (next <= 0) delete cart[productId]; else cart[productId] = next;
      Cart.save(state);
      return true;
    }
  };

  function updateCartPill(data) {
    const pill = document.getElementById("cart-pill");
    if (!pill) return;
    const state = Cart.load();
    const persona = data.personas.find(x => x.id === state.persona);
    const count = Object.values(Cart.items(state)).reduce((a, b) => a + b, 0);
    pill.textContent = persona ? `Shopping for ${persona.name} · ${count} in cart` : "Pick a shopper";
  }

  function toast(msg) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.innerHTML = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 3500);
  }

  /* ---------- Label popup (used on pages other than the store) ----------
     Any link with data-product="<id>" opens that product's package and label in a popup
     instead of leaving the page. The link still points to the store, so Ctrl/Cmd-click
     or "open in new tab" works too. */
  function enableLabelPopups(data) {
    const dlg = document.createElement("dialog");
    dlg.className = "label-dialog";
    dlg.setAttribute("aria-labelledby", "label-dialog-title");
    document.body.appendChild(dlg);
    let opener = null;

    function open(p) {
      dlg.innerHTML = `<div class="ld-inner">
        <div class="ld-head">
          <h2 id="label-dialog-title">${esc(p.name)}</h2>
          <button type="button" class="btn ld-close" aria-label="Close">✕ Close</button>
        </div>
        <div class="ld-body">
          <div class="ld-label">${nutritionLabel(p)}</div>
          <div class="ld-front">${packageFront(p)}</div>
        </div>
        <p class="ld-foot">${money(p.price)} per serving · ${esc(p.aisle)} aisle</p></div>`;
      dlg.showModal();
      dlg.querySelector(".ld-close").focus();
    }

    document.addEventListener("click", e => {
      const link = e.target.closest("a[data-product]");
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      const p = data.byId[link.dataset.product];
      if (!p || typeof dlg.showModal !== "function") return; // old browser: follow the link
      e.preventDefault();
      opener = link;
      open(p);
    });
    dlg.addEventListener("click", e => {
      // Close on the ✕ button or a click on the dark backdrop around the box.
      if (e.target.closest(".ld-close") || e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", () => { if (opener) opener.focus(); });
  }

  window.Lynx = { esc, money, loadData, packageFront, nutritionLabel, Cart, updateCartPill, toast, enableLabelPopups };
})();
