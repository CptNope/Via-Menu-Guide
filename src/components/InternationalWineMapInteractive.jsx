import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Wine-colored marker icon creator
const createWineIcon = (color) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="16" cy="38" rx="8" ry="2" fill="#000" opacity="0.2"/>
  <rect x="14" y="24" width="4" height="10" fill="#333" rx="1"/>
  <ellipse cx="16" cy="35" rx="6" ry="2" fill="#444"/>
  <path d="M8 8 C8 4 10 2 16 2 C22 2 24 4 24 8 L22 20 C22 24 19 26 16 26 C13 26 10 24 10 20 Z" fill="${color}" stroke="#333" stroke-width="1"/>
  <ellipse cx="14" cy="10" rx="3" ry="4" fill="#FFF" opacity="0.25"/>
  <path d="M9 8 Q16 6 23 8" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.4"/>
</svg>`)}`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40]
});

const regionColors = {
  // France
  'Bordeaux': '#722F37',
  'Burgundy': '#800020',
  'Rhone Valley': '#9B111E',
  'Champagne': '#FADA5E',
  'Loire Valley': '#E0C097',
  // USA
  'Napa Valley': '#811F3F',
  'Sonoma': '#993366',
  'California': '#8B0000',
  'Oregon': '#614051',
  'Washington State': '#722F37',
  'Paso Robles': '#9B111E',
  // Southern Hemisphere
  'Argentina': '#74ACDF',
  'Chile': '#D52B1E',
  'Australia': '#FFD700',
  'New Zealand': '#00247D',
  'South Africa': '#007A4D',
  // Europe Other
  'Spain': '#AA151B',
  'Portugal': '#006847',
  'Italy': '#009246',
  'Piedmont': '#8B0000',
  'Veneto': '#B22222',
  'Germany': '#FFCC00',
  // US Beer Regions
  'Massachusetts': '#1C2951',
  'Maine': '#003478',
  'Vermont': '#046A38',
  'Pennsylvania': '#002B5C'
};

// Regional landmarks data with centers and zoom levels
const regionalLandmarks = {
  'Bordeaux': {
    center: [44.8378, -0.5792],
    zoom: 9,
    country: 'France',
    landmarks: [
      { name: 'Bordeaux', coords: [44.8378, -0.5792], description: 'World wine capital', link: 'https://en.wikipedia.org/wiki/Bordeaux' },
      { name: 'Médoc', coords: [45.2, -0.8], description: 'Left Bank Cabernet', link: 'https://en.wikipedia.org/wiki/M%C3%A9doc' },
      { name: 'Saint-Émilion', coords: [44.89, -0.15], description: 'Right Bank Merlot', link: 'https://en.wikipedia.org/wiki/Saint-%C3%89milion' },
      { name: 'Pomerol', coords: [44.93, -0.2], description: 'Prestigious Merlot region', link: 'https://en.wikipedia.org/wiki/Pomerol' }
    ]
  },
  'Burgundy': {
    center: [47.0, 4.8],
    zoom: 9,
    country: 'France',
    landmarks: [
      { name: 'Beaune', coords: [47.0253, 4.8395], description: 'Burgundy wine capital', link: 'https://en.wikipedia.org/wiki/Beaune' },
      { name: 'Côte de Nuits', coords: [47.2, 4.95], description: 'Premier Pinot Noir', link: 'https://en.wikipedia.org/wiki/C%C3%B4te_de_Nuits' },
      { name: 'Côte de Beaune', coords: [46.95, 4.85], description: 'Great white Burgundy', link: 'https://en.wikipedia.org/wiki/C%C3%B4te_de_Beaune' },
      { name: 'Chablis', coords: [47.82, 3.8], description: 'Iconic Chardonnay', link: 'https://en.wikipedia.org/wiki/Chablis_wine' }
    ]
  },
  'Champagne': {
    center: [49.0, 4.0],
    zoom: 8,
    country: 'France',
    landmarks: [
      { name: 'Reims', coords: [49.2583, 4.0317], description: 'Champagne capital - Veuve Clicquot, Taittinger', link: 'https://en.wikipedia.org/wiki/Reims' },
      { name: 'Épernay', coords: [49.0417, 3.9592], description: 'Avenue de Champagne - Moët & Chandon, Dom Pérignon', link: 'https://en.wikipedia.org/wiki/%C3%89pernay' },
      { name: 'Côte des Bar', coords: [48.15, 4.35], description: 'Southern Champagne - Moutard', link: 'https://en.wikipedia.org/wiki/C%C3%B4te_des_Bar' },
      { name: 'Montagne de Reims', coords: [49.15, 4.1], description: 'Pinot Noir heartland', link: 'https://en.wikipedia.org/wiki/Montagne_de_Reims' },
      { name: 'Côte des Blancs', coords: [48.95, 3.95], description: 'Chardonnay paradise', link: 'https://en.wikipedia.org/wiki/C%C3%B4te_des_Blancs' }
    ]
  },
  'Loire Valley': {
    center: [47.3, 1.5],
    zoom: 8,
    country: 'France',
    landmarks: [
      { name: 'Sancerre', coords: [47.3333, 2.8333], description: 'Sauvignon Blanc home', link: 'https://en.wikipedia.org/wiki/Sancerre' },
      { name: 'Pouilly-Fumé', coords: [47.28, 2.95], description: 'Flinty Sauvignon Blanc', link: 'https://en.wikipedia.org/wiki/Pouilly-Fum%C3%A9' },
      { name: 'Vouvray', coords: [47.4, 0.8], description: 'Chenin Blanc capital', link: 'https://en.wikipedia.org/wiki/Vouvray' }
    ]
  },
  'Rhone Valley': {
    center: [44.5, 4.8],
    zoom: 8,
    country: 'France',
    landmarks: [
      { name: 'Châteauneuf-du-Pape', coords: [44.05, 4.83], description: 'Southern Rhône icon', link: 'https://en.wikipedia.org/wiki/Ch%C3%A2teauneuf-du-Pape' },
      { name: 'Côte-Rôtie', coords: [45.5, 4.8], description: 'Northern Rhône Syrah', link: 'https://en.wikipedia.org/wiki/C%C3%B4te-R%C3%B4tie' },
      { name: 'Hermitage', coords: [45.08, 4.84], description: 'Legendary Syrah hill', link: 'https://en.wikipedia.org/wiki/Hermitage_(wine)' }
    ]
  },
  'Napa Valley': {
    center: [38.5, -122.4],
    zoom: 10,
    country: 'USA',
    landmarks: [
      { name: 'Napa', coords: [38.2975, -122.2869], description: 'Napa Valley wine capital', link: 'https://en.wikipedia.org/wiki/Napa,_California' },
      { name: 'St. Helena', coords: [38.5052, -122.4703], description: 'Heart of Napa Valley', link: 'https://en.wikipedia.org/wiki/St._Helena,_California' },
      { name: 'Yountville', coords: [38.4016, -122.3608], description: 'Culinary & wine destination', link: 'https://en.wikipedia.org/wiki/Yountville,_California' },
      { name: 'Rutherford', coords: [38.45, -122.42], description: 'Cabernet Dust terroir', link: 'https://en.wikipedia.org/wiki/Rutherford,_California' }
    ]
  },
  'Sonoma': {
    center: [38.4, -122.7],
    zoom: 10,
    country: 'USA',
    landmarks: [
      { name: 'Healdsburg', coords: [38.6102, -122.8695], description: 'Sonoma wine hub', link: 'https://en.wikipedia.org/wiki/Healdsburg,_California' },
      { name: 'Sonoma Plaza', coords: [38.2919, -122.4580], description: 'Historic wine town', link: 'https://en.wikipedia.org/wiki/Sonoma,_California' },
      { name: 'Russian River Valley', coords: [38.5, -122.9], description: 'Premium Pinot & Chardonnay', link: 'https://en.wikipedia.org/wiki/Russian_River_Valley_AVA' }
    ]
  },
  'California': {
    center: [37.0, -120.0],
    zoom: 6,
    country: 'USA',
    landmarks: [
      { name: 'Carneros', coords: [38.25, -122.35], description: 'Cool Chardonnay & Pinot', link: 'https://en.wikipedia.org/wiki/Los_Carneros_AVA' },
      { name: 'Monterey', coords: [36.6, -121.9], description: 'Cool-climate wines', link: 'https://en.wikipedia.org/wiki/Monterey_AVA' },
      { name: 'Santa Barbara', coords: [34.7, -120.2], description: 'Sideways wine country', link: 'https://en.wikipedia.org/wiki/Santa_Barbara_County_wine' }
    ]
  },
  'Oregon': {
    center: [45.0, -123.0],
    zoom: 8,
    country: 'USA',
    landmarks: [
      { name: 'Willamette Valley', coords: [45.2, -123.0], description: 'Pinot Noir paradise', link: 'https://en.wikipedia.org/wiki/Willamette_Valley_AVA' },
      { name: 'McMinnville', coords: [45.2104, -123.1987], description: 'Oregon wine country', link: 'https://en.wikipedia.org/wiki/McMinnville,_Oregon' },
      { name: 'Dundee Hills', coords: [45.28, -123.05], description: 'Premier Pinot terroir', link: 'https://en.wikipedia.org/wiki/Dundee_Hills_AVA' }
    ]
  },
  'Washington State': {
    center: [46.5, -119.5],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Walla Walla', coords: [46.07, -118.34], description: 'Premium wine region', link: 'https://en.wikipedia.org/wiki/Walla_Walla_Valley_AVA' },
      { name: 'Columbia Valley', coords: [46.5, -119.5], description: 'Largest WA wine region', link: 'https://en.wikipedia.org/wiki/Columbia_Valley_AVA' },
      { name: 'Red Mountain', coords: [46.3, -119.4], description: 'Cabernet excellence', link: 'https://en.wikipedia.org/wiki/Red_Mountain_AVA' }
    ]
  },
  'Paso Robles': {
    center: [35.6, -120.7],
    zoom: 10,
    country: 'USA',
    landmarks: [
      { name: 'Paso Robles', coords: [35.6266, -120.6907], description: 'Central Coast gem', link: 'https://en.wikipedia.org/wiki/Paso_Robles,_California' }
    ]
  },
  'Argentina': {
    center: [-33.0, -68.5],
    zoom: 8,
    country: 'Argentina',
    landmarks: [
      { name: 'Mendoza', coords: [-32.8895, -68.8458], description: 'Malbec capital of world', link: 'https://en.wikipedia.org/wiki/Mendoza,_Argentina' },
      { name: 'Uco Valley', coords: [-33.8, -69.2], description: 'High-altitude premium wines', link: 'https://en.wikipedia.org/wiki/Uco_Valley' },
      { name: 'Luján de Cuyo', coords: [-33.0, -68.9], description: 'Historic Malbec zone', link: 'https://en.wikipedia.org/wiki/Luj%C3%A1n_de_Cuyo' }
    ]
  },
  'Chile': {
    center: [-34.0, -71.0],
    zoom: 7,
    country: 'Chile',
    landmarks: [
      { name: 'Maipo Valley', coords: [-33.7, -70.6], description: 'Chile premier Cabernet', link: 'https://en.wikipedia.org/wiki/Maipo_Valley' },
      { name: 'Colchagua', coords: [-34.5, -71.2], description: 'Red wine heartland', link: 'https://en.wikipedia.org/wiki/Colchagua_Valley' },
      { name: 'Casablanca', coords: [-33.3, -71.4], description: 'Cool-climate whites', link: 'https://en.wikipedia.org/wiki/Casablanca_Valley' }
    ]
  },
  'Australia': {
    center: [-34.5, 138.5],
    zoom: 6,
    country: 'Australia',
    landmarks: [
      { name: 'Barossa Valley', coords: [-34.5, 138.9], description: 'Shiraz heartland', link: 'https://en.wikipedia.org/wiki/Barossa_Valley' },
      { name: 'Margaret River', coords: [-33.95, 115.1], description: 'Premium Cabernet', link: 'https://en.wikipedia.org/wiki/Margaret_River_wine_region' },
      { name: 'Hunter Valley', coords: [-32.8, 151.2], description: 'Historic wine region', link: 'https://en.wikipedia.org/wiki/Hunter_Valley_wine_region' }
    ]
  },
  'New Zealand': {
    center: [-41.5, 174.0],
    zoom: 6,
    country: 'New Zealand',
    landmarks: [
      { name: 'Marlborough', coords: [-41.5, 173.8], description: 'Sauvignon Blanc region', link: 'https://en.wikipedia.org/wiki/Marlborough_Region' },
      { name: 'Central Otago', coords: [-45.0, 169.2], description: 'Premium Pinot Noir', link: 'https://en.wikipedia.org/wiki/Central_Otago_wine_region' },
      { name: 'Hawke\'s Bay', coords: [-39.5, 176.9], description: 'Red wine country', link: 'https://en.wikipedia.org/wiki/Hawke%27s_Bay_wine_region' }
    ]
  },
  'South Africa': {
    center: [-33.9, 18.9],
    zoom: 9,
    country: 'South Africa',
    landmarks: [
      { name: 'Stellenbosch', coords: [-33.93, 18.86], description: 'SA wine capital', link: 'https://en.wikipedia.org/wiki/Stellenbosch' },
      { name: 'Franschhoek', coords: [-33.91, 19.12], description: 'French Huguenot valley', link: 'https://en.wikipedia.org/wiki/Franschhoek' },
      { name: 'Constantia', coords: [-34.03, 18.42], description: 'Historic wine estate', link: 'https://en.wikipedia.org/wiki/Constantia,_Cape_Town' }
    ]
  },
  'Spain': {
    center: [42.0, -2.5],
    zoom: 7,
    country: 'Spain',
    landmarks: [
      { name: 'Rioja', coords: [42.45, -2.45], description: 'Spanish red wine icon', link: 'https://en.wikipedia.org/wiki/Rioja_(wine)' },
      { name: 'Ribera del Duero', coords: [41.6, -3.7], description: 'Tempranillo excellence', link: 'https://en.wikipedia.org/wiki/Ribera_del_Duero' },
      { name: 'Priorat', coords: [41.2, 0.75], description: 'Premium Garnacha', link: 'https://en.wikipedia.org/wiki/Priorat_(wine)' }
    ]
  },
  'Portugal': {
    center: [41.15, -8.0],
    zoom: 8,
    country: 'Portugal',
    landmarks: [
      { name: 'Douro Valley', coords: [41.15, -7.8], description: 'Port wine home', link: 'https://en.wikipedia.org/wiki/Douro_DOC' },
      { name: 'Porto', coords: [41.16, -8.63], description: 'Port wine cellars', link: 'https://en.wikipedia.org/wiki/Port_wine' }
    ]
  },
  // Italian Wine Regions
  'Piedmont': {
    center: [44.7, 8.0],
    zoom: 8,
    country: 'Italy',
    landmarks: [
      { name: 'Alba', coords: [44.7, 8.04], description: 'Barolo & Barbaresco capital', link: 'https://en.wikipedia.org/wiki/Alba,_Piedmont' },
      { name: 'Asti', coords: [44.9, 8.21], description: 'Moscato d\'Asti region', link: 'https://en.wikipedia.org/wiki/Asti' },
      { name: 'Torino', coords: [45.07, 7.69], description: 'Piedmont capital', link: 'https://en.wikipedia.org/wiki/Turin' }
    ]
  },
  'Veneto': {
    center: [45.5, 11.5],
    zoom: 8,
    country: 'Italy',
    landmarks: [
      { name: 'Verona', coords: [45.44, 10.99], description: 'Amarone & Valpolicella', link: 'https://en.wikipedia.org/wiki/Verona' },
      { name: 'Conegliano', coords: [45.89, 12.30], description: 'Prosecco capital', link: 'https://en.wikipedia.org/wiki/Conegliano' },
      { name: 'Soave', coords: [45.42, 11.25], description: 'White wine region', link: 'https://en.wikipedia.org/wiki/Soave,_Veneto' }
    ]
  },
  // Beer Regions
  'Italy': {
    center: [41.9, 12.5],
    zoom: 6,
    country: 'Italy',
    landmarks: [
      { name: 'Rome', coords: [41.9028, 12.4964], description: 'Peroni Brewery founded 1846', link: 'https://en.wikipedia.org/wiki/Peroni_Brewery' },
      { name: 'Milan', coords: [45.4642, 9.1900], description: 'Italian beer culture hub', link: 'https://en.wikipedia.org/wiki/Milan' }
    ]
  },
  'Germany': {
    center: [50.0, 10.0],
    zoom: 6,
    country: 'Germany',
    landmarks: [
      { name: 'Munich', coords: [48.1351, 11.5820], description: 'Oktoberfest & beer capital', link: 'https://en.wikipedia.org/wiki/Beer_in_Munich' },
      { name: 'Mosel', coords: [49.8, 7.0], description: 'Riesling wine region', link: 'https://en.wikipedia.org/wiki/Mosel_(wine_region)' }
    ]
  },
  'Massachusetts': {
    center: [42.3, -71.8],
    zoom: 8,
    country: 'USA',
    landmarks: [
      { name: 'Worcester', coords: [42.2626, -71.8023], description: 'Wormtown & Greater Good breweries', link: 'https://en.wikipedia.org/wiki/Worcester,_Massachusetts' },
      { name: 'Framingham', coords: [42.2793, -71.4162], description: 'Jack\'s Abby Craft Lagers', link: 'https://en.wikipedia.org/wiki/Framingham,_Massachusetts' },
      { name: 'Westminster', coords: [42.5462, -71.9109], description: 'Wachusett Brewing', link: 'https://en.wikipedia.org/wiki/Westminster,_Massachusetts' },
      { name: 'Harvard', coords: [42.5001, -71.5828], description: 'Carlson Orchards Cider', link: 'https://en.wikipedia.org/wiki/Harvard,_Massachusetts' }
    ]
  },
  'Maine': {
    center: [43.8, -70.2],
    zoom: 8,
    country: 'USA',
    landmarks: [
      { name: 'Portland', coords: [43.6591, -70.2568], description: 'Allagash Brewing Co.', link: 'https://en.wikipedia.org/wiki/Allagash_Brewing_Company' },
      { name: 'Freeport', coords: [43.8567, -70.1031], description: 'Maine craft beer hub', link: 'https://en.wikipedia.org/wiki/Freeport,_Maine' }
    ]
  },
  'Vermont': {
    center: [44.0, -72.7],
    zoom: 8,
    country: 'USA',
    landmarks: [
      { name: 'Burlington', coords: [44.4759, -73.2121], description: 'Switchback Brewing', link: 'https://en.wikipedia.org/wiki/Burlington,_Vermont' },
      { name: 'Shelburne', coords: [44.3792, -73.2268], description: 'Fiddlehead Brewing', link: 'https://en.wikipedia.org/wiki/Shelburne,_Vermont' },
      { name: 'Stowe', coords: [44.4654, -72.6874], description: 'Vermont craft beer scene', link: 'https://en.wikipedia.org/wiki/Stowe,_Vermont' }
    ]
  },
  'Pennsylvania': {
    center: [40.0, -75.5],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Philadelphia', coords: [39.9526, -75.1652], description: 'Historic brewing city', link: 'https://en.wikipedia.org/wiki/Philadelphia' },
      { name: 'Pittsburgh', coords: [40.4406, -79.9959], description: 'Steel City brewing', link: 'https://en.wikipedia.org/wiki/Pittsburgh' }
    ]
  }
};

function InternationalWineMapInteractive({ wine }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  
  if (!wine || !wine.region) return null;
  
  const regionData = regionalLandmarks[wine.region];
  if (!regionData) return null;

  // Use wine's coordinates if available, otherwise use region center
  const wineCoords = wine.coordinates || regionData.center;
  const wineIcon = createWineIcon(regionColors[wine.region] || '#8B0000');

  return (
    <div className="wine-map-interactive">
      <div 
        className="wine-map-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <span className="wine-map-toggle">
          🗺️ View {wine.region} Map {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="wine-map-container">
          <div className="map-controls">
            <button 
              className="map-toggle-btn"
              onClick={(e) => { e.stopPropagation(); setShowLandmarks(!showLandmarks); }}
            >
              {showLandmarks ? '🏛️ Hide' : '🏛️ Show'} Landmarks
            </button>
            <span className="map-region-label">📍 {wine.region}, {regionData.country}</span>
          </div>
          
          <MapContainer 
            center={regionData.center} 
            zoom={regionData.zoom} 
            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Wine marker */}
            <Marker position={wineCoords} icon={wineIcon}>
              <Popup>
                <div className="wine-popup">
                  <strong>{wine.name}</strong>
                  <p>{wine.description}</p>
                  {wine.winery && <p><em>Winery: {wine.winery}</em></p>}
                </div>
              </Popup>
            </Marker>

            {/* Landmark markers */}
            {showLandmarks && regionData.landmarks.map((landmark, idx) => (
              <Marker key={idx} position={landmark.coords}>
                <Popup>
                  <div className="landmark-popup">
                    <strong>{landmark.name}</strong>
                    <p>{landmark.description}</p>
                    {landmark.link && (
                      <a href={landmark.link} target="_blank" rel="noopener noreferrer">
                        Learn more →
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default InternationalWineMapInteractive;
