// Checks data/products.json for typos and numbers that don't add up.
// Run from the project folder:  node tools/check-data.js
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "data", "products.json");
let data;
try {
  data = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (err) {
  console.error("✗ products.json is not valid JSON:\n  " + err.message);
  console.error("  Tip: look for a missing comma or an extra comma before } or ].");
  process.exit(1);
}

const problems = [];
const warnings = [];
const NUM_FIELDS = ["calories", "totalFatG", "satFatG", "transFatG", "cholesterolMg", "sodiumMg",
  "carbsG", "fiberG", "totalSugarsG", "addedSugarsG", "proteinG", "price"];
const ids = new Set();

for (const p of data.products) {
  const who = `${p.id || "(no id)"} — ${p.name || "(no name)"}`;
  if (!p.id) problems.push(`${who}: missing "id"`);
  if (ids.has(p.id)) problems.push(`${who}: id is used twice`);
  ids.add(p.id);
  if (!data.aisles.includes(p.aisle)) problems.push(`${who}: aisle "${p.aisle}" is not in the aisles list`);
  for (const f of NUM_FIELDS) {
    if (typeof p[f] !== "number" || p[f] < 0) problems.push(`${who}: "${f}" must be a number (got ${JSON.stringify(p[f])})`);
  }
  if (!p.servingSize) problems.push(`${who}: missing "servingSize"`);
  if (!p.art || !p.art.icon) warnings.push(`${who}: no art.icon (a plain package will be drawn)`);

  // Label consistency checks
  if (p.satFatG + p.transFatG > p.totalFatG) problems.push(`${who}: saturated + trans fat is more than total fat`);
  if (p.addedSugarsG > p.totalSugarsG) problems.push(`${who}: added sugars are more than total sugars`);
  if (p.fiberG + p.totalSugarsG > p.carbsG) problems.push(`${who}: fiber + sugars are more than total carbohydrate`);
  const est = 9 * p.totalFatG + 4 * p.carbsG + 4 * p.proteinG - 2 * p.fiberG;
  const diff = Math.abs(est - p.calories);
  if (diff > Math.max(20, p.calories * 0.2)) {
    warnings.push(`${who}: calories (${p.calories}) don't match fat/carbs/protein (≈${Math.round(est)}). Check the numbers.`);
  }
}

const checkRows = (label, rows) => rows.forEach((r, i) => {
  if (!ids.has(r.productId)) problems.push(`${label} row ${i + 1}: no product with id "${r.productId}"`);
  if (!r.amountEaten) problems.push(`${label} row ${i + 1}: missing "amountEaten"`);
});
for (const [key, log] of Object.entries(data.logs)) checkRows(`logs.${key}`, log.rows);
checkRows("mayasWeek", data.mayasWeek.rows);

for (const per of data.personas) {
  if (typeof per.dailyBudget !== "number") problems.push(`persona ${per.name}: dailyBudget must be a number`);
}

warnings.forEach(w => console.log("⚠ " + w));
problems.forEach(p => console.log("✗ " + p));
console.log(`\n${data.products.length} products, ${problems.length} problem(s), ${warnings.length} warning(s).`);
process.exit(problems.length ? 1 : 0);
