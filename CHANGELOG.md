# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
| 1.2.7 | 2024-12-15 | Wine pairing fix, collapsible categories, GF corrections |
| 1.2.6 | Previous | Wine maps, pairing system, educational guides |
