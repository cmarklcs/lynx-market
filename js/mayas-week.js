/* Variant B: one mixed log. Rows appear in the fixed order from products.json — no meals, no claims, no totals. */
(async function () {
  const { esc, loadData } = Lynx;
  const data = await loadData();
  const log = data.mayasWeek;
  Lynx.enableLabelPopups(data);
  document.getElementById("maya-title").textContent = log.title;
  document.getElementById("maya-intro").textContent = log.intro || "";

  document.getElementById("maya").innerHTML = `
    <section class="log-card log-card--maya" aria-label="${esc(log.title)} food log">
      <table class="log">
        <caption class="visually-hidden">${esc(log.title)}: everything Maya ate</caption>
        <thead><tr><th scope="col">#</th><th scope="col">Product</th><th scope="col">Amount eaten</th></tr></thead>
        <tbody>
          ${log.rows.map((r, i) => {
            const p = data.byId[r.productId];
            return `<tr>
              <td class="num">${i + 1}</td>
              <td>${p ? `<a href="index.html#${esc(p.id)}" data-product="${esc(p.id)}">${esc(p.name)}</a>` : esc(r.productId)}</td>
              <td class="amount">${esc(r.amountEaten)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </section>`;
})();
