import React, { useState, useMemo } from "react";
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

// Move static data outside component to avoid recreation on every render
const WINE_CATEGORIES = [
  'Italian Reds', 'Super Tuscan', 'Merlot & Malbec', 'Pinot Noir & Interesting Reds', 
  'Organic Pinot Noir', 'Cabernet & Blends', 'Sauvignon Blanc', 'Chardonnay', 
  'Interesting Whites', 'Sparkling',
  'Italian Reds Bottles', 'Super Tuscan Bottles', 'Merlot & Malbec Bottles', 
  'Pinot Noir & Interesting Reds Bottles', 'Cabernet & Blends Bottles',
  'Sauvignon Blanc Bottles', 'Chardonnay Bottles', 'Interesting Whites Bottles',
  'Sparkling Bottles',
  'Half Bottles', 'Half Bottles - Wine'
];

const BEER_CATEGORIES = ['Draught', 'Bottles & Cans', 'Non-Alcoholic Beer', 'Beer'];
const WHISKEY_CATEGORIES = ['Bourbon', 'Rye', 'Scotch'];
const AFTER_DINNER_CATEGORIES = ['Port', 'Amaro & Digestivo', 'Coffee Cocktails', 'Grappa', 'Cognac'];
const DESSERT_CATEGORIES = ['Desserts', 'Gelato', 'Sorbetto'];
const APPETIZER_PIZZA_CATEGORIES = ['Appetizers', 'Grilled Pizzas'];
const MAIN_COURSE_CATEGORIES = ['Salads', 'VIA Italian Classics', 'Beef, Pork & Veal', 'House Pastas', 'Seafood', 'VIA Signature Sandwiches', 'VIA Lunch Classics'];

// Pre-filter drinks data once (only runs once when module loads)
const FILTERED_BEERS = drinks.filter(drink => 
  drink.flavorProfile && BEER_CATEGORIES.includes(drink.category)
);

const FILTERED_WHISKEYS = drinks.filter(drink => 
  drink.flavorProfile && WHISKEY_CATEGORIES.includes(drink.category)
);

const FILTERED_AFTER_DINNER = drinks.filter(drink => 
  AFTER_DINNER_CATEGORIES.includes(drink.category)
);

// Pre-combine and filter food data
const ALL_DESSERTS = [...dessertData, ...gelatoData];
const ALL_FOOD_ITEMS = [...appetizers, ...dinnerData, ...ALL_DESSERTS].filter(food => 
  food.category !== 'Pasta' && 
  !food.id?.includes('scoops') && 
  !food.id?.includes('sampler') &&
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

function MenuItemCard({ item, pairingPreferences = null }) {
  const [showPairings, setShowPairings] = useState(false);
  const [showAfterDinnerPairings, setShowAfterDinnerPairings] = useState(false);
  const [showBeerPairings, setShowBeerPairings] = useState(false);
  const [showBourbonPairings, setShowBourbonPairings] = useState(false);
  const [showWhiskeyPairings, setShowWhiskeyPairings] = useState(false);
  const [showDessertPairings, setShowDessertPairings] = useState(false);
  
  // Memoize tags array to avoid recreation on every render
  const tags = useMemo(() => {
    const tagList = [];
    if (item.vegetarian) tagList.push("Vegetarian");
    if (item.glutenFree) tagList.push("Gluten-free");
    if (item.nutFree) tagList.push("Nut-free");
    if (item.kids) tagList.push("Kids");
    return tagList;
  }, [item.vegetarian, item.glutenFree, item.nutFree, item.kids]);

  // Memoize allergen icons
  const allergenIcons = useMemo(() => {
    const icons = [];
    if (item.allergens?.includes("gluten")) icons.push(<GiWheat key="gluten" />);
    if (item.allergens?.includes("nuts")) icons.push(<GiPeanut key="nuts" />);
    if (item.allergens?.includes("dairy")) icons.push(<GiCow key="dairy" />);
    return icons;
  }, [item.allergens]);

  // Memoize category detection - only recalculate when item.category changes
  const categoryFlags = useMemo(() => ({
    isDrinkWithFoodPairing: item.flavorProfile && (
      WINE_CATEGORIES.includes(item.category) ||
      BEER_CATEGORIES.includes(item.category) ||
      WHISKEY_CATEGORIES.includes(item.category) ||
      AFTER_DINNER_CATEGORIES.includes(item.category)
    ),
    isDessert: DESSERT_CATEGORIES.includes(item.category),
    isAppetizerOrPizza: APPETIZER_PIZZA_CATEGORIES.includes(item.category),
    isMainCourse: MAIN_COURSE_CATEGORIES.includes(item.category),
    isBeer: BEER_CATEGORIES.includes(item.category),
    isDessertDrink: [...AFTER_DINNER_CATEGORIES, ...WHISKEY_CATEGORIES].includes(item.category)
  }), [item.category, item.flavorProfile]);

  // Memoize pairing calculations - only recalculate when item or preferences change
  const winePairings = useMemo(() => 
    categoryFlags.isDrinkWithFoodPairing && item.flavorProfile 
      ? getWinePairingRecommendations(item, ALL_FOOD_ITEMS) 
      : null,
    [categoryFlags.isDrinkWithFoodPairing, item, ALL_FOOD_ITEMS]
  );
  
  const foodPairings = useMemo(() => 
    !categoryFlags.isDrinkWithFoodPairing && item.flavorProfile 
      ? getFoodPairingRecommendations(item, drinks, pairingPreferences) 
      : null,
    [categoryFlags.isDrinkWithFoodPairing, item, pairingPreferences]
  );
  
  // Memoize after-dinner pairings
  const afterDinnerPairings = useMemo(() => {
    if (!categoryFlags.isDessert || !item.flavorProfile || FILTERED_AFTER_DINNER.length === 0) return null;
    const topMatches = findPairings(item, FILTERED_AFTER_DINNER, 10);
    return topMatches && topMatches.length > 0
      ? { recommendations: { topMatches } }
      : null;
  }, [categoryFlags.isDessert, item]);

  // Memoize beer pairings
  const beerPairings = useMemo(() => {
    if (!(categoryFlags.isAppetizerOrPizza || categoryFlags.isMainCourse) || !item.flavorProfile || FILTERED_BEERS.length === 0) return null;
    const topBeerMatches = findPairings(item, FILTERED_BEERS, 6);
    return topBeerMatches && topBeerMatches.length > 0
      ? { recommendations: { topMatches: topBeerMatches } }
      : null;
  }, [categoryFlags.isAppetizerOrPizza, categoryFlags.isMainCourse, item]);

  // Memoize bourbon/whiskey pairings
  const bourbonPairings = useMemo(() => {
    if (!(categoryFlags.isAppetizerOrPizza || categoryFlags.isMainCourse) || !item.flavorProfile || FILTERED_WHISKEYS.length === 0) return null;
    const topBourbonMatches = findPairings(item, FILTERED_WHISKEYS, 6);
    return topBourbonMatches && topBourbonMatches.length > 0
      ? { recommendations: { topMatches: topBourbonMatches } }
      : null;
  }, [categoryFlags.isAppetizerOrPizza, categoryFlags.isMainCourse, item]);

  // Memoize whiskey pairings for desserts and beers
  const whiskeyPairings = useMemo(() => {
    if (!(categoryFlags.isDessert || categoryFlags.isBeer) || !item.flavorProfile || FILTERED_WHISKEYS.length === 0) return null;
    const topWhiskeyMatches = findPairings(item, FILTERED_WHISKEYS, 6);
    return topWhiskeyMatches && topWhiskeyMatches.length > 0
      ? { recommendations: { topMatches: topWhiskeyMatches } }
      : null;
  }, [categoryFlags.isDessert, categoryFlags.isBeer, item]);

  // Memoize dessert pairings
  const dessertPairings = useMemo(() => {
    if (!categoryFlags.isDessertDrink || !item.flavorProfile || ALL_DESSERTS.length === 0) return null;
    const topDessertMatches = findPairings(item, ALL_DESSERTS, 6);
    return topDessertMatches && topDessertMatches.length > 0
      ? { recommendations: { topMatches: topDessertMatches } }
      : null;
  }, [categoryFlags.isDessertDrink, item]);

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
          <strong>Server Notes:</strong>{' '}
          {item.serverNotes.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < item.serverNotes.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Brewery/Winery Website Link */}
      {item.website && (
        <div className="website-link">
          <strong>🔗 Website:</strong>{' '}
          <a href={item.website} target="_blank" rel="noopener noreferrer">
            {item.website.replace('https://', '').replace('http://', '').replace('www.', '')}
          </a>
        </div>
      )}

      {/* Standalone Flavor Profile - Available for all items */}
      {item.flavorProfile && (
        <div className="standalone-flavor-profile">
          <FlavorProfileDisplay 
            flavorProfile={item.flavorProfile}
            title="Flavor Profile"
          />
        </div>
      )}

      {/* Wine Pairings for Food Items */}
      {foodPairings && (
        <>
          <button 
            className="pairing-toggle-btn"
            onClick={() => setShowPairings(!showPairings)}
          >
            <span className="toggle-arrow">{showPairings ? '▼' : '▶'}</span>
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

              {/* Half Bottles Section */}
              {foodPairings.recommendations.halfBottles && (
                <div className="pairing-section">
                  <h4>🍾 Half Bottle Recommendations (375ml)</h4>
                  
                  {/* Best half bottle */}
                  {foodPairings.recommendations.halfBottles.best && (
                    <div className="bottle-tier">
                      <label>Perfect for Two</label>
                      
                      <div className="pairing-item-detailed">
                        <div className="wine-info">
                          <div className="wine-header">
                            <span className="wine-name">
                              {foodPairings.recommendations.halfBottles.best.drinkName}
                              {foodPairings.recommendations.halfBottles.best.drinkPronunciation && (
                                <span className="pronunciation"> ({foodPairings.recommendations.halfBottles.best.drinkPronunciation})</span>
                              )}
                            </span>
                            <span className="wine-price">${foodPairings.recommendations.halfBottles.best.drinkPrice}</span>
                          </div>
                          {foodPairings.recommendations.halfBottles.best.drinkRegion && (
                            <div className="wine-region">{foodPairings.recommendations.halfBottles.best.drinkRegion}</div>
                          )}
                          <div className="wine-description">{foodPairings.recommendations.halfBottles.best.drinkDescription}</div>
                          <div className="pairing-explanation">{foodPairings.recommendations.halfBottles.best.explanation}</div>
                          {foodPairings.recommendations.halfBottles.best.flavorProfile && (
                            <FlavorProfileDisplay 
                              flavorProfile={foodPairings.recommendations.halfBottles.best.flavorProfile}
                              title="Tasting Profile"
                            />
                          )}
                        </div>
                        <span className={`match-badge ${foodPairings.recommendations.halfBottles.best.compatibility.toLowerCase().replace(' ', '-')}`}>
                          {foodPairings.recommendations.halfBottles.best.compatibility}
                        </span>
                      </div>

                      {/* Alternative half bottles */}
                      {foodPairings.recommendations.halfBottles.alternatives?.length > 0 && (
                        <div className="alternatives-compact">
                          {foodPairings.recommendations.halfBottles.alternatives.slice(0, 2).map((alt, idx) => (
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
              )}
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
            <span className="toggle-arrow">{showPairings ? '▼' : '▶'}</span>
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
            <span className="toggle-arrow">{showBeerPairings ? '▼' : '▶'}</span>
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
                        {pairing.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={pairing.flavorProfile}
                            title="Tasting Profile"
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
            </div>
          )}
        </>
      )}

      {/* Bourbon/Whiskey Pairings for Appetizers & Pizzas */}
      {bourbonPairings && (
        <>
          <button 
            className="pairing-toggle-btn bourbon-btn"
            onClick={() => setShowBourbonPairings(!showBourbonPairings)}
          >
            <span className="toggle-arrow">{showBourbonPairings ? '▼' : '▶'}</span>
            🥃 {showBourbonPairings ? 'Hide' : 'View'} Bourbon & Whiskey Pairings
          </button>

          {showBourbonPairings && bourbonPairings?.recommendations && (
            <div className="pairing-panel">
              {/* Top Bourbon Matches */}
              {bourbonPairings.recommendations.topMatches?.length > 0 && (
                <div className="pairing-section">
                  <h4>🥃 Top Bourbon & Whiskey Pairings</h4>
                  
                  {bourbonPairings.recommendations.topMatches.slice(0, 6).map((pairing, idx) => (
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
                        {pairing.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={pairing.flavorProfile}
                            title="Tasting Profile"
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
            <span className="toggle-arrow">{showAfterDinnerPairings ? '▼' : '▶'}</span>
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
                        {pairing.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={pairing.flavorProfile}
                            title="Tasting Profile"
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
            </div>
          )}
        </>
      )}

      {/* Whiskey Pairings for Desserts & Beers */}
      {whiskeyPairings && (
        <>
          <button 
            className="pairing-toggle-btn bourbon-btn"
            onClick={() => setShowWhiskeyPairings(!showWhiskeyPairings)}
          >
            <span className="toggle-arrow">{showWhiskeyPairings ? '▼' : '▶'}</span>
            🥃 {showWhiskeyPairings ? 'Hide' : 'View'} Whiskey Pairings
          </button>

          {showWhiskeyPairings && whiskeyPairings?.recommendations && (
            <div className="pairing-panel">
              {/* Top Whiskey Matches */}
              {whiskeyPairings.recommendations.topMatches?.length > 0 && (
                <div className="pairing-section">
                  <h4>🥃 Top Whiskey Pairings</h4>
                  
                  {whiskeyPairings.recommendations.topMatches.slice(0, 6).map((pairing, idx) => (
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
                        {pairing.flavorProfile && (
                          <FlavorProfileDisplay 
                            flavorProfile={pairing.flavorProfile}
                            title="Tasting Profile"
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
            </div>
          )}
        </>
      )}

      {/* Dessert Pairings for After-Dinner Drinks & Whiskeys */}
      {dessertPairings && (
        <>
          <button 
            className="pairing-toggle-btn"
            onClick={() => setShowDessertPairings(!showDessertPairings)}
          >
            <span className="toggle-arrow">{showDessertPairings ? '▼' : '▶'}</span>
            🍰 {showDessertPairings ? 'Hide' : 'View'} Dessert Pairings
          </button>

          {showDessertPairings && dessertPairings?.recommendations && (
            <div className="pairing-panel">
              {/* Top Dessert Matches */}
              {dessertPairings.recommendations.topMatches?.length > 0 && (
                <div className="pairing-section">
                  <h4>🍰 Top Dessert Pairings</h4>
                  
                  {dessertPairings.recommendations.topMatches.slice(0, 6).map((pairing, idx) => (
                    <div key={idx} className="pairing-item-detailed">
                      <div className="wine-info">
                        <div className="wine-header">
                          <span className="wine-name">
                            {pairing.foodName || pairing.drinkName}
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
                            title="Dessert Profile"
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
