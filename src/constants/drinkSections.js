/**
 * How the drinks menu is organized for navigation.
 * Sections are the top-level tabs; wine is further split by format.
 * Category names here must match the `category` field in src/data/drinks-*.json.
 */

// Wine styles in the order they appear on VIA's printed list (reds, then whites).
const WINE_STYLES = [
  "Italian Reds",
  "Super Tuscan",
  "Merlot & Malbec",
  "Pinot Noir",
  "Pinot Noir & Interesting Reds",
  "Cabernet & Blends",
  "Sauvignon Blanc",
  "Chardonnay",
  "Interesting Whites",
  "Sparkling",
];

export const WINE_FORMATS = [
  { id: "glass", label: "By the glass", short: "Glass" },
  { id: "bottle", label: "Bottles", short: "Bottles" },
  { id: "half", label: "Half bottles", short: "Half" },
  { id: "flight", label: "Flights", short: "Flights" },
];

export const DRINK_SECTIONS = [
  { id: "wine", label: "Wine" },
  { id: "cocktails", label: "Cocktails", categories: ["Signature Cocktails", "Mocktails"] },
  { id: "beer", label: "Beer", categories: ["Draught", "Bottles & Cans", "Non-Alcoholic Beer"] },
  { id: "spirits", label: "Whiskey", categories: ["Bourbon", "Rye", "Scotch"] },
  {
    id: "after",
    label: "After dinner",
    categories: ["Coffee Cocktails", "Port", "Amaro & Digestivo", "Cognac", "Grappa"],
  },
];

/** Which wine format a category belongs to, or null if it is not wine. */
export function wineFormatOf(category) {
  if (category === "Wine Flights") return "flight";
  if (category === "Half Bottles" || category === "Half Bottles - Wine") return "half";
  if (category.endsWith(" Bottles")) return "bottle";
  if (WINE_STYLES.includes(category)) return "glass";
  return null;
}

/** Which drink section an item belongs to. */
export function drinkSectionOf(category) {
  if (wineFormatOf(category)) return "wine";
  const s = DRINK_SECTIONS.find((sec) => sec.categories && sec.categories.includes(category));
  return s ? s.id : "after";
}

/**
 * The heading a drink is shown under. Bottles drop the " Bottles" suffix (the
 * format toggle already says it), and half bottles split into red and white.
 */
export function drinkGroupOf(item) {
  const cat = item.category || "Other";
  if (cat === "Half Bottles" || cat === "Half Bottles - Wine") {
    const ing = item.ingredients || [];
    if (ing.includes("red-wine")) return "Red";
    if (ing.includes("sparkling-wine")) return "Sparkling";
    return "White";
  }
  if (cat.endsWith(" Bottles")) return cat.slice(0, -" Bottles".length);
  if (cat === "Signature Cocktails") return "VIA Signature Cocktails";
  return cat;
}

/** Sort order for wine headings so every format reads reds first, then whites. */
export function wineGroupRank(group) {
  const order = [...WINE_STYLES, "Red", "White", "Wine Flights"];
  const i = order.indexOf(group);
  return i === -1 ? order.length : i;
}
