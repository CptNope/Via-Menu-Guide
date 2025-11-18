# Pairing Controls Usage Guide

## Overview

The new **Pairing Controls** feature allows users to customize their pairing recommendations by specifying preferences and exclusions. This provides a more personalized dining experience.

## Components

### 1. **PairingControls Component**
Location: `src/components/PairingControls.jsx`

A UI component that provides:
- **Preferences**: Wine characteristics to prioritize (e.g., Italian wines, high acidity, mineral terroir)
- **Exclusions**: Wine types to exclude (e.g., red wines, sweet wines, expensive bottles)
- **Price Range Filter**: Set minimum and maximum price for recommendations
- **Minimum Match Score**: Only show pairings above a certain quality threshold

### 2. **Pairing Preferences Utility**
Location: `src/utils/pairingPreferences.js`

Backend logic that:
- Filters out excluded wines from results
- Boosts scores for preferred characteristics (+6 to +10 points)
- Applies price range filtering
- Enforces minimum score thresholds

## Integration Example

### In a Component (e.g., MenuItemCard.jsx or PairingsPage.jsx):

```javascript
import React, { useState } from 'react';
import PairingControls from './components/PairingControls';
import { getFoodPairingRecommendations } from './utils/enhancedPairing';
import { getDefaultPreferences } from './utils/pairingPreferences';

function MyComponent({ foodItem, drinks }) {
  // State for pairing preferences
  const [pairingPreferences, setPairingPreferences] = useState(getDefaultPreferences());

  // Get pairing recommendations with preferences applied
  const pairings = getFoodPairingRecommendations(
    foodItem, 
    drinks, 
    pairingPreferences  // Pass preferences here
  );

  return (
    <div>
      {/* Pairing Controls UI */}
      <PairingControls
        preferences={pairingPreferences}
        onChange={setPairingPreferences}
      />

      {/* Display pairing results */}
      {pairings && (
        <div>
          <h3>Best Wine by the Glass</h3>
          {pairings.recommendations.byTheGlass && (
            <div>
              {pairings.recommendations.byTheGlass.drinkName} - $
              {pairings.recommendations.byTheGlass.drinkPrice}
              {pairings.recommendations.byTheGlass.boosted && " ⭐ Matches your preferences!"}
            </div>
          )}

          <h3>Bottle Recommendations</h3>
          {/* Low tier bottles */}
          {pairings.recommendations.bottles.lowTier.best && (
            <div>
              Budget: {pairings.recommendations.bottles.lowTier.best.drinkName}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Preference Options

### **Prefer (15 options)**
Users can prefer these wine characteristics:

1. **Italian Wines** - Boosts Italian regional wines (+10 points)
2. **French Wines** - Boosts French regional wines (+10 points)
3. **California Wines** - Boosts California wines (+10 points)
4. **Champagne/Sparkling** - Boosts bubbly wines (+10 points)
5. **Red Wines** - Boosts red wine categories (+8 points)
6. **White Wines** - Boosts white wine categories (+8 points)
7. **Rosé Wines** - Boosts rosé categories (+8 points)
8. **Full-Bodied** - Prefers full-bodied wines (+8 points)
9. **Light-Bodied** - Prefers light-bodied wines (+8 points)
10. **High Acidity** - Prefers wines with acidity ≥7 (+6 points)
11. **Low Tannin** - Prefers wines with tannin ≤3 (+6 points)
12. **Mineral/Terroir** - Prefers wines with minerality ≥6 (+8 points)
13. **Fruit-Forward** - Prefers wines with fruitiness ≥7 (+6 points)
14. **Oaky/Aged** - Prefers wines with oakiness ≥6 (+6 points)
15. **Crisp & Clean** - Prefers high acid + low richness (+6 points)

### **Exclude (10 options)**
Users can exclude these wine types:

1. **Red Wines** - Removes all red wines
2. **White Wines** - Removes all white wines
3. **Sparkling Wines** - Removes champagne/prosecco
4. **Sweet Wines** - Removes wines with sweetness ≥5
5. **High Alcohol** - Removes wines with alcohol >7
6. **Tannic Wines** - Removes wines with tannin ≥7
7. **Heavily Oaked** - Removes wines with oakiness ≥7
8. **Expensive ($100+)** - Removes wines over $100
9. **Bottles** - Only show wines by the glass
10. **By Glass** - Only show bottles

### **Price Range**
- **Min**: $0 - $1000
- **Max**: $0 - $1000

### **Minimum Match Score**
- **Range**: 0 - 100
- **Default**: 0 (show all matches)
- **Recommended**: 70+ for "Good" or better matches

## How It Works

### 1. User Sets Preferences
```javascript
const preferences = {
  prefer: {
    italian: true,
    highAcidity: true,
    mineral: true
  },
  exclude: {
    red: true,
    expensive: true
  },
  priceRange: {
    min: 10,
    max: 60
  },
  minScore: 70
};
```

### 2. Algorithm Applies Preferences
- **First**: Filters out excluded wines (red, expensive)
- **Second**: Applies price range filter ($10-$60)
- **Third**: Filters by minimum score (≥70)
- **Fourth**: Boosts preferred characteristics:
  - Italian wines: +10 points
  - High acidity: +6 points
  - Mineral: +8 points
- **Fifth**: Re-sorts results by boosted scores

### 3. Results Displayed
- Top-scoring wines appear first
- Boosted wines are marked with `boosted: true`
- `preferenceBoost` field shows how many points were added

## Visual Indicators

Wines that match user preferences get:
- Higher position in recommendations
- Optional "⭐ Matches your preferences!" badge
- `boosted` flag for custom styling

## State Management

The preferences object structure:
```javascript
{
  prefer: {
    [key: string]: boolean
  },
  exclude: {
    [key: string]: boolean
  },
  priceRange: {
    min: number,
    max: number
  },
  minScore: number
}
```

## CSS Customization

The component uses `PairingControls.css` which includes:
- Collapsible sections
- Active state indicators
- Color-coded preference vs exclusion pills
- Responsive design for mobile
- Gradient score slider

## Example Use Cases

### 1. **White Wine Only, No Expensive**
```javascript
{
  prefer: { white: true },
  exclude: { red: true, expensive: true },
  priceRange: { min: 0, max: 75 },
  minScore: 65
}
```

### 2. **Italian Reds, Full-Bodied**
```javascript
{
  prefer: { italian: true, red: true, fullBody: true },
  exclude: { white: true },
  priceRange: { min: 0, max: 1000 },
  minScore: 70
}
```

### 3. **Crisp, Mineral Whites Under $50**
```javascript
{
  prefer: { white: true, mineral: true, crisp: true, highAcidity: true },
  exclude: { red: true, oaky: true },
  priceRange: { min: 0, max: 50 },
  minScore: 75
}
```

## Notes

- Preferences are **additive** - multiple preferences combine for higher boosts
- Exclusions are **absolute** - excluded wines are completely removed
- The algorithm still prioritizes core pairing quality (base score)
- Boosts enhance but don't override bad pairings
- Clear all button resets to defaults

## Future Enhancements

Potential additions:
- Save/load preference profiles
- Preset profiles ("Sommelier's Choice", "Budget-Friendly", "Adventure Mode")
- Exclude specific allergens or ingredients
- Prefer organic/biodynamic wines
- Temperature preferences
- Vintage preferences (new vs aged)
