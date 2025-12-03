import { useMemo } from 'react';
import { getFoodPairingRecommendations, getWinePairingRecommendations } from '../utils/enhancedPairing.js';
import { findPairings } from '../utils/pairingAlgorithm.js';
import {
  WINE_CATEGORIES,
  BEER_CATEGORIES,
  WHISKEY_CATEGORIES,
  AFTER_DINNER_CATEGORIES,
  DESSERT_CATEGORIES,
  APPETIZER_PIZZA_CATEGORIES,
  MAIN_COURSE_CATEGORIES
} from '../constants/pairingCategories.js';
import drinks from '../data/drinks.json';
import appetizers from '../data/appetizers.json';
import dinnerData from '../data/dinner.json';
import dessertData from '../data/dessert.json';
import gelatoData from '../data/gelato.json';

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

/**
 * Custom hook for calculating and managing pairing data
 * @param {Object} item - Menu item
 * @param {Object} pairingPreferences - User's pairing preferences
 * @returns {Object} Pairing data and category flags
 */
export function usePairingData(item, pairingPreferences = null) {
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
    [categoryFlags.isDrinkWithFoodPairing, item]
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

  return {
    categoryFlags,
    winePairings,
    foodPairings,
    afterDinnerPairings,
    beerPairings,
    bourbonPairings,
    whiskeyPairings,
    dessertPairings
  };
}
