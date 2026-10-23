/* Shopping cart project: pick two shoppers, plan a day of meals for each, finalize,
   explain the choices, and save it all as a PDF for Toddle.
   The cart shows food names, servings and prices only — never nutrition totals. */
(async function () {
  const { esc, money, loadData, Plan, updateCartPill, toast, enableLabelPopups } = Lynx;
  const data = await loadData();
  enableLabelPopups(data);

  const A = Object.assign({
    title: "Plan a Day of Meals", shoppersToPick: 2,
    meals: ["Breakfast", "Lunch", "Snack", "Dinner", "Dessert"], requiredMeals: ["Breakfast", "Lunch", "Dinner"],
    minWords: 25, questions: [], compareQuestion: null
  }, data.assignment || {});
  const NEED = A.shoppersToPick;
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  let state = Plan.load();
  const $ = id => document.getElementById(id);
  const persona = id => data.personas.find(x => x.id === id);
  const save = () => { Plan.save(state); updateCartPill(data); };
  const words = t => (String(t || "").trim().match(/\S+/g) || []).length;
  const fill = (t, per) => t.replace(/\{name\}/g, per.name).replace(/\{budget\}/g, money(per.dailyBudget));

  document.getElementById("assign-title").textContent = A.title;

  function planFor(id) {
    const p = state.plans[id] = state.plans[id] || { day: "", meals: {} };
    A.meals.forEach(m => { p.meals[m] = p.meals[m] || { away: false, items: {} }; });
    return p;
  }
  function spent(id) {
    const p = planFor(id);
    return A.meals.reduce((sum, m) => sum + Object.entries(p.meals[m].items)
      .reduce((s, [pid, q]) => s + (data.byId[pid] ? data.byId[pid].price * q : 0), 0), 0);
  }

  /* ---------- Step 1: name ---------- */
  const student = $("student"), section = $("section");
  student.value = state.student; section.value = state.section;
  student.addEventListener("input", () => { state.student = student.value; save(); renderFinalize(); renderPrint(); });
  section.addEventListener("input", () => { state.section = section.value; save(); renderPrint(); });

  /* ---------- Step 2: shoppers ---------- */
  function renderPersonas() {
    $("pick-status").textContent = state.finalized
      ? "Your carts are finalized. Unlock them in step 4 to change shoppers."
      : `Tap a card to pick or un-pick a shopper. ${state.picks.length} of ${NEED} picked.`;
    $("personas").innerHTML = data.personas.map(per => `
      <button type="button" class="persona" style="--pc:${esc(per.color)}" aria-pressed="${state.picks.includes(per.id)}" data-id="${esc(per.id)}" ${state.finalized ? "disabled" : ""}>
        <span class="persona-head">
          <span class="avatar" aria-hidden="true">${esc(per.name[0])}</span>
          <span><span class="persona-name">${esc(per.name)}</span><br><span class="persona-age">Age ${esc(per.age)}</span></span>
        </span>
        <ul>${per.details.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
        <span class="budget">Daily budget: ${money(per.dailyBudget)}</span>
        <span class="chosen">✓ Picked</span>
      </button>`).join("");
  }
  $("personas").addEventListener("click", e => {
    const btn = e.target.closest(".persona");
    if (!btn || state.finalized) return;
    const id = btn.dataset.id;
    if (state.picks.includes(id)) {
      state.picks = state.picks.filter(x => x !== id);
      if (state.active === id) state.active = state.picks[0] || null;
    } else if (state.picks.length >= NEED) {
      toast(`You already picked ${NEED}. Tap one of them to un-pick it first.`);
      return;
    } else {
      state.picks.push(id);
      state.active = id;
    }
    save(); renderAll();
    $("personas").querySelector(`[data-id="${id}"]`).focus();
  });

  /* ---------- Step 3: planner ---------- */
  let addMeal = A.meals[0];
  function renderPlanner() {
    const el = $("planner");
    if (!state.picks.length) { el.innerHTML = `<p class="step-help">Pick your shoppers in step 2 first.</p>`; return; }
    if (!state.picks.includes(state.active)) state.active = state.picks[0];
    const per = persona(state.active), plan = planFor(per.id), locked = state.finalized;
    const total = spent(per.id), left = per.dailyBudget - total, over = left < -0.004;
    const pctUsed = Math.min(100, (total / per.dailyBudget) * 100);

    const tabs = `<div class="kid-tabs" role="group" aria-label="Choose whose day to work on">${state.picks.map(id => {
      const p = persona(id);
      return `<button type="button" class="kid-tab" style="--pc:${esc(p.color)}" aria-pressed="${id === per.id}" data-kid="${esc(id)}">${esc(p.name)}'s day</button>`;
    }).join("")}</div>`;

    const meals = A.meals.map(m => {
      const meal = plan.meals[m];
      const items = Object.entries(meal.items).filter(([pid]) => data.byId[pid]);
      const req = A.requiredMeals.includes(m);
      return `<div class="meal-block">
        <div class="meal-head"><h4>${esc(m)}${req ? "" : ' <span class="opt">(optional)</span>'}</h4>
          <label class="away"><input type="checkbox" data-away="${esc(m)}" ${meal.away ? "checked" : ""} ${locked ? "disabled" : ""}> Eating away from home</label></div>
        ${meal.away ? `<p class="meal-empty">Eating away from home (school lunch, restaurant…)</p>`
          : items.length ? `<ul class="cart-items">${items.map(([pid, q]) => {
            const p = data.byId[pid];
            return `<li><span><a href="index.html#${esc(pid)}" data-product="${esc(pid)}">${esc(p.name)}</a></span>
              <span class="line-price">${money(p.price * q)}</span>
              <span class="qty">${locked ? "" : `<button type="button" class="qbtn" data-dec="${esc(pid)}" data-meal="${esc(m)}" aria-label="Remove one serving of ${esc(p.name)} from ${esc(m)}">−</button>`}
                <output aria-label="Servings of ${esc(p.name)} at ${esc(m)}">${q}</output>
                ${locked ? "" : `<button type="button" class="qbtn" data-inc="${esc(pid)}" data-meal="${esc(m)}" aria-label="Add one serving of ${esc(p.name)} to ${esc(m)}">+</button>`}
                <span>serving${q === 1 ? "" : "s"}</span></span></li>`;
          }).join("")}</ul>` : `<p class="meal-empty">${locked ? "Nothing planned." : "Nothing yet. Add foods from the list."}</p>`}
      </div>`;
    }).join("");

    const shop = locked ? "" : `<section class="shop-list" aria-label="Foods you can add">
      <div class="add-to"><label>Add foods to <b>${esc(per.name)}'s</b>
        <select id="add-meal">${A.meals.map(m => `<option ${m === addMeal ? "selected" : ""}>${esc(m)}</option>`).join("")}</select></label></div>
      ${data.aisles.map(a => `<h3>${esc(a)}</h3>` + data.products.filter(p => p.aisle === a).map(p => `
        <div class="shop-row">
          <span class="nm">${esc(p.name)} <a href="index.html#${esc(p.id)}" data-product="${esc(p.id)}" aria-label="See the label for ${esc(p.name)}">label</a></span>
          <span class="pr">${money(p.price)}<span class="visually-hidden"> per serving</span></span>
          <button type="button" class="btn btn-sm btn--primary" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)}">+ Add</button>
        </div>`).join("")).join("")}
    </section>`;

    el.innerHTML = `${tabs}
      <div class="shop-layout ${locked ? "locked" : ""}">
        ${shop}
        <aside class="cart-panel" aria-label="${esc(per.name)}'s cart">
          <h3>${esc(per.name)}'s cart</h3>
          <p class="kid-needs">${per.details.map(esc).join(" · ")}</p>
          <label class="day-pick">Which day is this?
            <select id="day" ${locked ? "disabled" : ""}><option value="">Choose a day</option>${DAYS.map(d => `<option ${plan.day === d ? "selected" : ""}>${d}</option>`).join("")}</select></label>
          ${meals}
          <div class="budget-box">
            <div class="budget-line"><span>Spent</span><span>${money(total)} of ${money(per.dailyBudget)}</span></div>
            <div class="meter ${over ? "over" : ""}" role="progressbar" aria-label="Budget used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pctUsed)}"><span style="width:${pctUsed}%"></span></div>
            <p class="budget-status ${over ? "over" : ""}" aria-live="polite">${over ? `Over budget by ${money(-left)}` : `${money(left)} left to spend`}</p>
          </div>
        </aside>
      </div>`;
  }
  $("planner").addEventListener("change", e => {
    if (e.target.id === "add-meal") addMeal = e.target.value;
    else if (e.target.id === "day") { planFor(state.active).day = e.target.value; save(); renderAfterEdit(); }
    else if (e.target.dataset.away) {
      planFor(state.active).meals[e.target.dataset.away].away = e.target.checked;
      save(); renderPlanner(); renderFinalize(); renderPrint();
      $("planner").querySelector(`[data-away="${e.target.dataset.away}"]`).focus();
    }
  });
  $("planner").addEventListener("click", e => {
    const tab = e.target.closest("[data-kid]");
    if (tab) { state.active = tab.dataset.kid; save(); renderPlanner(); $("planner").querySelector(`[data-kid="${tab.dataset.kid}"]`).focus(); return; }
    const add = e.target.closest("[data-add]"), inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (!(add || inc || dec) || state.finalized) return;
    const plan = planFor(state.active);
    const meal = add ? addMeal : (inc || dec).dataset.meal;
    const pid = add ? add.dataset.add : (inc || dec).dataset.inc || (inc || dec).dataset.dec;
    const m = plan.meals[meal];
    if (add && m.away) { toast(`${meal} is marked "eating away from home." Un-check that to add food.`); return; }
    const next = (m.items[pid] || 0) + (dec ? -1 : 1);
    if (next <= 0) delete m.items[pid]; else m.items[pid] = next;
    save();
    if (add) toast(`Added 1 serving of ${esc(data.byId[pid].name)} to ${esc(persona(state.active).name)}'s ${esc(meal.toLowerCase())}.`);
    const scroll = window.scrollY;
    renderAfterEdit();
    window.scrollTo(0, scroll);
    if (inc || dec) {
      const again = $("planner").querySelector(`[data-${inc ? "inc" : "dec"}="${pid}"][data-meal="${meal}"]`);
      (again || $("planner").querySelector(".cart-panel h3")).focus?.();
    } else {
      const btn = $("planner").querySelector(`[data-add="${pid}"]`);
      if (btn) btn.focus({ preventScroll: true });
    }
  });

  /* ---------- Step 4: finalize ---------- */
  function problems() {
    const out = [];
    if (!state.student.trim()) out.push("Type your name in step 1.");
    if (state.picks.length !== NEED) out.push(`Pick ${NEED} shoppers in step 2 (you have ${state.picks.length}).`);
    state.picks.forEach(id => {
      const per = persona(id), plan = planFor(id);
      if (!plan.day) out.push(`Choose which day of the week ${per.name}'s plan is for.`);
      A.requiredMeals.forEach(m => {
        const meal = plan.meals[m];
        if (!meal.away && !Object.keys(meal.items).length) out.push(`Add food to ${per.name}'s ${m.toLowerCase()} (or mark it "eating away from home").`);
      });
      const over = spent(id) - per.dailyBudget;
      if (over > 0.004) out.push(`${per.name}'s cart is ${money(over)} over budget.`);
    });
    return out;
  }
  function renderFinalize() {
    const el = $("finalize");
    if (state.finalized) {
      el.innerHTML = `<p class="done-msg">✓ Your carts are finalized.</p>
        <button type="button" class="btn" id="unlock">Unlock my carts to make changes</button>`;
      return;
    }
    const list = problems();
    el.innerHTML = `${list.length ? `<p class="step-help">Before you can finalize:</p><ul class="todo">${list.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`
      : `<p class="step-help">Everything is ready. Once you finalize, your carts lock so you can write about them.</p>`}
      <button type="button" class="btn btn--primary" id="finalize-btn" ${list.length ? "disabled" : ""}>Finalize my carts</button>`;
  }
  $("finalize").addEventListener("click", e => {
    if (e.target.id === "finalize-btn" && !problems().length) {
      state.finalized = true; save(); renderAll();
      $("s5").scrollIntoView({ behavior: "smooth", block: "start" });
      const first = $("justify").querySelector("textarea");
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 400);
    } else if (e.target.id === "unlock") {
      state.finalized = false; save(); renderAll();
      $("s3").scrollIntoView({ block: "start" });
    }
  });

  /* ---------- Step 5: justification ---------- */
  const allQuestions = () => {
    const qs = [];
    state.picks.forEach(id => A.questions.forEach(q => qs.push({ key: `${id}.${q.id}`, per: persona(id), q })));
    if (A.compareQuestion && state.picks.length > 1) qs.push({ key: `compare.${A.compareQuestion.id}`, per: null, q: A.compareQuestion });
    return qs;
  };
  function renderJustify() {
    const el = $("justify");
    if (!state.finalized) { el.innerHTML = `<p class="step-help">Finalize your carts in step 4 to unlock the questions.</p>`; return; }
    const groups = state.picks.map(id => {
      const per = persona(id);
      return `<fieldset class="q-group"><legend>${esc(per.name)}'s day</legend>
        ${A.questions.map(q => qBox(`${id}.${q.id}`, q, per)).join("")}</fieldset>`;
    }).join("");
    const cmp = A.compareQuestion && state.picks.length > 1
      ? `<fieldset class="q-group"><legend>${esc(A.compareQuestion.title)}</legend>${qBox(`compare.${A.compareQuestion.id}`, A.compareQuestion, null)}</fieldset>` : "";
    el.innerHTML = `<p class="step-help">Write in complete sentences. Use evidence from the Nutrition Facts labels — click any food name to see its label again.</p>${groups}${cmp}`;
  }
  function qBox(key, q, per) {
    const id = "q-" + key.replace(/\W/g, "-");
    const val = state.answers[key] || "";
    const n = words(val);
    return `<div class="q-box">
      <label for="${id}"><b>${esc(q.title)}.</b> ${esc(per ? fill(q.prompt, per) : q.prompt)}</label>
      <textarea id="${id}" data-key="${esc(key)}" rows="5">${esc(val)}</textarea>
      <p class="wc ${n < A.minWords ? "short" : ""}" id="${id}-wc">${n} word${n === 1 ? "" : "s"}${n < A.minWords ? ` (aim for at least ${A.minWords})` : " ✓"}</p>
    </div>`;
  }
  $("justify").addEventListener("input", e => {
    const ta = e.target.closest("textarea[data-key]");
    if (!ta) return;
    state.answers[ta.dataset.key] = ta.value;
    save();
    const n = words(ta.value), wc = $(ta.id + "-wc");
    wc.textContent = `${n} word${n === 1 ? "" : "s"}${n < A.minWords ? ` (aim for at least ${A.minWords})` : " ✓"}`;
    wc.classList.toggle("short", n < A.minWords);
    renderSave(); renderPrint();
  });

  /* ---------- Step 6: save as PDF ---------- */
  function renderSave() {
    const el = $("save");
    if (!state.finalized) { el.innerHTML = `<p class="step-help">Finalize your carts and answer the questions first.</p>`; return; }
    const missing = allQuestions().filter(x => !words(state.answers[x.key]));
    const short = allQuestions().filter(x => words(state.answers[x.key]) && words(state.answers[x.key]) < A.minWords);
    el.innerHTML = `
      ${missing.length ? `<p class="step-help">Answer every question before saving (${missing.length} still empty).</p>`
        : short.length ? `<p class="step-help warn">${short.length} answer${short.length === 1 ? " is" : "s are"} shorter than ${A.minWords} words. You can still save, but more detail may earn more points.</p>`
        : `<p class="step-help">All set!</p>`}
      <button type="button" class="btn btn--primary" id="save-pdf" ${missing.length ? "disabled" : ""}>Save as PDF</button>
      <div class="pdf-help">
        <p><b>On a Chromebook or computer:</b> in the print window, set <b>Destination</b> to <b>Save as PDF</b>, then click <b>Save</b>.</p>
        <p><b>On an iPad:</b> in the print window, tap the <b>Share</b> button at the top, then <b>Save to Files</b>.</p>
        <p>Then upload the PDF to the assignment in <b>Toddle</b>.</p>
      </div>`;
  }
  $("save").addEventListener("click", e => {
    if (e.target.id !== "save-pdf") return;
    renderPrint();
    const old = document.title;
    document.title = `Lynx Market meal plans - ${state.student.trim() || "student"}`;
    window.print();
    setTimeout(() => { document.title = old; }, 1000);
  });

  /* ---------- What goes in the PDF ---------- */
  function renderPrint() {
    const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const kid = id => {
      const per = persona(id), plan = planFor(id), total = spent(id);
      const rows = A.meals.flatMap(m => {
        const meal = plan.meals[m];
        const items = Object.entries(meal.items).filter(([pid]) => data.byId[pid]);
        if (meal.away) return [`<tr><td>${esc(m)}</td><td colspan="3"><i>Eating away from home</i></td></tr>`];
        if (!items.length) return [`<tr><td>${esc(m)}</td><td colspan="3"><i>Nothing planned</i></td></tr>`];
        return items.map(([pid, q], i) => `<tr><td>${i ? "" : esc(m)}</td><td>${esc(data.byId[pid].name)}</td><td>${q}</td><td>${money(data.byId[pid].price * q)}</td></tr>`);
      }).join("");
      return `<section class="ps-kid">
        <h2>${esc(per.name)}'s day${plan.day ? ` · ${esc(plan.day)}` : ""}</h2>
        <p class="ps-needs">${esc(per.name)}, age ${esc(per.age)}: ${per.details.map(esc).join(" · ")}</p>
        <table><thead><tr><th>Meal</th><th>Food</th><th>Servings</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr><td colspan="3">Total spent (budget ${money(per.dailyBudget)})</td><td>${money(total)}</td></tr></tfoot></table>
        ${A.questions.map(q => answer(fill(q.prompt, per), q.title, state.answers[`${id}.${q.id}`])).join("")}
      </section>`;
    };
    const answer = (prompt, title, text) => `<div class="ps-q"><p class="ps-prompt">${title ? `<b>${esc(title)}.</b> ` : ""}${esc(prompt)}</p><p class="ps-a">${esc(text || "")}</p></div>`;
    $("plan-sheet").innerHTML = `
      <header class="ps-head"><h1>${esc(A.title)} · Lynx Market</h1>
        <p><b>Name:</b> ${esc(state.student)} &nbsp; <b>Class:</b> ${esc(state.section)} &nbsp; <b>Date:</b> ${esc(today)}</p></header>
      ${state.picks.map(kid).join("")}
      ${A.compareQuestion && state.picks.length > 1 ? `<section class="ps-kid ps-compare"><h2>${esc(A.compareQuestion.title)}</h2>${answer(A.compareQuestion.prompt, "", state.answers[`compare.${A.compareQuestion.id}`])}</section>` : ""}`;
  }

  /* ---------- Start over ---------- */
  $("start-over").addEventListener("click", () => {
    if (!confirm("Erase your shoppers, carts and answers on this device and start over?")) return;
    Plan.clear(); state = Plan.load();
    student.value = ""; section.value = "";
    save(); renderAll();
  });

  function renderAfterEdit() { renderPlanner(); renderFinalize(); renderPrint(); }
  function renderAll() {
    renderPersonas(); renderPlanner(); renderFinalize(); renderJustify(); renderSave(); renderPrint(); updateCartPill(data);
    document.body.classList.toggle("is-finalized", state.finalized);
  }
  window.addEventListener("beforeprint", renderPrint);
  renderAll();
})();
