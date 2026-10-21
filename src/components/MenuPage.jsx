import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import MenuItemCard from "./MenuItemCard";
import MenuNav, { anchorId } from "./MenuNav";
import FilterSheet, { EMPTY_FILTERS, filterLabel } from "./FilterSheet";
import CategoryWineMap from "./CategoryWineMap";
import InternationalWineMap from "./InternationalWineMap";
import SpiritsMap from "./SpiritsMap";
import { getDefaultPreferences } from "../utils/pairingPreferences";
import {
  DRINK_SECTIONS, WINE_FORMATS, drinkSectionOf, wineFormatOf, drinkGroupOf, wineGroupRank,
} from "../constants/drinkSections";
import educationalGuide from "../data/drinksEducationalGuide.json";

const ITALIAN_MAP = ["Italian Reds Bottles", "Super Tuscan Bottles", "Italian Reds", "Super Tuscan"];
const INTERNATIONAL_MAP = [
  "Merlot & Malbec Bottles", "Merlot & Malbec", "Pinot Noir & Interesting Reds Bottles", "Pinot Noir",
  "Cabernet & Blends Bottles", "Cabernet & Blends", "Sauvignon Blanc Bottles", "Sauvignon Blanc",
  "Chardonnay Bottles", "Chardonnay", "Interesting Whites Bottles", "Interesting Whites",
  "Sparkling Bottles", "Sparkling", "Half Bottles",
];
const SPIRITS_MAP = ["Bourbon", "Rye", "Scotch", "Cognac", "Grappa", "Port", "Amaro & Digestivo"];

// Educational guide keys for each raw category
const EDU_KEYS = {
  "Bourbon": "Bourbon", "Rye": "Rye", "Scotch": "Scotch", "Grappa": "Grappa", "Cognac": "Cognac",
  "Port": "Port", "Amaro & Digestivo": "Amaro & Digestivo", "Coffee Cocktails": "Coffee Cocktails",
  "Italian Reds": "Italian Reds", "Italian Reds Bottles": "Italian Reds",
  "Super Tuscan": "Super Tuscan", "Super Tuscan Bottles": "Super Tuscan",
  "Sparkling": "Sparkling Bottles", "Sparkling Bottles": "Sparkling Bottles",
  "Merlot & Malbec": "Merlot & Malbec", "Merlot & Malbec Bottles": "Merlot & Malbec",
  "Pinot Noir": "Pinot Noir & Interesting Reds",
  "Cabernet & Blends": "Cabernet & Blends", "Cabernet & Blends Bottles": "Cabernet & Blends",
  "Sauvignon Blanc": "Sauvignon Blanc", "Sauvignon Blanc Bottles": "Sauvignon Blanc",
  "Chardonnay": "Chardonnay", "Chardonnay Bottles": "Chardonnay",
  "Interesting Whites": "Interesting Whites", "Interesting Whites Bottles": "Interesting Whites",
  "Pinot Noir & Interesting Reds Bottles": "Pinot Noir & Interesting Reds",
  "Signature Cocktails": "Via Signature Cocktails", "Mocktails": "Mocktails",
  "Draught": "Draught Beers", "Bottles & Cans": "Bottles & Cans", "Non-Alcoholic Beer": "Non-Alcoholic Beer",
};
const eduFor = (rawCategory) => {
  const key = EDU_KEYS[rawCategory];
  return key ? educationalGuide.categories[key] : null;
};

function passesFilters(item, f) {
  if (f.vegetarian && !item.vegetarian) return false;
  if (f.glutenFree && !(item.glutenFree || item.canBeMadeGlutenFree || item.glutenFreeAvailable)) return false;
  if (f.nutFree && !item.nutFree) return false;
  if (f.dairyFree && item.allergens?.includes("dairy")) return false;
  if (f.shellfishFree && item.allergens?.includes("shellfish")) return false;
  if (f.fishFree && item.allergens?.includes("fish")) return false;
  if (f.soyFree && item.allergens?.includes("soy")) return false;
  if (f.eggFree && item.allergens?.includes("eggs")) return false;
  if (f.kids && !item.kids) return false;
  return true;
}

function pairingIsCustom(p) {
  const d = getDefaultPreferences();
  return Object.keys(p.prefer || {}).length > 0 || Object.keys(p.exclude || {}).length > 0
    || p.priceRange?.min !== d.priceRange.min || p.priceRange?.max !== d.priceRange.max || p.minScore !== d.minScore;
}

function MenuPage({ title, data, showKidsFilter = false }) {
  const isDrinksMenu = title === "Drinks";
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState({});
  const [eduOpen, setEduOpen] = useState({});
  const [pairingPreferences, setPairingPreferences] = useState(getDefaultPreferences());
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Drinks: section and wine format live in the URL so Back and shared links keep them.
  const section = isDrinksMenu && DRINK_SECTIONS.some((s) => s.id === searchParams.get("section"))
    ? searchParams.get("section") : "wine";
  const format = WINE_FORMATS.some((f) => f.id === searchParams.get("format"))
    ? searchParams.get("format") : "glass";
  const setNav = useCallback((next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    if (params.get("section") !== "wine") params.delete("format");
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0 });
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => data.filter((item) => passesFilters(item, filters)), [data, filters]);

  // Items shown on screen: drinks are narrowed to the chosen section (and wine format).
  const visible = useMemo(() => {
    if (!isDrinksMenu) return filtered;
    return filtered.filter((item) => {
      if (drinkSectionOf(item.category) !== section) return false;
      if (section === "wine") return wineFormatOf(item.category) === format;
      return true;
    });
  }, [filtered, isDrinksMenu, section, format]);

  // Group into headings, in menu order.
  const groups = useMemo(() => {
    const map = new Map();
    visible.forEach((item) => {
      const id = isDrinksMenu ? drinkGroupOf(item) : (item.category || "Other");
      if (!map.has(id)) map.set(id, { id, label: id, rawCategory: item.category, items: [] });
      map.get(id).items.push(item);
    });
    let list = [...map.values()];
    if (isDrinksMenu && section === "wine") list.sort((a, b) => wineGroupRank(a.id) - wineGroupRank(b.id));
    if (isDrinksMenu && section !== "wine") {
      const order = DRINK_SECTIONS.find((s) => s.id === section)?.categories || [];
      list.sort((a, b) => order.indexOf(a.rawCategory) - order.indexOf(b.rawCategory));
    }
    return list;
  }, [visible, isDrinksMenu, section]);

  const navGroups = useMemo(
    () => groups.map((g) => ({ id: g.id, label: g.label, count: g.items.length })),
    [groups],
  );

  const formatCounts = useMemo(() => {
    if (!isDrinksMenu) return null;
    const counts = {};
    filtered.forEach((i) => { const f = wineFormatOf(i.category); if (f) counts[f] = (counts[f] || 0) + 1; });
    return counts;
  }, [filtered, isDrinksMenu]);

  // Search hands over an item id; open its section, format and heading, then scroll to it.
  const focusId = location.state?.focusId;
  useEffect(() => {
    if (!focusId) return undefined;
    const item = data.find((i) => i.id === focusId);
    if (!item) return undefined;
    if (!passesFilters(item, filters)) setFilters(EMPTY_FILTERS);
    if (isDrinksMenu) {
      const s = drinkSectionOf(item.category);
      const f = wineFormatOf(item.category);
      if (s !== section || (f && f !== format)) {
        const params = new URLSearchParams(searchParams);
        params.set("section", s);
        if (f) params.set("format", f); else params.delete("format");
        setSearchParams(params, { replace: true, state: location.state });
        return undefined; // runs again once the section is showing
      }
    }
    const group = isDrinksMenu ? drinkGroupOf(item) : item.category;
    setCollapsed((c) => ({ ...c, [group]: false }));
    const t = setTimeout(() => {
      const el = document.getElementById(`menu-item-${item.id}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlight-flash");
      setTimeout(() => el.classList.remove("highlight-flash"), 2000);
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId, location.key, section, format]);

  const activeFilterKeys = Object.keys(filters).filter((k) => filters[k]);
  const filterCount = activeFilterKeys.length + (pairingIsCustom(pairingPreferences) ? 1 : 0);

  return (
    <div className="page">
      <div className="menu-header">
        <h1 className="menu-title">{title}</h1>
      </div>

      <MenuNav
        sections={isDrinksMenu ? DRINK_SECTIONS : null}
        activeSection={section}
        onSection={(id) => setNav({ section: id })}
        formats={isDrinksMenu && section === "wine" ? WINE_FORMATS : null}
        activeFormat={format}
        onFormat={(id) => setNav({ section: "wine", format: id })}
        formatCounts={formatCounts}
        groups={navGroups}
        onFiltersClick={() => setSheetOpen(true)}
        filterCount={filterCount}
      />

      {activeFilterKeys.length > 0 && (
        <div className="active-filters" aria-label="Active filters">
          {activeFilterKeys.map((k) => (
            <button key={k} type="button" className="active-filter" onClick={() => setFilters({ ...filters, [k]: false })}
              aria-label={`Remove filter: ${filterLabel(k)}`}>
              {filterLabel(k)}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
            </button>
          ))}
          <button type="button" className="fs-link" onClick={() => setFilters(EMPTY_FILTERS)}>Clear all</button>
        </div>
      )}

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={visible.length}
        showKidsFilter={showKidsFilter}
        pairingPreferences={pairingPreferences}
        onPairingChange={setPairingPreferences}
      />

      <div className="menu-layout">
        {groups.map((g) => {
          const cat = g.rawCategory;
          const edu = isDrinksMenu ? eduFor(cat) : null;
          const isOpen = !collapsed[g.id];
          const isEduOpen = eduOpen[g.id];
          const bodyId = `${anchorId(g.id)}-items`;
          return (
            <section key={g.id} className="menu-category" id={anchorId(g.id)} aria-labelledby={`${anchorId(g.id)}-h`}>
              <div className="category-header">
                <h2 className="menu-category-title" id={`${anchorId(g.id)}-h`}>
                  {g.label} <span className="category-count">{g.items.length}</span>
                </h2>
                {edu && (
                  <button type="button" className="edu-toggle-btn" aria-expanded={!!isEduOpen}
                    onClick={() => setEduOpen((p) => ({ ...p, [g.id]: !p[g.id] }))}
                    aria-label={`About ${g.label}`} title={`About ${g.label}`}>
                    {isEduOpen ? "−" : "ℹ"}
                  </button>
                )}
                <button type="button" className="edu-toggle-btn" aria-expanded={isOpen} aria-controls={bodyId}
                  onClick={() => setCollapsed((p) => ({ ...p, [g.id]: isOpen }))}
                  aria-label={isOpen ? `Hide ${g.label}` : `Show ${g.label}`}>
                  {isOpen ? "−" : "+"}
                </button>
              </div>

              {edu && isEduOpen && (
                <div className="educational-content">
                  <div className="edu-section"><h4>📚 Origins & History</h4><p>{edu.origins}</p></div>
                  <div className="edu-section"><h4>📈 Current Trends</h4><p>{edu.trends}</p></div>
                  <div className="edu-section"><h4>💡 Expert Tips</h4><p>{edu.expertTips}</p></div>
                </div>
              )}

              {isOpen && (
                <div id={bodyId}>
                  {ITALIAN_MAP.includes(cat) && <CategoryWineMap wines={g.items} categoryName={cat} />}
                  {INTERNATIONAL_MAP.includes(cat) && <InternationalWineMap wines={g.items} categoryName={cat} />}
                  {SPIRITS_MAP.includes(cat) && <SpiritsMap spirits={g.items} categoryName={cat} />}
                  {g.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      pairingPreferences={pairingPreferences}
                      isGlutenFilterActive={filters.glutenFree}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
        {visible.length === 0 && (
          <div className="empty-state">
            <p>Nothing here matches your filters.</p>
            <button type="button" className="fs-link" onClick={() => setFilters(EMPTY_FILTERS)}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuPage;
