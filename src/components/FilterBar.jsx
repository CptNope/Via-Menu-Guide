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
            <span>All Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("italianRedsBottles")}
          >
            <input type="checkbox" readOnly checked={filters.italianRedsBottles} />
            <span>Italian Reds Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("superTuscanBottles")}
          >
            <input type="checkbox" readOnly checked={filters.superTuscanBottles} />
            <span>Super Tuscan Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("merlotMalbecBottles")}
          >
            <input type="checkbox" readOnly checked={filters.merlotMalbecBottles} />
            <span>Merlot & Malbec Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("pinotNoirBottles")}
          >
            <input type="checkbox" readOnly checked={filters.pinotNoirBottles} />
            <span>Pinot Noir Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("cabernetBottles")}
          >
            <input type="checkbox" readOnly checked={filters.cabernetBottles} />
            <span>Cabernet Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("sauvignonBlancBottles")}
          >
            <input type="checkbox" readOnly checked={filters.sauvignonBlancBottles} />
            <span>Sauvignon Blanc Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("chardonnayBottles")}
          >
            <input type="checkbox" readOnly checked={filters.chardonnayBottles} />
            <span>Chardonnay Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("interestingWhitesBottles")}
          >
            <input type="checkbox" readOnly checked={filters.interestingWhitesBottles} />
            <span>Interesting Whites Bottles</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("sparklingBottles")}
          >
            <input type="checkbox" readOnly checked={filters.sparklingBottles} />
            <span>Sparkling Bottles</span>
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
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("bourbon")}
          >
            <input type="checkbox" readOnly checked={filters.bourbon} />
            <span>Bourbon</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("rye")}
          >
            <input type="checkbox" readOnly checked={filters.rye} />
            <span>Rye</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("scotch")}
          >
            <input type="checkbox" readOnly checked={filters.scotch} />
            <span>Scotch</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("grappa")}
          >
            <input type="checkbox" readOnly checked={filters.grappa} />
            <span>Grappa</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("cognac")}
          >
            <input type="checkbox" readOnly checked={filters.cognac} />
            <span>Cognac</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("port")}
          >
            <input type="checkbox" readOnly checked={filters.port} />
            <span>Port</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("amaro")}
          >
            <input type="checkbox" readOnly checked={filters.amaro} />
            <span>Amaro & Digestivo</span>
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleToggle("coffeeCocktails")}
          >
            <input type="checkbox" readOnly checked={filters.coffeeCocktails} />
            <span>Coffee Cocktails</span>
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
