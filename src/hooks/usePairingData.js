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
import drinksDraught from "../data/drinks-draught.json";
import drinksBottlesCans from "../data/drinks-bottles-cans.json";
import drinksNonAlcoholicBeer from "../data/drinks-non-alcoholic-beer.json";
import drinksHalfBottles from "../data/drinks-half-bottles.json";
import drinksItalianReds from "../data/drinks-italian-reds.json";
import drinksSuperTuscan from "../data/drinks-super-tuscan.json";
import drinksMerlotMalbec from "../data/drinks-merlot-malbec.json";
import drinksPinotNoir from "../data/drinks-pinot-noir.json";
import drinksCabernetBlends from "../data/drinks-cabernet-blends.json";
import drinksSauvignonBlanc from "../data/drinks-sauvignon-blanc.json";
import drinksChardonnay from "../data/drinks-chardonnay.json";
import drinksInterestingWhites from "../data/drinks-interesting-whites.json";
import drinksSparkling from "../data/drinks-sparkling.json";
import drinksWineFlights from "../data/drinks-wine-flights.json";
import drinksItalianRedsBottles from "../data/drinks-italian-reds-bottles.json";
import drinksSuperTuscanBottles from "../data/drinks-super-tuscan-bottles.json";
import drinksMerlotMalbecBottles from "../data/drinks-merlot-malbec-bottles.json";
import drinksPinotNoirInterestingRedsBottles from "../data/drinks-pinot-noir-interesting-reds-bottles.json";
import drinksCabernetBlendsBottles from "../data/drinks-cabernet-blends-bottles.json";
import drinksSauvignonBlancBottles from "../data/drinks-sauvignon-blanc-bottles.json";
import drinksChardonnayBottles from "../data/drinks-chardonnay-bottles.json";
import drinksInterestingWhitesBottles from "../data/drinks-interesting-whites-bottles.json";
import drinksSparklingBottles from "../data/drinks-sparkling-bottles.json";
import drinksHalfBottlesWine from "../data/drinks-half-bottles-wine.json";
import drinksBourbon from "../data/drinks-bourbon.json";
import drinksRye from "../data/drinks-rye.json";
import drinksScotch from "../data/drinks-scotch.json";
import drinksGrappa from "../data/drinks-grappa.json";
import drinksCognac from "../data/drinks-cognac.json";
import drinksPort from "../data/drinks-port.json";
import drinksAmaroDigestivo from "../data/drinks-amaro-digestivo.json";
import drinksSignatureCocktails from "../data/drinks-signature-cocktails.json";
import drinksMocktails from "../data/drinks-mocktails.json";
import drinksCoffeeCocktails from "../data/drinks-coffee-cocktails.json";
import appetizers from '../data/appetizers.json';
import dinnerData from '../data/dinner.json';
import dessertData from '../data/dessert.json';
import gelatoData from '../data/gelato.json';

const drinks = [
  ...drinksDraught,
  ...drinksBottlesCans,
  ...drinksNonAlcoholicBeer,
  ...drinksSignatureCocktails,
  ...drinksMocktails,
  ...drinksCoffeeCocktails,
  ...drinksItalianReds,
  ...drinksSuperTuscan,
  ...drinksMerlotMalbec,
  ...drinksPinotNoir,
  ...drinksCabernetBlends,
  ...drinksSauvignonBlanc,
  ...drinksChardonnay,
  ...drinksInterestingWhites,
  ...drinksSparkling,
  ...drinksWineFlights,
  ...drinksItalianRedsBottles,
  ...drinksSuperTuscanBottles,
  ...drinksMerlotMalbecBottles,
  ...drinksPinotNoirInterestingRedsBottles,
  ...drinksCabernetBlendsBottles,
  ...drinksSauvignonBlancBottles,
  ...drinksChardonnayBottles,
  ...drinksInterestingWhitesBottles,
  ...drinksSparklingBottles,
  ...drinksHalfBottles,
  ...drinksHalfBottlesWine,
  ...drinksBourbon,
  ...drinksRye,
  ...drinksScotch,
  ...drinksGrappa,
  ...drinksCognac,
  ...drinksPort,
  ...drinksAmaroDigestivo
];

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
