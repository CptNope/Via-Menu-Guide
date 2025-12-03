import React, { useMemo, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import FilterBar from "./FilterBar";
import PairingControls from "./PairingControls";
import { getDefaultPreferences } from "../utils/pairingPreferences";
import educationalGuide from "../data/drinksEducationalGuide.json";

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
  const [expandedCategories, setExpandedCategories] = useState({});
  const [pairingPreferences, setPairingPreferences] = useState(getDefaultPreferences());
  
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
    bourbon: false,
    rye: false,
    scotch: false,
    grappa: false,
    cognac: false,
    port: false,
    amaro: false,
    coffeeCocktails: false,
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
        const cocktailCategories = ["Signature Cocktails", "Mocktails"];
        const beerCategories = ["Draught", "Bottles & Cans", "Non-Alcoholic Beer"];
        
        const anyDrinkFilter = filters.winesByGlass || filters.halfBottles || filters.bottles || 
                               filters.cocktails || filters.beers || filters.bourbon || filters.rye || 
                               filters.scotch || filters.grappa || filters.cognac || filters.port || 
                               filters.amaro || filters.coffeeCocktails;
        
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
          if (filters.bourbon && item.category === "Bourbon") {
            matchesDrinkFilter = true;
          }
          if (filters.rye && item.category === "Rye") {
            matchesDrinkFilter = true;
          }
          if (filters.scotch && item.category === "Scotch") {
            matchesDrinkFilter = true;
          }
          if (filters.grappa && item.category === "Grappa") {
            matchesDrinkFilter = true;
          }
          if (filters.cognac && item.category === "Cognac") {
            matchesDrinkFilter = true;
          }
          if (filters.port && item.category === "Port") {
            matchesDrinkFilter = true;
          }
          if (filters.amaro && item.category === "Amaro & Digestivo") {
            matchesDrinkFilter = true;
          }
          if (filters.coffeeCocktails && item.category === "Coffee Cocktails") {
            matchesDrinkFilter = true;
          }
          
          if (!matchesDrinkFilter) return false;
        }
      }
      
      // Dietary filters
      if (filters.vegetarian && !item.vegetarian) return false;
      if (filters.glutenFree && !(item.glutenFree || item.canBeMadeGlutenFree)) return false;
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

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getEducationalInfo = (category) => {
    // Map category names to educational guide keys
    const categoryMap = {
      "Bourbon": "Bourbon",
      "Rye": "Rye",
      "Scotch": "Scotch",
      "Grappa": "Grappa",
      "Cognac": "Cognac",
      "Port": "Port",
      "Amaro & Digestivo": "Amaro & Digestivo",
      "Coffee Cocktails": "Coffee Cocktails",
      "Italian Reds": "Italian Reds",
      "Italian Reds Bottles": "Italian Reds",
      "Super Tuscan": "Super Tuscan",
      "Super Tuscan Bottles": "Super Tuscan",
      "Sparkling": "Sparkling Bottles",
      "Sparkling Bottles": "Sparkling Bottles",
      "Merlot & Malbec": "Merlot & Malbec",
      "Merlot & Malbec Bottles": "Merlot & Malbec",
      "Organic Pinot Noir": "Organic Pinot Noir",
      "Cabernet & Blends": "Cabernet & Blends",
      "Cabernet & Blends Bottles": "Cabernet & Blends",
      "Sauvignon Blanc": "Sauvignon Blanc",
      "Sauvignon Blanc Bottles": "Sauvignon Blanc",
      "Chardonnay": "Chardonnay",
      "Chardonnay Bottles": "Chardonnay",
      "Interesting Whites": "Interesting Whites",
      "Interesting Whites Bottles": "Interesting Whites",
      "Pinot Noir & Interesting Reds Bottles": "Pinot Noir & Interesting Reds",
      "Via Signature Cocktails": "Via Signature Cocktails",
      "Mocktails": "Mocktails",
      "Draught Beers": "Draught Beers",
      "Bottles & Cans": "Bottles & Cans",
      "Non-Alcoholic Beer": "Non-Alcoholic Beer",
    };
    
    const guideKey = categoryMap[category];
    return guideKey ? educationalGuide.categories[guideKey] : null;
  };

  return (
    <div className="page">
      <div className="menu-header">
        <h1 className="menu-title">{title}</h1>
        <p className="menu-subtitle">
          Proposed allergen information and pairings &mdash; editable in admin.
        </p>
      </div>

      <PairingControls 
        preferences={pairingPreferences}
        onChange={setPairingPreferences}
      />
      
      <FilterBar filters={filters} onChange={setFilters} showDrinkFilters={isDrinksMenu} />

      <div className="menu-layout">
        {Object.keys(grouped).map((cat) => {
          const eduInfo = isDrinksMenu ? getEducationalInfo(cat) : null;
          const isExpanded = expandedCategories[cat];
          
          return (
            <section key={cat} className="menu-category">
              <div className="category-header">
                <h2 className="menu-category-title">{cat}</h2>
                {eduInfo && (
                  <button
                    className="edu-toggle-btn"
                    onClick={() => toggleCategory(cat)}
                    title={isExpanded ? "Hide educational info" : "Show educational info"}
                  >
                    {isExpanded ? "−" : "ℹ"}
                  </button>
                )}
              </div>
              
              {eduInfo && isExpanded && (
                <div className="educational-content">
                  <div className="edu-section">
                    <h4>📚 Origins & History</h4>
                    <p>{eduInfo.origins}</p>
                  </div>
                  <div className="edu-section">
                    <h4>📈 Current Trends</h4>
                    <p>{eduInfo.trends}</p>
                  </div>
                  <div className="edu-section">
                    <h4>💡 Expert Tips</h4>
                    <p>{eduInfo.expertTips}</p>
                  </div>
                </div>
              )}
              
              {grouped[cat].map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  pairingPreferences={pairingPreferences}
                  isGlutenFilterActive={filters.glutenFree}
                />
              ))}
            </section>
          );
        })}
        {filtered.length === 0 && (
          <p>No items match the selected filters yet.</p>
        )}
      </div>
    </div>
  );
}

export default MenuPage;
