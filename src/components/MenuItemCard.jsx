import React, { useState } from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { getFoodPairingRecommendations, getWinePairingRecommendations } from "../utils/enhancedPairing.js";
import { findPairings } from "../utils/pairingAlgorithm.js";
import FlavorProfileDisplay from "./FlavorProfileDisplay.jsx";
import drinks from "../data/drinks.json";
import appetizers from "../data/appetizers.json";
import dinnerData from "../data/dinner.json";
import dessertData from "../data/dessert.json";
import gelatoData from "../data/gelato.json";

function MenuItemCard({ item }) {
  const [showPairings, setShowPairings] = useState(false);
  const [showAfterDinnerPairings, setShowAfterDinnerPairings] = useState(false);
  const [showBeerPairings, setShowBeerPairings] = useState(false);
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
  // Includes: wines by the glass, wine bottles, half bottles, bourbon, rye, scotch, Port, Amaro, Coffee Cocktails, Grappa, Cognac
  
  // Wine categories (by the glass and bottles)
  const wineCategories = [
    'Italian Reds', 'Super Tuscan', 'Merlot & Malbec', 'Pinot Noir & Interesting Reds', 
    'Organic Pinot Noir', 'Cabernet & Blends', 'Sauvignon Blanc', 'Chardonnay', 
    'Interesting Whites', 'Sparkling',
    // Bottle categories
    'Italian Reds Bottles', 'Super Tuscan Bottles', 'Merlot & Malbec Bottles', 
    'Pinot Noir & Interesting Reds Bottles', 'Cabernet & Blends Bottles',
    'Sauvignon Blanc Bottles', 'Chardonnay Bottles', 'Interesting Whites Bottles',
    'Sparkling Bottles',
    // Half bottles
    'Half Bottles', 'Half Bottles - Wine'
  ];
  
  const isDrinkWithFoodPairing = item.flavorProfile && (
    // Wine bottles, glasses, and half bottles
    wineCategories.includes(item.category) ||
    // Beers
    item.category === 'Draught' ||
    item.category === 'Bottles & Cans' ||
    item.category === 'Non-Alcoholic Beer' ||
    item.category === 'Beer' ||
    // Bourbon, rye, scotch, and after-dinner drinks
    item.category === 'Bourbon' ||
    item.category === 'Rye' ||
    item.category === 'Scotch' ||
    item.category === 'Port' ||
    item.category === 'Amaro & Digestivo' ||
    item.category === 'Coffee Cocktails' ||
    item.category === 'Grappa' ||
    item.category === 'Cognac'
  );

  // Detect if this is a dessert item
  const isDessert = item.category === 'Desserts' || item.category === 'Gelato' || item.category === 'Sorbetto';
  
  // Detect if this is an appetizer or pizza (should show beer pairings)
  const isAppetizerOrPizza = item.category === 'Appetizers' || item.category === 'Grilled Pizzas';
  
  // Filter beers for appetizer/pizza pairings
  const beers = drinks.filter(drink => 
    drink.flavorProfile &&
    (drink.category === 'Draught' ||
     drink.category === 'Bottles & Cans' ||
     drink.category === 'Non-Alcoholic Beer' ||
     drink.category === 'Beer')
  );
  
  // Filter after-dinner drinks
  const afterDinnerDrinks = drinks.filter(drink => 
    drink.category === 'Port' ||
    drink.category === 'Amaro & Digestivo' ||
    drink.category === 'Coffee Cocktails' ||
    drink.category === 'Grappa' ||
    drink.category === 'Cognac'
  );

  // Get dynamic pairings based on item type
  // Combine all food data including individual gelato/sorbetto
  const allDesserts = [...dessertData, ...gelatoData];
  
  // Filter out pasta types, multi-scoop items, samplers, and any drink categories from food pairing
  const allFoodItems = [...appetizers, ...dinnerData, ...allDesserts].filter(food => 
    food.category !== 'Pasta' && 
    !food.id?.includes('scoops') && 
    !food.id?.includes('sampler') &&
    // Exclude any wine/drink categories that might have snuck in
    !food.category?.includes('Red') &&
    !food.category?.includes('White') &&
    !food.category?.includes('Sparkling') &&
    !food.category?.includes('Rosé') &&
    !food.category?.includes('Port') &&
    !food.category?.includes('Amaro') &&
    !food.category?.includes('Cocktails') &&
    !food.category?.includes('Beer') &&
    !food.category?.includes('Bottles')
  );
  
  const winePairings = isDrinkWithFoodPairing && item.flavorProfile ? getWinePairingRecommendations(item, allFoodItems) : null;
  const foodPairings = !isDrinkWithFoodPairing && item.flavorProfile ? getFoodPairingRecommendations(item, drinks) : null;
  
  // For after-dinner drinks, use findPairings directly and structure results
  let afterDinnerPairings = null;
  if (isDessert && item.flavorProfile && afterDinnerDrinks.length > 0) {
    const topMatches = findPairings(item, afterDinnerDrinks, 10);
    if (topMatches && topMatches.length > 0) {
      afterDinnerPairings = {
        recommendations: {
          topMatches: topMatches
        }
      };
    }
  }

  // For appetizers and pizzas, get beer pairings
  let beerPairings = null;
  if (isAppetizerOrPizza && item.flavorProfile && beers.length > 0) {
    const topBeerMatches = findPairings(item, beers, 6);
    if (topBeerMatches && topBeerMatches.length > 0) {
      beerPairings = {
        recommendations: {
          topMatches: topBeerMatches
        }
      };
    }
  }

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
                        <span className="wine-name">
                          {foodPairings.recommendations.byTheGlass.drinkName}
                          {foodPairings.recommendations.byTheGlass.drinkPronunciation && (
                            <span className="pronunciation"> ({foodPairings.recommendations.byTheGlass.drinkPronunciation})</span>
                          )}
                        </span>
                        <span className="wine-price">${foodPairings.recommendations.byTheGlass.drinkPrice}</span>
                      </div>
                      {foodPairings.recommendations.byTheGlass.drinkRegion && (
                        <div className="wine-region">{foodPairings.recommendations.byTheGlass.drinkRegion}</div>
                      )}
                      <div className="wine-description">{foodPairings.recommendations.byTheGlass.drinkDescription}</div>
                      <div className="pairing-explanation">{foodPairings.recommendations.byTheGlass.explanation}</div>
                      {foodPairings.recommendations.byTheGlass.flavorProfile && (
                        <FlavorProfileDisplay 
                          flavorProfile={foodPairings.recommendations.byTheGlass.flavorProfile}
                          title="Tasting Profile"
                        />
                      )}
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
                          <span className="wine-name">
                            {foodPairings.recommendations.bottles.lowTier.best.drinkName}
                            {foodPairings.recommendations.bottles.lowTier.best.drinkPronunciation && (
                              <span className="pronunciation"> ({foodPairings.recommendations.bottles.lowTier.best.drinkPronunciation})</span>
                            )}
                          </span>
                          <span className="wine-price">${foodPairings.recommendations.bottles.lowTier.best.drinkPrice}</span>
                        </div>
                        {foodPairings.recommendations.bottles.lowTier.best.drinkRegion && (
                          <div className="wine-region">{foodPairings.recommendations.bottles.lowTier.best.drinkRegion}</div>
                        )}
                        <div className="wine-description">{foodPairings.recommendations.bottles.lowTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{foodPairings.recommendations.bottles.lowTier.best.explanation}</div>
                        {foodPairings.recommendations.bottles.lowTier.best.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={foodPairings.recommendations.bottles.lowTier.best.flavorProfile}
                            title="Tasting Profile"
                          />
                        )}
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
                          <span className="wine-name">
                            {foodPairings.recommendations.bottles.midTier.best.drinkName}
                            {foodPairings.recommendations.bottles.midTier.best.drinkPronunciation && (
                              <span className="pronunciation"> ({foodPairings.recommendations.bottles.midTier.best.drinkPronunciation})</span>
                            )}
                          </span>
                          <span className="wine-price">${foodPairings.recommendations.bottles.midTier.best.drinkPrice}</span>
                        </div>
                        {foodPairings.recommendations.bottles.midTier.best.drinkRegion && (
                          <div className="wine-region">{foodPairings.recommendations.bottles.midTier.best.drinkRegion}</div>
                        )}
                        <div className="wine-description">{foodPairings.recommendations.bottles.midTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{foodPairings.recommendations.bottles.midTier.best.explanation}</div>
                        {foodPairings.recommendations.bottles.midTier.best.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={foodPairings.recommendations.bottles.midTier.best.flavorProfile}
                            title="Tasting Profile"
                          />
                        )}
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
                          <span className="wine-name">
                            {foodPairings.recommendations.bottles.highTier.best.drinkName}
                            {foodPairings.recommendations.bottles.highTier.best.drinkPronunciation && (
                              <span className="pronunciation"> ({foodPairings.recommendations.bottles.highTier.best.drinkPronunciation})</span>
                            )}
                          </span>
                          <span className="wine-price">${foodPairings.recommendations.bottles.highTier.best.drinkPrice}</span>
                        </div>
                        {foodPairings.recommendations.bottles.highTier.best.drinkRegion && (
                          <div className="wine-region">{foodPairings.recommendations.bottles.highTier.best.drinkRegion}</div>
                        )}
                        <div className="wine-description">{foodPairings.recommendations.bottles.highTier.best.drinkDescription}</div>
                        <div className="pairing-explanation">{foodPairings.recommendations.bottles.highTier.best.explanation}</div>
                        {foodPairings.recommendations.bottles.highTier.best.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={foodPairings.recommendations.bottles.highTier.best.flavorProfile}
                            title="Tasting Profile"
                          />
                        )}
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
                          <span className="wine-name">
                            {pairing.foodName}
                            {pairing.foodPronunciation && (
                              <span className="pronunciation"> ({pairing.foodPronunciation})</span>
                            )}
                          </span>
                          <span className="food-category">{pairing.foodCategory}</span>
                        </div>
                        {pairing.foodDescription && (
                          <div className="wine-description">{pairing.foodDescription}</div>
                        )}
                        <div className="pairing-explanation">{pairing.explanation}</div>
                        {pairing.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={pairing.flavorProfile}
                            title="Food Profile"
                          />
                        )}
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

      {/* Beer Pairings for Appetizers & Pizzas */}
      {beerPairings && (
        <>
          <button 
            className="pairing-toggle-btn beer-btn"
            onClick={() => setShowBeerPairings(!showBeerPairings)}
          >
            🍺 {showBeerPairings ? 'Hide' : 'View'} Beer Pairings
          </button>

          {showBeerPairings && beerPairings?.recommendations && (
            <div className="pairing-panel">
              {/* Top Beer Matches */}
              {beerPairings.recommendations.topMatches?.length > 0 && (
                <div className="pairing-section">
                  <h4>🍺 Top Beer Pairings</h4>
                  
                  {beerPairings.recommendations.topMatches.slice(0, 6).map((pairing, idx) => (
                    <div key={idx} className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">
                            {pairing.drinkName}
                            {pairing.drinkPronunciation && (
                              <span className="pronunciation"> ({pairing.drinkPronunciation})</span>
                            )}
                          </span>
                          <span className="wine-price">${pairing.drinkPrice}</span>
                        </div>
                        <div className="wine-category">{pairing.drinkCategory}</div>
                        {pairing.drinkDescription && (
                          <div className="wine-description">{pairing.drinkDescription}</div>
                        )}
                        <div className="pairing-explanation">{pairing.explanation}</div>
                      </div>
                      <span className={`match-badge ${pairing.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {pairing.compatibility}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* After-Dinner Drink Pairings for Desserts */}
      {afterDinnerPairings && (
        <>
          <button 
            className="pairing-toggle-btn after-dinner-btn"
            onClick={() => setShowAfterDinnerPairings(!showAfterDinnerPairings)}
          >
            ☕ {showAfterDinnerPairings ? 'Hide' : 'View'} After-Dinner Drink Pairings
          </button>

          {showAfterDinnerPairings && afterDinnerPairings?.recommendations && (
            <div className="pairing-panel">
              {/* Top After-Dinner Drink Matches */}
              {afterDinnerPairings.recommendations.topMatches?.length > 0 && (
                <div className="pairing-section">
                  <h4>☕ Top After-Dinner Drink Pairings</h4>
                  
                  {afterDinnerPairings.recommendations.topMatches.slice(0, 5).map((pairing, idx) => (
                    <div key={idx} className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">
                            {pairing.drinkName}
                            {pairing.drinkPronunciation && (
                              <span className="pronunciation"> ({pairing.drinkPronunciation})</span>
                            )}
                          </span>
                          <span className="wine-price">${pairing.drinkPrice}</span>
                        </div>
                        <div className="wine-category">{pairing.drinkCategory}</div>
                        {pairing.drinkDescription && (
                          <div className="wine-description">{pairing.drinkDescription}</div>
                        )}
                        <div className="pairing-explanation">{pairing.explanation}</div>
                      </div>
                      <span className={`match-badge ${pairing.compatibility.toLowerCase().replace(' ', '-')}`}>
                        {pairing.compatibility}
                      </span>
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
