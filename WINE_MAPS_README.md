# 🗺️ Interactive Italian Wine Maps

## Overview
Each Italian Reds and Super Tuscan wine bottle now displays an **interactive OpenStreetMap** showing:
- **Exact winery location** (wine-colored marker)
- **Regional landmarks** (historic towns, appellations, key sites)
- **Educational links** to Wikipedia for each landmark

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
- **Toggle landmarks** - Show/hide landmark markers
- **Clickable popups** - Wine info and landmark details
- **Wikipedia links** - Learn more about each location
- **Pan & zoom** - Explore the region

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
