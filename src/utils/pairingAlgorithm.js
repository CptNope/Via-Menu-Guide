/**
 * Food & Drink Pairing Algorithm
 * 
 * Analyzes flavor profiles to generate intelligent pairing suggestions
 * based on classic wine/food pairing principles.
 */

/**
 * Main pairing function - finds best drink matches for a food item
 * @param {Object} foodItem - Food item with flavorProfile
 * @param {Array} drinks - Array of drink items with flavorProfile
 * @param {number} maxResults - Maximum number of pairings to return (default: 5)
 * @returns {Array} Sorted array of pairing suggestions with scores and explanations
 */
export function findPairings(foodItem, drinks, maxResults = 5) {
  if (!foodItem?.flavorProfile || !Array.isArray(drinks)) {
    return [];
  }

  const pairings = drinks
    .filter(drink => drink?.flavorProfile)
    .map(drink => {
      const score = calculatePairingScore(foodItem.flavorProfile, drink.flavorProfile);
      const explanation = generateExplanation(foodItem, drink, score);
      
      return {
        drinkId: drink.id,
        drinkName: drink.name,
        drinkPronunciation: drink.pronunciation,
        drinkDescription: drink.description,
        drinkCategory: drink.category,
        drinkRegion: drink.region,
        drinkPrice: drink.price,
        score: score.total,
        scoreBreakdown: score,
        explanation,
        compatibility: getCompatibilityLevel(score.total),
        flavorProfile: drink.flavorProfile
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return pairings;
}

/**
 * Calculate pairing score based on multiple factors
 * @param {Object} foodProfile - Food flavor profile
 * @param {Object} drinkProfile - Drink flavor profile
 * @returns {Object} Score breakdown and total
 */
function calculatePairingScore(foodProfile, drinkProfile) {
  const scores = {
    bodyMatch: scoreBodyMatch(foodProfile.body, drinkProfile.body),
    acidityBalance: scoreAcidityBalance(foodProfile, drinkProfile),
    richnessBalance: scoreRichnessBalance(foodProfile, drinkProfile),
    spiceHandling: scoreSpiceHandling(foodProfile, drinkProfile),
    umamiPairing: scoreUmamiPairing(foodProfile, drinkProfile),
    sweetnessBalance: scoreSweetnessBalance(foodProfile, drinkProfile),
    flavorHarmony: scoreFlavorHarmony(foodProfile, drinkProfile),
    total: 0
  };

  // Calculate weighted total (max 100)
  scores.total = Math.round(
    scores.bodyMatch * 0.20 +           // 20% weight
    scores.acidityBalance * 0.20 +      // 20% weight
    scores.richnessBalance * 0.20 +     // 20% weight
    scores.spiceHandling * 0.15 +       // 15% weight
    scores.umamiPairing * 0.10 +        // 10% weight
    scores.sweetnessBalance * 0.05 +    // 5% weight
    scores.flavorHarmony * 0.10         // 10% weight
  );

  return scores;
}

/**
 * Score body matching (light with light, full with full)
 */
function scoreBodyMatch(foodBody, drinkBody) {
  const bodyMap = { light: 1, medium: 2, full: 3 };
  const foodWeight = bodyMap[foodBody] || 2;
  const drinkWeight = bodyMap[drinkBody] || 2;
  
  const difference = Math.abs(foodWeight - drinkWeight);
  
  if (difference === 0) return 100; // Perfect match
  if (difference === 1) return 70;  // Good match
  return 40; // Acceptable but not ideal
}

/**
 * Score acidity balance (high acid food needs high acid drink)
 */
function scoreAcidityBalance(foodProfile, drinkProfile) {
  const foodAcidity = foodProfile.acidity || 0;
  const drinkAcidity = drinkProfile.acidity || 0;
  
  // High acid food pairs well with high acid drink
  if (foodAcidity >= 6 && drinkAcidity >= 7) return 100;
  if (foodAcidity >= 6 && drinkAcidity >= 5) return 80;
  
  // Low acid food is flexible
  if (foodAcidity <= 4) return 90;
  
  // Medium acid food
  if (foodAcidity >= 4 && foodAcidity <= 6) {
    if (drinkAcidity >= 5) return 85;
    return 70;
  }
  
  return 60;
}

/**
 * Score richness balance (rich food needs acid or tannin to cut through)
 */
function scoreRichnessBalance(foodProfile, drinkProfile) {
  const foodRichness = foodProfile.richness || 0;
  const drinkAcidity = drinkProfile.acidity || 0;
  const drinkTannin = drinkProfile.tannin || 0;
  const drinkCarbonation = drinkProfile.carbonation || 0;
  
  // Rich food (7+) needs acid, tannin, or bubbles to cut through
  if (foodRichness >= 7) {
    const cuttingPower = Math.max(drinkAcidity, drinkTannin, drinkCarbonation);
    if (cuttingPower >= 7) return 100;
    if (cuttingPower >= 5) return 80;
    return 50;
  }
  
  // Medium richness (4-6) is flexible
  if (foodRichness >= 4 && foodRichness <= 6) {
    return 85;
  }
  
  // Light food (0-3) pairs well with light drinks
  const drinkRichness = drinkProfile.richness || 0;
  if (foodRichness <= 3 && drinkRichness <= 5) return 90;
  
  return 70;
}

/**
 * Score spice handling (spicy food needs sweet, low alcohol, or off-dry)
 */
function scoreSpiceHandling(foodProfile, drinkProfile) {
  const foodSpice = foodProfile.spiciness || 0;
  
  // No spice - flexible pairing
  if (foodSpice === 0) return 90;
  
  const drinkSweetness = drinkProfile.sweetness || 0;
  const drinkAlcohol = drinkProfile.alcohol || 5;
  
  // Spicy food (4+) needs sweetness and lower alcohol
  if (foodSpice >= 4) {
    let score = 50;
    if (drinkSweetness >= 4) score += 30; // Sweet helps
    if (drinkAlcohol <= 6) score += 20;   // Lower alcohol helps
    return Math.min(100, score);
  }
  
  // Mild spice (1-3)
  if (foodSpice >= 1 && foodSpice <= 3) {
    if (drinkSweetness >= 2 || drinkAlcohol <= 7) return 85;
    return 75;
  }
  
  return 80;
}

/**
 * Score umami pairing (high umami food pairs with high umami/tannin wine)
 */
function scoreUmamiPairing(foodProfile, drinkProfile) {
  const foodUmami = foodProfile.umami || 0;
  const drinkUmami = drinkProfile.umami || 0;
  const drinkTannin = drinkProfile.tannin || 0;
  
  // High umami food (7+) pairs well with tannic or aged wines
  if (foodUmami >= 7) {
    if (drinkTannin >= 6 || drinkUmami >= 4) return 100;
    if (drinkTannin >= 4 || drinkUmami >= 2) return 80;
    return 60;
  }
  
  // Medium umami (4-6)
  if (foodUmami >= 4 && foodUmami <= 6) {
    if (drinkTannin >= 4 || drinkUmami >= 2) return 90;
    return 75;
  }
  
  // Low umami - flexible
  return 85;
}

/**
 * Score sweetness balance
 */
function scoreSweetnessBalance(foodProfile, drinkProfile) {
  const foodSweetness = foodProfile.sweetness || 0;
  const drinkSweetness = drinkProfile.sweetness || 0;
  
  // Sweet food (6+) needs equal or sweeter drink
  if (foodSweetness >= 6) {
    if (drinkSweetness >= foodSweetness) return 100;
    if (drinkSweetness >= 4) return 70;
    return 40;
  }
  
  // Otherwise flexible
  return 85;
}

/**
 * Score flavor note harmony (matching or complementary notes)
 */
function scoreFlavorHarmony(foodProfile, drinkProfile) {
  const foodNotes = foodProfile.flavorNotes || [];
  const drinkNotes = drinkProfile.flavorNotes || [];
  
  if (foodNotes.length === 0 || drinkNotes.length === 0) return 70;
  
  // Complementary flavor pairings
  const complementary = {
    'seafood': ['citrus', 'mineral', 'crisp', 'bright'],
    'creamy': ['citrus', 'oak', 'butter', 'rich'],
    'spicy': ['sweet', 'fruity', 'off-dry'],
    'earthy': ['earthy', 'truffle', 'mushroom', 'complex'],
    'fruity': ['fruity', 'cherry', 'berry'],
    'meaty': ['dark-fruit', 'oak', 'bold', 'structured'],
    'fresh': ['crisp', 'bright', 'citrus', 'clean']
  };
  
  let matches = 0;
  foodNotes.forEach(foodNote => {
    // Direct match
    if (drinkNotes.includes(foodNote)) {
      matches += 2;
    }
    
    // Complementary match
    const complements = complementary[foodNote] || [];
    drinkNotes.forEach(drinkNote => {
      if (complements.includes(drinkNote)) {
        matches += 1;
      }
    });
  });
  
  // Normalize score
  const maxPossible = foodNotes.length * 2;
  const score = Math.min(100, (matches / maxPossible) * 100 + 50);
  
  return score;
}

/**
 * Generate human-readable explanation for the pairing
 */
function generateExplanation(foodItem, drink, scoreBreakdown) {
  const reasons = [];
  const fp = foodItem.flavorProfile;
  const dp = drink.flavorProfile;
  
  // Body matching
  if (scoreBreakdown.bodyMatch >= 90) {
    reasons.push(`Perfect body match - ${fp.body}-bodied food with ${dp.body}-bodied wine`);
  }
  
  // Acidity
  if (fp.acidity >= 6 && dp.acidity >= 7) {
    reasons.push(`High acidity in both creates a harmonious pairing`);
  }
  
  // Richness
  if (fp.richness >= 7 && (dp.acidity >= 6 || dp.tannin >= 6 || dp.carbonation >= 6)) {
    const cutter = dp.carbonation >= 6 ? 'bubbles' : (dp.tannin >= 6 ? 'tannins' : 'acidity');
    reasons.push(`Wine's ${cutter} cuts through the richness beautifully`);
  }
  
  // Spice
  if (fp.spiciness >= 4) {
    if (dp.sweetness >= 4) {
      reasons.push(`Sweetness balances the spice perfectly`);
    }
    if (dp.alcohol <= 6) {
      reasons.push(`Lower alcohol won't amplify the heat`);
    }
  }
  
  // Umami
  if (fp.umami >= 7 && dp.tannin >= 6) {
    reasons.push(`Tannins complement the umami-rich flavors`);
  }
  
  // Flavor notes
  const foodNotes = fp.flavorNotes || [];
  const drinkNotes = dp.flavorNotes || [];
  const sharedNotes = foodNotes.filter(note => drinkNotes.includes(note));
  if (sharedNotes.length > 0) {
    reasons.push(`Shared ${sharedNotes[0]} flavors create harmony`);
  }
  
  // Default if no specific reasons
  if (reasons.length === 0) {
    reasons.push(`Well-balanced pairing with complementary characteristics`);
  }
  
  return reasons.join('. ');
}

/**
 * Get compatibility level label
 */
function getCompatibilityLevel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 65) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Acceptable';
}

/**
 * Helper function to find reverse pairings (which foods go with a drink)
 * @param {Object} drinkItem - Drink item with flavorProfile
 * @param {Array} foods - Array of food items with flavorProfile
 * @param {number} maxResults - Maximum number of pairings to return
 * @returns {Array} Sorted array of food pairing suggestions
 */
export function findFoodPairings(drinkItem, foods, maxResults = 5) {
  if (!drinkItem?.flavorProfile || !Array.isArray(foods)) {
    return [];
  }

  const pairings = foods
    .filter(food => food?.flavorProfile)
    .map(food => {
      const score = calculatePairingScore(food.flavorProfile, drinkItem.flavorProfile);
      const explanation = generateExplanation(food, drinkItem, score);
      
      return {
        foodId: food.id,
        foodName: food.name,
        foodDescription: food.description,
        foodPronunciation: food.pronunciation,
        foodCategory: food.category,
        foodPrice: food.price,
        score: score.total,
        scoreBreakdown: score,
        explanation,
        compatibility: getCompatibilityLevel(score.total),
        flavorProfile: food.flavorProfile
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return pairings;
}
