import React, { useMemo, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import FilterBar from "./FilterBar";

const groupByCategory = (items) => {
  const map = {};
  items.forEach((item) => {
    const cat = item.category || "Other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
  });
  return map;
};

function MenuPage({ title, data }) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    glutenFree: false,
    nutFree: false,
    dairyFree: false,
    shellfishFree: false,
    fishFree: false,
    soyFree: false,
    eggFree: false,
    kids: false,
  });

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.vegetarian && !item.vegetarian) return false;
      if (filters.glutenFree && !item.glutenFree) return false;
      if (filters.nutFree && !item.nutFree) return false;
      if (filters.dairyFree && item.allergens?.includes("dairy")) return false;
      if (filters.shellfishFree && item.allergens?.includes("shellfish")) return false;
      if (filters.fishFree && item.allergens?.includes("fish")) return false;
      if (filters.soyFree && item.allergens?.includes("soy")) return false;
      if (filters.eggFree && item.allergens?.includes("eggs")) return false;
      if (filters.kids && !item.kids) return false;
      return true;
    });
  }, [data, filters]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <div className="page">
      <div className="menu-header">
        <h1 className="menu-title">{title}</h1>
        <p className="menu-subtitle">
          Proposed allergen information and pairings &mdash; editable in admin.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="menu-layout">
        {Object.keys(grouped).map((cat) => (
          <section key={cat} className="menu-category">
            <h2 className="menu-category-title">{cat}</h2>
            {grouped[cat].map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </section>
        ))}
        {filtered.length === 0 && (
          <p>No items match the selected filters yet.</p>
        )}
      </div>
    </div>
  );
}

export default MenuPage;
