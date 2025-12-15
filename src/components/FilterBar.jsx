import React from "react";

function FilterBar({ filters, onChange, showDrinkFilters = false }) {
  const handleToggle = (key) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  const FilterButton = ({ filterKey, label }) => (
    <button
      type="button"
      className="filter-pill"
      onClick={() => handleToggle(filterKey)}
    >
      <input type="checkbox" readOnly checked={filters[filterKey]} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="menu-filters-container">
      {showDrinkFilters && (
        <div className="drink-filters-organized">
          {/* Wine Format Filters */}
          <div className="filter-group">
            <span className="filter-group-label">🍷 Wine Format:</span>
            <div className="filter-group-items">
              <FilterButton filterKey="winesByGlass" label="By Glass" />
              <FilterButton filterKey="halfBottles" label="Half Bottles" />
              <FilterButton filterKey="bottles" label="All Bottles" />
            </div>
          </div>

          {/* Red Wine Bottles */}
          <div className="filter-group">
            <span className="filter-group-label">🍷 Red Bottles:</span>
            <div className="filter-group-items">
              <FilterButton filterKey="italianRedsBottles" label="Italian Reds" />
              <FilterButton filterKey="superTuscanBottles" label="Super Tuscan" />
              <FilterButton filterKey="merlotMalbecBottles" label="Merlot/Malbec" />
              <FilterButton filterKey="pinotNoirBottles" label="Pinot Noir" />
              <FilterButton filterKey="cabernetBottles" label="Cabernet" />
            </div>
          </div>

          {/* White & Sparkling Bottles */}
          <div className="filter-group">
            <span className="filter-group-label">🥂 White & Sparkling:</span>
            <div className="filter-group-items">
              <FilterButton filterKey="sauvignonBlancBottles" label="Sauv Blanc" />
              <FilterButton filterKey="chardonnayBottles" label="Chardonnay" />
              <FilterButton filterKey="interestingWhitesBottles" label="Other Whites" />
              <FilterButton filterKey="sparklingBottles" label="Sparkling" />
            </div>
          </div>

          {/* Cocktails & Beer */}
          <div className="filter-group">
            <span className="filter-group-label">🍹 Mixed & Beer:</span>
            <div className="filter-group-items">
              <FilterButton filterKey="cocktails" label="Cocktails" />
              <FilterButton filterKey="beers" label="Beers" />
              <FilterButton filterKey="coffeeCocktails" label="Coffee Cocktails" />
            </div>
          </div>

          {/* Spirits */}
          <div className="filter-group">
            <span className="filter-group-label">🥃 Spirits:</span>
            <div className="filter-group-items">
              <FilterButton filterKey="bourbon" label="Bourbon" />
              <FilterButton filterKey="rye" label="Rye" />
              <FilterButton filterKey="scotch" label="Scotch" />
              <FilterButton filterKey="cognac" label="Cognac" />
            </div>
          </div>

          {/* Digestifs */}
          <div className="filter-group">
            <span className="filter-group-label">🍸 After Dinner:</span>
            <div className="filter-group-items">
              <FilterButton filterKey="grappa" label="Grappa" />
              <FilterButton filterKey="port" label="Port" />
              <FilterButton filterKey="amaro" label="Amaro" />
            </div>
          </div>
        </div>
      )}

      {/* Dietary Filters */}
      <div className="menu-filters">
        <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("vegetarian")}
      >
        <input type="checkbox" readOnly checked={filters.vegetarian} />
        <span>Vegetarian</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("glutenFree")}
      >
        <input type="checkbox" readOnly checked={filters.glutenFree} />
        <span>Gluten-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("nutFree")}
      >
        <input type="checkbox" readOnly checked={filters.nutFree} />
        <span>Nut-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("dairyFree")}
      >
        <input type="checkbox" readOnly checked={filters.dairyFree} />
        <span>Dairy-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("shellfishFree")}
      >
        <input type="checkbox" readOnly checked={filters.shellfishFree} />
        <span>Shellfish-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("fishFree")}
      >
        <input type="checkbox" readOnly checked={filters.fishFree} />
        <span>Fish-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("soyFree")}
      >
        <input type="checkbox" readOnly checked={filters.soyFree} />
        <span>Soy-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("eggFree")}
      >
        <input type="checkbox" readOnly checked={filters.eggFree} />
        <span>Egg-free</span>
      </button>
      <button
        type="button"
        className="filter-pill"
        onClick={() => handleToggle("kids")}
      >
        <input type="checkbox" readOnly checked={filters.kids} />
        <span>Kids</span>
      </button>
      </div>
    </div>
  );
}

export default FilterBar;
