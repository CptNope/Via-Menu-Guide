/**
 * Enhanced Pairing System Demo
 * 
 * Demonstrates the comprehensive pairing recommendations:
 * 1. Food Item → Wine pairings (glass + bottles by price tier)
 * 2. Wine Bottle → Food pairings (across all menu categories)
 */

import {
  getFoodPairingRecommendations,
  getWinePairingRecommendations,
  getMenuPairingSummary,
  getWineListPairingSummary
} from './enhancedPairing.js';

// Import your data files
import appetizers from '../data/appetizers.json';
import dinner from '../data/dinner.json';
import dessert from '../data/dessert.json';
import drinks from '../data/drinks.json';

// ============================================
// EXAMPLE 1: Food Item Pairing Recommendations
// ============================================

console.log('='.repeat(60));
console.log('EXAMPLE 1: Food → Wine Pairing Recommendations');
console.log('='.repeat(60));

// Find a sample food item - Bistecca Fiorentina (high-end steak)
const bistecca = dinner.find(item => item.id === 'bistecca-fiorentina');

if (bistecca) {
  console.log(`\n🍽️  PAIRING RECOMMENDATIONS FOR: ${bistecca.name}`);
  console.log(`   Price: $${bistecca.price}`);
  console.log(`   Description: ${bistecca.description}`);
  console.log('');

  const pairings = getFoodPairingRecommendations(bistecca, drinks);

  // Best wine by the glass
  if (pairings.recommendations.byTheGlass) {
    const glass = pairings.recommendations.byTheGlass;
    console.log('🍷 BEST WINE BY THE GLASS:');
    console.log(`   ${glass.drinkName} - $${glass.drinkPrice}`);
    console.log(`   Match: ${glass.compatibility} (${glass.score}/100)`);
    console.log(`   Why: ${glass.explanation}`);
    console.log('');
  }

  // Alternative glasses
  if (pairings.recommendations.alternativeGlasses.length > 0) {
    console.log('   Alternative Glasses:');
    pairings.recommendations.alternativeGlasses.forEach((alt, i) => {
      console.log(`   ${i + 2}. ${alt.drinkName} - $${alt.drinkPrice} (${alt.compatibility})`);
    });
    console.log('');
  }

  // Budget-friendly bottles
  const low = pairings.recommendations.bottles.lowTier.best;
  if (low) {
    console.log('💰 BUDGET-FRIENDLY BOTTLE (Under $60):');
    console.log(`   ${low.drinkName} - $${low.drinkPrice}`);
    console.log(`   Match: ${low.compatibility} (${low.score}/100)`);
    console.log(`   Why: ${low.explanation}`);
    console.log('');
  }

  // Premium bottles
  const mid = pairings.recommendations.bottles.midTier.best;
  if (mid) {
    console.log('⭐ PREMIUM BOTTLE ($60-$120):');
    console.log(`   ${mid.drinkName} - $${mid.drinkPrice}`);
    console.log(`   Match: ${mid.compatibility} (${mid.score}/100)`);
    console.log(`   Why: ${mid.explanation}`);
    console.log('');
  }

  // Luxury bottles
  const high = pairings.recommendations.bottles.highTier.best;
  if (high) {
    console.log('💎 LUXURY BOTTLE ($120+):');
    console.log(`   ${high.drinkName} - $${high.drinkPrice}`);
    console.log(`   Match: ${high.compatibility} (${high.score}/100)`);
    console.log(`   Why: ${high.explanation}`);
    console.log('');
  }
}

// ============================================
// EXAMPLE 2: Wine Bottle Food Pairing Recommendations
// ============================================

console.log('\n' + '='.repeat(60));
console.log('EXAMPLE 2: Wine Bottle → Food Pairing Recommendations');
console.log('='.repeat(60));

// Find a premium wine bottle - Shafer Hillside Select (100 pts!)
const shaferCab = drinks.find(item => item.id === 'shafer-hillside-select-bottle');

if (shaferCab) {
  console.log(`\n🍷 FOOD PAIRING RECOMMENDATIONS FOR: ${shaferCab.name}`);
  console.log(`   Price: $${shaferCab.price}`);
  console.log(`   Category: ${shaferCab.category}`);
  console.log(`   Description: ${shaferCab.description}`);
  console.log('');

  // Combine all food items
  const allFoods = [...appetizers, ...dinner, ...dessert];
  
  const foodPairings = getWinePairingRecommendations(shaferCab, allFoods);

  // Top overall matches
  console.log('🏆 TOP 5 FOOD PAIRINGS (Overall):');
  foodPairings.recommendations.topMatches.forEach((pairing, i) => {
    console.log(`\n   ${i + 1}. ${pairing.foodName} (${pairing.foodCategory})`);
    console.log(`      Price: $${pairing.foodPrice}`);
    console.log(`      Match: ${pairing.compatibility} (${pairing.score}/100)`);
    console.log(`      Why: ${pairing.explanation}`);
  });
  console.log('');

  // Best from each category
  console.log('\n📋 BEST PAIRING FROM EACH MENU CATEGORY:');
  Object.entries(foodPairings.recommendations.bestByCategory).forEach(([category, pairing]) => {
    console.log(`\n   ${category}:`);
    console.log(`   → ${pairing.foodName} - $${pairing.foodPrice}`);
    console.log(`     ${pairing.compatibility} Match (${pairing.score}/100)`);
  });
  console.log('');
}

// ============================================
// EXAMPLE 3: Concise Menu Display Format
// ============================================

console.log('\n' + '='.repeat(60));
console.log('EXAMPLE 3: Menu Display Format (For UI)');
console.log('='.repeat(60));

const lobsterRavioli = dinner.find(item => item.id === 'lobster-ravioli');

if (lobsterRavioli) {
  console.log(`\n📱 MENU ITEM CARD:`);
  console.log(`   ${lobsterRavioli.name} - $${lobsterRavioli.price}`);
  console.log('');

  const menuSummary = getMenuPairingSummary(lobsterRavioli, drinks);

  if (menuSummary.glass) {
    console.log(`   🍷 Pairs with: ${menuSummary.glass.name} ($${menuSummary.glass.price})`);
    console.log(`      ${menuSummary.glass.match} Match (${menuSummary.glass.score}/100)`);
  }

  console.log('\n   📦 Bottle Recommendations:');
  if (menuSummary.bottles.budget) {
    console.log(`      Budget: ${menuSummary.bottles.budget.name} ($${menuSummary.bottles.budget.price})`);
  }
  if (menuSummary.bottles.premium) {
    console.log(`      Premium: ${menuSummary.bottles.premium.name} ($${menuSummary.bottles.premium.price})`);
  }
  if (menuSummary.bottles.luxury) {
    console.log(`      Luxury: ${menuSummary.bottles.luxury.name} ($${menuSummary.bottles.luxury.price})`);
  }
  console.log('');
}

// ============================================
// EXAMPLE 4: Wine List Display Format
// ============================================

console.log('\n' + '='.repeat(60));
console.log('EXAMPLE 4: Wine List Display Format (For UI)');
console.log('='.repeat(60));

const quintessa = drinks.find(item => item.id === 'quintessa-cabernet-bottle');

if (quintessa) {
  console.log(`\n🍾 WINE BOTTLE CARD:`);
  console.log(`   ${quintessa.name} - $${quintessa.price}`);
  console.log(`   ${quintessa.description}`);
  console.log('');

  const allFoods = [...appetizers, ...dinner, ...dessert];
  const wineSummary = getWineListPairingSummary(quintessa, allFoods);

  console.log('   🍽️  Perfect Pairings:');
  wineSummary.topFoodPairings.forEach((pairing, i) => {
    console.log(`      ${i + 1}. ${pairing.name} (${pairing.match} - ${pairing.score}/100)`);
  });

  console.log('\n   📋 Best Match by Course:');
  wineSummary.bestByCategory.slice(0, 5).forEach(cat => {
    console.log(`      ${cat.category}: ${cat.foodName} (${cat.match})`);
  });
  console.log('');
}

// ============================================
// EXAMPLE 5: React Component Example
// ============================================

console.log('\n' + '='.repeat(60));
console.log('EXAMPLE 5: Sample React Component Usage');
console.log('='.repeat(60));

const componentExample = `
// Example React Component for Menu Item with Pairing Recommendations
import { getMenuPairingSummary } from './utils/enhancedPairing';

function MenuItemCard({ foodItem, allDrinks }) {
  const pairings = getMenuPairingSummary(foodItem, allDrinks);
  const [showPairings, setShowPairings] = useState(false);

  return (
    <div className="menu-item-card">
      <h3>{foodItem.name} - \\${foodItem.price}</h3>
      <p>{foodItem.description}</p>
      
      <button onClick={() => setShowPairings(!showPairings)}>
        🍷 View Wine Pairings
      </button>

      {showPairings && pairings && (
        <div className="pairing-recommendations">
          {pairings.glass && (
            <div className="pairing-glass">
              <h4>By the Glass</h4>
              <p>{pairings.glass.name} - \\${pairings.glass.price}</p>
              <span className="match-badge">{pairings.glass.match}</span>
            </div>
          )}

          <div className="pairing-bottles">
            <h4>Bottle Recommendations</h4>
            
            {pairings.bottles.budget && (
              <div className="bottle-rec budget">
                <strong>Budget:</strong> {pairings.bottles.budget.name}
                <span>\\${pairings.bottles.budget.price}</span>
              </div>
            )}
            
            {pairings.bottles.premium && (
              <div className="bottle-rec premium">
                <strong>Premium:</strong> {pairings.bottles.premium.name}
                <span>\\${pairings.bottles.premium.price}</span>
              </div>
            )}
            
            {pairings.bottles.luxury && (
              <div className="bottle-rec luxury">
                <strong>Luxury:</strong> {pairings.bottles.luxury.name}
                <span>\\${pairings.bottles.luxury.price}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`;

console.log(componentExample);

console.log('\n' + '='.repeat(60));
console.log('✅ Enhanced pairing system demo complete!');
console.log('='.repeat(60));
