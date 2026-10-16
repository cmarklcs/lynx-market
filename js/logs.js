/* Meal logs: what was eaten and how much. No totals on purpose — students do the scaling. */
(async function () {
  const { esc, loadData } = Lynx;
  const data = await loadData();
  const root = document.getElementById("logs");
  Lynx.enableLabelPopups(data);

  root.innerHTML = Object.entries(data.logs).map(([key, log], i) => `
    <section class="log-card log-card--c${i % 2}" aria-labelledby="h-${esc(key)}">
      <header>
        <h2 id="h-${esc(key)}">${esc(log.title)}</h2>
        ${log.note ? `<p class="log-note">${esc(log.note)}</p>` : ""}
      </header>
      <table class="log">
        <caption class="visually-hidden">${esc(log.title)}</caption>
        <thead><tr><th scope="col">Meal</th><th scope="col">Product</th><th scope="col">Amount eaten</th></tr></thead>
        <tbody>
          ${log.rows.map(r => {
            const p = data.byId[r.productId];
            return `<tr>
              <th scope="row">${esc(r.meal)}</th>
              <td>${p ? `<a href="index.html#${esc(p.id)}" data-product="${esc(p.id)}">${esc(p.name)}</a>` : esc(r.productId)}</td>
              <td class="amount">${esc(r.amountEaten)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </section>`).join("");
})();
