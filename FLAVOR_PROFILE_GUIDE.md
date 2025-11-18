# Comprehensive Flavor Profile Attribute Guide

## Complete Attribute List (0-10 Scale)

### **CORE ATTRIBUTES** (All Items)
- `sweetness` (0-10) - Sugar/sweet perception
- `acidity` (0-10) - Tartness/brightness
- `bitterness` (0-10) - Bitter compounds
- `richness` (0-10) - Overall depth/opulence
- `spiciness` (0-10) - Heat from peppers/spices
- `umami` (0-10) - Savory/meaty character
- `saltiness` (0-10) - Salt content/perception

### **DRINK-SPECIFIC ATTRIBUTES**
- `tannin` (0-10) - Drying, astringent compounds (wine/tea)
- `alcohol` (0-10) - Alcohol warmth/strength
- `carbonation` (0-10) - Bubble intensity
- `fruitiness` (0-10) - Fruit character (beyond sweetness)
- `oakiness` (0-10) - Barrel aging influence (vanilla/toast/smoke)
- `minerality` (0-10) - Stone/chalk/wet stone character
- `finish` (0-10) - How long flavors persist (1=short, 10=very long)
- `aromaticIntensity` (0-10) - Fragrance/aroma strength

### **FOOD-SPECIFIC ATTRIBUTES**
- `fattiness` (0-10) - Fat content (butter/oil/marbling)
- `creaminess` (0-10) - Dairy/cream presence
- `herbaceousness` (0-10) - Fresh herb character
- `charLevel` (0-10) - Caramelization/char/Maillard reaction

### **UNIVERSAL ATTRIBUTES** (Both Food & Drink)
- `intensity` (0-10) - Overall flavor power/strength
- `complexity` (0-10) - Number of flavor layers
- `earthiness` (0-10) - Soil/mushroom/forest floor
- `smokiness` (0-10) - Smoke character (grilling/peating)

### **EXISTING ATTRIBUTES**
- `body` (string) - "light", "medium", "full"
- `flavorNotes` (array) - Descriptive tags

---

## Quick Reference by Item Type

### **RED WINE**
Required: sweetness, acidity, tannin, alcohol, body, richness, fruitiness, oakiness, finish, intensity, complexity
Optional: earthiness, minerality, aromaticIntensity
Usually 0: carbonation, bitterness, spiciness

### **WHITE WINE**
Required: sweetness, acidity, alcohol, body, fruitiness, minerality, finish, intensity
Optional: oakiness (if oak-aged), complexity, aromaticIntensity, earthiness
Usually 0: tannin, carbonation, bitterness

### **SPARKLING WINE/CHAMPAGNE**
Required: sweetness, acidity, carbonation, alcohol, body, minerality, finish
Optional: fruitiness, complexity, aromaticIntensity, oakiness
Usually 0: tannin, bitterness

### **BEER**
Required: sweetness, acidity, bitterness, alcohol, carbonation, body, intensity
Optional: fruitiness, oakiness (barrel-aged), finish, complexity, smokiness
Usually 0: tannin, minerality

### **BOURBON/WHISKEY**
Required: sweetness, alcohol, oakiness, smokiness, richness, intensity, finish, complexity
Optional: spiciness, fruitiness, earthiness
Usually 0: acidity, tannin, carbonation, minerality

### **COGNAC/BRANDY**
Required: sweetness, alcohol, oakiness, fruitiness, richness, intensity, finish, complexity
Optional: spiciness, aromaticIntensity
Usually 0: acidity, tannin, carbonation, bitterness

### **PORT**
Required: sweetness (high), alcohol, richness, fruitiness, complexity, finish, intensity
Optional: oakiness, tannin (vintage), earthiness
Usually 0: carbonation, bitterness, acidity

### **AMARO/DIGESTIVO**
Required: bitterness, sweetness, alcohol, richness, intensity, complexity, aromaticIntensity
Optional: spiciness, earthiness, herbaceousness (as drink)
Usually 0: carbonation, tannin, fruitiness

### **SCOTCH**
Required: alcohol, smokiness (if peated), oakiness, intensity, finish, complexity
Optional: sweetness, fruitiness, earthiness, minerality, aromaticIntensity
Usually 0: acidity, tannin, carbonation

### **RYE WHISKEY**
Required: spiciness (rye spice), alcohol, oakiness, intensity, finish
Optional: sweetness, fruitiness, complexity, earthiness
Usually 0: acidity, tannin, carbonation

---

## Food Category Guidelines

### **STEAK/RED MEAT**
Required: richness, fattiness, intensity, charLevel (if grilled), umami
Optional: smokiness (if grilled/smoked), saltiness, complexity
Usually 0: sweetness, acidity, bitterness

### **SEAFOOD**
Required: acidity, intensity (usually lower), saltiness (moderate)
Optional: fattiness (depends on fish), creaminess (if sauce), herbaceousness
Usually 0: smokiness, charLevel, bitterness

### **PASTA DISHES**
Required: richness, acidity (tomato sauce), intensity
Optional: fattiness (cream sauces), herbaceousness, spiciness, creaminess
Varies: umami (meat sauces), sweetness (tomato)

### **CHEESE**
Required: fattiness, creaminess, saltiness, richness, intensity
Optional: earthiness (aged), complexity, umami
Usually 0: acidity, bitterness, sweetness

### **DESSERTS**
Required: sweetness, richness, intensity
Optional: creaminess, fattiness, acidity (fruit), complexity
Usually 0: saltiness, spiciness, bitterness

### **GRILLED/BBQ**
Required: charLevel, smokiness, intensity, richness
Optional: fattiness, sweetness (sauce), spiciness, umami
Varies: acidity (vinegar-based sauce)

---

## Pairing Impact (How New Attributes Improve Pairings)

### **Critical Pairings Now Detected:**
1. **Fat + Tannin**: High `fattiness` food needs high `tannin` wine (ribeye + Cabernet)
2. **Smoke + Oak**: High `smokiness` food pairs with high `oakiness` drink (BBQ + oaked Chardonnay)
3. **Intensity Matching**: High `intensity` food needs high `intensity` drink (bold Barolo for rich osso buco)
4. **Mineral + Seafood**: High `minerality` wine pairs with seafood (`flavorNotes` contain seafood)
5. **Complexity Balance**: Simple food with complex wine, or complex food with simple wine can clash

### **Scoring Weight Distribution:**
- Body Match: 15%
- Acidity Balance: 15%
- Richness Balance: 12%
- Fat/Tannin Balance: **10%** (NEW - CRITICAL)
- Spice Handling: 10%
- Flavor Harmony: 10%
- Umami Pairing: 8%
- Intensity Match: **8%** (NEW)
- Sweetness Balance: 5%
- Oak/Smoke Harmony: **5%** (NEW)
- Minerality/Seafood: **2%** (NEW - bonus)

---

## Attribute Value Examples

### **BEER EXAMPLES:**

**Peroni Lager:**
```json
{
  "sweetness": 3,
  "acidity": 2,
  "bitterness": 3,
  "alcohol": 3,
  "carbonation": 7,
  "fruitiness": 1,
  "intensity": 3,
  "complexity": 2,
  "finish": 2,
  "body": "light"
}
```

**Imperial IPA:**
```json
{
  "sweetness": 4,
  "bitterness": 9,
  "alcohol": 6,
  "carbonation": 5,
  "fruitiness": 7,
  "intensity": 9,
  "complexity": 6,
  "finish": 7,
  "aromaticIntensity": 8,
  "body": "full"
}
```

### **WINE EXAMPLES:**

**Cabernet Sauvignon:**
```json
{
  "sweetness": 1,
  "acidity": 6,
  "tannin": 8,
  "alcohol": 7,
  "fruitiness": 7,
  "oakiness": 7,
  "richness": 8,
  "intensity": 9,
  "complexity": 7,
  "finish": 8,
  "earthiness": 4,
  "body": "full"
}
```

**Chablis (unoaked Chardonnay):**
```json
{
  "sweetness": 1,
  "acidity": 9,
  "alcohol": 6,
  "fruitiness": 5,
  "oakiness": 0,
  "minerality": 9,
  "richness": 5,
  "intensity": 6,
  "complexity": 6,
  "finish": 7,
  "body": "medium"
}
```

### **FOOD EXAMPLES:**

**Ribeye Steak (grilled):**
```json
{
  "richness": 9,
  "fattiness": 9,
  "umami": 8,
  "saltiness": 5,
  "charLevel": 7,
  "smokiness": 3,
  "intensity": 9,
  "complexity": 5,
  "body": "full"
}
```

**Oysters:**
```json
{
  "acidity": 4,
  "saltiness": 8,
  "umami": 6,
  "richness": 3,
  "intensity": 5,
  "complexity": 4,
  "body": "light",
  "flavorNotes": ["seafood", "briny", "ocean", "mineral"]
}
```

---

## Color Coding in UI

### Core Attributes:
- 🌸 Sweetness: Pink
- 🌟 Acidity: Yellow
- ⚫ Bitterness: Gray
- 🟤 Richness: Brown
- 🔥 Spice: Orange-red
- 💜 Umami: Purple
- ⚪ Salt: Light gray

### Drink-Specific:
- 🟫 Tannin: Sienna
- 🔴 Alcohol: Red
- 💧 Carbonation: Teal
- 🍒 Fruitiness: Red
- 🪵 Oak: Chocolate
- 🪨 Minerality: Gray
- ⏱️ Finish: Blue
- 🌺 Aromatic: Purple

### Food-Specific:
- 🧈 Fattiness: Orange
- 🥛 Creaminess: Yellow
- 🌿 Herbs: Green
- 🔥 Char: Dark gray

### Universal:
- ⚡ Intensity: Orange
- 🎨 Complexity: Purple
- 🌍 Earthiness: Brown
- 💨 Smokiness: Blue-gray

---

## Next Steps for Data Entry

All existing items with `flavorProfile` can be enhanced with:
1. Add applicable new attributes (use 0 for non-applicable)
2. Most items only need 5-10 of the new attributes
3. Focus on the critical ones first: `intensity`, `fattiness` (food), `fruitiness`/`oakiness` (drinks)
4. Can batch update categories (all Cabernets get similar oakiness/tannin)

System is ready! Add new attributes as you update items.
