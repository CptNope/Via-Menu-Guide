import React, { useState } from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { getFoodPairingRecommendations, getWinePairingRecommendations } from "../utils/enhancedPairing.js";
import drinks from "../data/drinks.json";
import appetizers from "../data/appetizers.json";
import dinner from "../data/dinner.json";

function MenuItemCard({ item }) {
  const [showPairings, setShowPairings] = useState(false);
  const tags = [];
  if (item.vegetarian) tags.push("Vegetarian");
  if (item.glutenFree) tags.push("Gluten-free");
  if (item.nutFree) tags.push("Nut-free");
  if (item.kids) tags.push("Kids");

  const allergenIcons = [];
  if (item.allergens?.includes("gluten")) allergenIcons.push(<GiWheat key="gluten" />);
  if (item.allergens?.includes("nuts")) allergenIcons.push(<GiPeanut key="nuts" />);
  if (item.allergens?.includes("dairy")) allergenIcons.push(<GiCow key="dairy" />);

  // Determine if this is a drink that should show food pairings
  // Includes: wines by the glass, wine bottles, Port, Amaro, Coffee Cocktails, Grappa, Cognac
  const isDrinkWithFoodPairing = item.flavorProfile && (
    // Wine bottles
    (item.price >= 30 && (
      item.category?.includes('Bottles') || 
      item.category?.includes('Red') || 
      item.category?.includes('White') || 
      item.category?.includes('Rosé') || 
      item.category?.includes('Rose') ||
      item.category?.includes('Sparkling')
    )) ||
    // Wines by the glass
    (item.price < 20 && !item.category?.includes('Bottles') && (
      item.category?.includes('Red') || 
      item.category?.includes('White') || 
      item.category?.includes('Rosé') || 
      item.category?.includes('Rose') ||
      item.category?.includes('Sparkling')
    )) ||
    // After-dinner drinks
    item.category === 'Port' ||
    item.category === 'Amaro & Digestivo' ||
    item.category === 'Coffee Cocktails' ||
    item.category === 'Grappa' ||
    item.category === 'Cognac'
  );

  // Get dynamic pairings based on item type
  const allFoodItems = [...appetizers, ...dinner];
  const winePairings = isDrinkWithFoodPairing && item.flavorProfile ? getWinePairingRecommendations(item, allFoodItems) : null;
  const foodPairings = !isDrinkWithFoodPairing && item.flavorProfile ? getFoodPairingRecommendations(item, drinks) : null;

  return (
    <article className="menu-item-card">
      <div className="menu-item-header">
        <div className="menu-item-name">
          {item.name}
          {item.pronunciation && (
            <span className="pronunciation"> ({item.pronunciation})</span>
          )}
        </div>
        <div className="menu-item-price">
          {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price}
        </div>
      </div>
      {item.description && (
        <p className="menu-item-description">{item.description}</p>
      )}

      {item.serverNotes && (
        <div className="server-notes">
          <strong>Server Notes:</strong> {item.serverNotes}
        </div>
      )}

      {/* Wine Pairings for Food Items */}
      {foodPairings && (
        <>
          <button 
            className="pairing-toggle-btn"
            onClick={() => setShowPairings(!showPairings)}
          >
            🍷 {showPairings ? 'Hide' : 'View'} Wine Pairings
          </button>

          {showPairings && foodPairings?.recommendations && (
            <div className="pairing-panel">
              {/* By the Glass - Show top 3 */}
              {foodPairings.recommendations.byTheGlass && (
                <div className="pairing-section">
                  <h4>🍷 By the Glass</h4>
                  
                  {/* Best glass */}
                  <div className="pairing-item-detailed">
                    <div className="wine-info">
                      <div className="wine-header">
                        <span className="wine-name">{foodPairings.recommendations.byTheGlass.drinkName}</span>
                        <span className="wine-price">${foodPairings.recommendations.byTheGlass.drinkPrice}</span>
                      </div>
                      <div className="wine-description">{foodPairings.recommendations.byTheGlass.drinkDescription}</div>
                      <div className="pairing-explanation">{foodPairings.recommendations.byTheGlass.explanation}</div>
                    </div>
                    <span className={`match-badge ${foodPairings.recommendations.byTheGlass.compatibility.toLowerCase().replace(' ', '-')}`}>
                      {foodPairings.recommendations.byTheGlass.compatibility}
                    </span>
                  </div>

                  {/* Alternative glasses */}
                  {foodPairings.recommendations.alternativeGlasses?.length > 0 && (
                    <div className="alternatives">
                      <label>Also pairs well with:</label>
                      {foodPairings.recommendations.alternativeGlasses.slice(0, 2).map((alt, idx) => (
                        <div key={idx} className="pairing-item-compact">
                          <span className="wine-name">{alt.drinkName}</span>
                          <span className="wine-price">${alt.drinkPrice}</span>
                          <span className={`match-badge ${alt.compatibility.toLowerCase().replace(' ', '-')}`}>
                            {alt.compatibility}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bottles by Price Tier - Show top 3 in each */}
              <div className="pairing-section">
                <h4>🍾 Bottle Recommendations</h4>
                
                {/* Budget Tier */}
                {foodPairings.recommendations.bottles.lowTier.best && (
                  <div className="bottle-tier">
                    <label>Budget-Friendly (Under $60)</label>
                    
                    {/* Best bottle */}
                    <div className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{foodPairings.recommendations.bottles.lowTier.best.drinkName}</span>
                          <span className="wine-price">${foodPairings.recommendations.bottles.lowTier.best.drinkPrice}</span>
                        </div>
                        <div className="wine-description">{foodPairings.recommendations.bottles.lowTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{foodPairings.recommendations.bottles.lowTier.best.explanation}</div>
                      </div>
                      <span className={`match-badge ${foodPairings.recommendations.bottles.lowTier.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {foodPairings.recommendations.bottles.lowTier.best.compatibility}
                      </span>
                    </div>

                    {/* Alternative bottles */}
                    {foodPairings.recommendations.bottles.lowTier.alternatives?.length > 0 && (
                      <div className="alternatives-compact">
                        {foodPairings.recommendations.bottles.lowTier.alternatives.slice(0, 2).map((alt, idx) => (
                          <div key={idx} className="pairing-item-compact">
                            <span className="wine-name">{alt.drinkName}</span>
                            <span className="wine-price">${alt.drinkPrice}</span>
                            <span className={`match-badge-small ${alt.compatibility.toLowerCase().replace(' ', '-')}`}>
                              {alt.compatibility}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Premium Tier */}
                {foodPairings.recommendations.bottles.midTier.best && (
                  <div className="bottle-tier">
                    <label>Premium ($60-$120)</label>
                    
                    <div className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{foodPairings.recommendations.bottles.midTier.best.drinkName}</span>
                          <span className="wine-price">${foodPairings.recommendations.bottles.midTier.best.drinkPrice}</span>
                        </div>
                        <div className="wine-description">{foodPairings.recommendations.bottles.midTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{foodPairings.recommendations.bottles.midTier.best.explanation}</div>
                      </div>
                      <span className={`match-badge ${foodPairings.recommendations.bottles.midTier.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {foodPairings.recommendations.bottles.midTier.best.compatibility}
                      </span>
                    </div>

                    {foodPairings.recommendations.bottles.midTier.alternatives?.length > 0 && (
                      <div className="alternatives-compact">
                        {foodPairings.recommendations.bottles.midTier.alternatives.slice(0, 2).map((alt, idx) => (
                          <div key={idx} className="pairing-item-compact">
                            <span className="wine-name">{alt.drinkName}</span>
                            <span className="wine-price">${alt.drinkPrice}</span>
                            <span className={`match-badge-small ${alt.compatibility.toLowerCase().replace(' ', '-')}`}>
                              {alt.compatibility}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Luxury Tier */}
                {foodPairings.recommendations.bottles.highTier.best && (
                  <div className="bottle-tier">
                    <label>Luxury ($120+)</label>
                    
                    <div className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{foodPairings.recommendations.bottles.highTier.best.drinkName}</span>
                          <span className="wine-price">${foodPairings.recommendations.bottles.highTier.best.drinkPrice}</span>
                        </div>
                        <div className="wine-description">{foodPairings.recommendations.bottles.highTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{foodPairings.recommendations.bottles.highTier.best.explanation}</div>
                      </div>
                      <span className={`match-badge ${foodPairings.recommendations.bottles.highTier.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {foodPairings.recommendations.bottles.highTier.best.compatibility}
                      </span>
                    </div>

                    {foodPairings.recommendations.bottles.highTier.alternatives?.length > 0 && (
                      <div className="alternatives-compact">
                        {foodPairings.recommendations.bottles.highTier.alternatives.slice(0, 2).map((alt, idx) => (
                          <div key={idx} className="pairing-item-compact">
                            <span className="wine-name">{alt.drinkName}</span>
                            <span className="wine-price">${alt.drinkPrice}</span>
                            <span className={`match-badge-small ${alt.compatibility.toLowerCase().replace(' ', '-')}`}>
                              {alt.compatibility}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Food Pairings for Wines (by glass/bottle) and After-Dinner Drinks */}
      {winePairings && (
        <>
          <button 
            className="pairing-toggle-btn"
            onClick={() => setShowPairings(!showPairings)}
          >
            🍽️ {showPairings ? 'Hide' : 'View'} Food Pairings
          </button>

          {showPairings && winePairings?.recommendations && (
            <div className="pairing-panel">
              {/* Top Food Matches */}
              {winePairings.recommendations.topMatches?.length > 0 && (
                <div className="pairing-section">
                  <h4>🍽️ Top Food Pairings</h4>
                  
                  {winePairings.recommendations.topMatches.slice(0, 5).map((pairing, idx) => (
                    <div key={idx} className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{pairing.foodName}</span>
                          <span className="food-category">{pairing.foodCategory}</span>
                        </div>
                        <div className="pairing-explanation">{pairing.explanation}</div>
                      </div>
                      <span className={`match-badge ${pairing.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {pairing.compatibility}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Best Match by Category */}
              {winePairings.recommendations.bestByCategory && Object.keys(winePairings.recommendations.bestByCategory).length > 0 && (
                <div className="pairing-section">
                  <h4>📋 Best Match by Course</h4>
                  
                  {Object.entries(winePairings.recommendations.bestByCategory).map(([category, pairing]) => (
                    <div key={category} className="category-pairing">
                      <label>{category}</label>
                      <div className="pairing-item-compact">
                        <span className="wine-name">{pairing.foodName}</span>
                        <span className={`match-badge-small ${pairing.compatibility.toLowerCase().replace(' ', '-')}`}>
                          {pairing.compatibility}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="menu-item-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag === "Vegetarian" && <TbLeaf />} {tag}
          </span>
        ))}
        {item.allergens &&
          item.allergens.length > 0 &&
          item.allergens.map((a) => (
            <span key={a} className="tag-pill danger">
              {a}
            </span>
          ))}
        {allergenIcons.length > 0 && (
          <span className="tag-pill danger">{allergenIcons}</span>
        )}
      </div>
    </article>
  );
}

export default MenuItemCard;
