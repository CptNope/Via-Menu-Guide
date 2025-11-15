import React, { useState } from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { getFoodPairingRecommendations } from "../utils/enhancedPairing.js";
import drinks from "../data/drinks.json";

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

  // Get dynamic pairings if item has flavor profile
  const pairings = item.flavorProfile ? getFoodPairingRecommendations(item, drinks) : null;

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

      {pairings && (
        <>
          <button 
            className="pairing-toggle-btn"
            onClick={() => setShowPairings(!showPairings)}
          >
            🍷 {showPairings ? 'Hide' : 'View'} Wine Pairings
          </button>

          {showPairings && pairings?.recommendations && (
            <div className="pairing-panel">
              {/* By the Glass - Show top 3 */}
              {pairings.recommendations.byTheGlass && (
                <div className="pairing-section">
                  <h4>🍷 By the Glass</h4>
                  
                  {/* Best glass */}
                  <div className="pairing-item-detailed">
                    <div className="wine-info">
                      <div className="wine-header">
                        <span className="wine-name">{pairings.recommendations.byTheGlass.drinkName}</span>
                        <span className="wine-price">${pairings.recommendations.byTheGlass.drinkPrice}</span>
                      </div>
                      <div className="wine-description">{pairings.recommendations.byTheGlass.drinkDescription}</div>
                      <div className="pairing-explanation">{pairings.recommendations.byTheGlass.explanation}</div>
                    </div>
                    <span className={`match-badge ${pairings.recommendations.byTheGlass.compatibility.toLowerCase().replace(' ', '-')}`}>
                      {pairings.recommendations.byTheGlass.compatibility}
                    </span>
                  </div>

                  {/* Alternative glasses */}
                  {pairings.recommendations.alternativeGlasses?.length > 0 && (
                    <div className="alternatives">
                      <label>Also pairs well with:</label>
                      {pairings.recommendations.alternativeGlasses.slice(0, 2).map((alt, idx) => (
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
                {pairings.recommendations.bottles.lowTier.best && (
                  <div className="bottle-tier">
                    <label>Budget-Friendly (Under $60)</label>
                    
                    {/* Best bottle */}
                    <div className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{pairings.recommendations.bottles.lowTier.best.drinkName}</span>
                          <span className="wine-price">${pairings.recommendations.bottles.lowTier.best.drinkPrice}</span>
                        </div>
                        <div className="wine-description">{pairings.recommendations.bottles.lowTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{pairings.recommendations.bottles.lowTier.best.explanation}</div>
                      </div>
                      <span className={`match-badge ${pairings.recommendations.bottles.lowTier.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {pairings.recommendations.bottles.lowTier.best.compatibility}
                      </span>
                    </div>

                    {/* Alternative bottles */}
                    {pairings.recommendations.bottles.lowTier.alternatives?.length > 0 && (
                      <div className="alternatives-compact">
                        {pairings.recommendations.bottles.lowTier.alternatives.slice(0, 2).map((alt, idx) => (
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
                {pairings.recommendations.bottles.midTier.best && (
                  <div className="bottle-tier">
                    <label>Premium ($60-$120)</label>
                    
                    <div className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{pairings.recommendations.bottles.midTier.best.drinkName}</span>
                          <span className="wine-price">${pairings.recommendations.bottles.midTier.best.drinkPrice}</span>
                        </div>
                        <div className="wine-description">{pairings.recommendations.bottles.midTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{pairings.recommendations.bottles.midTier.best.explanation}</div>
                      </div>
                      <span className={`match-badge ${pairings.recommendations.bottles.midTier.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {pairings.recommendations.bottles.midTier.best.compatibility}
                      </span>
                    </div>

                    {pairings.recommendations.bottles.midTier.alternatives?.length > 0 && (
                      <div className="alternatives-compact">
                        {pairings.recommendations.bottles.midTier.alternatives.slice(0, 2).map((alt, idx) => (
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
                {pairings.recommendations.bottles.highTier.best && (
                  <div className="bottle-tier">
                    <label>Luxury ($120+)</label>
                    
                    <div className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">{pairings.recommendations.bottles.highTier.best.drinkName}</span>
                          <span className="wine-price">${pairings.recommendations.bottles.highTier.best.drinkPrice}</span>
                        </div>
                        <div className="wine-description">{pairings.recommendations.bottles.highTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{pairings.recommendations.bottles.highTier.best.explanation}</div>
                      </div>
                      <span className={`match-badge ${pairings.recommendations.bottles.highTier.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {pairings.recommendations.bottles.highTier.best.compatibility}
                      </span>
                    </div>

                    {pairings.recommendations.bottles.highTier.alternatives?.length > 0 && (
                      <div className="alternatives-compact">
                        {pairings.recommendations.bottles.highTier.alternatives.slice(0, 2).map((alt, idx) => (
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
