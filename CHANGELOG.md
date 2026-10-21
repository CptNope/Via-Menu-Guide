# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.6] - 2026-10-21

### Fixed
- **Faster on phones.** Every card used to work out all of its wine, beer, cocktail and whiskey pairings as soon as the page opened, even though those panels start closed. On a phone that froze the page for up to a second on Dinner (three seconds on the old one-page drinks list) and made tabs slow to respond. Pairings are now worked out only when you open a pairing panel.

---

## [1.5.5] - 2026-10-21

### Changed
- **Every beer, cider and seltzer is mapped at its brewery**: Jack's Abby in Framingham, Wormtown in Worcester, Wachusett in Westminster, Carlson Orchards in Harvard, Allagash and Bissell Brothers in Portland, ME, Fiddlehead in Shelburne, Guinness at St. James's Gate in Dublin, Peroni in Rome, High Noon at E. & J. Gallo in Modesto, Sun Cruiser and Sam Adams at Boston Beer in Jamaica Plain, Heineken at Zoeterwoude, Athletic Brewing in Milford, CT.
- Non-alcoholic beers now have maps too, and each beer section has a brewery map.

---

## [1.5.4] - 2026-10-21

### Changed
- **Every spirit is mapped at its distillery or producer**: all 61 whiskeys, cognacs, grappa, ports and amari. Examples: Buffalo Trace, Eagle Rare, Blanton's and Sazerac at Buffalo Trace in Frankfort; Maker's Mark in Loretto; Knob Creek and Basil Hayden's at Clermont; WhistlePig in Shoreham, VT; Lagavulin and Port Charlotte on Islay; Macallan at Craigellachie; Hennessy in Cognac, Courvoisier in Jarnac; the ports at their Vila Nova de Gaia lodges and Quinta do Noval in Pinhão; Nonino in Percoto; Strega in Benevento. Blended Scotch and brands without a published town are labeled that way.
- Spirit cards, map pins and map headers show the location; spirit maps zoom to fit their pins.

### Fixed
- See the Elephant Amaro is made in Agropoli, Italy (it was listed as American).
- Perrine Key Lime Amaro is made by Tree House Distillery in Massachusetts (it was listed as a Florida amaro).
- Pendleton 12 Year is placed at Hood River Distillers in Oregon, where it's bottled (Canadian whisky).

---

## [1.5.3] - 2026-10-21

### Changed
- **Every wine is mapped where it is made.** All 109 wines (146 entries across glass, bottle and half bottle) now have their own location: the winery town or named vineyard (Caymus and Quintessa in Rutherford, Shafer in the Stags Leap District, Chappellet on Pritchard Hill, Gaja Sperss in Serralunga d'Alba, Dom Pérignon in Hautvillers, Cloudy Bay in Rapaura ...). Before, most wines sat on one point per region, so every "California" wine was in the middle of the state. Multi-vineyard blends and wines whose producer location isn't certain are placed in their growing area and labeled that way.
- Each wine card shows its location under the description, and map pins show it too.
- Section maps zoom to fit their wines; a wine's own map frames the wine with nearby landmarks.
- Knights Bridge, Wayfarer, Sonoma-Cutrer, J Vineyards and La Crema Chardonnay now use the Sonoma map (Knights Valley is in Sonoma County).

---

## [1.5.2] - 2026-10-21

### Fixed
- **Cocktail and mocktail pairings use the flavor engine.** Cocktails, mocktails and wine flights now get a "Food Pairings" dropdown with VIA dishes ranked by flavor profile, plus a best match for each course. Before, cocktails were treated as food (their dropdown suggested wines) and showed a hand-typed list of generic foods that aren't on the menu.
- **Cocktail Pairings on dishes**: appetizers, pizzas, salads and mains have a new "Cocktail Pairings" dropdown next to beer and whiskey.
- **Wine by the glass suggestions** now consider every glass pour. Before, only Italian Reds, Interesting Whites and Sparkling could be suggested, because of a category-name check; Super Tuscan, Cabernet, Pinot Noir, Sauvignon Blanc and Chardonnay pours were never picked. Bottle suggestions now only ever include wine.
- **Glass Pinot Noir** cards show food pairings instead of being treated as a dish.
- **Lunch dishes** (sandwiches, lunch classics) are now included when a drink suggests food, alongside the new $25 Entrées.
- A drink's top food pairings are savory dishes; desserts appear in the by-course list.
- Pairing explanations name the right drink ("medium-bodied cocktail", "Beer's bubbles cut through the richness") instead of always saying wine.

---

## [1.5.1] - 2026-10-21

### Fixed
- **Maps**: every wine, spirit and beer now has a region its map knows. Wines by the glass had no region and showed no map; glass Pinot Noir wasn't wired to a map; beer maps never appeared. Added Tuscany, Sicily, Alsace and Ireland to the item maps, the Italian regions and Germany to the international category map, and Italy to the spirits category map.
- **Pronunciations**: added for 44 more wines and for Italian dish names on the food menus (Arancini, Osso Buco, Affogato ...); fixed a few stresses (Gagliardo, Vajra, Meritage, brut). Plain English names (Eagle Rare, Duckhorn) are left without one on purpose.
- **Web links**: checked all 132 producer links. Fixed 16 that pointed to the wrong company (for example fernet.com is an insurer, stonestreet.com a finance firm) or had moved, replaced 10 dead domains with the producers' current sites where one could be confirmed, and removed 7 links with no confirmable official site. Fixed 7 Wikipedia landmark links on the maps.

---

## [1.5.0] - 2026-10-21

### Changed
- **Menu navigation**: a bar that stays at the top while you scroll, with a chip for every heading. Tap a chip to jump; the chip for the heading on screen lights up.
- **Drinks are split into sections**: Wine, Cocktails, Beer, Whiskey and After dinner. Wine has its own By the glass / Bottles / Half bottles / Flights switch, and every format lists wines by style (Italian Reds, Super Tuscan, Cabernet & Blends ...), reds first. Half bottles are grouped Red and White. The chosen section is kept in the address, so Back works.
- **Filters**: the wall of checkboxes is replaced by one Filters button. It opens a sheet with "Show only" (vegetarian, gluten-free) and "Leave out anything with" (nuts, dairy, shellfish, fish, eggs, soy), plus the pairing settings. Active filters show as removable chips under the bar, and the Filters button shows how many are on.
- **Search** now opens the right drinks section and wine format before jumping to the item, and clears filters that would hide it.
- **Header**: the page links sit in one swipeable row on phones.
- On desktops the heading chips wrap onto a second line instead of scrolling sideways, so every heading (Seafood, $25 Entrées, Pasta ...) can be clicked with a mouse.

### Removed
- The per-drink-type filter checkboxes (replaced by the section tabs) and the "Jump to" button block.

### Not changed
- Tip Tracker and its saved data.

---

## [1.4.0] - 2026-10-21

### Changed
- **Menus synced to viaitaliantable.com (October 2026)**: dinner, lunch, kids and the drink menu dated 10.12.26.
  - Prices updated across appetizers, pizzas ($18.99, GF crust +$4), salads, classics, steaks and chops, pastas, seafood, sandwiches and kids.
  - Dishes reworked to match the current menu: Berkshire Pork Chop, Pork Osso Buco, Seared Sea Scallops, Grilled Salmon, Roasted Pork Belly, Meat & Cheese Board, Steak Salad.
  - New: Grilled Octopus, Beet Salad (lunch and dinner), Chicken & Sausage Lasagne, French Onion Pasta, Chicken & Kale Salad, VIA Chopped Antipasto on the dinner appetizers, and a **$25 Entrées** section (Mushroom Fiori, Pork Milanese, Gnocchi & Sausage Arrabbiata).
  - Removed (no longer on the menu): Clams Casino, P.L.T. & Mozzarella, Tuna Tartare, Pan Seared Octopus & Sausage, Chicken Panzanella, Kids Spaghetti & Meatball, Fiori as a pasta choice.
- **Wine list**: new vintages, prices and ratings for wines by the glass, bottles and half bottles; 13 new wines with tasting notes and pairing profiles; wines that left the list removed.
- **Cocktails and beer**: autumn cocktail list (Falling for Spritz Flight, Caprese Martini, Pumpkin Margarita, Wimbledon and three Old Fashioneds), mocktails now $11 with two Bully Boy Intermezzo additions, Guinness and The Substance Ale on draught, Sun Cruiser in cans.
- New dishes carry a note to confirm allergens with the kitchen; their allergen flags are based on the menu description.

### Fixed
- The "New Version Available" banner now appears when an update is waiting. Previously the update event fired before the banner was listening, so updates only applied after the app was fully closed and reopened.

### Not changed
- Tip Tracker code and its saved data (`via-tip-tracker` in the browser) are untouched by this update.

---

## [1.3.2] - 2024-12-16

### Security
- Fixed 3 npm security vulnerabilities (glob, js-yaml, node-forge)
- Updated react-router-dom to latest patch version
- Verified production bundle is secure (remaining dev-only vulnerabilities don't affect deployed app)

---

## [1.3.1] - 2024-12-16

### Added
- **Tip Calendar Enhancements**:
  - Click/tap any empty calendar day to add a new entry with date pre-filled
  - Today's date highlighted with red border and dot indicator
  - Smart time defaults: 11 = AM, all other hours default to PM
- **Server Notes**: Added `serverNotes` field to all 24 lunch menu items with allergen info, GF availability, and serving tips

### Fixed
- **Calendar Mobile Responsiveness**: Calendar now fits properly on mobile screens instead of going off-screen
- **Spirits Map Zoom Levels**: Adjusted zoom on all whiskey/spirits maps to show all landmarks (was zoomed in too far)

---

## [1.3.0] - 2024-12-15

### Added
- **Tip Tracker - Complete Overhaul**:
  - Simplified data model: Tips on Check + Cash Walking (removed complex CC exchange fields)
  - Partner tracking with autocomplete from previous entries
  - Shift time tracking with automatic hourly rate calculations
  - **Pops tracking**: Track food credits earned with optional reason field
  - **Calendar View**: Monthly calendar grid showing daily tips with weekly totals
    - Click any day to see full shift details with inline editing
    - Edit/Delete buttons on each entry in calendar view
    - Weekly summary column with shifts, hours, and hourly rate
    - Monthly summary with averages and totals
    - Swipe/touch friendly navigation between months
  - **Bulk Edit Mode**: Quickly backfill multiple shifts at once
    - Spreadsheet-style entry table
    - Add 1, 5, or 10 rows at a time
    - Copy date from previous row
    - Real-time totals and validation
  - View toggle between List and Calendar views
- **Full Analytics**: Per-shift, weekly, monthly, and yearly breakdowns with hourly rates

### Changed
- Tip data structure simplified for easier entry
- Import/Export updated to support all new fields
- Calendar days converted to proper `<button>` elements for accessibility
- Mobile touch targets increased to 44px minimum (Apple guidelines)

### Fixed
- Calendar now properly clickable and tab-selectable
- Touch controls work correctly on mobile devices
- Keyboard navigation (Tab, Enter, Space) works on calendar

---

## [1.2.8] - 2024-12-15

### Added
- **Interactive Whiskey Maps**: All bourbon, rye, and scotch entries now display regional maps with distillery landmarks
  - Bourbon: Kentucky, Tennessee, Vermont, Utah landmarks
  - Rye: Kentucky, Vermont, Utah, Massachusetts, Canada landmarks
  - Scotch: All 5 official Scottish regions (Speyside, Islay, Highland, Lowland, Campbeltown) with key distillery towns
- **Enhanced Champagne Maps**: Champagne region now shows 5 sub-regions (Reims, Épernay, Côte des Bar, Montagne de Reims, Côte des Blancs)
- **Cognac Maps**: Full Cognac region support with landmarks (Cognac, Jarnac, Segonzac/Grande Champagne)
- **Amaro & Digestivo Maps**: Complete regional support including:
  - Italian regions: Sicily (Mt. Etna), Lombardy (Milan), Friuli (Nonino), plus Bologna (Montenegro), Benevento (Strega)
  - US craft regions: Massachusetts (Bully Boy), Washington DC (Don Ciccio), Brooklyn NY (Faccia Brutto), Florida (Perrine)
- **Port Wine Maps**: Douro Valley, Porto, and Portugal landmarks
- **Italian Wine Regions**: Added Piedmont and Veneto to International Wine Map for half bottles
- **Sparkling Wine Regions**: Added Italian sparkling landmarks (Conegliano, Valdobbiadene for Prosecco)

### Fixed
- **Cognac Data**: Standardized all cognac regions to "Cognac" for proper map display
- **Sparkling Wine JSON**: Fixed region fields that were incorrectly nested inside flavorProfile objects
- **Half Bottles Category**: Fixed category name mismatch ("Half Bottles - Wine" → "Half Bottles") in MenuPage and MenuItemCard
- **Duplicate Half Bottles**: Removed duplicate import of drinks-half-bottles-wine.json from App.jsx and usePairingData.js

### Changed
- **SpiritsMap.jsx**: Added map centers and zoom levels for Cognac, Grappa, Port, and Amaro categories
- **SpiritsMapInteractive.jsx**: Added all US craft amaro regions with landmarks
- **InternationalWineMap.jsx**: Enhanced Champagne landmarks and added Italian sparkling regions
- Landmarks now display by default when category maps are expanded

---

## [1.2.7] - 2024-12-15

### Fixed
- **Wine Pairing System**: Fixed wine pairings not displaying - the pairing hook was importing from an empty `drinks.json` instead of the individual drink category files
- **Ragu of Italian Meats**: Corrected gluten-free status - mezzi rigatoni contains gluten. Added `canBeMadeGlutenFree: true` with GF penne substitution option
- **Cone Samplers (5 & 10)**: Corrected gluten-free status - cones contain gluten. Added `canBeMadeGlutenFree: true` with cups substitution option
- **PWA Meta Tag**: Added `mobile-web-app-capable` meta tag to resolve deprecation warning for `apple-mobile-web-app-capable`

### Added
- **Collapsible Categories**: All menu pages (Dinner, Lunch, Dessert, Kids) now have expandable/collapsible category sections with +/− toggle buttons
- Categories default to expanded on page load
- Drinks page educational info toggle is now separate from category collapse

### Changed
- `usePairingData.js` now imports all drink category JSON files directly instead of relying on empty `drinks.json`

## [1.2.6] - Previous Release

### Features
- Wine pairing system with flavor profile matching
- Interactive wine maps (Italian regions, International regions, Spirits)
- Educational drink guides for spirits and wine categories
- PWA with offline support and auto-update notifications
- Dietary filters (vegetarian, gluten-free, nut-free, dairy-free, etc.)
- Admin panel for menu editing
- Global search across all menus

---

## Beverage Program Enhancements

### Wines By The Glass (27 wines)
Enhanced all wines with structured server notes and website links:
- **Italian Reds** (5): Barbera, Chianti, Barolo, Ripasso, Brunello
- **Pinot Noir** (2): Siduri, Cambria Julia's Vineyard
- **Cabernet & Blends** (5): The Pessimist, Greenwing, Band of Vintners, Cakebread, Austin Hope
- **Chardonnay** (2): La Crema, Rombauer
- **Interesting Whites** (6): La Fiera, Loosen Riesling, G.D. Vajra, Guado Al Tasso, Roero Arneis, Santa Margherita
- **Sauvignon Blanc** (2): Matua, Knights Bridge
- **Sparkling** (5): Centorri Moscato, Benvolio Prosecco, Pasqua Rosé, Nicolas Feuillatte Brut & Rosé

### Bourbon/Whiskey (16 spirits)
Complete update with distillery stories and website links:
- Eagle Rare, Four Roses, Jefferson's, Maker's Mark, Buffalo Trace, Elijah Craig
- High West, WhistlePig Piggyback, Basil Hayden's, Knob Creek
- Woodford Reserve Double Oaked, Uncle Nearest 1856, Blanton's
- Angel's Envy, WhistlePig Snout to Tail, Angel's Envy Triple Oak

### Scotch Whisky (10 spirits)
Enhanced with regional context and distillery stories:
- **Speyside** (4): Glenlivet 12, Glenfiddich 12, Balvenie Double Wood, Macallan 12
- **Islay** (2): Port Charlotte (heavily peated), Lagavulin 16
- **Highland** (1): Oban 14
- **Blends** (2): Johnnie Walker Black, Johnnie Walker Blue
- **Ultra-Premium** (1): Macallan 18

### Rye Whiskey (10 spirits)
Complete craft rye program with regional diversity:
- **Entry-Level**: Pendleton 12, Sazerac, High West, Knob Creek
- **Craft Ryes**: WhistlePig Piggyback, Mad River Revolution, Mad River Silver Oak, Short Path Concord
- **Premium**: WhistlePig 10 Year, Boss Hog XI "The Juggernaut"

### After-Dinner (25 drinks)
Enhanced with origin stories and cultural context:
- **Grappa** (1): Nonino Il Moscato
- **Cognac** (5): Grand Marnier 100, Courvoisier VS, Grand Marnier, Hennessy VS, Rémy Martin VSOP
- **Port** (5): Croft Reserve, Dow's 10 Year, Dow's LBV, Fonseca 20 Year, Quinta do Noval
- **Amaro & Digestivo** (14): Dell'Etna, Montenegro, Campari, Galliano, Strega, Fernet Branca, Bully Boy, Don Ciccio, See The Elephant, Unico, Faccia Brutto, Perrine Key Lime, Foro, Nonino Quintessentia

### Half Bottle Pronunciations
Added phonetic pronunciations for difficult wine names:
- Ceretto Vignaioli Moscato D'Asti: `cheh-REH-toh veen-yai-OH-lee mohs-KAH-toh DAHS-tee`
- DAOU Cabernet: `DAH-oo`
- Sonoma Cutrer: `soh-NOH-mah COO-trer`
- Alphonse Mellot Sancerre: `al-FONS mel-LOH lah moo-see-AIR san-SAIR`
- Damilano Barolo: `dah-mee-LAH-noh leh-CHEEN-kweh-VEEN-yeh bah-ROH-loh`
- Zenato Amarone: `zeh-NAH-toh ah-mah-ROH-neh`
- Kosta Browne: `KOH-stah BROWN`

### Cocktail Garnish Display
Added garnish field and green-themed display for all cocktails:
- Barrel Aged Sangria → Cherry, lime, orange slice
- Espresso Martini → 3 coffee beans
- The Via Mai Tai → Amarena cherry
- And 13 more cocktails with garnish info

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.3.2 | 2024-12-16 | Security fixes (glob, js-yaml, node-forge) |
| 1.3.1 | 2024-12-16 | Tip calendar enhancements, server notes for lunch items |
| 1.3.0 | 2024-12-15 | Tip tracker overhaul: calendar view, bulk edit, pops, inline editing |
| 1.2.8 | 2024-12-15 | Complete whiskey, champagne, cognac, amaro & port maps with landmarks |
| 1.2.7 | 2024-12-15 | Wine pairing fix, collapsible categories, GF corrections |
| 1.2.6 | Previous | Wine maps, pairing system, educational guides |
