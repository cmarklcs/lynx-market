/* Teacher page: every product as a fold-over card (front | label), 4 per printed page. */
(async function () {
  const { esc, money, loadData, packageFront, nutritionLabel } = Lynx;
  const data = await loadData();
  const ordered = data.aisles.flatMap(a => data.products.filter(p => p.aisle === a));

  const pages = [];
  for (let i = 0; i < ordered.length; i += 4) pages.push(ordered.slice(i, i + 4));

  document.getElementById("cards").innerHTML = pages.map(group => `
    <div class="label-page">
      ${group.map(p => `
        <div class="label-card">
          <div class="lc-front">${packageFront(p)}</div>
          <div class="lc-back">${nutritionLabel(p)}<p class="lc-price">${esc(p.aisle)} · ${money(p.price)} per serving</p></div>
        </div>`).join("")}
    </div>`).join("");
  document.getElementById("card-count").textContent = `${ordered.length} cards on ${pages.length} pages`;
  document.getElementById("print-btn").addEventListener("click", () => window.print());
})();
