import React from "react";

function FilterBar({ filters, onChange }) {
  const handleToggle = (key) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
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
        onClick={() => handleToggle("kids")}
      >
        <input type="checkbox" readOnly checked={filters.kids} />
        <span>Kids</span>
      </button>
    </div>
  );
}

export default FilterBar;
