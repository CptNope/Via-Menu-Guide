# 🗺️ Interactive Italian Wine Maps

## Overview
Italian wine bottles now feature **TWO levels of interactive OpenStreetMaps**:

### 📍 Category Overview Map
At the top of "Italian Reds Bottles" and "Super Tuscan Bottles" sections:
- **All wines displayed on one map** of Italy
- Color-coded markers by region (6 different colors)
- Wine count legend showing distribution
- 500px tall comprehensive view
- Toggle landmarks on/off

### 🍷 Individual Wine Maps
Each wine bottle card displays its own detailed map:
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
- **Piedmont** - Dark Red (#8B0000)
- **Tuscany** - Crimson (#DC143C)
- **Veneto** - Firebrick (#B22222)
- **Puglia** - Indian Red (#CD5C5C)
- **Sicily** - Brown Red (#A52A2A)
- **Abruzzo** - Cardinal Red (#C41E3A)

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
