import React from "react";

function FilterBar({ filters, onChange, showDrinkFilters = false }) {
  const handleToggle = (key) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="menu-filters">
      {showDrinkFilters && (
        <>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("winesByGlass")}
          >
            <input type="checkbox" readOnly checked={filters.winesByGlass} />
            <span>Wines by Glass</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("halfBottles")}
          >
            <input type="checkbox" readOnly checked={filters.halfBottles} />
            <span>Half Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("bottles")}
          >
            <input type="checkbox" readOnly checked={filters.bottles} />
            <span>Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("cocktails")}
          >
            <input type="checkbox" readOnly checked={filters.cocktails} />
            <span>Cocktails</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("beers")}
          >
            <input type="checkbox" readOnly checked={filters.beers} />
            <span>Beers</span>
          </button>
        </>
      )}
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
  );
}

export default FilterBar;
