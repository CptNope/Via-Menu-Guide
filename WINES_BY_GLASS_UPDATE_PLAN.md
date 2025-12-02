# Wines By The Glass - Enhanced Notes & Website Links Update Plan

## Task Overview
Add structured server notes and website links to **ALL wines by the glass** across all categories, similar to what was done for beers and half bottles.

---

## Wine Categories By The Glass (Estimated 35-40 wines total)

### ✅ **Italian Reds** (COMPLETED - 5 wines)
1. ✅ "Rosina" Barbera D'Asti by Garetto - $13
2. ✅ San Felice Chianti Classico - $13
3. ✅ G.D. Vajra Barolo Albe - $18
4. ✅ Bussola Valpolicella Ripasso - $15
5. ✅ Caparzo Brunello di Montalcino - $18

### 🔄 **Pinot Noir** (2+ wines)
1. Siduri (Willamette Valley) - $12
2. Cambria "Julia's Vineyard" (Santa Maria) - $13

### 🔄 **Cabernet Sauvignon** (Est. 2-3 wines)
- Need to identify all

### 🔄 **Italian Whites** (Est. 2-3 wines)
- Pinot Grigio, Vermentino, etc.

### 🔄 **Chardonnay** (Est. 2-3 wines)
- Various regions

### 🔄 **Sauvignon Blanc** (Est. 2-3 wines)
- Various regions

### 🔄 **Rosé** (Est. 2-3 wines)
- Various styles

### 🔄 **Sparkling & Prosecco** (Est. 2-3 wines)
- Prosecco, Cava, etc.

### 🔄 **Other Categories**
- Malbec, Zinfandel, etc.

---

## New Format Template

### **Structured Server Notes:**
```
🍷/🇮🇹/🍇 ABOUT: [Winery story, region, awards, quality indicators]

🍷 STYLE: [Wine style] | [Flavor profile] | [Body, tannins, acidity] | [Key characteristics]

🍽️ PAIRS WITH: [Food pairings - 3-5 items]

💡 BY THE GLASS: [Why this wine by the glass, what makes it special, server tips]
```

### **Website Field:**
```json
"website": "https://www.winery.com/"
```

---

## Example - Before & After

### **BEFORE:**
```json
{
  "name": "Siduri",
  "price": 12,
  "category": "Pinot Noir",
  "serverNotes": "Light to medium-bodied organic Oregon Pinot with red cherry, raspberry, earthy notes. Silky texture, bright acidity. Sustainably farmed. Pairs with salmon, duck, mushroom dishes, lighter fare. Classic Pacific Northwest style."
}
```

### **AFTER:**
```json
{
  "name": "Siduri",
  "price": 12,
  "category": "Pinot Noir",
  "website": "https://www.siduri.com/",
  "serverNotes": "🍷 ABOUT: Organic Oregon Pinot Noir from Siduri, Willamette Valley. Sustainably farmed with certified organic practices!\n\n🍷 STYLE: Light to medium-bodied Pinot | Red cherry, raspberry & earthy notes | Silky texture, bright acidity | Classic Pacific Northwest character.\n\n🍽️ PAIRS WITH: Salmon, duck, mushroom dishes, lighter fare, roasted chicken.\n\n💡 BY THE GLASS: Perfect example of Oregon Pinot - elegant, food-friendly, and sustainable!"
}
```

---

## Benefits of Update

### **For Servers:**
- Quick visual scanning with emoji sections
- Clear wine story to tell guests
- Pairing suggestions at a glance
- Website for curious guests

### **For Guests:**
- Better understanding of wine style
- Know what to expect flavor-wise
- Clear food pairing guidance
- Can research winery if interested

### **Visual Consistency:**
- Matches beers (red/blue/green themes)
- Matches half bottles (structured format)
- Professional, modern presentation
- Easy to read on mobile/tablet

---

## Progress Tracker

**Completed Categories:**
- ✅ Italian Reds (5/5)

**In Progress:**
- 🔄 Pinot Noir (0/2)
- 🔄 Cabernet Sauvignon (0/?)
- 🔄 Italian Whites (0/?)
- 🔄 Chardonnay (0/?)
- 🔄 Sauvignon Blanc (0/?)
- 🔄 Rosé (0/?)
- 🔄 Sparkling (0/?)

**Total Progress:** 5/35+ wines (14%)

---

## Next Steps

1. ✅ Complete Italian Reds
2. Update Pinot Noir wines
3. Update Cabernet Sauvignon wines
4. Update Italian White wines
5. Update Chardonnay wines
6. Update Sauvignon Blanc wines
7. Update Rosé wines
8. Update Sparkling wines
9. Update remaining categories
10. Final review and testing

---

## Website Research Needed

Will need to find official websites for:
- Siduri Wines
- Cambria Wines
- All other wineries

Most major wineries have official websites. For smaller producers, may use importer/distributor websites if direct winery site unavailable.

---

## Estimated Time

- Per wine: ~5 minutes (research website, format notes)
- Total: ~35 wines × 5 min = ~3 hours of work
- Already completed: 5 wines (25 minutes)
- Remaining: ~2.5 hours

---

Would you like me to:
1. **Continue batch by batch** - Update all wines systematically (recommended)
2. **Focus on specific categories** - Which categories are most important?
3. **Show more examples first** - Update 2-3 more wines to confirm format?

Let me know how you'd like to proceed! 🍷
