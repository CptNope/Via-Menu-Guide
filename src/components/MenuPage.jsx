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
  const isDrinksMenu = title === "Drinks";
  
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
    // Drink filters
    winesByGlass: false,
    halfBottles: false,
    bottles: false,
    cocktails: false,
    beers: false,
  });

  const filtered = useMemo(() => {
    return data.filter((item) => {
      // Drink category filters
      if (isDrinksMenu) {
        const wineByGlassCategories = [
          "Italian Reds", "Super Tuscan", "Merlot & Malbec", "Organic Pinot Noir",
          "Cabernet & Blends", "Sauvignon Blanc", "Chardonnay", "Interesting Whites", "Sparkling"
        ];
        const bottleCategories = [
          "Italian Reds Bottles", "Super Tuscan Bottles", "Merlot & Malbec Bottles",
          "Pinot Noir & Interesting Reds Bottles", "Cabernet & Blends Bottles",
          "Sauvignon Blanc Bottles", "Chardonnay Bottles", "Interesting Whites Bottles",
          "Sparkling Bottles", "Half Bottles - Wine"
        ];
        const cocktailCategories = ["Via Signature Cocktails", "Mocktails"];
        const beerCategories = ["Draught Beers", "Bottles & Cans", "Non-Alcoholic Beer"];
        
        const anyDrinkFilter = filters.winesByGlass || filters.halfBottles || filters.bottles || filters.cocktails || filters.beers;
        
        if (anyDrinkFilter) {
          let matchesDrinkFilter = false;
          
          if (filters.winesByGlass && wineByGlassCategories.includes(item.category)) {
            matchesDrinkFilter = true;
          }
          if (filters.halfBottles && item.category === "Half Bottles") {
            matchesDrinkFilter = true;
          }
          if (filters.bottles && bottleCategories.includes(item.category)) {
            matchesDrinkFilter = true;
          }
          if (filters.cocktails && cocktailCategories.includes(item.category)) {
            matchesDrinkFilter = true;
          }
          if (filters.beers && beerCategories.includes(item.category)) {
            matchesDrinkFilter = true;
          }
          
          if (!matchesDrinkFilter) return false;
        }
      }
      
      // Dietary filters
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
  }, [data, filters, isDrinksMenu]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <div className="page">
      <div className="menu-header">
        <h1 className="menu-title">{title}</h1>
        <p className="menu-subtitle">
          Proposed allergen information and pairings &mdash; editable in admin.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} showDrinkFilters={isDrinksMenu} />

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
