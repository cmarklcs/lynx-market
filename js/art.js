/* Lynx Market — package art.
   Two parts:
   1. PACKS: realistic package shapes (box, chip bag, bottle, carton, cup, jar, can, deli tray …).
      Set a product's "art.pack" in data/products.json to pick one.
   2. ICONS: the food picture printed on the package (or seen through a clear lid).
      Set "art.icon" to pick one.
   Everything is drawn here as SVG — no photos, no real brands. */
(function () {
  /* ---------- Shared gradients (one hidden <svg> per page) ---------- */
  const DEFS = `
    <linearGradient id="lx-cyl" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".1" stop-color="#000" stop-opacity=".08"/>
      <stop offset=".28" stop-color="#fff" stop-opacity=".32"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".82" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".34"/>
    </linearGradient>
    <linearGradient id="lx-flat" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".14"/>
    </linearGradient>
    <radialGradient id="lx-pillow" cx=".42" cy=".38" r=".75">
      <stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".3"/>
    </radialGradient>
    <linearGradient id="lx-gloss" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lx-foil" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f4f4f4"/><stop offset=".4" stop-color="#c9ccd1"/><stop offset=".7" stop-color="#eef0f2"/><stop offset="1" stop-color="#a9adb3"/>
    </linearGradient>
    <linearGradient id="lx-metal" x1="0" x2="1">
      <stop offset="0" stop-color="#8d9298"/><stop offset=".3" stop-color="#e9ecef"/><stop offset=".6" stop-color="#b6bbc1"/><stop offset="1" stop-color="#7d8288"/>
    </linearGradient>
    <linearGradient id="lx-foam" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcdfe3"/>
    </linearGradient>
    <linearGradient id="lx-clear" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/>
      <stop offset=".7" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/>
    </linearGradient>
    <radialGradient id="lx-ground" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lx-round" cx=".35" cy=".3" r=".75">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".35"/>
    </radialGradient>
    <linearGradient id="lx-banana" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset=".6" stop-color="#f5cf2f"/><stop offset="1" stop-color="#d9a91a"/></linearGradient>
    <linearGradient id="lx-carrot" x1="0" x2="1"><stop offset="0" stop-color="#ffa04a"/><stop offset=".5" stop-color="#f27d1c"/><stop offset="1" stop-color="#c95a0a"/></linearGradient>
    <linearGradient id="lx-crust" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9a05a"/><stop offset="1" stop-color="#9c6127"/></linearGradient>
    <linearGradient id="lx-grill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f0c48c"/><stop offset="1" stop-color="#c88a4c"/></linearGradient>
    <linearGradient id="lx-salmon" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffa48a"/><stop offset="1" stop-color="#e86f50"/></linearGradient>
    <linearGradient id="lx-leaf" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8cc965"/><stop offset="1" stop-color="#3f8a35"/></linearGradient>
    <linearGradient id="lx-choc" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7a4a2b"/><stop offset="1" stop-color="#3e2210"/></linearGradient>
    <linearGradient id="lx-milk" x1="0" x2="1"><stop offset="0" stop-color="#e9eef2"/><stop offset=".4" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe5ea"/></linearGradient>`;
  function injectDefs() {
    if (document.getElementById("lx-defs")) return;
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.id = "lx-defs";
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
    s.innerHTML = `<defs>${DEFS}</defs>`;
    document.body.prepend(s);
  }
  if (document.body) injectDefs(); else document.addEventListener("DOMContentLoaded", injectDefs);

  /* ---------- Food pictures (120 x 100 box). "ol" = soft outline. ---------- */
  const O = 'class="ol"';
  const shine = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45"/>`;

  const wheat = (x, y, s = 1, r = 0) => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M0 0 L0 -46" stroke="#b88a3a" stroke-width="2" fill="none"/>
      ${[-40, -32, -24, -16].map(dy => `
        <ellipse cx="-4.5" cy="${dy}" rx="3.6" ry="6.5" transform="rotate(-25 -4.5 ${dy})" fill="#e2b45a"/>
        <ellipse cx="4.5" cy="${dy}" rx="3.6" ry="6.5" transform="rotate(25 4.5 ${dy})" fill="#d6a446"/>`).join("")}
      <ellipse cx="0" cy="-50" rx="3.2" ry="6" fill="#e2b45a"/>
    </g>`;
  const leaf = (x, y, s = 1, r = 0, c = "url(#lx-leaf)") => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M0 0 C 4 -14, 18 -22, 30 -20 C 28 -6, 14 4, 0 0 Z" fill="${c}"/>
      <path d="M2 -2 C 10 -8, 18 -13, 26 -17" fill="none" stroke="#2f6d2a" stroke-opacity=".5" stroke-width="1.2"/>
    </g>`;
  const berry = (x, y, r = 7) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="#3d4f9e"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#lx-round)"/>
    <path d="M${x - 2} ${y - r + 2.5} l2 1.6 l2 -1.6" fill="none" stroke="#1d2659" stroke-width="1.1"/>`;
  const strawberry = (x, y, s = 1, r = 0) => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M-12 -6 Q-14 10 0 20 Q14 10 12 -6 Q0 -12 -12 -6 Z" fill="#d92a3d"/>
      <path d="M-12 -6 Q-14 10 0 20 Q14 10 12 -6 Q0 -12 -12 -6 Z" fill="url(#lx-round)"/>
      <path d="M-10 -7 L-4 -13 L0 -8 L4 -13 L10 -7 Q0 -3 -10 -7Z" fill="#4f9a3b"/>
      ${[[-5, 0], [4, -1], [-1, 7], [6, 8], [-6, 9], [1, 13]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx=".9" ry="1.4" fill="#ffe08a"/>`).join("")}
    </g>`;
  const glass = (liquid, x = 38, y = 14, w = 44, h = 80, fill = 0.82) => {
    const top = y + h * (1 - fill);
    return `<ellipse cx="${x + w / 2}" cy="${y + h + 2}" rx="${w / 2}" ry="4" fill="url(#lx-ground)"/>
      <path d="M${x + 2.5} ${top} L${x + w - 2.5} ${top} L${x + w - 6} ${y + h - 1} L${x + 6} ${y + h - 1} Z" fill="${liquid}"/>
      <ellipse cx="${x + w / 2}" cy="${top}" rx="${w / 2 - 2.5}" ry="3" fill="${liquid}"/><ellipse cx="${x + w / 2}" cy="${top}" rx="${w / 2 - 2.5}" ry="3" fill="#fff" opacity=".25"/>
      <path d="M${x} ${y} L${x + w} ${y} L${x + w - 5} ${y + h} L${x + 5} ${y + h} Z" fill="url(#lx-clear)" stroke="#000" stroke-opacity=".22" stroke-width="1"/>
      <path d="M${x + 6} ${y + 6} L${x + 10} ${y + h - 8}" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`;
  };
  const bowl = (fillTop, inner = "", rim = "#f7f4ee") => `
    <ellipse cx="60" cy="94" rx="40" ry="5" fill="url(#lx-ground)"/>
    <path d="M18 54 Q26 34 60 34 Q94 34 102 54 Z" fill="${fillTop}"/>
    ${inner}
    <path d="M14 52 L106 52 Q104 90 60 92 Q16 90 14 52 Z" fill="${rim}"/>
    <path d="M14 52 L106 52 Q104 90 60 92 Q16 90 14 52 Z" fill="url(#lx-cyl)" opacity=".7"/>
    <path d="M14 52 L106 52" stroke="#000" stroke-opacity=".12" stroke-width="1.5"/>`;
  const dots = (pts, r, c) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("");

  const ICONS = {
    granola: {
      alt: "a bowl of golden granola clusters next to stalks of wheat",
      svg: () => wheat(12, 94, 0.85, -12) + wheat(108, 94, 0.85, 14) + bowl("#c98b3c",
        [[36, 42], [48, 36], [62, 37], [76, 36], [86, 43], [54, 45], [70, 45], [42, 47], [80, 48]].map(([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="${6 + (i % 3)}" fill="${i % 2 ? "#b06f2d" : "#d9a35a"}"/><circle cx="${x}" cy="${y}" r="${6 + (i % 3)}" fill="url(#lx-round)" opacity=".6"/>`).join(""))
    },
    berryMix: {
      alt: "fresh strawberries and blueberries with a spoonful of creamy yogurt",
      svg: () => `<ellipse cx="60" cy="92" rx="46" ry="6" fill="url(#lx-ground)"/>
        <path d="M20 80 Q22 52 52 50 Q66 40 80 52 Q102 54 100 80 Q60 92 20 80 Z" fill="#fbf3f6"/>
        <path d="M30 70 Q60 60 90 70" fill="none" stroke="#e8c9d6" stroke-width="3"/>` +
        strawberry(40, 42, 1.25, -18) + strawberry(76, 38, 1.2, 14) + berry(58, 54, 7) + berry(92, 60, 6.5) + berry(26, 62, 6) + leaf(84, 24, .7, -20)
    },
    tropicalFruit: {
      alt: "slices of pineapple, mango and orange",
      svg: () => `<ellipse cx="60" cy="94" rx="48" ry="5" fill="url(#lx-ground)"/>
        <g transform="translate(8 0)"><path d="M18 28 L26 6 L30 26 L36 4 L38 28 Z" fill="url(#lx-leaf)"/>
        <ellipse cx="30" cy="58" rx="20" ry="32" fill="#f2b632"/><ellipse cx="30" cy="58" rx="20" ry="32" fill="url(#lx-round)" opacity=".6"/>
        <path d="M14 42 L46 74 M14 74 L46 42 M12 58 L48 58" stroke="#b07a12" stroke-opacity=".5" stroke-width="1.4"/></g>
        <path d="M64 76 Q60 46 84 40 Q108 40 108 66 Q104 88 80 90 Q66 90 64 76Z" fill="#ffab2e"/><path d="M64 76 Q60 46 84 40 Q108 40 108 66 Q104 88 80 90 Q66 90 64 76Z" fill="url(#lx-round)" opacity=".6"/>
        <circle cx="62" cy="80" r="14" fill="#ff8c1a"/><circle cx="62" cy="80" r="11.5" fill="#ffc35c"/>
        ${[0, 45, 90, 135].map(a => `<path d="M62 80 l${(11 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(11 * Math.sin(a * Math.PI / 180)).toFixed(1)} M62 80 l${(-11 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(-11 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="#ffe0a3" stroke-width="1.2"/>`).join("")}`
    },
    veggieStraws: {
      alt: "colorful veggie crisps beside a carrot, a tomato and spinach leaves",
      svg: () => leaf(10, 88, 1.1, -50) + leaf(100, 90, 1.05, 230) +
        [["#f08a24", 30], ["#e2513f", 44], ["#86c46b", 58], ["#f5b641", 72], ["#e2513f", 86]].map(([c, x], i) =>
          `<g transform="rotate(${(i - 2) * 9} ${x} 70)"><rect x="${x}" y="${18 + (i % 2) * 8}" width="9" height="56" rx="4" fill="${c}"/><rect x="${x}" y="${18 + (i % 2) * 8}" width="9" height="56" rx="4" fill="url(#lx-cyl)"/></g>`).join("") +
        `<path d="M18 94 L34 62 Q40 57 43 63 L27 96 Z" fill="url(#lx-carrot)"/>
         <circle cx="94" cy="78" r="12" fill="#d9372a"/><circle cx="94" cy="78" r="12" fill="url(#lx-round)"/>
         <path d="M89 67 L94 70 L99 67" fill="#4f9a3b"/>`
    },
    saladDrizzle: {
      alt: "a bowl of green salad drizzled with creamy white dressing",
      svg: () => bowl("#5e9e45", leaf(26, 50, 1.1, -40) + leaf(52, 44, 1, -80, "#7cbf55") + leaf(92, 50, 1.1, 220) + leaf(72, 46, 1, -120, "#5fa542") +
        `<circle cx="44" cy="40" r="5" fill="#e0412f"/><circle cx="80" cy="40" r="5" fill="#e0412f"/>
         <path d="M28 40 Q40 32 50 42 Q60 30 72 40 Q84 32 94 42" fill="none" stroke="#fffdf4" stroke-width="5" stroke-linecap="round"/>`)
    },
    barChunk: {
      alt: "a chewy oat bar dipped in chocolate, broken in half, with peanuts",
      svg: () => `<ellipse cx="60" cy="90" rx="50" ry="6" fill="url(#lx-ground)"/>
        <g transform="rotate(-8 40 60)"><rect x="6" y="48" width="58" height="30" rx="6" fill="#c99456"/>
          ${dots([[14, 56], [24, 62], [34, 54], [44, 64], [54, 56], [18, 70], [40, 72]], 3, "#e8c48c")}
          <rect x="6" y="70" width="58" height="10" rx="4" fill="url(#lx-choc)"/><rect x="6" y="48" width="58" height="30" rx="6" fill="url(#lx-flat)"/></g>
        <g transform="rotate(10 86 56)"><rect x="66" y="40" width="44" height="30" rx="6" fill="#c99456"/>
          ${dots([[74, 48], [84, 56], [96, 46], [102, 58], [78, 62]], 3, "#e8c48c")}
          <rect x="66" y="62" width="44" height="10" rx="4" fill="url(#lx-choc)"/><rect x="66" y="40" width="44" height="30" rx="6" fill="url(#lx-flat)"/></g>
        ${[[22, 92], [92, 88], [104, 92]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.6" fill="#d8a565"/>`).join("")}`
    },
    pizzaTop: {
      alt: "a whole veggie pizza with peppers, tomatoes and olives, one slice pulled out",
      svg: () => `<ellipse cx="54" cy="92" rx="46" ry="6" fill="url(#lx-ground)"/>
        <path d="M54 54 L96 40 A44 40 0 1 1 72 16 Z" fill="url(#lx-crust)"/>
        <path d="M54 54 L91 42 A38 34 0 1 1 71 22 Z" fill="#f2c870"/>
        <path d="M54 54 L91 42 A38 34 0 1 1 71 22 Z" fill="#e85d3a" opacity=".22"/>
        ${dots([[34, 40], [40, 66], [62, 74], [28, 58], [50, 30]], 4.5, "#d63c2c")}
        ${dots([[46, 48], [36, 78], [70, 62], [24, 44]], 2.6, "#2a2a2a")}
        <path d="M30 48 q4 -5 8 0 M52 64 q4 -5 8 0 M44 34 q4 -5 8 0 M20 66 q4 -5 8 0" fill="none" stroke="#3f8f3a" stroke-width="3" stroke-linecap="round"/>
        <g transform="translate(14 -6)"><path d="M70 50 L104 40 Q110 56 100 70 Z" fill="url(#lx-crust)"/><path d="M72 50 L101 43 Q106 56 98 66 Z" fill="#f2c870"/>
        <circle cx="92" cy="52" r="3.5" fill="#d63c2c"/><path d="M84 58 q3 -4 6 0" stroke="#3f8f3a" stroke-width="2.6" fill="none"/></g>`
    },
    oats: {
      alt: "a bowl of plain rolled oats",
      svg: () => bowl("#e3cfa0", [[36, 42], [50, 38], [64, 38], [78, 40], [88, 46], [44, 48], [58, 46], [72, 47], [30, 49]].map(([x, y], i) =>
        `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" transform="rotate(${i * 25} ${x} ${y})" fill="#f3e6c8"/>`).join(""))
    },
    banana: {
      alt: "a ripe yellow banana",
      svg: () => `<ellipse cx="62" cy="86" rx="46" ry="6" fill="url(#lx-ground)"/>
        <path d="M18 40 Q30 86 98 74 Q104 72 100 66 Q50 72 30 34 Z" fill="url(#lx-banana)"/>
        <path d="M24 44 Q40 74 92 70" fill="none" stroke="#c99a14" stroke-opacity=".6" stroke-width="1.4"/>
        <path d="M22 40 Q34 62 70 66" fill="none" stroke="#fff6c4" stroke-width="3" stroke-linecap="round" opacity=".7"/>
        <path d="M30 34 L25 24 L20 27 L24 38" fill="#6b4f22"/><path d="M98 74 L104 70" stroke="#4a3518" stroke-width="3" stroke-linecap="round"/>`
    },
    yogurtBowl: {
      alt: "a bowl of thick plain white yogurt with a spoon",
      svg: () => bowl("#fbfaf6", `<path d="M30 46 Q44 30 60 40 Q74 30 90 46" fill="none" stroke="#e5e2da" stroke-width="3"/>
        <path d="M80 20 L98 2" stroke="#b8bec4" stroke-width="5" stroke-linecap="round"/><ellipse cx="74" cy="30" rx="10" ry="6" transform="rotate(-40 74 30)" fill="#cfd4d9"/>`, "#e7eef3")
    },
    wrap: {
      alt: "a whole wheat wrap cut in half, showing turkey, lettuce and tomato inside",
      svg: () => `<ellipse cx="60" cy="92" rx="50" ry="6" fill="url(#lx-ground)"/>` + [[36, 58, -8], [84, 56, 8]].map(([x, y, r]) => `
        <g transform="rotate(${r} ${x} ${y})">
          <rect x="${x - 24}" y="${y - 8}" width="48" height="40" rx="6" fill="#b98550"/>
          <rect x="${x - 24}" y="${y - 8}" width="48" height="40" rx="6" fill="url(#lx-cyl)" opacity=".6"/>
          <ellipse cx="${x}" cy="${y - 8}" rx="24" ry="18" fill="#a8743f"/>
          <ellipse cx="${x}" cy="${y - 8}" rx="21" ry="15.5" fill="#e8c7a2"/>
          <path d="M${x - 19} ${y - 6} Q${x - 10} ${y - 20} ${x + 2} ${y - 18} Q${x + 18} ${y - 16} ${x + 18} ${y - 2}" fill="none" stroke="#5fae45" stroke-width="5"/>
          <path d="M${x - 14} ${y - 8} Q${x - 4} ${y - 14} ${x + 8} ${y - 12} Q${x + 14} ${y - 8} ${x + 12} ${y}" fill="none" stroke="#f1b9a3" stroke-width="5"/>
          <path d="M${x - 8} ${y - 4} Q${x + 2} ${y - 8} ${x + 6} ${y - 2}" fill="none" stroke="#d8402e" stroke-width="4"/>
          <path d="M${x - 21} ${y - 8} A21 15.5 0 0 0 ${x + 21} ${y - 8}" fill="none" stroke="#c99a68" stroke-width="2"/>
        </g>`).join("")
    },
    carrots: {
      alt: "a pile of baby carrots",
      svg: () => `<ellipse cx="60" cy="92" rx="50" ry="6" fill="url(#lx-ground)"/>` +
        [[30, 80, 8], [58, 84, -6], [86, 80, 12], [20, 64, -18], [46, 66, 4], [74, 64, -12], [100, 66, 20], [34, 48, 14], [62, 48, -4], [88, 48, 6], [50, 32, -10], [76, 32, 16]].map(([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 17} ${y - 6} Q${x - 22} ${y} ${x - 17} ${y + 6} L${x + 14} ${y + 4} Q${x + 20} ${y} ${x + 14} ${y - 4} Z" fill="url(#lx-carrot)"/>
           <path d="M${x - 17} ${y - 6} Q${x - 22} ${y} ${x - 17} ${y + 6} L${x + 14} ${y + 4} Q${x + 20} ${y} ${x + 14} ${y - 4} Z" fill="url(#lx-round)" opacity=".45"/>
           <path d="M${x - 6} ${y - 5} v2 M${x + 4} ${y + 2} v2" stroke="#b5520a" stroke-width="1" opacity=".6"/></g>`).join("")
    },
    hummus: {
      alt: "a bowl of smooth hummus swirled with olive oil and chickpeas",
      svg: () => bowl("#e6cf9a", `<path d="M38 46 Q60 30 82 46 Q60 52 46 42" fill="none" stroke="#c8a462" stroke-width="2"/>
        <path d="M50 42 Q60 38 70 42" fill="none" stroke="#b7a03a" stroke-width="3" opacity=".7"/>
        ${dots([[58, 40], [68, 44], [52, 46]], 3.2, "#d6a85e")}`)
    },
    blueberries: {
      alt: "a pile of fresh blueberries",
      svg: () => `<ellipse cx="60" cy="90" rx="46" ry="6" fill="url(#lx-ground)"/>` +
        [[30, 76], [46, 80], [62, 78], [78, 80], [94, 76], [38, 64], [54, 64], [70, 64], [86, 64], [46, 50], [62, 50], [78, 50], [62, 36]].map(([x, y]) => berry(x, y, 9)).join("")
    },
    peanuts: {
      alt: "a swirl of creamy peanut butter on a knife with whole peanuts",
      svg: () => `<ellipse cx="60" cy="90" rx="48" ry="6" fill="url(#lx-ground)"/>
        <path d="M8 52 L64 40 L66 48 L10 60 Z" fill="#c9ced3"/><path d="M8 52 L64 40" stroke="#fff" stroke-width="1.4" opacity=".8"/>
        <path d="M24 52 Q30 34 50 38 Q66 30 70 44 Q72 54 56 56 Q40 62 24 52Z" fill="#c48644"/>
        <path d="M30 48 Q46 40 62 44" fill="none" stroke="#e2ad6c" stroke-width="3" stroke-linecap="round"/>
        ${[[82, 72, 20], [100, 62, -30], [70, 84, 70], [98, 84, 10]].map(([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 10} ${y} Q${x - 10} ${y - 7} ${x - 4} ${y - 6} Q${x} ${y - 3} ${x + 4} ${y - 6} Q${x + 10} ${y - 7} ${x + 10} ${y} Q${x + 10} ${y + 7} ${x + 4} ${y + 6} Q${x} ${y + 3} ${x - 4} ${y + 6} Q${x - 10} ${y + 7} ${x - 10} ${y} Z" fill="#dcb47a"/></g>`).join("")}`
    },
    chicken: {
      alt: "sliced grilled chicken breast with grill marks",
      svg: () => `<ellipse cx="60" cy="88" rx="50" ry="6" fill="url(#lx-ground)"/>` +
        [0, 1, 2, 3].map(i => {
          const x = 6 + i * 27, w = 26;
          return `<g transform="rotate(${-10 + i * 6} ${x + w / 2} 60)"><path d="M${x} 30 Q${x + w / 2} 22 ${x + w} 30 L${x + w} 84 Q${x + w / 2} 92 ${x} 84 Z" fill="url(#lx-grill)"/>
            <path d="M${x} 30 Q${x + w / 2} 22 ${x + w} 30 L${x + w} 37 Q${x + w / 2} 31 ${x} 37Z" fill="#f6ead8"/>
            <path d="M${x + 3} 50 L${x + w - 3} 42 M${x + 3} 66 L${x + w - 3} 58 M${x + 3} 82 L${x + w - 3} 74" stroke="#6b3f1a" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>`;
        }).join("")
    },
    rice: {
      alt: "a bowl of cooked brown rice",
      svg: () => bowl("#c4a073", Array.from({ length: 22 }, (_, i) => {
        const x = 28 + (i % 7) * 10.5, y = 40 + Math.floor(i / 7) * 4.5 - ((i % 7) > 1 && (i % 7) < 5 ? 3 : 0);
        return `<ellipse cx="${x}" cy="${y}" rx="4" ry="1.8" transform="rotate(${i * 37} ${x} ${y})" fill="#ecd8b4"/>`;
      }).join(""))
    },
    broccoli: {
      alt: "bright green steamed broccoli florets",
      svg: () => `<ellipse cx="60" cy="92" rx="46" ry="5" fill="url(#lx-ground)"/>` + [[34, 52, .9], [78, 48, 1], [56, 64, 1.05]].map(([x, y, s]) => `
        <g transform="translate(${x} ${y}) scale(${s})">
          <path d="M-6 6 L-8 30 L8 30 L6 6 Z" fill="#9fcf73"/>
          ${[[-12, -2, 11], [0, -10, 13], [12, -2, 11], [-5, 4, 9], [6, 4, 9]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#3f8c34"/><circle cx="${a}" cy="${b}" r="${r}" fill="url(#lx-round)" opacity=".5"/>`).join("")}
        </g>`).join("")
    },
    bagel: {
      alt: "a seeded multigrain bagel next to a wheat stalk",
      svg: () => wheat(102, 96, 0.85, 12) +
        `<ellipse cx="54" cy="90" rx="42" ry="5" fill="url(#lx-ground)"/>
         <ellipse cx="54" cy="58" rx="42" ry="30" fill="#a96a30"/>
         <ellipse cx="54" cy="54" rx="40" ry="27" fill="#c88a4a"/><ellipse cx="54" cy="54" rx="40" ry="27" fill="url(#lx-round)" opacity=".55"/>
         <ellipse cx="54" cy="56" rx="11" ry="7" fill="#7b4a1e"/>
         ${[[30, 44], [40, 36], [64, 34], [76, 44], [30, 64], [76, 64], [52, 74], [44, 70], [66, 72], [84, 54], [22, 54]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.2" transform="rotate(${i * 40} ${x} ${y})" fill="${i % 2 ? "#f3e6c8" : "#4a3018"}"/>`).join("")}`
    },
    cerealBowl: {
      alt: "a bowl of chocolate cereal puffs and stars with milk",
      svg: () => bowl("#f4f1ea", [[34, 44], [46, 38], [58, 36], [70, 38], [82, 42], [40, 50], [52, 46], [64, 46], [76, 48], [88, 50], [30, 50]].map(([x, y], i) =>
        i % 4 === 0
          ? `<path d="M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y - 1} L${x + 3} ${y + 2} L${x + 4} ${y + 6} L${x} ${y + 4} L${x - 4} ${y + 6} L${x - 3} ${y + 2} L${x - 6} ${y - 1} L${x - 2} ${y - 2} Z" fill="#5a3218"/>`
          : `<circle cx="${x}" cy="${y}" r="5.5" fill="#5e3419"/><circle cx="${x}" cy="${y}" r="5.5" fill="url(#lx-round)" opacity=".6"/>`).join(""), "#ffffff") +
        `<path d="M86 22 L104 6" stroke="#c9ced3" stroke-width="5" stroke-linecap="round"/>`
    },
    mapleBowl: {
      alt: "a bowl of oatmeal drizzled with maple syrup beside a maple leaf",
      svg: () => bowl("#e0c48d", `<path d="M38 44 Q50 36 60 42 Q70 34 84 44" fill="none" stroke="#a0521d" stroke-width="4" stroke-linecap="round" opacity=".85"/>
        ${dots([[48, 40], [72, 40]], 2.4, "#8a4a1a")}`) +
        `<path d="M96 8 L100 20 L110 14 L106 26 L116 28 L104 34 L108 42 L96 38 L92 46 L90 34 L80 32 L88 26 L84 16 L94 20 Z" fill="#c9561f"/>
         <path d="M94 22 L92 44" stroke="#8a3a12" stroke-width="1.2"/>`
    },
    eggs: {
      alt: "two peeled hard-boiled eggs, one cut in half",
      svg: () => `<ellipse cx="60" cy="88" rx="48" ry="5" fill="url(#lx-ground)"/>
        <ellipse cx="40" cy="58" rx="20" ry="26" fill="#fbf8f1"/><ellipse cx="40" cy="58" rx="20" ry="26" fill="url(#lx-round)" opacity=".45"/>
        <ellipse cx="82" cy="66" rx="24" ry="20" fill="#fbf8f1"/><ellipse cx="82" cy="66" rx="24" ry="20" fill="url(#lx-round)" opacity=".35"/>
        <circle cx="82" cy="66" r="10.5" fill="#f2b630"/><circle cx="82" cy="66" r="10.5" fill="url(#lx-round)" opacity=".5"/>`
    },
    milkGlass: {
      alt: "a tall glass of milk",
      svg: () => glass("url(#lx-milk)", 38, 10, 44, 82, .86) + `<path d="M24 92 Q40 86 56 92" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>`
    },
    chocGlass: {
      alt: "a glass of chocolate milk with a chocolate splash",
      svg: () => glass("#8a5634", 38, 14, 44, 80, .82) +
        `<path d="M86 30 Q96 20 104 30 Q110 40 100 46 Q106 52 98 58" fill="none" stroke="#8a5634" stroke-width="5" stroke-linecap="round"/>
         <rect x="14" y="58" width="16" height="14" rx="2" fill="url(#lx-choc)" transform="rotate(-12 22 65)"/>`
    },
    cheeseStick: {
      alt: "a stick of mozzarella string cheese peeled into strings",
      svg: () => `<ellipse cx="60" cy="86" rx="46" ry="5" fill="url(#lx-ground)"/>
        <g transform="rotate(-18 55 52)"><rect x="16" y="42" width="72" height="20" rx="10" fill="#fdf6e3"/><rect x="16" y="42" width="72" height="20" rx="10" fill="url(#lx-cyl)" transform="rotate(90 52 52)" opacity="0"/>
        <rect x="16" y="42" width="72" height="20" rx="10" fill="#000" opacity=".06"/><rect x="18" y="44" width="68" height="5" rx="2.5" fill="#fff" opacity=".9"/></g>
        <path d="M86 34 Q100 42 104 62 M88 38 Q96 52 96 68 M84 42 Q90 58 86 74" fill="none" stroke="#f3e8cf" stroke-width="4" stroke-linecap="round"/>`
    },
    greenGlass: {
      alt: "a glass of green smoothie with spinach, an apple slice and a carrot",
      svg: () => leaf(6, 70, 1.2, -60) + leaf(108, 74, 1.2, 240) + glass("#7fb04a", 38, 14, 44, 80, .85) +
        `<path d="M88 96 L106 64 Q110 60 112 66 L96 98 Z" fill="url(#lx-carrot)"/>
         <path d="M8 96 Q10 80 24 80 Q34 82 32 96 Z" fill="#f2e7b8"/><path d="M8 96 Q10 80 24 80" fill="none" stroke="#c9372a" stroke-width="3"/>`
    },
    sportDrop: {
      alt: "a splash of blue sports drink with a lightning bolt",
      svg: () => `<path d="M60 6 Q30 46 30 66 Q30 94 60 94 Q90 94 90 66 Q90 46 60 6 Z" fill="#45b7ff"/>
        <path d="M60 6 Q30 46 30 66 Q30 94 60 94 Q90 94 90 66 Q90 46 60 6 Z" fill="url(#lx-round)"/>
        <path d="M64 30 L48 64 L60 64 L54 86 L74 52 L62 52 L70 30 Z" fill="#ffe14d"/>
        ${dots([[18, 40], [104, 36], [12, 64], [108, 62], [22, 22]], 4, "#8fd6ff")}`
    },
    limeSoda: {
      alt: "a glass of sparkling water with ice, bubbles and a lime slice",
      svg: () => glass("#e8f6ef", 34, 12, 48, 82, .85) +
        `<rect x="44" y="34" width="14" height="13" rx="3" fill="#fff" opacity=".8" transform="rotate(12 51 40)"/><rect x="58" y="44" width="13" height="12" rx="3" fill="#fff" opacity=".7" transform="rotate(-10 64 50)"/>
         ${[[50, 70, 2], [60, 62, 1.6], [66, 78, 2.2], [46, 82, 1.5], [56, 86, 1.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#9ccfb8" stroke-width="1"/>`).join("")}
         <circle cx="92" cy="26" r="15" fill="#6fae3a"/><circle cx="92" cy="26" r="12.5" fill="#cfe89a"/>
         ${[0, 60, 120].map(a => `<path d="M92 26 l${(12 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(12 * Math.sin(a * Math.PI / 180)).toFixed(1)} M92 26 l${(-12 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(-12 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="#f3fbe0" stroke-width="1.2"/>`).join("")}`
    },
    orange: {
      alt: "oranges and a glass of orange juice",
      svg: () => glass("#ffa733", 62, 16, 40, 78, .85) +
        `<circle cx="34" cy="70" r="22" fill="#ff9418"/><circle cx="34" cy="70" r="22" fill="url(#lx-round)"/>
         <path d="M34 48 L37 42" stroke="#6b4f22" stroke-width="2.5" stroke-linecap="round"/>` + leaf(37, 45, 0.55, -30)
    },
    gummies: {
      alt: "red fruit gummies shaped like strawberries next to a real strawberry",
      svg: () => leaf(8, 92, 1.1, -50) + strawberry(92, 34, 1.4, 15) +
        [[30, 40, "#d92a3d"], [52, 34, "#f0547a"], [40, 60, "#ff8c2a"], [62, 58, "#d92a3d"], [30, 80, "#f0547a"], [56, 80, "#d92a3d"], [80, 72, "#ff8c2a"]].map(([x, y, c]) =>
          `<path d="M${x} ${y - 9} Q${x + 11} ${y - 10} ${x + 9} ${y + 2} Q${x + 4} ${y + 11} ${x} ${y + 9} Q${x - 4} ${y + 11} ${x - 9} ${y + 2} Q${x - 11} ${y - 10} ${x} ${y - 9} Z" fill="${c}" opacity=".92"/>
           <ellipse cx="${x - 3}" cy="${y - 3}" rx="3" ry="2" fill="#fff" opacity=".55"/>`).join("")
    },
    puffs: {
      alt: "a pile of orange cheese puffs",
      svg: () => `<ellipse cx="60" cy="90" rx="50" ry="6" fill="url(#lx-ground)"/>` +
        [[22, 80, 0], [44, 84, 30], [70, 82, -20], [96, 82, 50], [32, 64, 60], [56, 66, 10], [82, 64, -40], [44, 48, -10], [70, 46, 35], [58, 30, 70]].map(([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 13} ${y} Q${x - 11} ${y - 9} ${x} ${y - 7} Q${x + 13} ${y - 10} ${x + 13} ${y} Q${x + 11} ${y + 9} ${x} ${y + 7} Q${x - 13} ${y + 9} ${x - 13} ${y} Z" fill="#f78e1e"/>
           <path d="M${x - 13} ${y} Q${x - 11} ${y - 9} ${x} ${y - 7} Q${x + 13} ${y - 10} ${x + 13} ${y} Q${x + 11} ${y + 9} ${x} ${y + 7} Q${x - 13} ${y + 9} ${x - 13} ${y} Z" fill="url(#lx-round)" opacity=".5"/></g>`).join("")
    },
    almonds: {
      alt: "a handful of almonds",
      svg: () => `<ellipse cx="60" cy="90" rx="46" ry="6" fill="url(#lx-ground)"/>` +
        [[30, 40, -20], [56, 34, 10], [84, 40, 35], [40, 66, 60], [66, 62, -30], [92, 70, 15], [54, 84, 80], [24, 78, -40]].map(([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x} ${y - 14} Q${x + 12} ${y - 2} ${x} ${y + 14} Q${x - 12} ${y - 2} ${x} ${y - 14} Z" fill="#a8672e"/>
           <path d="M${x} ${y - 14} Q${x + 12} ${y - 2} ${x} ${y + 14} Q${x - 12} ${y - 2} ${x} ${y - 14} Z" fill="url(#lx-round)" opacity=".55"/>
           <path d="M${x - 2} ${y - 6} L${x - 3} ${y + 6} M${x + 3} ${y - 4} L${x + 2} ${y + 7}" stroke="#7a4518" stroke-width=".8" opacity=".6"/></g>`).join("")
    },
    trailMix: {
      alt: "a pile of trail mix with peanuts, raisins, almonds and candy-coated chocolates",
      svg: () => `<ellipse cx="60" cy="90" rx="52" ry="6" fill="url(#lx-ground)"/>` +
        [[18, 80, "#d8a565", 8, 6], [36, 84, "#4a2a1e", 6, 5], [54, 80, "#d9372a", 6, 6], [72, 86, "#d8a565", 8, 6], [88, 80, "#2f6fd1", 6, 6], [104, 86, "#4a2a1e", 6, 5],
         [28, 66, "#a8672e", 9, 5], [46, 64, "#f2c12e", 6, 6], [64, 66, "#d8a565", 8, 6], [82, 64, "#4a2a1e", 6, 5], [96, 68, "#3f9a4a", 6, 6],
         [40, 50, "#d8a565", 8, 6], [58, 48, "#d9372a", 6, 6], [76, 50, "#a8672e", 9, 5], [58, 34, "#4a2a1e", 6, 5]].map(([x, y, c, rx, ry], i) =>
          `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${i * 23} ${x} ${y})" fill="${c}"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${i * 23} ${x} ${y})" fill="url(#lx-round)" opacity=".5"/>`).join("")
    },
    crackers: {
      alt: "golden cracker sandwiches filled with sunflower butter, next to a sunflower",
      svg: () => `<ellipse cx="50" cy="92" rx="42" ry="5" fill="url(#lx-ground)"/>
        <g transform="translate(94 30)">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="-14" rx="4.5" ry="11" transform="rotate(${i * 30})" fill="#f7c62f"/>`).join("")}<circle r="9" fill="#5a3a1a"/></g>` +
        [[38, 52], [50, 78]].map(([x, y]) => `
          <rect x="${x - 26}" y="${y - 14}" width="52" height="10" rx="4" fill="#e3a94a"/><rect x="${x - 26}" y="${y - 14}" width="52" height="10" rx="4" fill="url(#lx-flat)"/>
          <rect x="${x - 23}" y="${y - 4}" width="46" height="6" fill="#9c6a35"/>
          <rect x="${x - 26}" y="${y + 2}" width="52" height="10" rx="4" fill="#e3a94a"/><rect x="${x - 26}" y="${y + 2}" width="52" height="10" rx="4" fill="url(#lx-flat)"/>
          ${dots([[x - 14, y - 9], [x, y - 9], [x + 14, y - 9]], 1.2, "#b5772e")}`).join("")
    },
    chickpeas: {
      alt: "roasted chickpeas dusted with chili, with a red chili pepper and a lime wedge",
      svg: () => `<ellipse cx="60" cy="92" rx="50" ry="5" fill="url(#lx-ground)"/>
        <path d="M72 20 Q104 24 104 62 Q102 72 96 64 Q94 36 70 30 Z" fill="#d9262f"/><path d="M72 20 Q104 24 104 62" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
        <path d="M70 30 Q64 22 70 14" fill="none" stroke="#4f9a3b" stroke-width="4" stroke-linecap="round"/>
        <path d="M14 34 L46 34 A16 16 0 0 1 14 34 Z" fill="#8cc04a"/><path d="M17 35 L43 35 A13 12 0 0 1 17 35 Z" fill="#d8ec9a"/>` +
        [[24, 66], [40, 72], [56, 64], [34, 84], [52, 84], [70, 80], [88, 86], [18, 82], [74, 64]].map(([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="8" fill="#c98a43"/><circle cx="${x}" cy="${y}" r="8" fill="url(#lx-round)" opacity=".55"/><circle cx="${x + 2}" cy="${y + 2}" r="1.2" fill="#b0301f"/>`).join("")
    },
    cookie: {
      alt: "two chocolate chip cookies",
      svg: () => `<ellipse cx="60" cy="90" rx="50" ry="6" fill="url(#lx-ground)"/>` + [[42, 56, 30], [88, 68, 24]].map(([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#d29a55"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#lx-round)" opacity=".55"/>` +
        [[-10, -10], [8, -12], [12, 6], [-6, 10], [0, -2], [-14, 2]].map(([a, b]) => `<ellipse cx="${x + a * r / 26}" cy="${y + b * r / 26}" rx="3.6" ry="2.8" fill="#3e2210"/>`).join("")).join("")
    },
    chocolate: {
      alt: "squares of dark chocolate with cocoa beans",
      svg: () => `<ellipse cx="56" cy="92" rx="50" ry="5" fill="url(#lx-ground)"/>
        <g transform="rotate(-8 50 60)">${[0, 1, 2].map(c => [0, 1].map(r => `<rect x="${12 + c * 26}" y="${38 + r * 24}" width="24" height="22" rx="2" fill="#3b2216"/><rect x="${15 + c * 26}" y="${41 + r * 24}" width="18" height="16" rx="1.5" fill="#4d2c1c"/>`).join("")).join("")}</g>
        <ellipse cx="96" cy="76" rx="12" ry="8" transform="rotate(-30 96 76)" fill="#6b3a24"/><ellipse cx="104" cy="58" rx="10" ry="7" transform="rotate(20 104 58)" fill="#7a4a2b"/>`
    },
    topBurrito: {
      alt: "a burrito bowl seen from above with rice, black beans, corn, salsa, cheese, lettuce and sour cream",
      svg: () => {
        let r = 7, out = `<ellipse cx="60" cy="50" rx="56" ry="40" fill="#efe3c6"/>`;
        const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
        const pile = (cx, cy, n, spread, draw) => { for (let i = 0; i < n; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * spread; out += draw(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .75, i); } };
        pile(60, 50, 40, 48, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.6" ry="1.2" fill="#fbf4e2"/>`);
        pile(36, 32, 26, 16, (x, y, i) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.4" ry="2.2" transform="rotate(${i * 40} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#2a221f"/>`);
        pile(84, 32, 22, 14, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#f4c430"/>`);
        pile(84, 66, 16, 13, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#d7372a"/>`);
        pile(36, 66, 14, 14, (x, y, i) => `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${6 + (i % 3)} ${i % 2 ? 3 : -3}" stroke="#6db24a" stroke-width="3" stroke-linecap="round"/>`);
        pile(60, 48, 14, 10, (x, y, i) => `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l5 ${i % 2 ? 2 : -2}" stroke="#f6b73c" stroke-width="2" stroke-linecap="round"/>`);
        return out + `<ellipse cx="62" cy="52" rx="9" ry="6" fill="#fffdf6"/><ellipse cx="60" cy="50" rx="4" ry="2.4" fill="#fff"/>`;
      }
    },
    topStirfry: {
      alt: "tofu stir-fry seen from above: crispy tofu cubes, peppers, broccoli and noodles in red sauce",
      svg: () => `<ellipse cx="60" cy="50" rx="56" ry="40" fill="#c8562f"/>
        ${Array.from({ length: 8 }, (_, i) => `<path d="M${14 + i * 12} ${20 + (i % 3) * 6} Q${30 + i * 8} 50 ${18 + i * 11} ${80 - (i % 2) * 6}" fill="none" stroke="#f1d39a" stroke-width="3"/>`).join("")}
        ${[[32, 36], [56, 30], [80, 38], [44, 58], [70, 60], [90, 54]].map(([x, y], i) => `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" rx="2.5" transform="rotate(${i * 17} ${x} ${y})" fill="#f2d8a7"/><rect x="${x - 7}" y="${y - 7}" width="14" height="14" rx="2.5" transform="rotate(${i * 17} ${x} ${y})" fill="#c9852f" opacity=".35"/>`).join("")}
        ${[[24, 54], [62, 46], [98, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#3f8c34"/>`).join("")}
        ${[[50, 74], [84, 72], [26, 36]].map(([x, y]) => `<path d="M${x - 7} ${y} Q${x} ${y - 6} ${x + 7} ${y}" stroke="#e8382a" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("")}
        ${dots([[40, 46], [66, 40], [76, 68]], 1.4, "#fff8e0")}`
    },
    fish: {
      alt: "a lemon herb salmon fillet with a lemon slice",
      svg: () => `<ellipse cx="58" cy="86" rx="50" ry="5" fill="url(#lx-ground)"/>
        <path d="M10 60 Q30 30 70 36 Q100 40 104 60 Q100 80 70 84 Q30 88 10 60 Z" fill="url(#lx-salmon)"/>
        ${[34, 50, 66, 82].map(x => `<path d="M${x} 42 Q${x + 6} 60 ${x} 80" fill="none" stroke="#ffe3d6" stroke-width="2.4"/>`).join("")}
        ${dots([[40, 52], [58, 60], [74, 50], [86, 64]], 1.8, "#3f7d2a")}
        <circle cx="96" cy="28" r="14" fill="#f5d63a"/><circle cx="96" cy="28" r="11" fill="#fff3a8"/>`
    },
    apple: {
      alt: "a red and yellow apple with a leaf",
      svg: () => `<ellipse cx="60" cy="92" rx="38" ry="5" fill="url(#lx-ground)"/>
        <path d="M60 30 Q40 18 26 34 Q12 54 26 76 Q40 98 60 86 Q80 98 94 76 Q108 54 94 34 Q80 18 60 30 Z" fill="#d42e2a"/>
        <path d="M60 30 Q40 18 26 34 Q12 54 26 76 Q40 98 60 86 Q80 98 94 76 Q108 54 94 34 Q80 18 60 30 Z" fill="url(#lx-round)"/>
        <path d="M60 30 Q46 36 40 52" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".35"/>
        <path d="M60 30 Q60 18 66 10" stroke="#5a3a1a" stroke-width="3" fill="none" stroke-linecap="round"/>` + leaf(64, 20, 0.75, -20)
    },
    greens: {
      alt: "a pile of mixed salad leaves",
      svg: () => leaf(10, 82, 2, -40) + leaf(38, 90, 2, -70, "#7cbf55") + leaf(106, 86, 2, 220) + leaf(80, 92, 1.8, 250, "#8a2f52") + leaf(52, 72, 1.6, -100, "#9fd06b") + leaf(70, 70, 1.4, -60, "#a33a5e")
    },
    beanBowl: {
      alt: "a bowl of black beans",
      svg: () => bowl("#2b2420", Array.from({ length: 16 }, (_, i) => {
        const x = 30 + (i % 6) * 12, y = 42 + Math.floor(i / 6) * 5 - ((i % 6) > 1 && (i % 6) < 4 ? 3 : 0);
        return `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="3.4" transform="rotate(${i * 31} ${x} ${y})" fill="#3a302b"/><ellipse cx="${x - 1}" cy="${y - 1}" rx="2" ry="1" fill="#fff" opacity=".35"/>`;
      }).join(""))
    },
    bread: {
      alt: "slices of whole wheat bread",
      svg: () => `<ellipse cx="60" cy="94" rx="40" ry="5" fill="url(#lx-ground)"/>
        <g transform="translate(-8 4) rotate(-6 60 50)"><path d="M30 92 L30 42 Q14 40 16 24 Q20 8 60 8 Q100 8 104 24 Q106 40 90 42 L90 92 Z" fill="#8f5a26"/>
        <path d="M35 87 L35 39 Q22 35 24 26 Q28 14 60 14 Q92 14 96 26 Q98 35 85 39 L85 87 Z" fill="#c99b62"/></g>
        <path d="M30 92 L30 42 Q14 40 16 24 Q20 8 60 8 Q100 8 104 24 Q106 40 90 42 L90 92 Z" fill="#9c6427"/>
        <path d="M35 87 L35 39 Q22 35 24 26 Q28 14 60 14 Q92 14 96 26 Q98 35 85 39 L85 87 Z" fill="#d6ac72"/>
        ${[[48, 30], [70, 40], [56, 60], [44, 74], [72, 72], [62, 24]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1.1" fill="#7a4a22"/>`).join("")}`
    },
    nuggets: {
      alt: "golden crispy chicken nuggets",
      svg: () => `<ellipse cx="60" cy="92" rx="50" ry="5" fill="url(#lx-ground)"/>` +
        [[30, 52, 0], [64, 42, 20], [92, 58, -15], [44, 78, 35], [78, 80, -30]].map(([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 16} ${y} Q${x - 14} ${y - 14} ${x} ${y - 12} Q${x + 18} ${y - 14} ${x + 16} ${y + 2} Q${x + 14} ${y + 14} ${x} ${y + 12} Q${x - 18} ${y + 12} ${x - 16} ${y} Z" fill="#dc9a3c"/>
           <path d="M${x - 16} ${y} Q${x - 14} ${y - 14} ${x} ${y - 12} Q${x + 18} ${y - 14} ${x + 16} ${y + 2} Q${x + 14} ${y + 14} ${x} ${y + 12} Q${x - 18} ${y + 12} ${x - 16} ${y} Z" fill="url(#lx-round)" opacity=".55"/>
           ${dots([[x - 6, y - 4], [x + 5, y + 3], [x + 2, y - 6], [x - 3, y + 5]], 1.1, "#a8641c")}</g>`).join("")
    },
    veggieBurger: {
      alt: "a black bean veggie burger on a bun with lettuce and tomato",
      svg: () => `<ellipse cx="60" cy="94" rx="48" ry="5" fill="url(#lx-ground)"/>
        <path d="M16 46 Q16 14 60 14 Q104 14 104 46 Z" fill="#d99a48"/><path d="M16 46 Q16 14 60 14 Q104 14 104 46 Z" fill="url(#lx-round)" opacity=".5"/>
        <path d="M12 50 q8 -7 16 0 q8 -7 16 0 q8 -7 16 0 q8 -7 16 0 q8 -7 16 0 q8 -7 16 0 L108 54 L12 54Z" fill="#6fb24f"/>
        <rect x="14" y="52" width="92" height="8" rx="3" fill="#d63c2c"/>
        <rect x="12" y="60" width="96" height="16" rx="7" fill="#4a2e22"/>${dots([[30, 66], [52, 70], [74, 65], [92, 70]], 2, "#2b1a14")}
        <path d="M16 78 L104 78 Q104 92 60 92 Q16 92 16 78 Z" fill="#d99a48"/>
        ${[[40, 26], [60, 22], [80, 28], [50, 34], [70, 34]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.3" fill="#fff6e0"/>`).join("")}`
    },
    edamame: {
      alt: "green edamame pods and shelled beans",
      svg: () => `<ellipse cx="60" cy="92" rx="48" ry="5" fill="url(#lx-ground)"/>` + [[34, 40, -20], [70, 62, 15]].map(([x, y, r]) => `
        <g transform="rotate(${r} ${x} ${y})">
          <path d="M${x - 30} ${y} Q${x - 30} ${y - 14} ${x - 14} ${y - 12} Q${x} ${y - 18} ${x + 14} ${y - 12} Q${x + 30} ${y - 14} ${x + 30} ${y} Q${x + 30} ${y + 12} ${x} ${y + 10} Q${x - 30} ${y + 12} ${x - 30} ${y} Z" fill="#6aaa45"/>
          ${[-16, 0, 16].map(d => `<circle cx="${x + d}" cy="${y - 1}" r="6.5" fill="#9fd06b"/><circle cx="${x + d}" cy="${y - 1}" r="6.5" fill="url(#lx-round)" opacity=".5"/>`).join("")}
        </g>`).join("") + [[92, 26], [104, 36], [20, 84], [32, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#9fd06b"/><circle cx="${x}" cy="${y}" r="7" fill="url(#lx-round)" opacity=".5"/>`).join("")
    },
    popsicle: {
      alt: "a strawberry fruit bar on a stick with fresh strawberries",
      svg: () => `<rect x="54" y="74" width="10" height="24" rx="4" fill="#e3c08a"/>
        <path d="M38 22 Q38 6 59 6 Q80 6 80 22 L80 74 Q80 78 76 78 L42 78 Q38 78 38 74 Z" fill="#f05a78"/>
        <path d="M38 22 Q38 6 59 6 Q80 6 80 22 L80 74 Q80 78 76 78 L42 78 Q38 78 38 74 Z" fill="url(#lx-cyl)" opacity=".6"/>
        ${[[50, 30], [66, 40], [52, 56], [68, 64], [58, 18]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.2" ry="1.9" fill="#ffd6a0"/>`).join("")}` +
        strawberry(18, 72, 1.1, -15) + strawberry(100, 68, 1.1, 18)
    },
    iceCream: {
      alt: "a bowl of chocolate ice cream with fudge and brownie chunks",
      svg: () => `<ellipse cx="60" cy="94" rx="44" ry="5" fill="url(#lx-ground)"/>
        ${[[42, 42, 22, "#5e3419"], [78, 40, 22, "#6b3d1f"], [60, 24, 18, "#4e2a14"]].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#lx-round)" opacity=".5"/>`).join("")}
        <path d="M28 30 Q34 38 38 30 Q42 44 48 32 M68 26 Q72 36 78 28 Q82 38 88 30" fill="none" stroke="#2b1408" stroke-width="3.5" stroke-linecap="round"/>
        <rect x="52" y="30" width="10" height="9" rx="1.5" fill="#2e1709" transform="rotate(20 57 34)"/><rect x="80" y="46" width="9" height="8" rx="1.5" fill="#2e1709" transform="rotate(-15 84 50)"/>
        <path d="M14 56 L106 56 Q100 92 60 94 Q20 92 14 56 Z" fill="#f2f2f2"/><path d="M14 56 L106 56 Q100 92 60 94 Q20 92 14 56 Z" fill="url(#lx-cyl)" opacity=".6"/>`
    },
    froyo: {
      alt: "a tall swirl of vanilla frozen yogurt in a cup with mint leaves",
      svg: () => `<ellipse cx="60" cy="96" rx="30" ry="4" fill="url(#lx-ground)"/>
        <path d="M34 54 L86 54 L78 96 L42 96 Z" fill="#fff"/><path d="M34 54 L86 54 L78 96 L42 96 Z" fill="url(#lx-cyl)" opacity=".6"/>
        <path d="M30 54 Q28 42 44 40 Q36 30 50 24 Q48 12 60 8 Q72 12 70 24 Q84 30 76 40 Q92 42 90 54 Z" fill="#fffaf0"/>
        <path d="M30 54 Q28 42 44 40 Q36 30 50 24 Q48 12 60 8 Q72 12 70 24 Q84 30 76 40 Q92 42 90 54 Z" fill="url(#lx-round)" opacity=".3"/>
        <path d="M40 46 Q60 40 80 46 M48 32 Q60 28 72 32" fill="none" stroke="#e8decb" stroke-width="2"/>` +
        leaf(70, 12, 0.8, -30, "#4f9a6a")
    },
    box: {
      alt: "a food package",
      svg: () => `<rect x="30" y="16" width="60" height="76" rx="6" fill="#ddd"/>`
    }
  };

  function iconSVG(name, extra = "") {
    const icon = ICONS[name] || ICONS.box;
    return `<svg viewBox="0 0 120 100" aria-hidden="true" focusable="false" ${extra}>${icon.svg()}</svg>`;
  }
  const iconAlt = name => (ICONS[name] || ICONS.box).alt;

  /* ---------- Package shapes ----------
     w,h: drawing size (also the package's aspect ratio)
     face: where the printed text goes, as % insets [top, right, bottom, left]
     mode: "full" = text + food picture printed on the package
           "header" = text printed on a band; the food shows through clear plastic
           "sticker" = see-through or loose; a store sticker carries the text
     under(food): SVG drawn behind the text.  over: SVG drawn on top (shine, plastic). */
  const BG = 'style="fill:var(--pk-bg)"', BG2 = 'style="fill:var(--pk-bg2)"', ACC = 'style="fill:var(--pk-accent)"';
  const zig = (x0, x1, y, dy, step, up) => {
    let d = "";
    for (let x = x0, i = 0; x <= x1 + 0.01; x += step, i++) d += ` L${x.toFixed(1)} ${(i % 2 ? y + (up ? -dy : dy) : y).toFixed(1)}`;
    return d;
  };
  const food = (icon, x, y, w, h) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet">${ICONS[icon] ? ICONS[icon].svg() : ""}</svg>`;

  const PACKS = {
    box: {
      w: 200, h: 290, face: [5, 10, 2, 2], mode: "full",
      under: () => `<path d="M0 8 L14 0 H200 L186 8 Z" ${BG}/><path d="M0 8 L14 0 H200 L186 8 Z" fill="#fff" opacity=".35"/>
        <path d="M186 8 L200 0 V282 L186 290 Z" ${BG}/><path d="M186 8 L200 0 V282 L186 290 Z" fill="#000" opacity=".3"/>
        <rect x="0" y="8" width="186" height="282" ${BG}/>`,
      over: `<rect x="0" y="8" width="186" height="282" fill="url(#lx-flat)"/>`
    },
    wideBox: {
      w: 200, h: 220, face: [6, 10, 3, 2], mode: "full",
      under: () => PACKS.box.under().replace(/290/g, "220").replace(/282/g, "212"),
      over: `<rect x="0" y="8" width="186" height="212" fill="url(#lx-flat)"/>`
    },
    bag: {
      w: 200, h: 290, face: [8, 3, 8, 3], mode: "full",
      under: () => `<path d="${bagPath()}" ${BG}/>
        <rect x="0" y="0" width="200" height="18" fill="#000" opacity=".12"/><rect x="0" y="272" width="200" height="18" fill="#000" opacity=".12"/>
        ${Array.from({ length: 33 }, (_, i) => `<path d="M${4 + i * 6} 6 V16 M${4 + i * 6} 274 V284" stroke="#fff" stroke-opacity=".28" stroke-width="1"/>`).join("")}`,
      over: () => `<path d="${bagPath()}" fill="url(#lx-pillow)"/>`
    },
    pouch: {
      w: 200, h: 300, face: [12, 4, 6, 4], mode: "full",
      under: () => `<path d="M6 0 H194 Q200 0 200 6 V266 Q200 300 168 300 H32 Q0 300 0 266 V6 Q0 0 6 0 Z" ${BG}/>
        <path d="M0 26 H200" stroke="#000" stroke-opacity=".18" stroke-width="2"/><path d="M0 30 H200" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
        <path d="M0 12 L6 15 L0 18 Z M200 12 L194 15 L200 18 Z" fill="#000" opacity=".25"/>
        <path d="M14 290 Q100 272 186 290" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="2"/>`,
      over: `<path d="M6 0 H194 Q200 0 200 6 V266 Q200 300 168 300 H32 Q0 300 0 266 V6 Q0 0 6 0 Z" fill="url(#lx-pillow)" opacity=".8"/>`
    },
    breadBag: {
      w: 200, h: 320, face: [16, 5, 4, 5], mode: "full",
      under: () => `<path d="M84 2 Q100 -2 116 2 L114 36 Q196 44 196 84 V302 Q196 320 178 320 H22 Q4 320 4 302 V84 Q4 44 86 36 Z" ${BG}/>
        <path d="M90 6 L96 36 M104 4 L104 36 M112 6 L108 36" stroke="#000" stroke-opacity=".15" stroke-width="1.5"/>
        <rect x="84" y="30" width="32" height="7" rx="3" ${ACC}/>`,
      over: `<path d="M84 2 Q100 -2 116 2 L114 36 Q196 44 196 84 V302 Q196 320 178 320 H22 Q4 320 4 302 V84 Q4 44 86 36 Z" fill="url(#lx-pillow)" opacity=".7"/>`
    },
    cup: {
      w: 200, h: 230, face: [14, 9, 6, 9], mode: "full",
      under: () => `<path d="M6 24 H194 L176 222 Q175 230 166 230 H34 Q25 230 24 222 Z" ${BG}/>
        <path d="M0 14 Q0 8 6 8 H194 Q200 8 200 14 V24 H0 Z" fill="url(#lx-foil)"/>
        <path d="M0 24 H200" stroke="#000" stroke-opacity=".2" stroke-width="2"/>`,
      over: `<path d="M6 24 H194 L176 222 Q175 230 166 230 H34 Q25 230 24 222 Z" fill="url(#lx-cyl)"/>`
    },
    tub: {
      w: 200, h: 170, face: [19, 8, 5, 8], mode: "full",
      under: () => `<path d="M10 26 H190 L180 164 Q179 170 172 170 H28 Q21 170 20 164 Z" ${BG}/>
        <rect x="0" y="4" width="200" height="24" rx="8" ${BG2}/><rect x="0" y="4" width="200" height="24" rx="8" fill="url(#lx-cyl)"/>`,
      over: `<path d="M10 26 H190 L180 164 Q179 170 172 170 H28 Q21 170 20 164 Z" fill="url(#lx-cyl)"/>`
    },
    pint: {
      w: 200, h: 250, face: [14, 7, 4, 7], mode: "full",
      under: () => `<path d="M6 28 H194 L184 244 Q183 250 176 250 H24 Q17 250 16 244 Z" ${BG}/>
        <rect x="0" y="4" width="200" height="28" rx="9" ${BG2}/><rect x="0" y="4" width="200" height="28" rx="9" fill="url(#lx-cyl)"/>`,
      over: `<path d="M6 28 H194 L184 244 Q183 250 176 250 H24 Q17 250 16 244 Z" fill="url(#lx-cyl)"/>`
    },
    bottle: {
      w: 180, h: 360, face: [36, 12, 11, 12], mode: "full",
      under: (p) => `<rect x="62" y="0" width="56" height="30" rx="5" ${ACC}/><rect x="62" y="0" width="56" height="30" rx="5" fill="url(#lx-cyl)"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${66 + i * 6} 4 V26" stroke="#000" stroke-opacity=".15"/>`).join("")}
        <path d="M68 30 H112 V44 Q112 54 128 66 Q164 88 164 124 V336 Q164 360 140 360 H40 Q16 360 16 336 V124 Q16 88 52 66 Q68 54 68 44 Z" fill="${(p.art && p.art.liquid) || "#cfe6f2"}"/>
        <rect x="16" y="128" width="148" height="196" ${BG}/>`,
      over: `<path d="M68 30 H112 V44 Q112 54 128 66 Q164 88 164 124 V336 Q164 360 140 360 H40 Q16 360 16 336 V124 Q16 88 52 66 Q68 54 68 44 Z" fill="url(#lx-cyl)"/>
        <path d="M36 92 Q30 108 30 130" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/>`
    },
    carton: {
      w: 200, h: 340, face: [23, 4, 2, 2], mode: "full",
      under: () => `<rect x="34" y="0" width="132" height="14" ${BG2}/>
        <path d="M0 76 L34 14 H166 L200 76 Z" ${BG}/><path d="M0 76 L34 14 H100 L100 76 Z" fill="#fff" opacity=".22"/>
        <circle cx="136" cy="44" r="11" fill="#f2f2f2"/><circle cx="136" cy="44" r="11" fill="url(#lx-cyl)"/>
        <rect x="0" y="76" width="200" height="264" ${BG}/><path d="M0 76 H200" stroke="#000" stroke-opacity=".2" stroke-width="2"/>`,
      over: `<rect x="0" y="76" width="200" height="264" fill="url(#lx-flat)"/>`
    },
    canister: {
      w: 200, h: 310, face: [12, 4, 5, 4], mode: "full",
      under: () => `<ellipse cx="100" cy="300" rx="100" ry="10" ${BG}/><rect x="0" y="22" width="200" height="278" ${BG}/>
        <rect x="0" y="14" width="200" height="16" ${BG2}/><ellipse cx="100" cy="14" rx="100" ry="12" ${BG2}/><ellipse cx="100" cy="14" rx="100" ry="12" fill="#fff" opacity=".25"/>`,
      over: `<rect x="0" y="14" width="200" height="290" fill="url(#lx-cyl)"/>`
    },
    can: {
      w: 200, h: 270, face: [10, 4, 9, 4], mode: "full",
      under: () => `<path d="M6 18 H194 V252 Q194 262 184 264 H16 Q6 262 6 252 Z" ${BG}/>
        <path d="M10 2 H190 Q196 2 196 10 V20 H4 V10 Q4 2 10 2 Z" fill="url(#lx-metal)"/>
        <path d="M6 252 H194 Q194 268 180 270 H20 Q6 268 6 252 Z" fill="url(#lx-metal)"/>`,
      over: `<rect x="4" y="2" width="192" height="268" fill="url(#lx-cyl)"/>`
    },
    jar: {
      w: 200, h: 250, face: [28, 5, 14, 5], mode: "full",
      under: (p) => `<rect x="18" y="0" width="164" height="42" rx="7" ${ACC}/>
        ${Array.from({ length: 26 }, (_, i) => `<path d="M${22 + i * 6} 4 V38" stroke="#000" stroke-opacity=".14"/>`).join("")}
        <path d="M10 54 Q10 42 26 42 H174 Q190 42 190 54 V228 Q190 250 168 250 H32 Q10 250 10 228 Z" fill="${(p.art && p.art.liquid) || "#d9b27a"}"/>
        <rect x="10" y="68" width="180" height="150" ${BG}/>`,
      over: `<rect x="18" y="0" width="164" height="42" rx="7" fill="url(#lx-cyl)"/>
        <path d="M10 54 Q10 42 26 42 H174 Q190 42 190 54 V228 Q190 250 168 250 H32 Q10 250 10 228 Z" fill="url(#lx-cyl)"/>`
    },
    wrapper: {
      w: 200, h: 150, face: [8, 8, 8, 8], mode: "full", row: true,
      under: () => {
        const crimp = (xIn, xOut) => { let d = `M${xIn} 8`; for (let i = 0; i <= 16; i++) d += ` L${i % 2 ? xOut : xIn} ${8 + i * 8.375}`; return d + " Z"; };
        return `<rect x="14" y="8" width="172" height="134" ${BG}/><path d="${crimp(14, 2)}" ${BG2}/><path d="${crimp(186, 198)}" ${BG2}/>`;
      },
      over: `<rect x="0" y="8" width="200" height="134" fill="url(#lx-pillow)" opacity=".7"/>`
    },
    tray: {
      w: 200, h: 150, mode: "sticker",
      under: (p) => `<ellipse cx="100" cy="146" rx="96" ry="6" fill="url(#lx-ground)"/>
        <rect x="0" y="14" width="200" height="130" rx="16" fill="url(#lx-foam)"/><rect x="12" y="26" width="176" height="106" rx="10" fill="#eceef0"/>
        ${food(p.art.icon, 14, 22, 172, 112)}`,
      over: `<rect x="0" y="14" width="200" height="130" rx="16" fill="url(#lx-clear)"/>`
    },
    bowl: {
      w: 200, h: 180, mode: "sticker",
      under: (p) => `<ellipse cx="100" cy="176" rx="92" ry="6" fill="url(#lx-ground)"/>
        <path d="M6 100 H194 L178 168 Q176 178 162 178 H38 Q24 178 22 168 Z" fill="#222"/><path d="M6 100 H194 L178 168 Q176 178 162 178 H38 Q24 178 22 168 Z" fill="url(#lx-cyl)"/>
        ${food(p.art.icon, 10, 54, 180, 90)}`,
      over: `<path d="M6 100 Q6 34 100 30 Q194 34 194 100 Z" fill="url(#lx-clear)" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
        <path d="M30 70 Q50 44 90 40" stroke="#fff" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round"/>`
    },
    clamshell: {
      w: 200, h: 180, mode: "sticker",
      under: (p) => `<ellipse cx="100" cy="176" rx="94" ry="6" fill="url(#lx-ground)"/>
        <rect x="6" y="30" width="188" height="144" rx="12" fill="#f5f7f8" opacity=".5"/>
        ${food(p.art.icon, 10, 36, 180, 136)}`,
      over: `<rect x="6" y="30" width="188" height="144" rx="12" fill="url(#lx-clear)" stroke="#000" stroke-opacity=".2" stroke-width="1.5"/>
        <rect x="0" y="22" width="200" height="16" rx="7" fill="#fff" opacity=".55" stroke="#000" stroke-opacity=".15"/>
        ${[40, 70, 100, 130, 160].map(x => `<rect x="${x - 8}" y="27" width="16" height="5" rx="2.5" fill="#000" opacity=".12"/>`).join("")}`
    },
    produceBag: {
      w: 200, h: 300, face: [6, 6, 70, 6], mode: "header",
      under: (p) => `<path d="M10 0 H190 V280 Q190 300 170 300 H30 Q10 300 10 280 Z" fill="#fff" opacity=".35"/>
        ${food(p.art.icon, 12, 96, 176, 196)}
        <rect x="10" y="0" width="180" height="96" ${BG}/>`,
      over: `<path d="M10 0 H190 V280 Q190 300 170 300 H30 Q10 300 10 280 Z" fill="url(#lx-clear)" stroke="#000" stroke-opacity=".15" stroke-width="1.5"/>
        <rect x="10" y="4" width="180" height="5" fill="#000" opacity=".12"/>`
    },
    loose: {
      w: 200, h: 180, mode: "sticker",
      under: (p) => food(p.art.icon, 0, 0, 200, 180),
      over: ""
    }
  };
  let _bag;
  function bagPath() {
    if (_bag) return _bag;
    let d = "M2 16 L2 6";
    for (let i = 0; i <= 30; i++) d += ` L${(2 + i * 6.53).toFixed(1)} ${i % 2 ? 0 : 6}`;
    d += " L198 16 Q206 145 198 274 L198 284";
    for (let i = 0; i <= 30; i++) d += ` L${(198 - i * 6.53).toFixed(1)} ${i % 2 ? 290 : 284}`;
    _bag = d + " L2 274 Q-6 145 2 16 Z";
    return _bag;
  }

  window.LynxArt = { iconSVG, iconAlt, ICONS, PACKS, food };
})();
