# Food & Wine Pairing System

## Overview

This system uses flavor profile analysis to generate intelligent food and wine pairing recommendations. Each menu item (food and drink) has a detailed flavor profile that the pairing algorithm uses to calculate compatibility scores.

## Flavor Profile Structure

Every item with pairings includes a `flavorProfile` object with these attributes:

### Core Dimensions (0-10 scale)

- **sweetness**: How sweet the item is
- **acidity**: Tartness, brightness, citrus notes
- **body**: Weight/richness ("light", "medium", "full")
- **spiciness**: Heat level (chili, pepper)
- **saltiness**: Salt content
- **richness**: Fat content, creaminess
- **umami**: Savory depth (meats, mushrooms, aged cheese)
- **bitterness**: Bitter notes

### Drink-Specific Attributes (0-10 scale)

- **tannin**: For wines - drying, astringent quality
- **alcohol**: Alcohol warmth/strength
- **carbonation**: Bubbles/effervescence

### Flavor Notes

- **flavorNotes**: Array of descriptive tags like ["citrus", "earthy", "smoky", "crisp"]

## Example Flavor Profile

```json
{
  "flavorProfile": {
    "sweetness": 2,
    "acidity": 6,
    "body": "light",
    "spiciness": 4,
    "saltiness": 5,
    "richness": 5,
    "umami": 5,
    "bitterness": 0,
    "tannin": 0,
    "alcohol": 0,
    "carbonation": 0,
    "flavorNotes": ["crispy", "bright", "spicy", "fried"]
  }
}
```

## Pairing Algorithm

The algorithm (`src/utils/pairingAlgorithm.js`) calculates compatibility scores using these principles:

### 1. Body Matching (20% weight)
- Light-bodied food pairs with light-bodied wine
- Full-bodied food pairs with full-bodied wine
- Perfect match: 100 points
- One level difference: 70 points
- Two levels difference: 40 points

### 2. Acidity Balance (20% weight)
- High acid food needs high acid wine
- Citrusy dishes → Sauvignon Blanc, sparkling wines
- Tomato-based dishes → Chianti, Barbera, Sangiovese

### 3. Richness Balance (20% weight)
- Rich/fatty foods need acid, tannin, or bubbles to cut through
- Creamy dishes → High acid whites (Champagne, Chablis)
- Fatty meats → Tannic reds (Cabernet, Barolo)

### 4. Spice Handling (15% weight)
- Spicy food pairs with:
  - Sweeter wines (off-dry Riesling, Moscato)
  - Lower alcohol wines
  - Avoid: High tannin, high alcohol

### 5. Umami Pairing (10% weight)
- High umami food pairs with:
  - Tannic wines (aged reds)
  - Umami-rich wines (aged Barolo, Brunello)
- Examples: Mushrooms, aged cheese, cured meats

### 6. Sweetness Balance (5% weight)
- Sweet food needs equal or sweeter wine
- Wine should never be less sweet than the food

### 7. Flavor Harmony (10% weight)
- Matching flavor notes (earthy food + earthy wine)
- Complementary notes (seafood + citrus)

## Compatibility Levels

Based on total score (0-100):

- **85-100**: Excellent - Classic pairing
- **75-84**: Very Good - Highly recommended
- **65-74**: Good - Works well
- **55-64**: Fair - Acceptable choice
- **Below 55**: Acceptable - May work for some palates

## Usage Examples

### Finding Wine Pairings for Food

```javascript
import { findPairings } from './utils/pairingAlgorithm';
import appetizers from './data/appetizers.json';
import drinks from './data/drinks.json';

// Get the food item
const friedCalamari = appetizers.find(item => item.id === 'fried-calamari');

// Filter to wines by the glass
const winesByGlass = drinks.filter(d => 
  ['Italian Reds', 'Sauvignon Blanc', 'Sparkling'].includes(d.category)
);

// Get top 5 pairing recommendations
const pairings = findPairings(friedCalamari, winesByGlass, 5);

// Results include:
// - score (0-100)
// - explanation (why it pairs well)
// - compatibility level ("Excellent", "Very Good", etc.)
```

### Finding Food Pairings for Wine

```javascript
import { findFoodPairings } from './utils/pairingAlgorithm';

// Get the wine
const barolo = drinks.find(item => item.id === 'ascher-barolo');

// Get all appetizers
const pairings = findFoodPairings(barolo, appetizers, 5);
```

## Current Coverage

### Wines with Flavor Profiles (32 total)

**Red Wines (16)**
- Italian Reds: Barbera, Chianti, Barolo, Valpolicella Ripasso, Brunello
- Super Tuscan: Rubio, O'Lillo
- Merlot & Malbec: Felino Malbec, Stags' Leap Merlot
- Organic Pinot Noir: Siduri, Cambria Julia's Vineyard
- Cabernet & Blends: The Pessimist, Greenwing, Band of Vintners, Cakebread, Austin Hope

**White Wines (16)**
- Sauvignon Blanc: Matua, Knights Bridge
- Chardonnay: La Crema, Rombauer
- Interesting Whites: La Fiera Pinot Grigio, Loosen Riesling, GD Valle Realis Bello, Vermentino, Roero Arneis, Santa Margherita
- Sparkling: Moscato, Prosecco (3 styles), Champagne (2 styles)

### Food with Flavor Profiles (17 appetizers)

1. House-Made Chicken Orzo Soup
2. Jumbo Shrimp Cocktail
3. Single Meatball & Marinara
4. Clams Casino
5. Fried Calamari
6. Pan Seared Octopus & Sausage
7. Roasted Pork Belly
8. Crispy Pork Meatballs
9. Bolognese Arancini
10. Prosciutto Wrapped Mozzarella
11. P.L.T. & Mozzarella
12. Tuna Tartare
13. House Made Ricotta
14. Pan Fried Fresh Mozzarella
15. Fried Brussels Sprouts
16. Truffle Frites with Parmigiano
17. Garlic Cheese Bread
18. Italian Meat & Cheese Board

## Classic Pairing Examples

### Fried Calamari
**Best Pairings:**
- Sauvignon Blanc (high acid, crisp, light body)
- Prosecco (bubbles, acidity, refreshing)
- Pinot Grigio (light, crisp, citrus)

**Why:** Light body matches fried texture, high acidity cuts through richness, crisp notes complement the spice

### Roasted Pork Belly
**Best Pairings:**
- Off-dry Riesling (sweetness balances spice)
- Gewürztraminer (aromatic, off-dry)
- Sparkling Rosé (acidity cuts richness, bubbles cleanse)

**Why:** Sweet/off-dry balances Calabrian chili, acidity cuts through high richness (9/10)

### Italian Meat & Cheese Board
**Best Pairings:**
- Brunello (high tannin, high umami)
- Barolo (complex, tannic, umami-rich)
- Chianti Classico (acidity, tannin, traditional match)

**Why:** Tannins match high umami (9/10) and saltiness (8/10), complex flavors complement variety

### Truffle Frites
**Best Pairings:**
- Barolo (earthy, truffle notes, high umami)
- Champagne (acidity cuts richness, luxurious pairing)
- Barbaresco (Nebbiolo, earthy, elegant)

**Why:** Shared earthy/truffle notes, high umami in wine (7-9) matches umami in food (8)

## Next Steps

To extend this system:

1. **Add flavor profiles to:**
   - Dinner entrees (House Pastas, Seafood, VIA Italian Classics, Beef/Pork/Veal)
   - Pizzas and Sandwiches
   - Salads
   - Desserts
   - More drink categories (cocktails, beers, spirits)

2. **Enhance the algorithm:**
   - Add seasonal pairing preferences
   - Regional pairing rules (Tuscan food + Tuscan wine bonus)
   - Temperature considerations
   - Price-matching logic

3. **UI/UX Features:**
   - Expandable pairing sections on menu items
   - Filter by compatibility level
   - "Reverse search" - select wine first, see food recommendations
   - Pairing explanations with education

4. **Data visualization:**
   - Flavor profile radar charts
   - Pairing compatibility heatmaps
   - Interactive pairing explorer

## Files

- `src/utils/pairingAlgorithm.js` - Main pairing algorithm
- `src/utils/pairingDemo.js` - Usage examples and demonstrations
- `src/data/drinks.json` - Wine data with flavor profiles
- `src/data/appetizers.json` - Appetizer data with flavor profiles
- `PAIRING_SYSTEM.md` - This documentation
