/* Shopping cart project:
   1 name · 2 shop the aisles (unlocks the rest) · 3 pick a more-active and a less-active shopper ·
   4 plan three different days for each · 5 finalize (calorie check, then nutrition totals) ·
   6 explain choices · 7 save as PDF for Toddle.
   While shopping, the cart shows food names, servings and prices only. Nutrition totals appear
   after finalizing, and in the PDF. Settings live in data/products.json → "assignment". */
(async function () {
  const { esc, money, loadData, Plan, updateCartPill, toast, enableLabelPopups } = Lynx;
  const data = await loadData();
  enableLabelPopups(data);

  const A = Object.assign({
    title: "Plan Three Days of Meals", shoppersToPick: 2, daysPerShopper: 3, minDifferentFoods: 3,
    meals: ["Breakfast", "Lunch", "Snack", "Dinner", "Dessert"], requiredMeals: ["Breakfast", "Lunch", "Dinner"],
    minWords: 25, aisleMinWords: 15, aisleQuestions: [], questions: [], compareQuestion: null
  }, data.assignment || {});
  const NEED = A.shoppersToPick, DAYS_N = Math.max(1, A.daysPerShopper || 1);
  const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const LEVELS = A.activityLevels || { more: "More active", less: "Less active" };
  const ONE_EACH = !!A.pickOneOfEach && NEED === 2;
  const AWAY = A.awayMealCalories || {};

  let state = Plan.load();
  const $ = id => document.getElementById(id);
  const persona = id => data.personas.find(x => x.id === id);
  const save = () => { Plan.save(state); updateCartPill(data); };
  const words = t => (String(t || "").trim().match(/\S+/g) || []).length;
  const fill = (t, per) => t.replace(/\{name\}/g, per.name).replace(/\{budget\}/g, money(per.dailyBudget));
  const pickedOf = level => state.picks.map(persona).find(p => p && p.activity === level);
  const fillCompare = t => {
    const act = pickedOf("more"), less = pickedOf("less");
    return t.replace(/\{active\}/g, act ? act.name : "The more active shopper").replace(/\{lessActive\}/g, less ? less.name : "the less active shopper");
  };
  const wcText = (n, min) => `${n} word${n === 1 ? "" : "s"}${n < min ? ` (at least ${min})` : " ✓"}`;
  $("assign-title").textContent = A.title;

  /* ---------- Plans: each shopper has DAYS_N days ---------- */
  function planFor(id) {
    let p = state.plans[id];
    if (!p || !Array.isArray(p.days)) p = state.plans[id] = { days: p && p.meals ? [{ day: p.day || "", meals: p.meals }] : [] };
    while (p.days.length < DAYS_N) p.days.push({ day: "", meals: {} });
    p.days.forEach(d => A.meals.forEach(m => { d.meals[m] = d.meals[m] || { away: false, items: {} }; }));
    return p;
  }
  const dayOf = (id, i) => planFor(id).days[i];
  state.activeDay = state.activeDay || {};
  const activeDay = id => Math.min(state.activeDay[id] || 0, DAYS_N - 1);
  const dayLabel = (id, i) => `Day ${i + 1}${dayOf(id, i).day ? ` · ${dayOf(id, i).day}` : ""}`;
  const items = meal => Object.entries(meal.items).filter(([pid]) => data.byId[pid]);
  const spent = (id, i) => A.meals.reduce((s, m) => s + items(dayOf(id, i).meals[m]).reduce((t, [pid, q]) => t + data.byId[pid].price * q, 0), 0);
  const foodSet = (id, i) => new Set(A.meals.flatMap(m => dayOf(id, i).meals[m].away ? [] : items(dayOf(id, i).meals[m]).map(([pid]) => pid)));
  function foodsDifferent(id, i, j) {
    const a = foodSet(id, i), b = foodSet(id, j);
    let n = 0; a.forEach(x => { if (!b.has(x)) n++; }); b.forEach(x => { if (!a.has(x)) n++; });
    return n;
  }

  /* ---------- Nutrition totals ---------- */
  const NUTRIENTS = [
    ["totalFatG", "Total fat", "g", 78], ["satFatG", "Saturated fat", "g", 20], ["cholesterolMg", "Cholesterol", "mg", 300],
    ["sodiumMg", "Sodium", "mg", 2300], ["carbsG", "Total carbohydrate", "g", 275], ["fiberG", "Dietary fiber", "g", 28],
    ["totalSugarsG", "Total sugars", "g", null], ["addedSugarsG", "Added sugars", "g", 50], ["proteinG", "Protein", "g", null]
  ];
  const fmt = n => (Math.round(n * 10) / 10).toLocaleString();
  function totals(id, i) {
    const d = dayOf(id, i), t = { calories: 0, awayCalories: 0, awayMeals: [] };
    NUTRIENTS.forEach(([k]) => { t[k] = 0; });
    A.meals.forEach(m => {
      const meal = d.meals[m];
      if (meal.away) { t.awayMeals.push(m); t.awayCalories += AWAY[m] || 0; return; }
      items(meal).forEach(([pid, q]) => {
        const p = data.byId[pid];
        t.calories += p.calories * q;
        NUTRIENTS.forEach(([k]) => { t[k] += (p[k] || 0) * q; });
      });
    });
    t.dayCalories = t.calories + t.awayCalories;
    return t;
  }
  const range = per => per.calorieRange || [1800, 2400];
  function calStatus(id, i) {
    const [lo, hi] = range(persona(id)), c = totals(id, i).dayCalories;
    return c < lo ? "low" : c > hi ? "high" : "ok";
  }
  const STATUS_TEXT = { low: "Not enough", ok: "In range", high: "More than needed" };
  function calorieLine(id, i) {
    const per = persona(id), [lo, hi] = range(per), st = calStatus(id, i);
    return `<p class="cal-line cal-${st}"><b>${esc(per.name)} · ${esc(dayLabel(id, i))}: ${fmt(totals(id, i).dayCalories)} calories</b> · needs about ${lo.toLocaleString()}–${hi.toLocaleString()} · <b>${STATUS_TEXT[st]}</b></p>`;
  }
  function totalsTable(id, forPrint) {
    const per = persona(id), [lo, hi] = range(per);
    const T = Array.from({ length: DAYS_N }, (_, i) => totals(id, i));
    const head = `<tr><th scope="col">Nutrient</th>${T.map((_, i) => `<th scope="col">${esc(dayLabel(id, i))}</th>`).join("")}<th scope="col">Daily Value*</th></tr>`;
    const cal = `<tr><th scope="row">Calories</th>${T.map((t, i) => `<td class="${forPrint ? "" : "cal-cell cal-" + calStatus(id, i)}">${fmt(t.dayCalories)}</td>`).join("")}<td>Target ${lo.toLocaleString()}–${hi.toLocaleString()}</td></tr>`;
    const rows = NUTRIENTS.map(([k, label, unit, dv]) =>
      `<tr><th scope="row">${label} (${unit})</th>${T.map(t => `<td>${fmt(t[k])}</td>`).join("")}<td>${dv ? dv.toLocaleString() + " " + unit : ""}</td></tr>`).join("");
    const awayDays = T.map((t, i) => t.awayMeals.length ? `${dayLabel(id, i)}: ${t.awayMeals.map(m => m.toLowerCase()).join(", ")}` : "").filter(Boolean);
    const away = awayDays.length ? `<p class="tot-note">Calories include estimates for meals away from home (${esc(awayDays.join("; "))}). Other nutrients count Lynx Market food only.</p>` : "";
    return `<table class="tot-table"><caption>${forPrint ? `${esc(per.name)}'s nutrition totals` : `<span class="visually-hidden">${esc(per.name)}'s nutrition totals</span>`}</caption>
      <thead>${head}</thead><tbody>${cal}${rows}</tbody></table>${away}`;
  }

  /* ---------- Step 1: name ---------- */
  const student = $("student"), section = $("section");
  student.value = state.student; section.value = state.section;
  student.addEventListener("input", () => { state.student = student.value; save(); renderFinalize(); renderPrint(); });
  section.addEventListener("input", () => { state.section = section.value; save(); renderPrint(); });

  /* ---------- Step 2: shop the aisles ---------- */
  state.aisle = state.aisle || {};
  const aisleAns = q => (state.aisle[q.id] = state.aisle[q.id] || { picks: [], text: "" });
  function aisleQDone(q) {
    const a = aisleAns(q), picks = a.picks.filter(Boolean);
    return picks.length >= (q.picks || 0) && new Set(picks).size === picks.length && words(a.text) >= A.aisleMinWords;
  }
  const aisleDone = () => A.aisleQuestions.every(aisleQDone);
  const aisleStatusText = () => aisleDone() ? "✓ Step 2 is done. Steps 3–7 are unlocked."
    : `Finish all ${A.aisleQuestions.length} to unlock steps 3–7. Pick two different foods for each and write at least ${A.aisleMinWords} words.`;
  const productOptions = sel => `<option value="">Choose a food…</option>` + data.aisles.map(a =>
    `<optgroup label="${esc(a)}">${data.products.filter(p => p.aisle === a).map(p => `<option value="${esc(p.id)}" ${p.id === sel ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</optgroup>`).join("");
  function renderAisle() {
    const locked = state.finalized;
    $("aisle").innerHTML = A.aisleQuestions.map((q, qi) => {
      const a = aisleAns(q), n = words(a.text), done = aisleQDone(q);
      return `<fieldset class="q-group aisle-q ${done ? "is-done" : ""}"><legend>${String.fromCharCode(65 + qi)}. ${esc(q.title)} ${done ? '<span class="done-tag">✓ Done</span>' : ""}</legend>
        <p>${esc(q.prompt)}</p>
        <div class="aisle-picks">${Array.from({ length: q.picks || 0 }, (_, i) => `
          <label>Food ${i + 1}
            <select data-aq="${esc(q.id)}" data-i="${i}" ${locked ? "disabled" : ""}>${productOptions(a.picks[i])}</select>
            ${a.picks[i] && data.byId[a.picks[i]] ? `<a href="index.html#${esc(a.picks[i])}" data-product="${esc(a.picks[i])}">See package and label</a>` : ""}
          </label>`).join("")}</div>
        <label class="visually-hidden" for="aq-${esc(q.id)}">${esc(q.title)}: your answer</label>
        <textarea id="aq-${esc(q.id)}" data-aqtext="${esc(q.id)}" rows="3" ${locked ? "readonly" : ""} placeholder="Your answer">${esc(a.text)}</textarea>
        <p class="wc ${n < A.aisleMinWords ? "short" : ""}" id="aq-${esc(q.id)}-wc">${wcText(n, A.aisleMinWords)}</p>
      </fieldset>`;
    }).join("") + `<p class="step-help" id="aisle-status" aria-live="polite">${aisleStatusText()}</p>`;
  }
  function updateLock() {
    const open = aisleDone() || state.finalized;
    const box = $("locked-steps");
    box.classList.toggle("is-locked", !open);
    let note = $("lock-note");
    if (!open && !note) {
      note = document.createElement("p");
      note.id = "lock-note"; note.className = "lock-note";
      note.textContent = "🔒 Steps 3–7 unlock when you finish step 2: Shop the aisles.";
      box.parentNode.insertBefore(note, box);
    } else if (open && note) note.remove();
    box.querySelectorAll("section").forEach(s => s.toggleAttribute("inert", !open));
  }
  $("aisle").addEventListener("change", e => {
    const sel = e.target.closest("select[data-aq]");
    if (!sel) return;
    const a = state.aisle[sel.dataset.aq];
    a.picks[+sel.dataset.i] = sel.value;
    const chosen = a.picks.filter(Boolean);
    if (chosen.length !== new Set(chosen).size) toast("Pick two different foods.");
    save(); renderAisle(); updateLock(); renderPrint();
    $("aisle").querySelector(`select[data-aq="${sel.dataset.aq}"][data-i="${sel.dataset.i}"]`).focus();
  });
  $("aisle").addEventListener("input", e => {
    const ta = e.target.closest("textarea[data-aqtext]");
    if (!ta) return;
    const q = A.aisleQuestions.find(x => x.id === ta.dataset.aqtext);
    aisleAns(q).text = ta.value; save();
    const n = words(ta.value), wc = $(ta.id + "-wc");
    wc.textContent = wcText(n, A.aisleMinWords); wc.classList.toggle("short", n < A.aisleMinWords);
    const fs = ta.closest(".aisle-q"), was = fs.classList.contains("is-done"), now = aisleQDone(q);
    if (was !== now) {
      fs.classList.toggle("is-done", now);
      const lg = fs.querySelector("legend"), tag = lg.querySelector(".done-tag");
      if (now && !tag) lg.insertAdjacentHTML("beforeend", ' <span class="done-tag">✓ Done</span>'); else if (!now && tag) tag.remove();
      $("aisle-status").textContent = aisleStatusText();
      renderAll(true);
    }
    renderPrint();
  });

  /* ---------- Step 3: shoppers ---------- */
  function renderPersonas() {
    $("pick-status").textContent = state.finalized
      ? "Your carts are finalized. Unlock them in step 5 to change shoppers."
      : ONE_EACH ? `Pick one ${LEVELS.more.toLowerCase()} shopper and one ${LEVELS.less.toLowerCase()} shopper. Tap a card to pick or un-pick it. ${state.picks.length} of ${NEED} picked.`
      : `Tap a card to pick or un-pick a shopper. ${state.picks.length} of ${NEED} picked.`;
    const card = per => `
      <button type="button" class="persona" style="--pc:${esc(per.color)}" aria-pressed="${state.picks.includes(per.id)}" data-id="${esc(per.id)}" ${state.finalized ? "disabled" : ""}>
        <span class="persona-head">
          <span class="avatar" aria-hidden="true">${esc(per.name[0])}</span>
          <span><span class="persona-name">${esc(per.name)}</span><br><span class="persona-age">Age ${esc(per.age)}</span></span>
        </span>
        <ul>${per.details.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
        <span class="budget">Daily budget: ${money(per.dailyBudget)}</span>
        ${per.calorieRange ? `<span class="cal-need">Needs about ${per.calorieRange.map(n => n.toLocaleString()).join("–")} calories a day</span>` : ""}
        <span class="chosen">✓ Picked</span>
      </button>`;
    $("personas").innerHTML = ONE_EACH
      ? ["more", "less"].map(l => `<div class="act-group act-${l}"><h3>${esc(LEVELS[l])}</h3><div class="personas">${data.personas.filter(p => p.activity === l).map(card).join("")}</div></div>`).join("")
      : `<div class="personas">${data.personas.map(card).join("")}</div>`;
  }
  $("personas").addEventListener("click", e => {
    const btn = e.target.closest(".persona");
    if (!btn || state.finalized) return;
    const id = btn.dataset.id;
    if (state.picks.includes(id)) {
      state.picks = state.picks.filter(x => x !== id);
      if (state.active === id) state.active = state.picks[0] || null;
    } else if (ONE_EACH && pickedOf(persona(id).activity)) {
      const other = pickedOf(persona(id).activity);
      toast(`You already picked ${esc(other.name)} (${esc(LEVELS[other.activity].toLowerCase())}). Pick a ${esc(LEVELS[persona(id).activity === "more" ? "less" : "more"].toLowerCase())} shopper, or un-pick ${esc(other.name)} first.`);
      return;
    } else if (state.picks.length >= NEED) {
      toast(`You already picked ${NEED}. Tap one of them to un-pick it first.`);
      return;
    } else {
      state.picks.push(id); state.active = id;
    }
    save(); renderAll(true);
    $("personas").querySelector(`[data-id="${id}"]`).focus();
  });

  /* ---------- Step 4: planner ---------- */
  let addMeal = A.meals[0];
  function renderPlanner() {
    const el = $("planner");
    if (!state.picks.length) { el.innerHTML = `<p class="step-help">Pick your shoppers in step 3 first.</p>`; return; }
    if (!state.picks.includes(state.active)) state.active = state.picks[0];
    const per = persona(state.active), di = activeDay(per.id), day = dayOf(per.id, di), locked = state.finalized;
    const total = spent(per.id, di), left = per.dailyBudget - total, over = left < -0.004;
    const pctUsed = Math.min(100, (total / per.dailyBudget) * 100);

    const kidTabs = `<div class="kid-tabs" role="group" aria-label="Choose a shopper">${state.picks.map(id => {
      const p = persona(id);
      return `<button type="button" class="kid-tab" style="--pc:${esc(p.color)}" aria-pressed="${id === per.id}" data-kid="${esc(id)}">${esc(p.name)}</button>`;
    }).join("")}</div>`;
    const dayTabs = `<div class="day-tabs" role="group" aria-label="Choose ${esc(per.name)}'s day">${Array.from({ length: DAYS_N }, (_, i) =>
      `<button type="button" class="day-tab" aria-pressed="${i === di}" data-day="${i}">${esc(dayLabel(per.id, i))}</button>`).join("")}</div>`;

    const used = planFor(per.id).days.map((d, i) => i !== di && d.day).filter(Boolean);
    const meals = A.meals.map(m => {
      const meal = day.meals[m], list = items(meal), req = A.requiredMeals.includes(m);
      return `<div class="meal-block">
        <div class="meal-head"><h4>${esc(m)}${req ? "" : ' <span class="opt">(optional)</span>'}</h4>
          <label class="away"><input type="checkbox" data-away="${esc(m)}" ${meal.away ? "checked" : ""} ${locked ? "disabled" : ""}> Eating away from home</label></div>
        ${meal.away ? `<p class="meal-empty">Eating away from home (school lunch, restaurant…)</p>`
          : list.length ? `<ul class="cart-items">${list.map(([pid, q]) => {
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
      <div class="add-to"><label>Add foods to <b>${esc(per.name)}'s ${esc(dayLabel(per.id, di))}</b>
        <select id="add-meal">${A.meals.map(m => `<option ${m === addMeal ? "selected" : ""}>${esc(m)}</option>`).join("")}</select></label></div>
      ${data.aisles.map(a => `<h3>${esc(a)}</h3>` + data.products.filter(p => p.aisle === a).map(p => `
        <div class="shop-row">
          <span class="nm">${esc(p.name)} <a href="index.html#${esc(p.id)}" data-product="${esc(p.id)}" aria-label="See the label for ${esc(p.name)}">label</a></span>
          <span class="pr">${money(p.price)}<span class="visually-hidden"> per serving</span></span>
          <button type="button" class="btn btn-sm btn--primary" data-add="${esc(p.id)}" aria-label="Add ${esc(p.name)}">+ Add</button>
        </div>`).join("")).join("")}
    </section>`;

    el.innerHTML = `<p class="step-help">Plan ${DAYS_N} days for each shopper. Each day needs a different day of the week, and no two days can be alike: change at least ${A.minDifferentFoods} foods between any two days.</p>
      ${kidTabs}${dayTabs}
      <div class="shop-layout ${locked ? "locked" : ""}">
        ${shop}
        <aside class="cart-panel" aria-label="${esc(per.name)}'s cart for ${esc(dayLabel(per.id, di))}">
          <h3>${esc(per.name)}'s cart · Day ${di + 1}</h3>
          <p class="kid-needs">${per.details.map(esc).join(" · ")}</p>
          <label class="day-pick">Which day of the week?
            <select id="day" ${locked ? "disabled" : ""}><option value="">Choose a day</option>${WEEK.map(d => `<option value="${d}" ${day.day === d ? "selected" : ""} ${used.includes(d) ? "disabled" : ""}>${d}${used.includes(d) ? " (used)" : ""}</option>`).join("")}</select></label>
          ${meals}
          ${state.calorieCheck && !locked ? calorieLine(per.id, di) : ""}
          <div class="budget-box">
            <div class="budget-line"><span>Spent on Day ${di + 1}</span><span>${money(total)} of ${money(per.dailyBudget)}</span></div>
            <div class="meter ${over ? "over" : ""}" role="progressbar" aria-label="Budget used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pctUsed)}"><span style="width:${pctUsed}%"></span></div>
            <p class="budget-status ${over ? "over" : ""}" aria-live="polite">${over ? `Over budget by ${money(-left)}` : `${money(left)} left to spend`}</p>
          </div>
        </aside>
      </div>`;
  }
  $("planner").addEventListener("change", e => {
    if (e.target.id === "add-meal") { addMeal = e.target.value; return; }
    const d = dayOf(state.active, activeDay(state.active));
    if (e.target.id === "day") { d.day = e.target.value; save(); renderAfterEdit(); $("day").focus(); }
    else if (e.target.dataset.away) {
      d.meals[e.target.dataset.away].away = e.target.checked;
      save(); renderAfterEdit();
      $("planner").querySelector(`[data-away="${e.target.dataset.away}"]`).focus();
    }
  });
  $("planner").addEventListener("click", e => {
    const tab = e.target.closest("[data-kid]"), dtab = e.target.closest("[data-day]");
    if (tab) { state.active = tab.dataset.kid; save(); renderPlanner(); $("planner").querySelector(`[data-kid="${tab.dataset.kid}"]`).focus(); return; }
    if (dtab) { state.activeDay[state.active] = +dtab.dataset.day; save(); renderPlanner(); $("planner").querySelector(`[data-day="${dtab.dataset.day}"]`).focus(); return; }
    const add = e.target.closest("[data-add]"), inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (!(add || inc || dec) || state.finalized) return;
    const di = activeDay(state.active), d = dayOf(state.active, di);
    const meal = add ? addMeal : (inc || dec).dataset.meal;
    const pid = add ? add.dataset.add : (inc || dec).dataset.inc || (inc || dec).dataset.dec;
    const m = d.meals[meal];
    if (add && m.away) { toast(`${meal} is marked "eating away from home." Un-check that to add food.`); return; }
    const next = (m.items[pid] || 0) + (dec ? -1 : 1);
    if (next <= 0) delete m.items[pid]; else m.items[pid] = next;
    save();
    if (add) toast(`Added 1 serving of ${esc(data.byId[pid].name)} to ${esc(persona(state.active).name)}'s Day ${di + 1} ${esc(meal.toLowerCase())}.`);
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

  /* ---------- Step 5: finalize ---------- */
  function problems() {
    const out = [];
    if (!state.student.trim()) out.push("Type your name in step 1.");
    if (!aisleDone()) out.push("Finish step 2: Shop the aisles.");
    if (state.picks.length !== NEED) out.push(`Pick ${NEED} shoppers in step 3 (you have ${state.picks.length}).`);
    else if (ONE_EACH && !(pickedOf("more") && pickedOf("less"))) out.push(`In step 3, pick one ${LEVELS.more.toLowerCase()} and one ${LEVELS.less.toLowerCase()} shopper.`);
    state.picks.forEach(id => {
      const per = persona(id), days = planFor(id).days;
      days.forEach((d, i) => {
        const tag = `${per.name}'s Day ${i + 1}`;
        if (!d.day) out.push(`Choose a day of the week for ${tag}.`);
        A.requiredMeals.forEach(m => {
          const meal = d.meals[m];
          if (!meal.away && !items(meal).length) out.push(`Add food to ${tag} ${m.toLowerCase()} (or mark it "eating away from home").`);
        });
        const over = spent(id, i) - per.dailyBudget;
        if (over > 0.004) out.push(`${tag} is ${money(over)} over budget.`);
      });
      for (let i = 0; i < days.length; i++) for (let j = i + 1; j < days.length; j++) {
        if (!foodSet(id, i).size || !foodSet(id, j).size) continue;
        const n = foodsDifferent(id, i, j), need = A.minDifferentFoods - n;
        if (n < A.minDifferentFoods) out.push(`${per.name}'s Day ${i + 1} and Day ${j + 1} are ${n ? "too similar" : "identical"}. Swap in at least ${need} different food${need === 1 ? "" : "s"}.`);
      }
    });
    return out;
  }
  const lowDays = () => state.picks.flatMap(id => Array.from({ length: DAYS_N }, (_, i) => i).filter(i => calStatus(id, i) === "low").map(i => [id, i]));
  function renderFinalize() {
    const el = $("finalize");
    if (state.finalized) {
      el.innerHTML = `<p class="done-msg">✓ Your carts are finalized. Here are each shopper's nutrition totals for each day.</p>
        <div class="tot-grid tot-grid--days">${state.picks.map(id => `<div class="tot-card" style="--pc:${esc(persona(id).color)}"><h3>${esc(persona(id).name)} (${esc((LEVELS[persona(id).activity] || "").toLowerCase())})</h3>${totalsTable(id, false)}</div>`).join("")}</div>
        <p class="tot-note">* Daily Values are the amounts used on Nutrition Facts labels, based on a 2,000-calorie diet. Calories are shaded green (in range), red (not enough) or orange (more than needed).</p>
        <button type="button" class="btn" id="unlock">Unlock my carts to make changes</button>`;
      return;
    }
    const list = problems(), short = list.length ? [] : lowDays();
    el.innerHTML = `${list.length ? `<p class="step-help">Before you can finalize:</p><ul class="todo">${list.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`
      : state.calorieCheck && short.length ? `<div class="cal-warn" role="alert" tabindex="-1"><p><b>Not enough food yet.</b> Add more food to these days in step 4, then try again.</p>${short.map(([id, i]) => calorieLine(id, i)).join("")}</div>`
      : `<p class="step-help">Everything is ready. When you finalize, we check that every day has enough calories, then lock your carts so you can write about them.</p>`}
      <button type="button" class="btn btn--primary" id="finalize-btn" ${list.length ? "disabled" : ""}>${state.calorieCheck && short.length ? "Check again and finalize" : "Finalize my carts"}</button>`;
  }
  $("finalize").addEventListener("click", e => {
    if (e.target.id === "finalize-btn" && !problems().length) {
      if (lowDays().length) {
        state.calorieCheck = true; save(); renderAll(true);
        $("finalize").querySelector(".cal-warn")?.focus();
        return;
      }
      state.finalized = true; save(); renderAll();
      $("s5").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (e.target.id === "unlock") {
      state.finalized = false; save(); renderAll();
      $("s4").scrollIntoView({ block: "start" });
    }
  });

  /* ---------- Step 6: justification ---------- */
  const allQuestions = () => {
    const qs = [];
    state.picks.forEach(id => A.questions.forEach(q => qs.push({ key: `${id}.${q.id}` })));
    if (A.compareQuestion && state.picks.length > 1) qs.push({ key: `compare.${A.compareQuestion.id}` });
    return qs;
  };
  function qBox(key, q, prompt) {
    const id = "q-" + key.replace(/\W/g, "-"), val = state.answers[key] || "", n = words(val);
    return `<div class="q-box">
      <label for="${id}"><b>${esc(q.title)}.</b> ${esc(prompt)}</label>
      <textarea id="${id}" data-key="${esc(key)}" rows="5">${esc(val)}</textarea>
      <p class="wc ${n < A.minWords ? "short" : ""}" id="${id}-wc">${wcText(n, A.minWords)}</p>
    </div>`;
  }
  function renderJustify() {
    const el = $("justify");
    if (!state.finalized) { el.innerHTML = `<p class="step-help">Finalize your carts in step 5 to unlock the questions.</p>`; return; }
    const groups = state.picks.map(id => {
      const per = persona(id);
      return `<fieldset class="q-group"><legend>${esc(per.name)}'s ${DAYS_N === 1 ? "day" : "days"}</legend>
        ${A.questions.map(q => qBox(`${id}.${q.id}`, q, fill(q.prompt, per))).join("")}</fieldset>`;
    }).join("");
    const cq = A.compareQuestion;
    const cmp = cq && state.picks.length > 1 ? `<fieldset class="q-group"><legend>${esc(cq.title)}</legend>${qBox(`compare.${cq.id}`, cq, fillCompare(cq.prompt))}</fieldset>` : "";
    el.innerHTML = `<p class="step-help">Write in complete sentences. Use evidence from the Nutrition Facts labels and the nutrition totals in step 5. Click any food name to see its label again.</p>${groups}${cmp}`;
  }
  $("justify").addEventListener("input", e => {
    const ta = e.target.closest("textarea[data-key]");
    if (!ta) return;
    state.answers[ta.dataset.key] = ta.value; save();
    const n = words(ta.value), wc = $(ta.id + "-wc");
    wc.textContent = wcText(n, A.minWords); wc.classList.toggle("short", n < A.minWords);
    renderSave(); renderPrint();
  });

  /* ---------- Step 7: save as PDF ---------- */
  function renderSave() {
    const el = $("save");
    if (!state.finalized) { el.innerHTML = `<p class="step-help">Finalize your carts and answer the questions first.</p>`; return; }
    const qs = allQuestions();
    const missing = qs.filter(x => !words(state.answers[x.key]));
    const short = qs.filter(x => words(state.answers[x.key]) && words(state.answers[x.key]) < A.minWords);
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
    const answer = (prompt, title, text) => `<div class="ps-q"><p class="ps-prompt">${title ? `<b>${esc(title)}.</b> ` : ""}${esc(prompt)}</p><p class="ps-a">${esc(text || "")}</p></div>`;
    const aisle = A.aisleQuestions.length ? `<section class="ps-aisle"><h2>Shopping the aisles</h2>${A.aisleQuestions.map((q, qi) => {
      const a = aisleAns(q), names = a.picks.filter(p => data.byId[p]).map(p => data.byId[p].name);
      return `<div class="ps-q"><p class="ps-prompt"><b>${String.fromCharCode(65 + qi)}. ${esc(q.title)}.</b> ${esc(q.prompt)}</p>
        <p class="ps-picks"><b>Foods:</b> ${esc(names.join("; ") || "—")}</p><p class="ps-a">${esc(a.text)}</p></div>`;
    }).join("")}</section>` : "";
    const kid = id => {
      const per = persona(id);
      const dayTable = i => {
        const d = dayOf(id, i);
        const rows = A.meals.map(m => {
          const meal = d.meals[m], list = items(meal);
          const foods = meal.away ? "<i>Eating away from home</i>" : list.length ? list.map(([pid, q]) => `${esc(data.byId[pid].name)} ×${q}`).join("; ") : "<i>Nothing planned</i>";
          const price = list.reduce((s, [pid, q]) => s + data.byId[pid].price * q, 0);
          return `<tr><td>${esc(m)}</td><td>${foods}</td><td>${meal.away || !list.length ? "" : money(price)}</td></tr>`;
        }).join("");
        return `<div class="ps-dayblock"><h3>${esc(dayLabel(id, i))}</h3><table class="ps-day"><thead><tr><th>Meal</th><th>Foods (servings)</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody><tfoot><tr><td colspan="2">Total spent (budget ${money(per.dailyBudget)})</td><td>${money(spent(id, i))}</td></tr></tfoot></table></div>`;
      };
      return `<section class="ps-kid">
        <h2>${esc(per.name)}'s ${DAYS_N === 1 ? "day" : "days"}</h2>
        <p class="ps-needs">${esc(per.name)}, age ${esc(per.age)}${per.activity ? ` (${esc((LEVELS[per.activity] || "").toLowerCase())})` : ""}: ${per.details.map(esc).join(" · ")}</p>
        ${Array.from({ length: DAYS_N }, (_, i) => dayTable(i)).join("")}
        ${state.finalized ? totalsTable(id, true) : ""}
        ${A.questions.map(q => answer(fill(q.prompt, per), q.title, state.answers[`${id}.${q.id}`])).join("")}
      </section>`;
    };
    const cq = A.compareQuestion;
    $("plan-sheet").innerHTML = `
      <header class="ps-head"><h1>${esc(A.title)} · Lynx Market</h1>
        <p><b>Name:</b> ${esc(state.student)} &nbsp; <b>Class:</b> ${esc(state.section)} &nbsp; <b>Date:</b> ${esc(today)}</p></header>
      ${aisle}
      ${state.picks.map(kid).join("")}
      ${cq && state.picks.length > 1 ? `<section class="ps-kid ps-compare"><h2>${esc(cq.title)}</h2>${answer(fillCompare(cq.prompt), "", state.answers[`compare.${cq.id}`])}</section>` : ""}`;
  }

  /* ---------- Start over ---------- */
  $("start-over").addEventListener("click", () => {
    if (!confirm("Erase everything on this page (your aisle answers, shoppers, carts and answers) on this device and start over?")) return;
    Plan.clear(); state = Plan.load(); state.aisle = {}; state.activeDay = {};
    student.value = ""; section.value = "";
    save(); renderAll();
  });

  function renderAfterEdit() { renderPlanner(); renderFinalize(); renderPrint(); }
  function renderAll(skipAisle) {
    if (!skipAisle) renderAisle();
    renderPersonas(); renderPlanner(); renderFinalize(); renderJustify(); renderSave(); renderPrint(); updateCartPill(data);
    updateLock();
    document.body.classList.toggle("is-finalized", state.finalized);
  }
  window.addEventListener("beforeprint", renderPrint);
  renderAll();
})();
