/* Lynx Market — hand-drawn package illustrations.
   Each icon is drawn in a 120 x 100 box. "ol" = dark outline, "ac" = the package's accent color.
   Add a new icon here, then use its name in a product's "art.icon" in data/products.json. */
(function () {
  const O = 'class="ol"';

  const wheat = (x, y, s = 1, r = 0) => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M0 0 L0 -46" ${O} fill="none"/>
      ${[-40, -32, -24, -16].map(dy => `
        <ellipse cx="-5" cy="${dy}" rx="4" ry="7" transform="rotate(-25 -5 ${dy})" fill="#e3b552" ${O} style="stroke-width:2"/>
        <ellipse cx="5" cy="${dy}" rx="4" ry="7" transform="rotate(25 5 ${dy})" fill="#e3b552" ${O} style="stroke-width:2"/>`).join("")}
      <ellipse cx="0" cy="-50" rx="3.5" ry="6" fill="#e3b552" ${O} style="stroke-width:2"/>
    </g>`;

  const leaf = (x, y, s = 1, r = 0, c = "#6aa84f") => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M0 0 C 4 -14, 18 -22, 30 -20 C 28 -6, 14 4, 0 0 Z" fill="${c}" ${O} style="stroke-width:2.5"/>
      <path d="M2 -2 C 10 -8, 18 -13, 26 -17" fill="none" ${O} style="stroke-width:1.8"/>
    </g>`;

  const berry = (x, y, r = 7, c = "#4a5fc1") => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${O} style="stroke-width:2.2"/>
    <path d="M${x - 2} ${y - r + 3} l2 2 l2 -2" fill="none" ${O} style="stroke-width:1.5"/>`;

  const strawberry = (x, y, s = 1, r = 0) => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M-12 -6 Q-14 10 0 20 Q14 10 12 -6 Q0 -12 -12 -6 Z" fill="#e63950" ${O}/>
      <path d="M-10 -7 L-4 -14 L0 -8 L4 -14 L10 -7" fill="#5fae4b" ${O} style="stroke-width:2"/>
      ${[[-5, 0], [4, -1], [-1, 7], [6, 8], [-6, 9]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="1" ry="1.6" fill="#ffe08a"/>`).join("")}
    </g>`;

  const bowl = (fillTop, inner = "") => `
    <path d="M18 54 Q26 32 60 32 Q94 32 102 54 Z" fill="${fillTop}" ${O}/>
    ${inner}
    <path d="M14 52 L106 52 Q104 90 60 92 Q16 90 14 52 Z" fill="#fffaf0" ${O}/>
    <path d="M22 66 Q60 74 98 66" fill="none" class="ol ac-stroke" style="stroke-width:5"/>`;

  const bottle = (body, cap, label = "") => `
    <path d="M50 8 L70 8 L70 18 Q80 26 80 40 L80 90 Q80 96 74 96 L46 96 Q40 96 40 90 L40 40 Q40 26 50 18 Z" fill="${body}" ${O}/>
    <rect x="48" y="2" width="24" height="10" rx="3" fill="${cap}" ${O}/>
    ${label}`;

  const ICONS = {
    granola: {
      alt: "a bowl of golden granola clusters next to stalks of wheat and a honey drip",
      svg: () => wheat(14, 92, 0.9, -12) + wheat(104, 92, 0.9, 14) + bowl("#c98b3c",
        [[36, 40], [48, 34], [62, 36], [76, 34], [86, 42], [54, 44], [70, 44], [42, 46], [80, 47]].map(([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="${6 + (i % 3)}" fill="${i % 2 ? "#b8742f" : "#dca35a"}" ${O} style="stroke-width:2"/>`).join("")) +
        `<path d="M60 52 Q57 62 60 68 Q63 62 60 52" fill="#f2b632" ${O} style="stroke-width:2"/>`
    },
    yogurtBerry: {
      alt: "a yogurt cup topped with strawberries and blueberries, with green leaves",
      svg: () => leaf(14, 70, 1, -30) + leaf(106, 70, 1, 210) +
        `<path d="M30 40 L90 40 L82 94 L38 94 Z" fill="#fff" ${O}/>
         <path d="M33 58 L87 58 L84 78 L36 78 Z" class="ac" style="opacity:.85"/>
         <ellipse cx="60" cy="40" rx="30" ry="7" fill="#f7d6e4" ${O}/>` +
        strawberry(48, 28, 0.9, -15) + strawberry(70, 26, 0.9, 12) + berry(60, 34, 6) + berry(82, 34, 5)
    },
    tropical: {
      alt: "a glass of orange juice drink with a pineapple, an orange slice and palm leaves",
      svg: () => leaf(10, 40, 1.2, -70, "#3f8f3a") + leaf(18, 34, 1.1, -40, "#5fae4b") +
        `<path d="M24 40 Q22 92 40 92 Q58 92 56 40 Z" fill="#ffd27a" ${O}/>
         <path d="M28 54 Q40 58 52 54" fill="none" ${O} style="stroke-width:2"/>
         <path d="M48 40 L60 10" ${O} fill="none"/>
         <ellipse cx="88" cy="68" rx="18" ry="24" fill="#f2b632" ${O}/>
         <path d="M76 56 L100 80 M76 80 L100 56 M74 68 L102 68" ${O} style="stroke-width:1.8" fill="none"/>
         <path d="M80 46 L84 30 L88 44 L92 28 L96 46" fill="#3f8f3a" ${O}/>
         <circle cx="58" cy="82" r="14" fill="#ff9f1c" ${O}/>
         <circle cx="58" cy="82" r="9" fill="#ffd166" ${O} style="stroke-width:1.5"/>
         <path d="M58 73 L58 91 M49 82 L67 82" ${O} style="stroke-width:1.2"/>`
    },
    veggieStraws: {
      alt: "colorful veggie crisps spilling out beside a carrot, a tomato and spinach leaves",
      svg: () => leaf(12, 84, 1.2, -50, "#4f9a45") + leaf(100, 86, 1.1, 230, "#4f9a45") +
        [["#f08a24", 30], ["#e94b3c", 44], ["#7cc26b", 58], ["#f08a24", 72], ["#e94b3c", 86]].map(([c, x], i) =>
          `<rect x="${x}" y="${18 + (i % 2) * 8}" width="9" height="56" rx="4" fill="${c}" transform="rotate(${(i - 2) * 9} ${x} 70)" ${O} style="stroke-width:2"/>`).join("") +
        `<path d="M20 92 L36 60 Q42 56 44 62 L28 94 Z" fill="#f08a24" ${O}/>
         <circle cx="94" cy="76" r="12" fill="#e94b3c" ${O}/>
         <path d="M90 64 L94 68 L98 64" fill="#4f9a45" ${O} style="stroke-width:2"/>`
    },
    dressing: {
      alt: "a dressing bottle with an herb label beside fresh lettuce leaves",
      svg: () => leaf(10, 88, 1.4, -60, "#7cc26b") + leaf(108, 88, 1.4, 240, "#5fae4b") +
        bottle("#fffdf5", "#4f9a45", `<rect x="44" y="50" width="32" height="28" rx="4" class="ac" ${O} style="stroke-width:2"/>` + leaf(50, 72, 0.7, -40, "#e9f5df"))
    },
    mountainBar: {
      alt: "a granola-style energy bar in front of green mountains and a rising sun",
      svg: () => `<circle cx="84" cy="34" r="14" fill="#f6c453" ${O}/>
        <path d="M6 76 L36 30 L54 56 L70 38 L114 76 Z" fill="#7fae5c" ${O}/>
        <path d="M30 40 L36 30 L42 40 Z" fill="#fff" ${O} style="stroke-width:2"/>
        <rect x="14" y="66" width="92" height="26" rx="8" fill="#c88a4a" ${O} transform="rotate(-4 60 80)"/>
        ${[[26, 76], [40, 80], [58, 74], [74, 79], [90, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#7a4a22"/>`).join("")}` +
        leaf(4, 64, 0.9, -40)
    },
    pizza: {
      alt: "a pizza slice topped with green peppers, tomatoes and olives next to a wheat stalk",
      svg: () => wheat(16, 96, 0.9, -10) +
        `<path d="M30 20 Q74 6 108 26 L66 96 Z" fill="#f4d58d" ${O}/>
         <path d="M30 20 Q74 6 108 26 L104 33 Q72 16 36 28 Z" fill="#d9a35a" ${O}/>
         <path d="M40 34 Q72 22 98 36 L68 86 Z" fill="#ffe7a3" ${O} style="stroke-width:1.5"/>
         <circle cx="60" cy="42" r="6" fill="#e94b3c" ${O} style="stroke-width:2"/>
         <circle cx="80" cy="44" r="6" fill="#e94b3c" ${O} style="stroke-width:2"/>
         <circle cx="68" cy="64" r="5" fill="#e94b3c" ${O} style="stroke-width:2"/>
         <path d="M52 52 q5 -6 10 0 M74 56 q5 -6 10 0 M62 76 q4 -5 8 0" fill="none" stroke="#3f8f3a" stroke-width="4" stroke-linecap="round"/>
         <circle cx="72" cy="36" r="2.6" fill="#2b2b2b"/><circle cx="58" cy="60" r="2.6" fill="#2b2b2b"/>`
    },
    oats: {
      alt: "a simple bowl of plain oats",
      svg: () => bowl("#e8d6a8", [[36, 42], [50, 38], [64, 38], [78, 40], [88, 46], [44, 48], [58, 46], [72, 47]].map(([x, y], i) =>
        `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" transform="rotate(${i * 25} ${x} ${y})" fill="#f6ead0" ${O} style="stroke-width:1.6"/>`).join(""))
    },
    banana: {
      alt: "a ripe yellow banana",
      svg: () => `<path d="M18 40 Q30 86 98 74 Q104 72 100 66 Q50 72 30 34 Z" fill="#f7d348" ${O}/>
        <path d="M28 46 Q48 70 92 70" fill="none" ${O} style="stroke-width:1.6"/>
        <path d="M30 34 L24 24 L19 27 L24 38" fill="#7a5a2a" ${O} style="stroke-width:2"/>
        <path d="M98 74 L104 70" ${O}/>`
    },
    yogurtTub: {
      alt: "a plain white tub of yogurt with a spoon",
      svg: () => `<path d="M26 34 L94 34 L86 92 L34 92 Z" fill="#fff" ${O}/>
        <ellipse cx="60" cy="34" rx="34" ry="8" fill="#f4f1ea" ${O}/>
        <rect x="32" y="52" width="56" height="18" class="ac"/>
        <path d="M86 6 L70 38" ${O} style="stroke-width:5" stroke="#9aa4ad"/>`
    },
    wrap: {
      alt: "a whole wheat wrap cut in half showing turkey, lettuce and tomato",
      svg: () => `<path d="M14 80 L58 22 Q66 16 72 24 L76 30 L30 92 Q20 94 14 80 Z" fill="#c9965a" ${O}/>
        <ellipse cx="66" cy="27" rx="10" ry="6" transform="rotate(-50 66 27)" fill="#f0c9b0" ${O} style="stroke-width:2"/>
        <path d="M44 88 L88 30 Q96 24 104 32 L106 38 L62 96 Q50 98 44 88 Z" fill="#b8844a" ${O}/>
        <ellipse cx="97" cy="35" rx="11" ry="7" transform="rotate(-50 97 35)" fill="#f0c9b0" ${O}/>
        <path d="M90 32 q4 -4 8 0 q4 4 8 0" fill="none" stroke="#5fae4b" stroke-width="3"/>
        <circle cx="96" cy="40" r="3" fill="#e94b3c"/>`
    },
    carrots: {
      alt: "three baby carrots",
      svg: () => [[24, -18], [52, -6], [80, 8]].map(([x, r]) => `
        <g transform="translate(${x} 20) rotate(${r})">
          <path d="M6 0 Q16 -2 18 6 L12 70 Q11 76 8 70 Z" fill="#f08a24" ${O}/>
          <path d="M8 18 L14 20 M9 34 L15 36 M10 50 L14 51" ${O} style="stroke-width:1.5"/>
        </g>`).join("")
    },
    hummus: {
      alt: "a bowl of smooth hummus swirled with olive oil and chickpeas",
      svg: () => bowl("#e8cf98", `<path d="M40 44 Q60 30 80 44 Q60 50 48 42" fill="none" class="ol" style="stroke-width:2"/>
        <circle cx="60" cy="40" r="3" fill="#d9a35a"/><circle cx="70" cy="43" r="3" fill="#d9a35a"/>`)
    },
    blueberries: {
      alt: "a pile of fresh blueberries",
      svg: () => [[30, 74], [46, 78], [62, 76], [78, 78], [94, 74], [38, 62], [54, 62], [70, 62], [86, 62], [46, 48], [62, 48], [78, 48], [62, 34]].map(([x, y]) => berry(x, y, 9)).join("")
    },
    peanutJar: {
      alt: "a jar of peanut butter with a peanut beside it",
      svg: () => `<rect x="28" y="16" width="56" height="14" rx="4" class="ac" ${O}/>
        <path d="M26 30 L86 30 Q90 30 90 36 L90 88 Q90 94 84 94 L32 94 Q26 94 26 88 L26 36 Q26 30 32 30 Z" fill="#c98a4b" ${O}/>
        <rect x="32" y="48" width="52" height="28" rx="3" fill="#fbf6ea" ${O} style="stroke-width:2"/>
        <path d="M98 64 Q90 70 98 78 Q106 86 112 78 Q118 70 110 64 Q104 58 98 64 Z" fill="#e3b16c" ${O} style="stroke-width:2"/>`
    },
    chicken: {
      alt: "a grilled chicken breast with grill marks",
      svg: () => `<path d="M14 60 Q16 30 54 28 Q96 26 106 52 Q110 76 72 82 Q24 88 14 60 Z" fill="#e1a96a" ${O}/>
        ${[30, 46, 62, 78, 94].map(x => `<path d="M${x - 8} 40 L${x + 4} 74" stroke="#7a4a22" stroke-width="4" stroke-linecap="round"/>`).join("")}`
    },
    rice: {
      alt: "a bowl of cooked brown rice",
      svg: () => bowl("#c9a77a", Array.from({ length: 18 }, (_, i) => {
        const x = 30 + (i % 6) * 12, y = 40 + Math.floor(i / 6) * 5 - (i % 6 === 2 || i % 6 === 3 ? 4 : 0);
        return `<ellipse cx="${x}" cy="${y}" rx="4" ry="2" transform="rotate(${i * 37} ${x} ${y})" fill="#f2e2c4" ${O} style="stroke-width:1"/>`;
      }).join(""))
    },
    broccoli: {
      alt: "a head of green broccoli",
      svg: () => `<path d="M50 60 L46 94 L74 94 L70 60 Z" fill="#9ccc65" ${O}/>
        ${[[36, 46, 16], [60, 34, 20], [84, 46, 16], [48, 58, 14], [72, 58, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4f9a45" ${O}/>`).join("")}
        ${[[54, 28], [66, 38], [40, 46], [80, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#7cc26b"/>`).join("")}`
    },
    bagel: {
      alt: "a seeded multigrain bagel next to a wheat stalk",
      svg: () => wheat(100, 96, 0.9, 12) +
        `<ellipse cx="54" cy="58" rx="42" ry="32" fill="#b97a3a" ${O}/>
         <ellipse cx="54" cy="54" rx="40" ry="28" fill="#cf9150" ${O} style="stroke-width:1.5"/>
         <ellipse cx="54" cy="56" rx="12" ry="8" fill="var(--pk-bg)" ${O}/>
         ${[[30, 44], [40, 36], [64, 34], [76, 44], [30, 66], [76, 66], [52, 76], [44, 70], [66, 72]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="2.5" ry="1.4" transform="rotate(${i * 40} ${x} ${y})" fill="${i % 2 ? "#f6ead0" : "#5a3a1a"}"/>`).join("")}`
    },
    comet: {
      alt: "a cartoon chocolate comet flying past stars, with cereal pieces",
      svg: () => `<path d="M10 90 Q40 60 70 46 L76 58 Q46 70 10 90 Z" fill="#ffcc33" ${O} style="stroke-width:2"/>
        <path d="M14 76 Q40 54 66 42" fill="none" stroke="#ff8f3c" stroke-width="4" stroke-linecap="round"/>
        <circle cx="80" cy="42" r="20" fill="#7a4a2b" ${O}/>
        <circle cx="74" cy="38" r="3" fill="#fff"/><circle cx="86" cy="38" r="3" fill="#fff"/>
        <path d="M74 48 Q80 54 86 48" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        ${[[24, 22], [102, 16], [104, 78], [44, 36]].map(([x, y]) => `<path d="M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z" fill="#fff6c2"/>`).join("")}
        ${[[50, 86], [66, 90], [82, 84], [96, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#5a3218" ${O} style="stroke-width:1.5"/>`).join("")}`
    },
    mapleBowl: {
      alt: "a bowl of oatmeal with a maple leaf and a heart",
      svg: () => bowl("#e3c48a", `<path d="M44 40 Q60 30 76 40" fill="none" stroke="#a0521d" stroke-width="4" stroke-linecap="round"/>`) +
        `<path d="M94 10 L98 22 L108 16 L104 28 L114 30 L102 36 L106 44 L94 40 L90 46 L88 36 L78 34 L86 28 L82 18 L92 22 Z" fill="#d9572b" ${O} style="stroke-width:2"/>
         <path d="M16 22 Q16 14 23 15 Q28 16 28 22 Q28 16 33 15 Q40 14 40 22 Q40 30 28 38 Q16 30 16 22 Z" fill="#e94b3c" ${O} style="stroke-width:2"/>`
    },
    eggs: {
      alt: "two peeled hard-boiled eggs, one cut in half",
      svg: () => `<ellipse cx="40" cy="58" rx="22" ry="28" fill="#fffdf5" ${O}/>
        <ellipse cx="82" cy="64" rx="24" ry="22" fill="#fffdf5" ${O}/>
        <circle cx="82" cy="64" r="11" fill="#f6c453" ${O} style="stroke-width:2"/>`
    },
    milk: {
      alt: "a carton of milk next to a glass of milk",
      svg: () => `<path d="M24 30 L44 14 L64 30 L64 94 L24 94 Z" fill="#fff" ${O}/>
        <path d="M24 30 L64 30" ${O}/>
        <rect x="28" y="48" width="32" height="22" class="ac"/>
        <path d="M76 44 L104 44 L100 94 L80 94 Z" fill="#fff" ${O}/>
        <path d="M78 58 L102 58" ${O} style="stroke-width:1.5"/>`
    },
    chocMilk: {
      alt: "a bottle of chocolate milk with cow spots and a splash",
      svg: () => bottle("#9a6440", "#f2c14e", `<ellipse cx="52" cy="50" rx="6" ry="5" fill="#fff"/><ellipse cx="68" cy="66" rx="7" ry="6" fill="#fff"/><ellipse cx="50" cy="80" rx="5" ry="4" fill="#fff"/>`) +
        `<path d="M86 30 Q96 20 104 30 Q112 40 100 46 Q108 52 98 58" fill="none" stroke="#c98b5c" stroke-width="5" stroke-linecap="round"/>`
    },
    cheeseStick: {
      alt: "a stick of mozzarella string cheese peeled into strings",
      svg: () => `<rect x="20" y="40" width="70" height="20" rx="10" fill="#fff8e1" ${O} transform="rotate(-20 55 50)"/>
        <path d="M86 32 Q100 40 104 60 M88 36 Q96 50 96 66 M84 40 Q90 56 86 72" fill="none" ${O} style="stroke-width:2.5"/>`
    },
    smoothie: {
      alt: "a bottle of green smoothie surrounded by spinach leaves and a carrot",
      svg: () => leaf(8, 70, 1.3, -60, "#4f9a45") + leaf(110, 70, 1.3, 240, "#7cc26b") + leaf(16, 40, 1, -30, "#5fae4b") +
        bottle("#8cc56a", "#3f8f3a", `<rect x="44" y="50" width="32" height="30" rx="5" fill="#f4fbea" ${O} style="stroke-width:2"/>` + leaf(52, 74, 0.6, -40, "#3f8f3a")) +
        `<path d="M86 96 L104 64 Q108 60 110 66 L94 98 Z" fill="#f08a24" ${O} style="stroke-width:2"/>`
    },
    sportDrop: {
      alt: "a giant blue water drop with a lightning bolt",
      svg: () => `<path d="M60 6 Q30 46 30 66 Q30 94 60 94 Q90 94 90 66 Q90 46 60 6 Z" fill="#7ef0ff" ${O}/>
        <path d="M64 30 L48 64 L60 64 L54 86 L74 52 L62 52 L70 30 Z" fill="#ffe14d" ${O} style="stroke-width:2.5"/>
        <path d="M10 40 L24 40 M6 54 L22 54 M98 40 L112 40 M100 54 L116 54" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`
    },
    bubbles: {
      alt: "a can of sparkling water with bubbles and a lime slice",
      svg: () => `<rect x="34" y="14" width="44" height="80" rx="8" fill="#e8f4f2" ${O}/>
        <rect x="34" y="40" width="44" height="26" class="ac"/>
        <circle cx="94" cy="72" r="16" fill="#9ccc65" ${O}/><circle cx="94" cy="72" r="11" fill="#d7ec9e" ${O} style="stroke-width:1.5"/>
        ${[[20, 30, 5], [16, 54, 3], [24, 72, 4], [92, 30, 4], [100, 46, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" ${O} style="stroke-width:2"/>`).join("")}`
    },
    orange: {
      alt: "two oranges and a glass of orange juice",
      svg: () => `<path d="M60 30 L90 30 L86 94 L64 94 Z" fill="#ffb347" ${O}/>
        <circle cx="34" cy="70" r="22" fill="#ff9f1c" ${O}/><path d="M34 48 L38 40" ${O}/>` + leaf(38, 44, 0.6, -30, "#4f9a45")
    },
    gummies: {
      alt: "a pouch of red fruit gummies shaped like strawberries, with a real strawberry and leaves",
      svg: () => leaf(8, 90, 1.2, -50, "#4f9a45") + strawberry(92, 34, 1.4, 15) +
        [[30, 40, "#e63950"], [52, 34, "#ff6f91"], [40, 60, "#ff9f1c"], [62, 58, "#e63950"], [30, 80, "#ff6f91"], [56, 80, "#e63950"], [80, 72, "#ff9f1c"]].map(([x, y, c]) =>
          `<path d="M${x} ${y - 9} Q${x + 11} ${y - 10} ${x + 9} ${y + 2} Q${x + 4} ${y + 11} ${x} ${y + 9} Q${x - 4} ${y + 11} ${x - 9} ${y + 2} Q${x - 11} ${y - 10} ${x} ${y - 9} Z" fill="${c}" ${O} style="stroke-width:2"/>`).join("")
    },
    puffs: {
      alt: "a puffy cloud surrounded by orange cheese puffs",
      svg: () => `<path d="M24 56 Q14 36 36 32 Q42 14 62 22 Q78 10 90 28 Q110 30 102 52 Q108 64 90 64 L36 64 Q18 66 24 56 Z" fill="#fff" ${O}/>` +
        [[20, 80, 0], [44, 86, 30], [70, 82, -20], [96, 84, 50], [56, 72, 80]].map(([x, y, r]) =>
          `<path d="M${x - 12} ${y} Q${x - 10} ${y - 8} ${x} ${y - 6} Q${x + 12} ${y - 9} ${x + 12} ${y} Q${x + 10} ${y + 8} ${x} ${y + 6} Q${x - 12} ${y + 8} ${x - 12} ${y} Z" transform="rotate(${r} ${x} ${y})" fill="#ff8c1a" ${O} style="stroke-width:2"/>`).join("")
    },
    almonds: {
      alt: "a handful of almonds",
      svg: () => [[30, 40, -20], [56, 34, 10], [84, 40, 35], [40, 66, 60], [66, 62, -30], [92, 70, 15], [54, 86, 80]].map(([x, y, r]) =>
        `<path d="M${x} ${y - 14} Q${x + 12} ${y - 2} ${x} ${y + 14} Q${x - 12} ${y - 2} ${x} ${y - 14} Z" transform="rotate(${r} ${x} ${y})" fill="#b97a3a" ${O} style="stroke-width:2"/>`).join("")
    },
    trailMix: {
      alt: "a trail through green hills with nuts, raisins and chocolate candies in front",
      svg: () => `<path d="M0 60 Q30 30 60 50 Q90 30 120 56 L120 66 L0 66 Z" fill="#a8b98a" ${O}/>
        <path d="M52 66 Q60 54 66 50" fill="none" stroke="#f1e3c4" stroke-width="5"/>` + leaf(90, 40, 0.8, -30) +
        [[18, 80, "#d9a35a"], [36, 86, "#5a3218"], [54, 80, "#e63950"], [72, 88, "#d9a35a"], [88, 80, "#3a7bd5"], [104, 88, "#5a3218"], [28, 96, "#ffcc33"], [62, 96, "#d9a35a"], [94, 98, "#e63950"]].map(([x, y, c]) =>
          `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="${c}" ${O} style="stroke-width:2"/>`).join("")
    },
    crackers: {
      alt: "golden cracker sandwiches filled with sunflower butter, next to a sunflower",
      svg: () => `<g transform="translate(92 34)">${Array.from({ length: 10 }, (_, i) => `<ellipse cx="0" cy="-14" rx="5" ry="11" transform="rotate(${i * 36})" fill="#ffd23f" ${O} style="stroke-width:1.5"/>`).join("")}<circle r="9" fill="#7a4a22" ${O}/></g>` +
        [[36, 52], [50, 76]].map(([x, y]) => `
          <rect x="${x - 26}" y="${y - 14}" width="52" height="10" rx="4" fill="#e8b04a" ${O} style="stroke-width:2"/>
          <rect x="${x - 23}" y="${y - 4}" width="46" height="6" fill="#a8743c"/>
          <rect x="${x - 26}" y="${y + 2}" width="52" height="10" rx="4" fill="#e8b04a" ${O} style="stroke-width:2"/>`).join("")
    },
    chickpeas: {
      alt: "roasted chickpeas with a red chili pepper and a lime wedge",
      svg: () => `<path d="M72 20 Q104 24 104 62 Q102 72 96 64 Q94 36 70 30 Z" fill="#e63950" ${O}/>
        <path d="M70 30 Q64 22 70 14" fill="none" stroke="#4f9a45" stroke-width="4" stroke-linecap="round"/>
        <path d="M14 30 L46 30 A16 16 0 0 1 14 30 Z" fill="#9ccc65" ${O} style="stroke-width:2"/>` +
        [[24, 62], [40, 70], [56, 62], [34, 84], [52, 84], [70, 80], [88, 88], [18, 82]].map(([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="8" fill="#d9a35a" ${O} style="stroke-width:2"/><path d="M${x - 2} ${y - 6} Q${x + 2} ${y} ${x - 1} ${y + 6}" fill="none" ${O} style="stroke-width:1.2"/>`).join("")
    },
    cookie: {
      alt: "two chocolate chip cookies",
      svg: () => [[42, 56, 30], [86, 66, 24]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#d9a35a" ${O}/>` +
        [[-10, -10], [8, -12], [12, 6], [-6, 10], [0, -2]].map(([a, b]) => `<ellipse cx="${x + a * r / 26}" cy="${y + b * r / 26}" rx="4" ry="3" fill="#4a2a12"/>`).join("")).join("")
    },
    chocolate: {
      alt: "squares of dark chocolate under a crescent moon",
      svg: () => `<path d="M92 10 Q72 20 78 40 Q86 56 106 50 Q90 60 76 50 Q60 34 74 16 Q82 10 92 10 Z" fill="#f5e9d0" ${O} style="stroke-width:2"/>
        <g transform="rotate(-8 50 66)">${[0, 1, 2].map(c => [0, 1].map(r => `<rect x="${18 + c * 24}" y="${48 + r * 22}" width="22" height="20" rx="3" fill="#4a2a1a" ${O} style="stroke-width:2"/>`).join("")).join("")}</g>`
    },
    burritoBowl: {
      alt: "a burrito bowl with black beans, rice, corn and a red chili pepper",
      svg: () => bowl("#f2e2c4", [[38, 42, "#2b2b2b"], [46, 46, "#2b2b2b"], [42, 38, "#2b2b2b"], [70, 40, "#ffd23f"], [76, 44, "#ffd23f"], [66, 46, "#ffd23f"], [56, 36, "#e94b3c"], [86, 46, "#5fae4b"]].map(([x, y, c]) =>
        `<circle cx="${x}" cy="${y}" r="4" fill="${c}" ${O} style="stroke-width:1.2"/>`).join("")) +
        `<path d="M88 6 Q112 10 110 36 Q108 42 104 36 Q102 18 86 14 Z" fill="#e63950" ${O} style="stroke-width:2"/>`
    },
    tofu: {
      alt: "cubes of tofu stir-fried with vegetables and a little flame for spicy",
      svg: () => `<path d="M10 58 L110 58 Q104 90 60 92 Q16 90 10 58 Z" fill="#2b2b2b" ${O}/>
        <path d="M110 58 L118 52" ${O} style="stroke-width:5"/>
        ${[[30, 50], [50, 46], [70, 50], [40, 36]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="14" rx="2" fill="#f6ead0" ${O} style="stroke-width:2"/>`).join("")}
        <circle cx="88" cy="50" r="6" fill="#e94b3c" ${O} style="stroke-width:2"/>
        <path d="M64 40 q5 -6 10 0" fill="none" stroke="#5fae4b" stroke-width="4" stroke-linecap="round"/>
        <path d="M92 10 Q104 24 98 34 Q92 40 86 34 Q82 26 92 10 Z" fill="#ff8c1a" ${O} style="stroke-width:2"/>`
    },
    fish: {
      alt: "a salmon fillet with a lemon slice",
      svg: () => `<path d="M10 60 Q30 30 70 36 Q100 40 104 60 Q100 80 70 84 Q30 88 10 60 Z" fill="#f4927a" ${O}/>
        ${[34, 50, 66, 82].map(x => `<path d="M${x} 42 Q${x + 6} 60 ${x} 80" fill="none" stroke="#fff4ef" stroke-width="3"/>`).join("")}
        <circle cx="96" cy="26" r="14" fill="#ffe14d" ${O}/><circle cx="96" cy="26" r="9" fill="#fff6b0" ${O} style="stroke-width:1.5"/>`
    },
    apple: {
      alt: "a red and yellow apple with a leaf",
      svg: () => `<path d="M60 30 Q40 18 26 34 Q12 54 26 76 Q40 98 60 86 Q80 98 94 76 Q108 54 94 34 Q80 18 60 30 Z" fill="#e94b3c" ${O}/>
        <path d="M36 44 Q32 54 36 62" fill="none" stroke="#ffd166" stroke-width="5" stroke-linecap="round"/>
        <path d="M60 30 Q60 18 66 10" ${O} fill="none"/>` + leaf(64, 20, 0.8, -20, "#4f9a45")
    },
    greens: {
      alt: "a pile of mixed salad leaves",
      svg: () => leaf(14, 80, 2, -40, "#4f9a45") + leaf(40, 88, 2, -70, "#7cc26b") + leaf(104, 84, 2, 220, "#5fae4b") + leaf(80, 90, 1.8, 250, "#8e3b5a") + leaf(54, 70, 1.6, -100, "#9ccc65")
    },
    beans: {
      alt: "a can of black beans with beans spilling out",
      svg: () => `<rect x="20" y="20" width="50" height="70" rx="6" fill="#fff" ${O}/>
        <ellipse cx="45" cy="20" rx="25" ry="6" fill="#d8d8d8" ${O}/>
        <rect x="20" y="40" width="50" height="28" class="ac"/>
        ${[[82, 80], [96, 74], [90, 90], [104, 88], [78, 94]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" transform="rotate(${i * 30} ${x} ${y})" fill="#2b2b2b" ${O} style="stroke-width:1.5"/>`).join("")}`
    },
    bread: {
      alt: "a slice of whole wheat bread",
      svg: () => `<path d="M30 92 L30 42 Q14 40 16 24 Q20 8 60 8 Q100 8 104 24 Q106 40 90 42 L90 92 Z" fill="#a8743c" ${O}/>
        <path d="M36 86 L36 40 Q22 36 24 26 Q28 14 60 14 Q92 14 96 26 Q98 36 84 40 L84 86 Z" fill="#d9b07a" ${O} style="stroke-width:1.5"/>
        ${[[48, 30], [70, 40], [56, 60], [44, 74], [72, 72]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1.2" fill="#7a4a22"/>`).join("")}`
    },
    nuggets: {
      alt: "golden crispy chicken nuggets",
      svg: () => [[30, 50, 0], [64, 40, 20], [92, 56, -15], [44, 78, 35], [78, 80, -30]].map(([x, y, r]) =>
        `<path d="M${x - 16} ${y} Q${x - 14} ${y - 14} ${x} ${y - 12} Q${x + 18} ${y - 14} ${x + 16} ${y + 2} Q${x + 14} ${y + 14} ${x} ${y + 12} Q${x - 18} ${y + 12} ${x - 16} ${y} Z" transform="rotate(${r} ${x} ${y})" fill="#e8a33d" ${O}/>
         <circle cx="${x - 4}" cy="${y - 3}" r="1.5" fill="#a0601a"/><circle cx="${x + 5}" cy="${y + 3}" r="1.5" fill="#a0601a"/>`).join("")
    },
    veggieBurger: {
      alt: "a veggie burger patty on a bun with lettuce and tomato",
      svg: () => `<path d="M16 46 Q16 14 60 14 Q104 14 104 46 Z" fill="#e8a33d" ${O}/>
        <path d="M12 50 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0" fill="#7cc26b" ${O} style="stroke-width:2"/>
        <rect x="14" y="52" width="92" height="8" rx="3" fill="#e94b3c" ${O} style="stroke-width:2"/>
        <rect x="12" y="60" width="96" height="16" rx="7" fill="#6b3a1c" ${O}/>
        <path d="M16 78 L104 78 Q104 92 60 92 Q16 92 16 78 Z" fill="#e8a33d" ${O}/>
        ${[[40, 26], [60, 22], [80, 28]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.5" ry="1.4" fill="#fff6e0"/>`).join("")}`
    },
    edamame: {
      alt: "green edamame pods and beans",
      svg: () => [[34, 40, -20], [70, 60, 15]].map(([x, y, r]) => `
        <g transform="rotate(${r} ${x} ${y})">
          <path d="M${x - 30} ${y} Q${x - 30} ${y - 14} ${x - 14} ${y - 12} Q${x} ${y - 18} ${x + 14} ${y - 12} Q${x + 30} ${y - 14} ${x + 30} ${y} Q${x + 30} ${y + 12} ${x} ${y + 10} Q${x - 30} ${y + 12} ${x - 30} ${y} Z" fill="#7cc26b" ${O}/>
          ${[-16, 0, 16].map(d => `<circle cx="${x + d}" cy="${y - 1}" r="6" fill="#a8d672" ${O} style="stroke-width:1.5"/>`).join("")}
        </g>`).join("") + [[92, 26], [104, 36], [20, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#a8d672" ${O} style="stroke-width:2"/>`).join("")
    },
    popsicle: {
      alt: "a strawberry fruit bar on a stick with fresh strawberries",
      svg: () => `<rect x="54" y="74" width="10" height="24" rx="4" fill="#e8c38a" ${O}/>
        <path d="M38 22 Q38 6 59 6 Q80 6 80 22 L80 74 Q80 78 76 78 L42 78 Q38 78 38 74 Z" fill="#ff6f91" ${O}/>
        ${[[50, 30], [66, 40], [52, 56], [68, 64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="2" fill="#ffe08a"/>`).join("")}` +
        strawberry(18, 70, 1.1, -15) + strawberry(100, 66, 1.1, 18)
    },
    iceCream: {
      alt: "a bowl of chocolate ice cream with fudge drips and brownie chunks",
      svg: () => `<circle cx="42" cy="40" r="22" fill="#6b3a1c" ${O}/><circle cx="76" cy="38" r="22" fill="#7a4a2b" ${O}/><circle cx="60" cy="22" r="18" fill="#5a3218" ${O}/>
        <path d="M30 26 Q36 34 40 26 Q44 40 50 28 M68 22 Q72 34 78 24 Q82 36 88 28" fill="none" stroke="#2b1408" stroke-width="4" stroke-linecap="round"/>
        <rect x="52" y="30" width="10" height="9" fill="#3a1d0c" transform="rotate(20 57 34)"/>
        <path d="M14 56 L106 56 Q100 92 60 94 Q20 92 14 56 Z" fill="#ff8fab" ${O}/>`
    },
    froyo: {
      alt: "a tall swirl of vanilla frozen yogurt in a cup with mint leaves",
      svg: () => `<path d="M34 54 L86 54 L78 96 L42 96 Z" fill="#fff" ${O}/>
        <rect x="38" y="66" width="44" height="12" class="ac"/>
        <path d="M30 54 Q28 42 44 40 Q36 30 50 24 Q48 12 60 8 Q72 12 70 24 Q84 30 76 40 Q92 42 90 54 Z" fill="#fffaf0" ${O}/>
        <path d="M40 46 Q60 40 80 46 M48 32 Q60 28 72 32" fill="none" ${O} style="stroke-width:1.8"/>` +
        leaf(70, 12, 0.8, -30, "#4f9a6a") + leaf(12, 80, 1, -50, "#7cc26b")
    },
    box: {
      alt: "a simple food package",
      svg: () => `<rect x="30" y="16" width="60" height="76" rx="6" class="ac" ${O}/>`
    }
  };

  function iconSVG(name) {
    const icon = ICONS[name] || ICONS.box;
    return `<svg viewBox="0 0 120 100" aria-hidden="true" focusable="false">${icon.svg()}</svg>`;
  }
  function iconAlt(name) {
    return (ICONS[name] || ICONS.box).alt;
  }

  window.LynxArt = { iconSVG, iconAlt, ICONS };
})();
