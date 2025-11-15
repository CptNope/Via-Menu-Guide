# Enhanced Pairing System - Integration Guide

## Overview

Your comprehensive pairing system now supports bi-directional recommendations:

1. **Food → Wine Pairings**: For any menu item, get:
   - Best wine by the glass
   - Best bottles at 3 price tiers (Budget, Premium, Luxury)

2. **Wine → Food Pairings**: For any wine bottle, get:
   - Top overall food matches
   - Best match from each menu category

---

## Quick Start

### 1. Import the Enhanced Pairing Functions

```javascript
import {
  getFoodPairingRecommendations,
  getWinePairingRecommendations,
  getMenuPairingSummary,
  getWineListPairingSummary
} from './utils/enhancedPairing.js';

import drinks from './data/drinks.json';
import appetizers from './data/appetizers.json';
import dinner from './data/dinner.json';
import dessert from './data/dessert.json';
```

---

## Food Item Pairings (Detailed)

### Get Complete Pairing Recommendations

```javascript
// Example: Find pairings for Lobster Ravioli
const lobsterRavioli = dinner.find(item => item.id === 'lobster-ravioli');
const pairings = getFoodPairingRecommendations(lobsterRavioli, drinks);

console.log(pairings);
/* Returns:
{
  foodId: "lobster-ravioli",
  foodName: "Lobster Ravioli",
  recommendations: {
    byTheGlass: {
      drinkId: "chardonnay-glass",
      drinkName: "Chardonnay",
      drinkPrice: 14,
      score: 92,
      compatibility: "Excellent",
      explanation: "Perfect body match - medium-bodied food with medium-bodied wine. Wine's acidity cuts through the richness beautifully."
    },
    alternativeGlasses: [...],  // Top 3 alternative glasses
    bottles: {
      lowTier: {
        label: "Budget-Friendly Bottles (Under $60)",
        best: { ... },
        alternatives: [...]
      },
      midTier: {
        label: "Premium Bottles ($60-$120)",
        best: { ... },
        alternatives: [...]
      },
      highTier: {
        label: "Luxury Bottles ($120+)",
        best: { ... },
        alternatives: [...]
      }
    }
  }
}
*/
```

### Get Concise Summary (For UI Display)

```javascript
const summary = getMenuPairingSummary(lobsterRavioli, drinks);

console.log(summary);
/* Returns:
{
  foodName: "Lobster Ravioli",
  glass: {
    name: "Chardonnay",
    price: 14,
    match: "Excellent",
    score: 92
  },
  bottles: {
    budget: {
      name: "La Crema Chardonnay",
      price: 48,
      match: "Very Good"
    },
    premium: {
      name: "Rombauer Chardonnay",
      price: 68,
      match: "Excellent"
    },
    luxury: {
      name: "Wayfarer Chardonnay",
      price: 95,
      match: "Excellent"
    }
  }
}
*/
```

---

## Wine Bottle Pairings (Reverse)

### Get Complete Food Pairing Recommendations

```javascript
// Example: Find foods for Shafer Hillside Select Cabernet
const shafer = drinks.find(item => item.id === 'shafer-hillside-select-bottle');
const allFoods = [...appetizers, ...dinner, ...dessert];

const foodPairings = getWinePairingRecommendations(shafer, allFoods);

console.log(foodPairings);
/* Returns:
{
  wineId: "shafer-hillside-select-bottle",
  wineName: "Shafer Hillside Select Cabernet",
  winePrice: 345,
  wineCategory: "Cabernet & Blends Bottles",
  recommendations: {
    topMatches: [
      {
        foodId: "bistecca-fiorentina",
        foodName: "Bistecca alla Fiorentina",
        foodCategory: "Beef, Pork & Veal",
        foodPrice: 125,
        score: 95,
        compatibility: "Excellent",
        explanation: "Perfect body match. Tannins complement the umami-rich flavors."
      },
      // ... top 5 overall
    ],
    bestByCategory: {
      "Appetizers": { ... },
      "House Pastas": { ... },
      "Beef, Pork & Veal": { ... },
      // ... etc
    },
    allPairings: {
      // Grouped by category with all matches
    }
  }
}
*/
```

### Get Concise Summary (For Wine List UI)

```javascript
const wineSummary = getWineListPairingSummary(shafer, allFoods);

console.log(wineSummary);
/* Returns:
{
  wineName: "Shafer Hillside Select Cabernet",
  winePrice: 345,
  topFoodPairings: [
    {
      name: "Bistecca alla Fiorentina",
      category: "Beef, Pork & Veal",
      match: "Excellent",
      score: 95,
      explanation: "Perfect body match. Tannins complement the umami-rich flavors."
    },
    // ... top 3
  ],
  bestByCategory: [
    {
      category: "Beef, Pork & Veal",
      foodName: "Bistecca alla Fiorentina",
      match: "Excellent",
      score: 95
    },
    // ... per category
  ]
}
*/
```

---

## React Component Examples

### Menu Item Card with Expandable Pairings

```jsx
import React, { useState } from 'react';
import { getMenuPairingSummary } from './utils/enhancedPairing';

function MenuItemCard({ foodItem, allDrinks }) {
  const [showPairings, setShowPairings] = useState(false);
  const pairings = getMenuPairingSummary(foodItem, allDrinks);

  return (
    <div className="menu-item-card">
      {/* Menu Item Info */}
      <div className="item-header">
        <h3>{foodItem.name}</h3>
        <span className="price">${foodItem.price}</span>
      </div>
      <p className="description">{foodItem.description}</p>

      {/* Pairing Toggle Button */}
      <button 
        className="pairing-toggle"
        onClick={() => setShowPairings(!showPairings)}
      >
        🍷 {showPairings ? 'Hide' : 'View'} Wine Pairings
      </button>

      {/* Expandable Pairing Recommendations */}
      {showPairings && pairings && (
        <div className="pairing-panel">
          {/* By the Glass */}
          {pairings.glass && (
            <div className="pairing-section glass">
              <h4>🍷 By the Glass</h4>
              <div className="pairing-item">
                <span className="wine-name">{pairings.glass.name}</span>
                <span className="wine-price">${pairings.glass.price}</span>
                <span className={`match-badge ${pairings.glass.match.toLowerCase()}`}>
                  {pairings.glass.match}
                </span>
              </div>
            </div>
          )}

          {/* Bottles by Price Tier */}
          <div className="pairing-section bottles">
            <h4>📦 Bottle Recommendations</h4>
            
            {pairings.bottles.budget && (
              <div className="bottle-tier budget">
                <label>Budget-Friendly (Under $60)</label>
                <div className="pairing-item">
                  <span className="wine-name">{pairings.bottles.budget.name}</span>
                  <span className="wine-price">${pairings.bottles.budget.price}</span>
                  <span className="match-badge">{pairings.bottles.budget.match}</span>
                </div>
              </div>
            )}

            {pairings.bottles.premium && (
              <div className="bottle-tier premium">
                <label>Premium ($60-$120)</label>
                <div className="pairing-item">
                  <span className="wine-name">{pairings.bottles.premium.name}</span>
                  <span className="wine-price">${pairings.bottles.premium.price}</span>
                  <span className="match-badge">{pairings.bottles.premium.match}</span>
                </div>
              </div>
            )}

            {pairings.bottles.luxury && (
              <div className="bottle-tier luxury">
                <label>Luxury ($120+)</label>
                <div className="pairing-item">
                  <span className="wine-name">{pairings.bottles.luxury.name}</span>
                  <span className="wine-price">${pairings.bottles.luxury.price}</span>
                  <span className="match-badge">{pairings.bottles.luxury.match}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuItemCard;
```

### Wine List Card with Food Pairings

```jsx
import React, { useState } from 'react';
import { getWineListPairingSummary } from './utils/enhancedPairing';

function WineBottleCard({ wineBottle, allFoods }) {
  const [showPairings, setShowPairings] = useState(false);
  const pairings = getWineListPairingSummary(wineBottle, allFoods);

  return (
    <div className="wine-bottle-card">
      {/* Wine Info */}
      <div className="wine-header">
        <h3>{wineBottle.name}</h3>
        <span className="price">${wineBottle.price}</span>
      </div>
      <p className="wine-description">{wineBottle.description}</p>
      <p className="server-notes">{wineBottle.serverNotes}</p>

      {/* Food Pairing Toggle */}
      <button 
        className="pairing-toggle"
        onClick={() => setShowPairings(!showPairings)}
      >
        🍽️ {showPairings ? 'Hide' : 'View'} Food Pairings
      </button>

      {/* Expandable Food Pairing Recommendations */}
      {showPairings && pairings && (
        <div className="pairing-panel">
          {/* Top Overall Matches */}
          <div className="pairing-section top-matches">
            <h4>🏆 Perfect Pairings</h4>
            {pairings.topFoodPairings.map((pairing, index) => (
              <div key={index} className="pairing-item">
                <div className="food-info">
                  <span className="food-name">{pairing.name}</span>
                  <span className="food-category">{pairing.category}</span>
                </div>
                <span className={`match-badge ${pairing.match.toLowerCase()}`}>
                  {pairing.match}
                </span>
              </div>
            ))}
          </div>

          {/* Best by Category */}
          <div className="pairing-section by-category">
            <h4>📋 Best Match by Course</h4>
            {pairings.bestByCategory.slice(0, 5).map((cat, index) => (
              <div key={index} className="category-pairing">
                <label>{cat.category}</label>
                <div className="pairing-item">
                  <span className="food-name">{cat.foodName}</span>
                  <span className="match-badge">{cat.match}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WineBottleCard;
```

---

## Sample CSS Styling

```css
/* Menu Item / Wine Card Base Styles */
.menu-item-card,
.wine-bottle-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  background: white;
}

.item-header,
.wine-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
  color: #2c5f2d;
  font-size: 1.2em;
}

/* Pairing Toggle Button */
.pairing-toggle {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background: #f8f4e6;
  border: 2px solid #8b7355;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pairing-toggle:hover {
  background: #8b7355;
  color: white;
}

/* Pairing Panel */
.pairing-panel {
  margin-top: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.pairing-section {
  margin-bottom: 20px;
}

.pairing-section h4 {
  margin-bottom: 10px;
  color: #2c5f2d;
  font-size: 1.1em;
}

/* Pairing Items */
.pairing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 8px 0;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #8b7355;
}

.wine-name,
.food-name {
  font-weight: 600;
  flex: 1;
}

.wine-price {
  margin: 0 10px;
  color: #666;
}

/* Match Badges */
.match-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  white-space: nowrap;
}

.match-badge.excellent {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.match-badge.very.good {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.match-badge.good {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* Bottle Tiers */
.bottle-tier {
  margin: 12px 0;
  padding: 10px;
  border-radius: 4px;
}

.bottle-tier label {
  display: block;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
  font-weight: 600;
}

.bottle-tier.budget {
  background: #e8f5e9;
}

.bottle-tier.premium {
  background: #e3f2fd;
}

.bottle-tier.luxury {
  background: #fce4ec;
}

/* Category Pairings */
.category-pairing {
  margin: 10px 0;
}

.category-pairing label {
  display: block;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 3px;
  font-weight: 600;
}

.food-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.food-category {
  font-size: 0.85em;
  color: #888;
  font-style: italic;
}
```

---

## Testing the System

Run the enhanced demo to see live examples:

```bash
node src/utils/pairingDemo_Enhanced.js
```

This will display:
1. Detailed food → wine pairing for Bistecca Fiorentina
2. Detailed wine → food pairing for Shafer Hillside Select
3. Concise menu display format
4. Concise wine list display format
5. React component examples

---

## API Reference

### `getFoodPairingRecommendations(foodItem, allDrinks)`
Returns complete pairing recommendations including glass and bottles at all price tiers.

**Parameters:**
- `foodItem`: Food object with `flavorProfile`
- `allDrinks`: Array of all available drinks

**Returns:** Object with categorized recommendations

---

### `getWinePairingRecommendations(wineBottle, allFoods)`
Returns food pairing recommendations for a wine bottle.

**Parameters:**
- `wineBottle`: Wine bottle object with `flavorProfile`
- `allFoods`: Array of all menu items

**Returns:** Object with top matches and category breakdown

---

### `getMenuPairingSummary(foodItem, allDrinks)`
Returns concise pairing summary optimized for menu UI display.

---

### `getWineListPairingSummary(wineBottle, allFoods)`
Returns concise food pairing summary optimized for wine list UI display.

---

## Next Steps

1. ✅ Test the demo to see live examples
2. ✅ Integrate into your menu/wine list components
3. ✅ Customize the UI styling to match your design
4. ✅ Add animations and transitions for expandable sections
5. ✅ Consider adding "Why this pairing?" tooltips with full explanations

Your comprehensive pairing system is now ready for production! 🍷✨
