# VIA Italian Table Menu PWA (CRA Starter)

This is a **Create React App** starter for a VIA Italian Table interactive menu:

- Dinner, lunch, dessert, kids and drinks menus
- Proposed allergen info + dietary flags
- Wine pairing guide
- Basic admin panel (placeholder login) to edit sample dinner items
- PWA enabled (offline-capable, installable)

> This is a starter / scaffold. Data is partial and meant to be extended.

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
- `npm run eject` – CRA eject (irreversible)

## PWA / Offline

The app registers a service worker in `src/serviceWorkerRegistration.js`.  
In production (`npm run build`), the service worker will:

- cache the app shell and static assets
- serve cached content when offline

The service worker implementation lives in `public/service-worker.js`.

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

## Extending

- Flesh out all menu JSON files with full VIA menus.
- Wire AdminPanel to edit **all** menu sections, ingredients and wines.
- Persist JSON updates to a backend (Node, Firebase, etc.) instead of keeping them in-memory.
- Replace placeholder icons in `public/` with real logo assets.
- Tune the PWA cache strategy (Workbox, runtime routes, versioning).

## License

This is a demo scaffold. Use and modify freely for your own VIA-style menu project.
