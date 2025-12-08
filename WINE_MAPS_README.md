# 🗺️ Interactive Wine Maps (Italy + World)

## Overview
All wine bottle categories now feature **interactive OpenStreetMaps**:

### 🇮🇹 Italian Wine Maps
**Categories:** Italian Reds Bottles (31 wines), Super Tuscan Bottles (10 wines)
- **Italy-focused view** showing 6 Italian regions
- Color-coded wine glass markers by region
- Historic landmarks with Wikipedia links
- 500px tall comprehensive view
- Toggle landmarks on/off

### 🌍 International Wine Maps
**Categories:** Merlot & Malbec, Pinot Noir, Cabernet, Sauvignon Blanc, Chardonnay, Interesting Whites, Sparkling (60+ wines)
- **World map view** showing global wine regions
- Color-coded markers for 21+ wine regions
- Covers France, USA, Argentina, Chile, Australia, New Zealand, South Africa, Spain, Portugal
- 450px tall world view
- Region legend with wine counts

### 🍷 Individual Wine Maps (Italian wines only)
Each Italian wine card displays its own detailed map:
- **Exact winery location** (wine-colored marker)
- **Regional landmarks** (historic towns, appellations, key sites)
- **Educational links** to Wikipedia for each landmark
- Focused regional view (300px)

## Features

### 🍷 Wine Location Markers
- **15 wines** have precise GPS coordinates of actual wineries
- Other wines show regional center points
- Click wine marker to see wine name, description, and winery info

### 🏛️ Regional Landmarks

**Piedmont (10 wines)**
- Alba - Truffle capital & Barolo center
- Barolo - "King of Wines" village
- Barbaresco - "Queen of Wines" village  
- Asti - Historic wine town

**Tuscany (24 wines - Italian Reds + Super Tuscans)**
- Montalcino - Brunello di Montalcino home
- Montepulciano - Vino Nobile village
- Greve in Chianti - Chianti Classico heart
- Bolgheri - Super Tuscan coast
- Siena - Historic Tuscan city

**Veneto (3 wines)**
- Valpolicella - Amarone region
- Verona - Romeo & Juliet city
- Soave - White wine region

**Puglia (1 wine)**
- Manduria - Primitivo di Manduria
- Lecce - Baroque city of Salento

**Sicily (1 wine)**
- Mount Etna - Active volcano, unique terroir
- Catania - Etna wine region base

**Abruzzo (2 wines)**
- Chieti - Montepulciano d'Abruzzo zone
- L'Aquila - Mountain wine region

### 🎛️ Interactive Controls
- **Toggle landmarks** - Show/hide landmark markers (category map shows count)
- **Clickable popups** - Wine info and landmark details with prices
- **Wikipedia links** - Learn more about each location
- **Pan & zoom** - Explore the region
- **Color-coded legend** - Understand regional distribution at a glance

### 🎨 Regional Color Coding

**Italian Regions:**
- **Piedmont** - Dark Red (#8B0000)
- **Tuscany** - Crimson (#DC143C)
- **Veneto** - Firebrick (#B22222)
- **Puglia** - Indian Red (#CD5C5C)
- **Sicily** - Brown Red (#A52A2A)
- **Abruzzo** - Cardinal Red (#C41E3A)

**International Regions:**
- **Bordeaux** - Claret (#722F37)
- **Burgundy** - Burgundy (#800020)
- **Champagne** - Champagne Gold (#FADA5E)
- **Napa Valley** - Deep Plum (#811F3F)
- **Sonoma** - Plum (#993366)
- **California** - Dark Red (#8B0000)
- **Argentina** - Sky Blue (#74ACDF)
- **Chile** - Chilean Red (#D52B1E)
- **Australia** - Gold (#FFD700)
- **New Zealand** - Navy (#00247D)
- **South Africa** - Green (#007A4D)
- Plus: Loire Valley, Rhone, Alsace, Oregon, Washington State, Paso Robles, Spain, Portugal

## Technology
- **OpenStreetMap** - Free, open-source mapping
- **React-Leaflet** - Interactive maps for React
- **No API key required** - Uses public tile servers

## Data Sources
- Wine coordinates from winery locations
- Regional landmarks from Wikipedia
- Map tiles from OpenStreetMap contributors

## Wines with Precise Coordinates

### Piedmont
1. G.D. Vajra Nebbiolo Clare J.C.
2. Ascheri Barolo
3. Ca' Del Baio Barbaresco Autinbej

### Tuscany (Italian Reds)
1. Castello Banfi Rosso di Montalcino
2. Caparzo Brunello di Montalcino
3. San Felice Chianti Classico
4. Antinori Chianti Classico Riserva

### Tuscany (Super Tuscans)
1. Sassicaia (Bolgheri)
2. Ornellaia, Bolgheri
3. Antinori Tignanello
4. Antinori Solaia

### Veneto
1. Tommasi Amarone
2. Bertani Amarone Classico

### Sicily
1. Benanti Etna Rosso (Mount Etna)

### Puglia
1. San Marzano "62 Anniversario", Primitivo

## Future Enhancements
- Add coordinates for all 41 wines
- Category-level map showing all wines at once
- Winery tour routes
- Appellation boundaries overlay
- Historical wine region information
