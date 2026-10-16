# Lynx Market

A pretend online grocery store for a 7th grade science project. Students browse invented products, flip each package to read its Nutrition Facts label, and use the labels to compare meal plans. Every brand, product, price and number is made up, so students can't look them up online.

- Plain HTML, CSS and JavaScript. No backend, database, logins, analytics, trackers or outside fonts.
- Nothing about students is collected. The shopping cart is stored only in the student's open browser tab (`sessionStorage`) and disappears when the tab closes.
- No totals and no answer key appear anywhere on the site.

## Pages

| Page | File | What it does |
|---|---|---|
| Store aisles | `index.html` | Every product, grouped by aisle. Click a package (or **Flip to label**) to see its Nutrition Facts. Search box and "Flip all" button at the top. |
| Meal logs | `logs.html` | Meal Log A and Meal Log B: meal, product (links to its card) and amount eaten. The logs have neutral names, so the page never says which one is healthier. |
| Maya's Week (Variant B) | `mayas-week.html` | All log rows mixed into one list, in a fixed order, with no meal names or log titles. |
| Shopping cart (Variant C) | `cart.html` | Pick a persona, add servings, watch the price against the daily budget. **Print my cart** prints the list with blank nutrient columns. |
| Print label cards (teacher) | `print-labels.html` | Prints every product as a fold-over card (front + label), 4 per page. Linked from the footer. |

On the meal logs, Maya's Week and the cart, clicking a product name opens its package and label in a popup, so students stay on the page. Close it with the ✕ button, the Esc key, or a click outside the box.

Linking straight to a product: `index.html#granola` opens the store with that product flipped to its label. The part after `#` is the product's `id`.

## Editing the products (`data/products.json`)

Everything a teacher might change lives in **one file**: `data/products.json`. You don't need to touch any code.

Open it in any text editor (on GitHub, open the file and click the ✏️ pencil). Each product looks like this:

```json
{
  "id": "granola",
  "name": "Sunrise Crunch Honey Granola",
  "brand": "Sunrise Crunch",
  "frontName": "Honey Granola",
  "aisle": "Breakfast",
  "claim": "Made with ancient grains!",
  "price": 0.85,
  "servingSize": "1/3 cup (40g)",
  "servingsPerContainer": "about 9",
  "calories": 150, "totalFatG": 5, "satFatG": 1.5, "transFatG": 0, "cholesterolMg": 0, "sodiumMg": 90,
  "carbsG": 24, "fiberG": 2, "totalSugarsG": 10, "addedSugarsG": 9, "proteinG": 3,
  "contains": ["wheat", "milk"],
  "art": { "style": "natural", "bg": "#efe1c2", "bg2": "#d9c497", "ink": "#3d5a1e", "accent": "#5e8c31", "icon": "granola", "seal": "Ancient Grains" }
}
```

| Field | Meaning |
|---|---|
| `id` | Short code used in links and logs. Lowercase, no spaces. **Don't change it** unless you also change it in the logs. |
| `name` | Full product name (shown on the shelf tag, logs and cart). |
| `brand`, `frontName` | What's printed big on the package front. |
| `aisle` | Must match one of the names in the `"aisles"` list. |
| `claim` | Front-of-package marketing claim. Use `""` for no claim. |
| `price` | Price in dollars for **one serving**. |
| `servingSize`, `servingsPerContainer` | Shown at the top of the label. |
| `calories` … `proteinG` | Label values **per serving**. The `G` / `Mg` at the end tells you the unit. |
| `contains` | Allergen line under the label. Use `[]` for none. |
| `art.style` | Package look: `natural` (leafy, earthy look), `bright`, `sporty`, `store` (plain Lynx Market brand), `fresh` (produce tag), `deli`, `treat`, `frosty`. |
| `art.bg`, `bg2`, `ink`, `accent` | Package colors (background, pattern, text, badge). |
| `art.icon` | Which drawing to use (see the list in `js/art.js`, such as `granola`, `banana`, `pizza`). |
| `art.seal` | Optional round badge text, such as `"Whole Grain"`. |
| `teacherReview` | `true` on products a teacher should double-check (see below). |

The % Daily Values on the labels are worked out from the numbers above, so you don't type them.

**Other things in the same file**

- `logs` holds the two meal logs (`logA` and `logB`). Change `title` to rename one. Each row is `{ "meal": "...", "productId": "...", "amountEaten": "..." }`.
- `mayasWeek.rows` is Maya's mixed log. Rows show **in the order they are listed**, so every student sees the same version. Reorder them to make a new version.
- `personas` holds the shopper cards. `dailyBudget` is in dollars. Only Sam's $12 came from the original plan. The others are set to $15 as placeholders, so change them if you like.
- `settings.showInNav` can hide pages from the menu for a class. For example, set `"logs": false` for a Variant B class so students only see Maya's Week. The page still works if someone types its address.

**Check your edits.** A single missing comma breaks the whole file. If you have Node installed, run:

```bash
node tools/check-data.js
```

It reports JSON mistakes, products in an aisle that doesn't exist, log rows pointing at a missing product, added sugars larger than total sugars, and calories that don't match the fat, carbs and protein. If you don't have Node, paste the file into any online "JSON validator". If the site shows "The store shelves are empty!", the JSON has a mistake.

## Products to review

The 18 products in the meal logs use the exact numbers from the project plan. Their extra label values (total fat, cholesterol, total carbohydrate, total sugars), serving weights in grams, and allergen lines were invented to match the given numbers.

These 32 products were **added** to give the Variant C personas more choices. They're marked `"teacherReview": true` in the JSON. Please check them before using the site with students:

| Product | Aisle | Claim | Serving | Cal | Added sugar g | Sat fat g | Sodium mg | Fiber g | Protein g | Price |
|---|---|---|---|---|---|---|---|---|---|---|
| Morning Mill Multigrain Bagel | Breakfast | Hearty multigrain goodness! | 1 bagel (105g) | 290 | 6 | 0.5 | 480 | 3 | 11 | $0.95 |
| Cosmo's Cocoa Comets Cereal | Breakfast | Part of a complete breakfast! | 1 cup (36g) | 150 | 13 | 0.5 | 170 | 2 | 2 | $0.60 |
| Golden Hearth Maple & Brown Sugar Instant Oatmeal | Breakfast | Heart-healthy whole grains | 1 packet (43g) | 160 | 12 | 0.5 | 260 | 3 | 4 | $0.55 |
| Lynx Hard-Boiled Eggs (2-pack) | Dairy | — | 2 eggs (100g) | 140 | 0 | 3 | 140 | 0 | 12 | $1.25 |
| Lynx 1% Lowfat Milk | Dairy | — | 1 cup (240mL) | 110 | 0 | 1.5 | 125 | 0 | 8 | $0.45 |
| Moo-Town Chocolate Milk | Dairy | Packed with 8g protein! | 1 bottle (8 fl oz) | 190 | 12 | 2.5 | 200 | 1 | 8 | $1.10 |
| Lynx Mozzarella String Cheese | Dairy | — | 1 stick (28g) | 80 | 0 | 3 | 200 | 0 | 7 | $0.50 |
| Sproutly Super Greens Veggie Smoothie | Drinks | 2 servings of veggies in every bottle! | 8 fl oz (240mL) | 140 | 8 | 0 | 40 | 1 | 1 | $1.75 |
| Surge Sport Electrolyte Drink, Blue Blast | Drinks | Hydrate like a pro! | 1 bottle (20 fl oz) | 140 | 34 | 0 | 270 | 0 | 0 | $1.50 |
| Lynx Sparkling Water, Lime | Drinks | — | 1 can (12 fl oz) | 0 | 0 | 0 | 0 | 0 | 0 | $0.50 |
| Lynx 100% Orange Juice | Drinks | — | 8 fl oz (240mL) | 110 | 0 | 0 | 0 | 0 | 2 | $0.70 |
| Sunny Squeeze Strawberry Fruit Snacks | Snacks | Made with real fruit juice! 100% Vitamin C | 1 pouch (25g) | 80 | 11 | 0 | 15 | 0 | 1 | $0.45 |
| Cloud Crunch Baked Cheddar Puffs | Snacks | Baked, not fried! | 1 oz (28g) | 150 | 1 | 2 | 290 | 0 | 2 | $0.65 |
| Lynx Lightly Salted Almonds | Snacks | — | 1/4 cup (30g) | 170 | 0 | 1 | 55 | 3 | 6 | $0.90 |
| Trailblazer Sweet & Salty Trail Mix | Snacks | Natural energy for the trail! | 1/4 cup (35g) | 170 | 7 | 3 | 60 | 2 | 4 | $0.80 |
| Bright Bites Sunflower Butter Cracker Sandwiches | Snacks | Peanut-free & school-safe! | 1 pack (6 crackers, 39g) | 190 | 5 | 2 | 230 | 2 | 5 | $0.70 |
| Pulse Pop Chili Lime Roasted Chickpeas | Snacks | Plant protein power! | 1 oz (28g) | 120 | 2 | 0.5 | 210 | 5 | 6 | $0.95 |
| Grandma Bea's Chocolate Chip Cookies | Snacks | Baked with love! | 2 cookies (32g) | 160 | 11 | 3.5 | 105 | 1 | 2 | $0.55 |
| Velvet Moon 70% Dark Chocolate Squares | Snacks | Rich in antioxidants! | 2 squares (20g) | 110 | 5 | 4.5 | 0 | 2 | 2 | $0.75 |
| Lynx Kitchen Spicy Black Bean Burrito Bowl | Deli & Prepared | — | 1 bowl (340g) | 450 | 2 | 3 | 820 | 12 | 17 | $3.75 |
| Lynx Kitchen Firecracker Tofu Stir-Fry | Deli & Prepared | — | 1 container (300g) | 380 | 14 | 1.5 | 890 | 5 | 18 | $3.50 |
| Lynx Kitchen Lemon Herb Salmon | Deli & Prepared | — | 4 oz (112g) | 230 | 0 | 2.5 | 75 | 0 | 25 | $3.95 |
| Fresh Gala Apple | Produce | — | 1 medium (182g) | 95 | 0 | 0 | 0 | 4 | 0 | $0.60 |
| Lynx Spring Mix Salad Greens | Produce | — | 2 cups (85g) | 20 | 0 | 0 | 80 | 2 | 2 | $0.85 |
| Lynx Black Beans, Low Sodium | Pantry | — | 1/2 cup (130g) | 110 | 0 | 0 | 140 | 7 | 7 | $0.40 |
| Lynx 100% Whole Wheat Bread | Pantry | — | 1 slice (38g) | 90 | 2 | 0 | 150 | 3 | 5 | $0.25 |
| Golden Bites Crispy Chicken Nuggets | Frozen | Made with white meat chicken! | 5 pieces (85g) | 230 | 0 | 2.5 | 470 | 1 | 12 | $1.25 |
| Garden Patch Black Bean Veggie Burger | Frozen | Plant-powered! | 1 patty (71g) | 130 | 0 | 0.5 | 380 | 5 | 9 | $1.40 |
| Lynx Shelled Edamame | Frozen | — | 1/2 cup (75g) | 100 | 0 | 0.5 | 5 | 4 | 9 | $0.75 |
| Chill Orchard Strawberry Fruit Bars | Frozen | Made with real strawberries | 1 bar (78g) | 70 | 9 | 0 | 0 | 1 | 0 | $0.80 |
| Big Dipper Double Fudge Brownie Ice Cream | Frozen | Extra fudge in every scoop! | 2/3 cup (140g) | 330 | 26 | 11 | 85 | 1 | 5 | $1.60 |
| Skinny Swirl Fat-Free Vanilla Frozen Yogurt | Frozen | Fat free! Guilt free! | 2/3 cup (130g) | 160 | 22 | 0 | 75 | 0 | 4 | $1.10 |

The original plan didn't name a brand for some log products, so some were added: Garden Patch (Garden Veggie Crisps), Meadow Valley (Light & Fresh Creamy Ranch), and the Lynx Market store brands. All prices were invented.

## Running it on your computer

The pages load `data/products.json`, so they need a small web server. Opening `index.html` by double-clicking won't work. From the project folder, run either:

```bash
python3 -m http.server 8000
```

```bash
npm start
```

Then open <http://localhost:8000>.

## Deploying

### GitHub Pages (free, simplest)

1. Create a GitHub repository and upload all the files, keeping the folders (`css`, `data`, `img`, `js`, `tools`).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then click **Save**.
4. After a minute or two, the site is live at `https://<your-username>.github.io/<repo-name>/`.

To change numbers later, edit `data/products.json` on GitHub and commit. The site updates by itself within a few minutes. The empty `.nojekyll` file tells GitHub to serve the files exactly as they are.

Note: on GitHub Pages, this README can be opened at `/README.md`. It has no answer key, but if you'd rather students not see the product list, keep the repository private (needs a paid or education plan for Pages) or use Railway.

### Railway

1. Push the project to a GitHub repository (as above).
2. In Railway, click **New Project → Deploy from GitHub repo** and pick the repository.
3. Railway finds `package.json` and runs `npm start`, which starts `server.js`. It has no dependencies and uses the `PORT` Railway provides.
4. In the service's **Settings → Networking**, click **Generate Domain** to get a public link.

`server.js` serves only the site files. It won't serve `server.js`, `package.json`, `tools/` or this README, and it doesn't log visitors.

## Accessibility notes

- Everything works with the keyboard: Tab to a card's **Flip to label** button and press Enter or Space. A skip link jumps past the menu.
- The hidden side of a card is removed from the tab order and from screen readers until it is flipped.
- Each package drawing has a text description, and the label is real text, not an image.
- Animations turn off for anyone who has "reduce motion" switched on.
- Colors were chosen for readable contrast, and the system fonts used are built into Chromebooks and iPads.

## Files

```
index.html  logs.html  mayas-week.html  cart.html  print-labels.html
css/style.css          all styles, including print layouts
js/art.js              hand-drawn SVG package illustrations
js/common.js           data loading, package fronts, Nutrition Facts label, cart storage
js/*.js                one script per page
img/lynx.svg           the Lynx Market mascot
data/products.json     ← all products, logs and personas
tools/check-data.js    data checker
server.js, package.json   tiny server for Railway
```
