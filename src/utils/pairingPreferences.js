/**
 * Pairing Preferences Utility
 * 
 * Handles filtering and boosting of pairing results based on user preferences
 */

/**
 * Apply user preferences to pairing results
 * @param {Array} pairings - Array of pairing results from algorithm
 * @param {Array} drinks - Original drink array for filtering
 * @param {Object} preferences - User preferences object
 * @returns {Array} Filtered and boosted pairing results
 */
export function applyPairingPreferences(pairings, drinks, preferences) {
  if (!preferences || (!preferences.prefer && !preferences.exclude && !preferences.priceRange && !preferences.minScore)) {
    return pairings;
  }

  let filteredPairings = [...pairings];

  // Apply exclusions first (remove unwanted pairings)
  if (preferences.exclude && Object.keys(preferences.exclude).length > 0) {
    filteredPairings = filteredPairings.filter(pairing => {
      const drink = drinks.find(d => d.id === pairing.drinkId);
      if (!drink) return true;

      return !shouldExcludeDrink(drink, pairing.flavorProfile, preferences.exclude);
    });
  }

  // Apply price range filter
  if (preferences.priceRange) {
    const { min = 0, max = 1000 } = preferences.priceRange;
    filteredPairings = filteredPairings.filter(pairing => {
      const price = pairing.drinkPrice || 0;
      return price >= min && price <= max;
    });
  }

  // Apply minimum score filter
  if (preferences.minScore && preferences.minScore > 0) {
    filteredPairings = filteredPairings.filter(pairing => 
      pairing.score >= preferences.minScore
    );
  }

  // Apply preference boosts (increase scores for preferred characteristics)
  if (preferences.prefer && Object.keys(preferences.prefer).length > 0) {
    filteredPairings = filteredPairings.map(pairing => {
      const drink = drinks.find(d => d.id === pairing.drinkId);
      if (!drink) return pairing;

      const boost = calculatePreferenceBoost(drink, pairing.flavorProfile, preferences.prefer);
      
      if (boost > 0) {
        return {
          ...pairing,
          score: Math.min(100, pairing.score + boost),
          preferenceBoost: boost,
          boosted: true
        };
      }

      return pairing;
    });

    // Re-sort after boosting
    filteredPairings.sort((a, b) => b.score - a.score);
  }

  return filteredPairings;
}

/**
 * Check if a drink should be excluded based on user preferences
 */
function shouldExcludeDrink(drink, flavorProfile, exclusions) {
  const category = drink.category || '';
  const description = drink.description || '';
  const name = drink.name || '';

  // Exclude red wines
  if (exclusions.red && (
    category.toLowerCase().includes('red') ||
    flavorProfile?.tannin > 0
  )) {
    return true;
  }

  // Exclude white wines
  if (exclusions.white && (
    category.toLowerCase().includes('white') ||
    category.toLowerCase().includes('chardonnay') ||
    category.toLowerCase().includes('sauvignon blanc')
  )) {
    return true;
  }

  // Exclude sparkling wines
  if (exclusions.sparkling && (
    category.toLowerCase().includes('sparkling') ||
    category.toLowerCase().includes('champagne') ||
    category.toLowerCase().includes('prosecco') ||
    flavorProfile?.carbonation > 5
  )) {
    return true;
  }

  // Exclude sweet wines
  if (exclusions.sweetWines && flavorProfile?.sweetness >= 5) {
    return true;
  }

  // Exclude high alcohol wines
  if (exclusions.highAlcohol && flavorProfile?.alcohol > 7) {
    return true;
  }

  // Exclude tannic wines
  if (exclusions.tannic && flavorProfile?.tannin >= 7) {
    return true;
  }

  // Exclude heavily oaked wines
  if (exclusions.oaky && flavorProfile?.oakiness >= 7) {
    return true;
  }

  // Exclude expensive wines
  if (exclusions.expensive && drink.price >= 100) {
    return true;
  }

  // Exclude bottles (glass only)
  if (exclusions.bottles && (
    category.includes('Bottles') || 
    drink.price >= 30
  )) {
    return true;
  }

  // Exclude by the glass (bottles only)
  if (exclusions.byGlass && (
    !category.includes('Bottles') && 
    drink.price < 30
  )) {
    return true;
  }

  return false;
}

/**
 * Calculate boost score based on preferred characteristics
 */
function calculatePreferenceBoost(drink, flavorProfile, preferences) {
  let boost = 0;
  const category = drink.category || '';
  const description = drink.description || '';
  const region = drink.region || '';

  // Italian wines
  if (preferences.italian && (
    description.toLowerCase().includes('italian') ||
    description.toLowerCase().includes('italy') ||
    description.toLowerCase().includes('tuscany') ||
    description.toLowerCase().includes('piemonte') ||
    description.toLowerCase().includes('sicily') ||
    category.includes('Italian')
  )) {
    boost += 10;
  }

  // French wines
  if (preferences.french && (
    description.toLowerCase().includes('france') ||
    description.toLowerCase().includes('french') ||
    description.toLowerCase().includes('bordeaux') ||
    description.toLowerCase().includes('burgundy') ||
    description.toLowerCase().includes('champagne') ||
    description.toLowerCase().includes('loire')
  )) {
    boost += 10;
  }

  // California wines
  if (preferences.california && (
    description.toLowerCase().includes('california') ||
    description.toLowerCase().includes('napa') ||
    description.toLowerCase().includes('sonoma') ||
    description.toLowerCase().includes('paso robles')
  )) {
    boost += 10;
  }

  // Champagne/Sparkling
  if (preferences.champagne && (
    category.toLowerCase().includes('sparkling') ||
    category.toLowerCase().includes('champagne') ||
    flavorProfile?.carbonation > 5
  )) {
    boost += 10;
  }

  // Red wines
  if (preferences.red && (
    category.toLowerCase().includes('red') ||
    flavorProfile?.tannin > 0
  )) {
    boost += 8;
  }

  // White wines
  if (preferences.white && (
    category.toLowerCase().includes('white') ||
    category.toLowerCase().includes('chardonnay') ||
    category.toLowerCase().includes('sauvignon blanc')
  )) {
    boost += 8;
  }

  // Rosé wines
  if (preferences.rosé && (
    category.toLowerCase().includes('rosé') ||
    category.toLowerCase().includes('rose')
  )) {
    boost += 8;
  }

  // Body preferences
  if (preferences.fullBody && flavorProfile?.body === 'full') {
    boost += 8;
  }

  if (preferences.lightBody && flavorProfile?.body === 'light') {
    boost += 8;
  }

  // High acidity
  if (preferences.highAcidity && flavorProfile?.acidity >= 7) {
    boost += 6;
  }

  // Low tannin
  if (preferences.lowTannin && flavorProfile?.tannin <= 3) {
    boost += 6;
  }

  // Mineral/terroir
  if (preferences.mineral && flavorProfile?.minerality >= 6) {
    boost += 8;
  }

  // Fruit-forward
  if (preferences.fruity && flavorProfile?.fruitiness >= 7) {
    boost += 6;
  }

  // Oaky/aged
  if (preferences.oaky && flavorProfile?.oakiness >= 6) {
    boost += 6;
  }

  // Crisp & clean
  if (preferences.crisp && (
    flavorProfile?.acidity >= 7 && 
    flavorProfile?.richness <= 4
  )) {
    boost += 6;
  }

  return boost;
}

/**
 * Get default preferences object
 */
export function getDefaultPreferences() {
  return {
    prefer: {},
    exclude: {},
    priceRange: { min: 0, max: 1000 },
    minScore: 0
  };
}
