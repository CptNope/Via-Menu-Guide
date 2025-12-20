# VIA Italian Table Menu PWA (CRA Starter)

**Version 1.3.2** | [View Changelog](./CHANGELOG.md)

This is a **Create React App** starter for a VIA Italian Table interactive menu:

- Dinner, lunch, dessert, kids and drinks menus
- Proposed allergen info + dietary flags
- Intelligent wine/food pairing system with flavor profile matching
- Interactive wine and spirits maps (Italy, International, Whiskey regions)
- Tip tracker for servers with calendar view and analytics
- Basic admin panel (placeholder login) to edit sample dinner items
- PWA enabled (offline-capable, installable on all devices)

> This is a starter / scaffold. Data is partial and meant to be extended.

---

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

The app will open at http://localhost:3000.

## Scripts

- `npm start` – run dev server
- `npm run build` – build for production
- `npm test` – run tests (none defined yet)
- `npm run deploy` – deploy to GitHub Pages
- `npm run generate-icons` – generate all PWA icons from SVG sources
- `npm version patch|minor|major` – bump version number

---

## PWA / Offline & Auto-Updates

The app is a full **Progressive Web App** using **Workbox** for intelligent caching and automatic updates.

### Features

- ✅ **Installable** on Android, iOS, and Desktop (Chrome/Edge)
- ✅ **Offline-first caching** with intelligent cache strategies
- ✅ **Automatic update detection** - checks every hour
- ✅ **User-friendly update notifications** with one-click updates
- ✅ **Version-based cache management** - old caches auto-cleared

### Cache Strategies

| Resource Type | Strategy | Max Age | Description |
|--------------|----------|---------|-------------|
| Images | Cache First | 30 days | Fast loading, rarely change |
| JSON Data | Network First | 7 days | Fresh content when online |
| CSS/JS | Stale While Revalidate | 30 days | Instant load + background update |
| Fonts | Cache First | 365 days | Never change, cache forever |

### Deploying Updates

```bash
npm version patch && npm run build && npm run deploy
```

Users automatically see an update notification and can update with one click.

### Icon Generation

Generate all 33 PWA icons from SVG sources:

```bash
npm run generate-icons
```

This creates standard icons (72-512px), maskable icons, Apple Touch icons, iOS splash screens, and favicon.

### Installation

- **Android**: Chrome shows install prompt automatically, or Menu → "Install app"
- **iOS**: Safari → Share button → "Add to Home Screen"
- **Desktop**: Click install icon in address bar, or Menu → "Install VIA Menu"

### Implementation Files

- `src/service-worker.js` – Workbox configuration with version management
- `src/serviceWorkerRegistration.js` – Registration with Workbox Window API
- `src/components/UpdateNotification.jsx` – Update notification UI
- `public/icon-source.svg` – Master icon (1024x1024)
- `public/icon-maskable-source.svg` – Android adaptive icon
- `public/splash-source.svg` – iOS splash screen template

## Project Structure

- `public/`
  - `index.html` – HTML shell
  - `manifest.json` – PWA manifest (app name, colors, icons)
  - `service-worker.js` – simple cache-first SW
- `src/`
  - `index.js` – entry, registers Router + SW
  - `App.jsx` – main layout + routes
  - `App.css` – main styling
  - `data/` – JSON data for menus, ingredients, wines
  - `components/`
    - `MenuPage.jsx` – renders a category page
    - `MenuItemCard.jsx` – renders a single dish
    - `FilterBar.jsx` – vegetarian / GF / nut-free / kids filters
    - `PairingsPage.jsx` – wine pairings view
    - `AdminLogin.jsx` – placeholder admin login
    - `AdminPanel.jsx` – sample admin editor for dinner items + ingredient list

## Admin Panel

Navigate to `/admin` or click **Admin** in the top nav.

- Demo password: **viaadmin**
- Once logged in you can:
  - Edit sample **dinner** items (name, description, price, flags, allergens)
  - See a read-only list of **ingredients** with attached allergens

> In this starter the admin edits are kept in React state only – they do **not** persist to disk.  
> In a real app you would hook these up to a backend / CMS to write JSON or database records.

## Data Model

All menu items are defined in JSON files under `src/data`:

Each item looks roughly like:

```json
{
  "id": "fried-calamari",
  "name": "Fried Calamari",
  "description": "Cherry peppers, lemon, marinara sauce.",
  "price": 16.99,
  "category": "Appetizers",
  "vegetarian": false,
  "glutenFree": false,
  "nutFree": true,
  "kids": false,
  "ingredients": ["calamari", "flour", "cherry-peppers", "lemon", "marinara-sauce"],
  "allergens": ["shellfish", "gluten"]
}
```

Ingredients are defined globally in `ingredients.json`:

```json
{
  "id": "flour",
  "name": "Wheat Flour",
  "allergens": ["gluten"]
}
```

Wines are defined in `wines.json` with pairing targets:

```json
{
  "id": "san-felice-chianti",
  "name": "San Felice Chianti Classico",
  "year": 2022,
  "type": "Red",
  "region": "Tuscany, Italy",
  "notes": "Bright cherry, savory herbs, food-friendly acidity.",
  "pairsWith": ["fried-calamari", "three-meatballs"]
}
```

The **Pairings** page uses `pairsWith` to show which dishes match each wine.

## Pairing System Architecture

The app features an intelligent food and drink pairing system based on flavor profiles and classic pairing principles. The system takes into account user preferences for price range and wine color/style.

### System Overview

```mermaid
graph TB
    A[Menu Item Card] --> B[usePairingData Hook]
    B --> C{Item Type?}
    C -->|Food Item| D[getFoodPairingRecommendations]
    C -->|Drink Item| E[getWinePairingRecommendations]
    D --> F[Filter by Preferences]
    F --> G[Calculate Pairing Scores]
    E --> G
    G --> H[findPairings Algorithm]
    H --> I[Sort & Rank Results]
    I --> J[Display Components]
    J --> K[WinePairingDisplay]
    J --> L[FoodPairingDisplay]
    J --> M[BeveragePairingDisplay]
```

### Pairing Preferences Flow

```mermaid
graph LR
    A[User Opens Pairing Controls] --> B{Has Saved Preferences?}
    B -->|Yes| C[Load from localStorage]
    B -->|No| D[Use Default Settings]
    C --> E[Display Current Settings]
    D --> E
    E --> F[User Adjusts Preferences]
    F --> G[Price Range]
    F --> H[Wine Color]
    F --> I[Style Preference]
    G --> J[Save to localStorage]
    H --> J
    I --> J
    J --> K[Filter Available Drinks]
    K --> L[Recalculate Pairings]
    L --> M[Update UI]
```

### Pairing Score Calculation

The algorithm calculates compatibility scores based on 12 weighted factors:

```mermaid
graph TD
    A[Food & Drink Flavor Profiles] --> B[Calculate Individual Scores]
    B --> C1[Body Match - 15%]
    B --> C2[Acidity Balance - 15%]
    B --> C3[Richness Balance - 12%]
    B --> C4[Spice Handling - 10%]
    B --> C5[Fat/Tannin Balance - 10%]
    B --> C6[Flavor Harmony - 10%]
    B --> C7[Umami Pairing - 8%]
    B --> C8[Intensity Match - 8%]
    B --> C9[Sweetness Balance - 5%]
    B --> C10[Oak/Smoke Harmony - 5%]
    B --> C11[Minerality/Seafood - 2%]
    B --> C12[Complexity Balance - Info Only]
    
    C1 --> D[Weighted Sum]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D
    C7 --> D
    C8 --> D
    C9 --> D
    C10 --> D
    C11 --> D
    
    D --> E{Total Score}
    E -->|85-100| F[Excellent Match]
    E -->|75-84| G[Very Good Match]
    E -->|65-74| H[Good Match]
    E -->|55-64| I[Fair Match]
    E -->|<55| J[Acceptable Match]
```

### Preference Filtering Logic

```mermaid
graph TB
    A[All Available Drinks] --> B{Apply Preferences}
    B --> C{Price Range Set?}
    C -->|Yes| D[Filter by Price Tier]
    C -->|No| E{Wine Color Set?}
    D --> E
    E -->|Red Only| F[Filter Red Wines]
    E -->|White Only| G[Filter White Wines]
    E -->|Either| H{Style Preference?}
    F --> H
    G --> H
    H -->|Bold| I[Filter Bold Wines]
    H -->|Delicate| J[Filter Delicate Wines]
    H -->|Off-Dry| K[Filter Off-Dry Wines]
    H -->|No Preference| L[Keep All Matching]
    I --> M[Filtered Drink Pool]
    J --> M
    K --> M
    L --> M
    M --> N[Calculate Pairings]
```

### Component Architecture

```mermaid
graph TB
    subgraph "Data Layer"
        A1[drinks.json]
        A2[appetizers.json]
        A3[dinner.json]
        A4[dessert.json]
    end
    
    subgraph "Constants & Config"
        B1[pairingCategories.js]
        B2[Category Definitions]
    end
    
    subgraph "Logic Layer"
        C1[usePairingData Hook]
        C2[pairingAlgorithm.js]
        C3[enhancedPairing.js]
        C4[pairingPreferences.js]
    end
    
    subgraph "Presentation Layer"
        D1[MenuItemCard]
        D2[PairingSection]
        D3[WinePairingDisplay]
        D4[FoodPairingDisplay]
        D5[BeveragePairingDisplay]
        D6[PairingItem Components]
        D7[PairingControls]
    end
    
    A1 --> C1
    A2 --> C1
    A3 --> C1
    A4 --> C1
    B1 --> C1
    C1 --> C2
    C1 --> C3
    C4 --> C3
    C2 --> D1
    C3 --> D1
    D1 --> D2
    D2 --> D3
    D2 --> D4
    D2 --> D5
    D3 --> D6
    D4 --> D6
    D5 --> D6
    D7 --> C4
```

### Key Pairing Principles

1. **Body Matching**: Light-bodied foods pair with light-bodied wines, full-bodied with full-bodied
2. **Acidity Balance**: High acid foods need high acid wines to avoid tasting flat
3. **Richness Management**: Rich/fatty foods need acidity, tannin, or bubbles to cut through
4. **Spice Handling**: Spicy foods pair better with sweeter, lower-alcohol wines
5. **Umami & Tannin**: High umami foods (aged cheese, mushrooms) pair well with tannic wines
6. **Fat & Tannin**: Fatty meats require tannins to cleanse the palate
7. **Intensity Matching**: Bold flavors shouldn't overpower delicate wines and vice versa
8. **Complementary Flavors**: Matching or complementary flavor notes create harmony

---

## Interactive Maps

The app features **interactive OpenStreetMaps** for wines and spirits:

### Italian Wine Maps
- **Categories**: Italian Reds (31 wines), Super Tuscans (10 wines)
- Italy-focused view showing 6 Italian regions
- Color-coded wine glass markers by region
- Historic landmarks with Wikipedia links

### International Wine Maps
- **Categories**: Merlot & Malbec, Pinot Noir, Cabernet, Sauvignon Blanc, Chardonnay, Sparkling (60+ wines)
- Smart zoom based on wine selection (California, USA, France, or world view)
- Wine region landmarks (Napa, Bordeaux, Champagne, etc.)
- Color-coded markers for 21+ wine regions

### Spirits Maps
- **Categories**: Bourbon, Rye, Scotch (30+ spirits)
- USA: Kentucky, Tennessee, Vermont, Massachusetts, Utah, Canada
- Scotland: Speyside, Islay, Highland, Lowland, Campbeltown
- Distillery landmarks with links

### Implementation
- `src/components/ItalianWineMap.jsx` – Italian wine regions
- `src/components/InternationalWineMap.jsx` – World wine regions
- `src/components/SpiritsMap.jsx` / `SpiritsMapInteractive.jsx` – Whiskey regions

---

## Tip Tracker

A comprehensive tool for servers to track earnings:

### Features
- **Daily tracking**: Cash tips, credit tips, partner exchanges
- **Calendar view**: Monthly grid with daily tips and weekly totals
- **Bulk edit mode**: Backfill multiple shifts at once
- **Analytics**: Per-shift, weekly, monthly, and yearly breakdowns with hourly rates
- **Pops tracking**: Track food credits earned
- **Data management**: Export/import JSON, local storage persistence

### Usage
1. Navigate to **Tips** in menu
2. Click **"+ Add Entry"**
3. Fill in date, partner, cash/credit tips
4. View analytics in calendar or list view

### Implementation
- `src/components/TipTracker.jsx` – Main component
- Data stored in browser localStorage
- Export creates `tips-[year].json` backup file

---

## Beverage Program

All drinks have enhanced server notes with structured sections:

### Format
```
🍷 ABOUT: [Winery story, region, awards]
🍷 STYLE: [Wine style] | [Flavor profile] | [Body, tannins, acidity]
🍽️ PAIRS WITH: [Food pairings - 3-5 items]
💡 BY THE GLASS: [Why this wine is special, server tips]
```

### Coverage
- **Wines by the Glass**: 27 wines with website links
- **Half Bottles**: 14 wines with pronunciations
- **Bourbon/Whiskey**: 16 spirits (Kentucky, Vermont, Utah, Tennessee)
- **Scotch**: 10 whiskeys (Speyside, Islay, Highland, etc.)
- **Rye**: 10 whiskeys
- **After-Dinner**: 25 drinks (Cognac, Port, Amaro, Grappa)
- **Cocktails**: 16 drinks with garnish display
- **Beers**: ~15 drinks

### Display Features
- Server notes (red theme)
- Website links (blue theme)
- Garnish info (green theme)
- Pronunciations for difficult names
- Expandable flavor profiles

---

## Extending

- Flesh out all menu JSON files with full VIA menus.
- Wire AdminPanel to edit **all** menu sections, ingredients and wines.
- Persist JSON updates to a backend (Node, Firebase, etc.) instead of keeping them in-memory.
- Add analytics tracking for update adoption and user engagement.
- Implement background sync for offline admin actions.

## License

This is a demo scaffold. Use and modify freely for your own VIA-style menu project.
