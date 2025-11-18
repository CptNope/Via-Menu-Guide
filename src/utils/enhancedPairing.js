/**
 * Enhanced Pairing Utility
 * 
 * Extends the base pairing algorithm to provide categorized recommendations:
 * - For food items: Best wine by the glass + bottles at low/mid/high price points
 * - For wine bottles: Best food pairings across all menu categories
 */

import { findPairings, findFoodPairings } from './pairingAlgorithm.js';
import { applyPairingPreferences } from './pairingPreferences.js';

/**
 * Get comprehensive pairing recommendations for a food item
 * @param {Object} foodItem - Food item with flavorProfile
 * @param {Array} allDrinks - All available drinks (glasses + bottles)
 * @param {Object} preferences - User pairing preferences (optional)
 * @returns {Object} Categorized pairing recommendations
 */
export function getFoodPairingRecommendations(foodItem, allDrinks, preferences = null) {
  if (!foodItem?.flavorProfile || !Array.isArray(allDrinks)) {
    return null;
  }

  // Separate wines by the glass and bottles
  // Wines by the glass are typically lower priced (under $20) and don't have "Bottles" or "Half" in category
  // Explicitly exclude beer and cocktail categories
  const winesByGlass = allDrinks.filter(drink => 
    drink.flavorProfile && 
    drink.price < 20 &&
    !drink.category?.includes('Bottles') &&
    !drink.category?.includes('Half') &&
    (drink.category?.includes('Red') || 
     drink.category?.includes('White') || 
     drink.category?.includes('Rosé') ||
     drink.category?.includes('Rose') ||
     drink.category?.includes('Sparkling')) &&
    // Exclude beers and cocktails
    drink.category !== 'Draught' &&
    drink.category !== 'Bottles & Cans' &&
    drink.category !== 'Non-Alcoholic Beer' &&
    drink.category !== 'Beer' &&
    !drink.category?.includes('Cocktails')
  );
  
  // Bottles are marked with "Bottles" or "Half Bottle" in category or have higher prices
  // Explicitly exclude beer categories
  const bottles = allDrinks.filter(drink => 
    drink.flavorProfile &&
    (drink.category?.includes('Bottles') || 
     drink.category?.includes('Half Bottle') || 
     drink.price >= 30) &&
    // Exclude beers, cocktails, and other non-wine drinks
    drink.category !== 'Bottles & Cans' &&
    drink.category !== 'Draught' &&
    drink.category !== 'Non-Alcoholic Beer' &&
    drink.category !== 'Beer' &&
    !drink.category?.includes('Cocktails')
  );

  // Find best wine by the glass
  let glassPairings = findPairings(foodItem, winesByGlass, 20);
  
  // Apply user preferences to glass pairings
  if (preferences) {
    glassPairings = applyPairingPreferences(glassPairings, winesByGlass, preferences);
  }
  
  const bestGlass = glassPairings[0] || null;

  // Categorize bottles by price tier
  const lowPriceBottles = bottles.filter(b => b.price < 60);
  const midPriceBottles = bottles.filter(b => b.price >= 60 && b.price < 120);
  const highPriceBottles = bottles.filter(b => b.price >= 120);

  // Find best bottle in each tier
  let lowPairings = findPairings(foodItem, lowPriceBottles, 10);
  let midPairings = findPairings(foodItem, midPriceBottles, 10);
  let highPairings = findPairings(foodItem, highPriceBottles, 10);
  
  // Apply user preferences to bottle pairings
  if (preferences) {
    lowPairings = applyPairingPreferences(lowPairings, lowPriceBottles, preferences);
    midPairings = applyPairingPreferences(midPairings, midPriceBottles, preferences);
    highPairings = applyPairingPreferences(highPairings, highPriceBottles, preferences);
  }

  return {
    foodId: foodItem.id,
    foodName: foodItem.name,
    recommendations: {
      byTheGlass: bestGlass,
      alternativeGlasses: glassPairings.slice(1, 4), // Top 3 alternatives
      bottles: {
        lowTier: {
          label: 'Budget-Friendly Bottles (Under $60)',
          best: lowPairings[0] || null,
          alternatives: lowPairings.slice(1, 3)
        },
        midTier: {
          label: 'Premium Bottles ($60-$120)',
          best: midPairings[0] || null,
          alternatives: midPairings.slice(1, 3)
        },
        highTier: {
          label: 'Luxury Bottles ($120+)',
          best: highPairings[0] || null,
          alternatives: highPairings.slice(1, 3)
        }
      }
    }
  };
}

/**
 * Get food pairing recommendations for a wine bottle
 * @param {Object} wineBottle - Wine bottle with flavorProfile
 * @param {Array} allFoods - All menu items from all categories
 * @returns {Object} Categorized food pairing recommendations
 */
export function getWinePairingRecommendations(wineBottle, allFoods) {
  if (!wineBottle?.flavorProfile || !Array.isArray(allFoods)) {
    return null;
  }

  // Find all food pairings
  const allPairings = findFoodPairings(wineBottle, allFoods, 20);

  // Group by food category
  const categorized = {};
  allPairings.forEach(pairing => {
    const category = pairing.foodCategory || 'Other';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(pairing);
  });

  // Get top overall matches
  const topMatches = allPairings.slice(0, 5);

  // Get best match from each major category
  const categories = ['Appetizers', 'House Pastas', 'Seafood', 'VIA Italian Classics', 
                      'Beef, Pork & Veal', 'Grilled Pizzas', 'Salads', 'Desserts', 'Gelato', 'Sorbetto'];
  
  const bestByCategory = {};
  categories.forEach(cat => {
    const categoryPairings = categorized[cat] || [];
    if (categoryPairings.length > 0) {
      bestByCategory[cat] = categoryPairings[0];
    }
  });

  return {
    wineId: wineBottle.id,
    wineName: wineBottle.name,
    winePrice: wineBottle.price,
    wineCategory: wineBottle.category,
    recommendations: {
      topMatches,
      bestByCategory,
      allPairings: categorized
    }
  };
}

/**
 * Format pairing recommendation for display
 * @param {Object} pairing - Pairing object from algorithm
 * @returns {string} Formatted display string
 */
export function formatPairingDisplay(pairing) {
  if (!pairing) return 'No pairing available';
  
  const name = pairing.drinkName || pairing.foodName || 'Unknown';
  const price = pairing.drinkPrice || pairing.foodPrice || 0;
  const compatibility = pairing.compatibility || 'Unknown';
  const score = pairing.score || 0;
  
  return `${name} ($${price}) - ${compatibility} Match (${score}/100)`;
}

/**
 * Get a summary of pairing recommendations suitable for menu display
 * @param {Object} foodItem - Food item
 * @param {Array} allDrinks - All drinks
 * @returns {Object} Concise recommendations for menu UI
 */
export function getMenuPairingSummary(foodItem, allDrinks) {
  const recs = getFoodPairingRecommendations(foodItem, allDrinks);
  
  if (!recs) return null;

  return {
    foodName: recs.foodName,
    glass: recs.recommendations.byTheGlass ? {
      name: recs.recommendations.byTheGlass.drinkName,
      price: recs.recommendations.byTheGlass.drinkPrice,
      match: recs.recommendations.byTheGlass.compatibility,
      score: recs.recommendations.byTheGlass.score
    } : null,
    bottles: {
      budget: recs.recommendations.bottles.lowTier.best ? {
        name: recs.recommendations.bottles.lowTier.best.drinkName,
        price: recs.recommendations.bottles.lowTier.best.drinkPrice,
        match: recs.recommendations.bottles.lowTier.best.compatibility
      } : null,
      premium: recs.recommendations.bottles.midTier.best ? {
        name: recs.recommendations.bottles.midTier.best.drinkName,
        price: recs.recommendations.bottles.midTier.best.drinkPrice,
        match: recs.recommendations.bottles.midTier.best.compatibility
      } : null,
      luxury: recs.recommendations.bottles.highTier.best ? {
        name: recs.recommendations.bottles.highTier.best.drinkName,
        price: recs.recommendations.bottles.highTier.best.drinkPrice,
        match: recs.recommendations.bottles.highTier.best.compatibility
      } : null
    }
  };
}

/**
 * Get a summary of food pairings for wine bottle display
 * @param {Object} wineBottle - Wine bottle
 * @param {Array} allFoods - All food items
 * @returns {Object} Concise food recommendations for wine list UI
 */
export function getWineListPairingSummary(wineBottle, allFoods) {
  const recs = getWinePairingRecommendations(wineBottle, allFoods);
  
  if (!recs) return null;

  return {
    wineName: recs.wineName,
    winePrice: recs.winePrice,
    topFoodPairings: recs.recommendations.topMatches.slice(0, 3).map(p => ({
      name: p.foodName,
      category: p.foodCategory,
      match: p.compatibility,
      score: p.score,
      explanation: p.explanation
    })),
    bestByCategory: Object.entries(recs.recommendations.bestByCategory).map(([cat, pairing]) => ({
      category: cat,
      foodName: pairing.foodName,
      match: pairing.compatibility,
      score: pairing.score
    }))
  };
}
