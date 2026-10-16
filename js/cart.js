/* Variant C: shopping cart for a persona. Shows names, servings and price only — never nutrition totals. */
(async function () {
  const { esc, money, loadData, Cart, updateCartPill, toast } = Lynx;
  const data = await loadData();
  let state = Cart.load();
  Lynx.enableLabelPopups(data);

  const personasEl = document.getElementById("personas");
  const listEl = document.getElementById("shop-list");
  const panelEl = document.getElementById("cart-panel");
  const sheetEl = document.getElementById("cart-sheet");
  const persona = () => data.personas.find(x => x.id === state.persona);

  function renderPersonas() {
    personasEl.innerHTML = data.personas.map(per => `
      <button type="button" class="persona" style="--pc:${esc(per.color)}" aria-pressed="${state.persona === per.id}" data-id="${esc(per.id)}">
        <span class="persona-head">
          <span class="avatar" aria-hidden="true">${esc(per.name[0])}</span>
          <span><span class="persona-name">${esc(per.name)}</span><br><span class="persona-age">Age ${esc(per.age)}</span></span>
        </span>
        <ul>${per.details.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
        <span class="budget">Daily budget: ${money(per.dailyBudget)}</span>
        <span class="chosen">✓ Shopping for ${esc(per.name)}</span>
      </button>`).join("");
  }

  function renderList() {
    listEl.innerHTML = data.aisles.map(a => {
      const items = data.products.filter(p => p.aisle === a);
      return `<h2>${esc(a)}</h2>` + items.map(p => `
        <div class="shop-row">
          <span class="nm">${esc(p.name)} <a href="index.html#${esc(p.id)}" data-product="${esc(p.id)}" aria-label="See the label for ${esc(p.name)}">label</a></span>
          <span class="pr">${money(p.price)}<span class="visually-hidden"> per serving</span></span>
          <button type="button" class="btn btn-sm btn--primary" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)}">+ Add</button>
        </div>`).join("");
    }).join("");
  }

  function renderCart() {
    const per = persona();
    if (!per) {
      panelEl.innerHTML = `<h2>Cart</h2><p class="cart-empty">Pick a shopper above to start their cart.</p>`;
      sheetEl.innerHTML = "";
      return;
    }
    const items = Object.entries(Cart.items(state)).filter(([id]) => data.byId[id]);
    const spent = items.reduce((sum, [id, q]) => sum + data.byId[id].price * q, 0);
    const left = per.dailyBudget - spent;
    const over = left < -0.004;
    const pctUsed = Math.min(100, (spent / per.dailyBudget) * 100);

    panelEl.innerHTML = `
      <h2>${esc(per.name)}'s cart</h2>
      ${items.length ? `<ul class="cart-items">${items.map(([id, q]) => {
        const p = data.byId[id];
        return `<li>
          <span>${esc(p.name)}</span>
          <span class="line-price">${money(p.price * q)}</span>
          <span class="qty">
            <button type="button" class="qbtn" data-dec="${esc(id)}" aria-label="Remove one serving of ${esc(p.name)}">−</button>
            <output aria-label="Servings of ${esc(p.name)}">${q}</output>
            <button type="button" class="qbtn" data-inc="${esc(id)}" aria-label="Add one serving of ${esc(p.name)}">+</button>
            <span>serving${q === 1 ? "" : "s"}</span>
          </span>
        </li>`;
      }).join("")}</ul>` : `<p class="cart-empty">The cart is empty. Add foods from the list.</p>`}
      <div class="budget-box">
        <div class="budget-line"><span>Spent</span><span>${money(spent)} of ${money(per.dailyBudget)}</span></div>
        <div class="meter ${over ? "over" : ""}" role="progressbar" aria-label="Budget used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pctUsed)}"><span style="width:${pctUsed}%"></span></div>
        <p class="budget-status ${over ? "over" : ""}" aria-live="polite">${over ? `Over budget by ${money(-left)}` : `${money(left)} left to spend`}</p>
      </div>
      <div class="cart-buttons">
        <button type="button" class="btn btn--primary" id="print-cart" ${items.length ? "" : "disabled"}>Print my cart</button>
        <button type="button" class="btn" id="empty-cart" ${items.length ? "" : "disabled"}>Empty cart</button>
      </div>`;

    sheetEl.innerHTML = `
      <h1>My Lynx Market Cart</h1>
      <div class="who"><span>Name: ______________________</span><span>Shopper: <b>${esc(per.name)}</b>, age ${esc(per.age)}</span><span>Budget: ${money(per.dailyBudget)}</span></div>
      <p>${per.details.map(esc).join(" · ")}</p>
      <table>
        <thead><tr>
          <th>Item</th><th>Servings</th><th>Price</th>
          <th>Calories</th><th>Added sugars (g)</th><th>Sat. fat (g)</th><th>Sodium (mg)</th><th>Fiber (g)</th><th>Protein (g)</th>
        </tr></thead>
        <tbody>${items.map(([id, q]) => `<tr><td>${esc(data.byId[id].name)}</td><td>${q}</td><td>${money(data.byId[id].price * q)}</td>${'<td class="blank"></td>'.repeat(6)}</tr>`).join("")}</tbody>
        <tfoot><tr><td>Totals</td><td></td><td>${money(spent)}</td>${'<td class="blank"></td>'.repeat(6)}</tr></tfoot>
      </table>`;
  }

  function renderAll() {
    renderPersonas();
    renderCart();
    updateCartPill(data);
  }

  personasEl.addEventListener("click", e => {
    const btn = e.target.closest(".persona");
    if (!btn) return;
    state.persona = btn.dataset.id;
    Cart.save(state);
    renderAll();
    personasEl.querySelector(`[data-id="${btn.dataset.id}"]`).focus();
  });

  listEl.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (!add) return;
    if (!Cart.change(state, add.dataset.add, 1)) {
      toast("Pick a shopper first (the cards at the top).");
      personasEl.querySelector(".persona").focus();
      return;
    }
    toast(`Added 1 serving of ${esc(data.byId[add.dataset.add].name)}.`);
    renderCart();
    updateCartPill(data);
  });

  panelEl.addEventListener("click", e => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc || dec) {
      const id = (inc || dec).dataset.inc || (inc || dec).dataset.dec;
      Cart.change(state, id, inc ? 1 : -1);
      renderCart();
      updateCartPill(data);
      const again = panelEl.querySelector(inc ? `[data-inc="${id}"]` : `[data-dec="${id}"]`);
      (again || panelEl.querySelector("h2")).focus?.();
    } else if (e.target.id === "print-cart") {
      window.print();
    } else if (e.target.id === "empty-cart") {
      if (confirm(`Empty ${persona().name}'s cart?`)) {
        state.carts[state.persona] = {};
        Cart.save(state);
        renderCart();
        updateCartPill(data);
      }
    }
  });

  // Keep in step if another tab (e.g. the store) changes the cart.
  window.addEventListener("focus", () => { state = Cart.load(); renderAll(); });

  renderList();
  renderAll();
})();
