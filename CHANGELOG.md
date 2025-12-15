# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.2.8 | 2024-12-15 | Complete whiskey, champagne, cognac, amaro & port maps with landmarks |
| 1.2.7 | 2024-12-15 | Wine pairing fix, collapsible categories, GF corrections |
| 1.2.6 | Previous | Wine maps, pairing system, educational guides |
