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
  MAIN_COURSE_CATEGORIES,
  COCKTAIL_CATEGORIES
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
import lunchData from '../data/lunch.json';
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

const FILTERED_COCKTAILS = drinks.filter(drink =>
  drink.flavorProfile && COCKTAIL_CATEGORIES.includes(drink.category)
);

const FILTERED_AFTER_DINNER = drinks.filter(drink => 
  AFTER_DINNER_CATEGORIES.includes(drink.category)
);

// Pre-combine and filter food data
const ALL_DESSERTS = [...dessertData, ...gelatoData];
// Lunch-only dishes (sandwiches, lunch classics) join the dinner menu; dishes on
// both menus are listed once, using the dinner version.
const DINNER_NAMES = new Set(dinnerData.map(d => d.name));
const LUNCH_ONLY = lunchData.filter(l => !DINNER_NAMES.has(l.name) && l.id !== 'lunch-pasta-sauce');
const ALL_FOOD_ITEMS = [...appetizers, ...dinnerData, ...LUNCH_ONLY, ...ALL_DESSERTS].filter(food => 
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
 * Pairing data for one menu item, computed only when asked for.
 *
 * Every card used to score every pairing on render, even though the panels
 * start closed; on a phone that froze the page for a second or more. Now the
 * hook only works out which pairing buttons to show (cheap), and each
 * `compute.*` function does the scoring when its panel is opened.
 *
 * @param {Object} item - Menu item
 * @param {Object} pairingPreferences - User's pairing preferences
 * @returns {{categoryFlags: Object, available: Object, compute: Object}}
 */
export function usePairingData(item, pairingPreferences = null) {
  const categoryFlags = useMemo(() => ({
    isDrinkWithFoodPairing: !!item.flavorProfile && (
      WINE_CATEGORIES.includes(item.category) ||
      BEER_CATEGORIES.includes(item.category) ||
      WHISKEY_CATEGORIES.includes(item.category) ||
      AFTER_DINNER_CATEGORIES.includes(item.category) ||
      COCKTAIL_CATEGORIES.includes(item.category)
    ),
    isDessert: DESSERT_CATEGORIES.includes(item.category),
    isAppetizerOrPizza: APPETIZER_PIZZA_CATEGORIES.includes(item.category),
    isMainCourse: MAIN_COURSE_CATEGORIES.includes(item.category),
    isBeer: BEER_CATEGORIES.includes(item.category),
    isDessertDrink: [...AFTER_DINNER_CATEGORIES, ...WHISKEY_CATEGORIES].includes(item.category)
  }), [item.category, item.flavorProfile]);

  const hasProfile = !!item.flavorProfile;
  const f = categoryFlags;
  const savory = f.isAppetizerOrPizza || f.isMainCourse;

  // Which pairing buttons this card shows (no scoring here)
  const available = {
    winePairings: hasProfile && f.isDrinkWithFoodPairing,
    foodPairings: hasProfile && !f.isDrinkWithFoodPairing,
    afterDinnerPairings: hasProfile && f.isDessert && FILTERED_AFTER_DINNER.length > 0,
    beerPairings: hasProfile && savory && FILTERED_BEERS.length > 0,
    cocktailPairings: hasProfile && savory && FILTERED_COCKTAILS.length > 0,
    bourbonPairings: hasProfile && savory && FILTERED_WHISKEYS.length > 0,
    whiskeyPairings: hasProfile && (f.isDessert || f.isBeer) && FILTERED_WHISKEYS.length > 0,
    dessertPairings: hasProfile && f.isDessertDrink && ALL_DESSERTS.length > 0,
  };

  const top = (candidates, n) => {
    const topMatches = findPairings(item, candidates, n);
    return topMatches && topMatches.length > 0 ? { recommendations: { topMatches } } : null;
  };

  // Scoring, run only when the matching panel is open
  const compute = {
    winePairings: () => getWinePairingRecommendations(item, ALL_FOOD_ITEMS),
    foodPairings: () => getFoodPairingRecommendations(item, drinks, pairingPreferences),
    afterDinnerPairings: () => top(FILTERED_AFTER_DINNER, 10),
    beerPairings: () => top(FILTERED_BEERS, 6),
    cocktailPairings: () => top(FILTERED_COCKTAILS, 6),
    bourbonPairings: () => top(FILTERED_WHISKEYS, 6),
    whiskeyPairings: () => top(FILTERED_WHISKEYS, 6),
    dessertPairings: () => top(ALL_DESSERTS, 6),
  };

  return { categoryFlags, available, compute };
}
