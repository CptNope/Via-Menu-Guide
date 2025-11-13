import React from "react";

function PairingsPage({ wines, menus }) {
  const { dinnerData, lunchData, dessertData, kidsData } = menus;

  const allDishes = [
    ...dinnerData,
    ...lunchData,
    ...dessertData,
    ...kidsData,
  ];

  const getDishName = (id) => {
    const dish = allDishes.find((d) => d.id === id);
    return dish ? dish.name : id;
  };

  return (
    <div className="page">
      <div className="menu-header">
        <h1 className="menu-title">Wine Pairings</h1>
        <p className="menu-subtitle">
          Suggested pairings between VIA dishes and wines. Proposed and fully
          editable data.
        </p>
      </div>

      <div className="menu-layout">
        {wines.map((wine) => (
          <section key={wine.id} className="menu-category">
            <h2 className="menu-category-title">
              {wine.name} ({wine.year}) &middot; {wine.type}
            </h2>
            <p className="menu-item-description">
              {wine.region} &mdash; {wine.notes}
            </p>
            {wine.pairsWith && wine.pairsWith.length > 0 && (
              <div className="menu-item-tags">
                <span className="tag-pill">Pairs with:</span>
                {wine.pairsWith.map((dishId) => (
                  <span key={dishId} className="tag-pill">
                    {getDishName(dishId)}
                  </span>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default PairingsPage;
