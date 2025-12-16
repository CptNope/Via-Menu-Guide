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

// Whiskey glass marker icon creator
const createWhiskeyIcon = (color) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="16" cy="38" rx="7" ry="2" fill="#000" opacity="0.2"/>
  <rect x="10" y="18" width="12" height="16" fill="${color}" stroke="#333" stroke-width="1" rx="1"/>
  <ellipse cx="16" cy="34" rx="6" ry="1.5" fill="#444"/>
  <rect x="11" y="19" width="10" height="12" fill="${color}" opacity="0.8"/>
  <ellipse cx="14" cy="24" rx="2" ry="3" fill="#FFF" opacity="0.2"/>
  <rect x="9" y="18" width="14" height="2" fill="#666" rx="1"/>
</svg>`)}`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40]
});

const regionColors = {
  // USA Bourbon/Rye
  'Kentucky': '#B8860B',
  'Tennessee': '#CD853F',
  'Indiana': '#DAA520',
  'Vermont': '#8B4513',
  'Utah': '#D2691E',
  'Massachusetts': '#8B7355',
  'Oregon': '#A0522D',
  'New York': '#C4A000',
  'Pennsylvania': '#B8860B',
  // Scotland
  'Speyside': '#8B4789',
  'Islay': '#4B0082',
  'Highland': '#9370DB',
  'Lowland': '#BA55D3',
  'Campbeltown': '#8B008B',
  'Scotland': '#663399',
  // Other Whiskey
  'Canada': '#DC143C',
  'Ireland': '#228B22',
  'Japan': '#B22222',
  // US Amaro
  'Washington DC': '#3C3B6E',
  'Brooklyn, NY': '#FF6600',
  'Florida': '#F4A460',
  'USA': '#B22234',
  // Cognac (France)
  'Cognac': '#D4AF37',
  'Grande Champagne': '#FFD700',
  'Petite Champagne': '#F0E68C',
  'France': '#0055A4',
  // Grappa & Amaro (Italy)
  'Veneto': '#B22222',
  'Piedmont': '#8B0000',
  'Trentino': '#DC143C',
  'Friuli': '#CD5C5C',
  'Italy': '#009246',
  'Sicily': '#A52A2A',
  'Lombardy': '#C41E3A',
  // Port (Portugal)
  'Douro Valley': '#006847',
  'Portugal': '#FF0000',
  'Porto': '#003399'
};

// Regional landmarks data with centers and zoom levels
const regionalLandmarks = {
  'Kentucky': {
    center: [38.0, -84.5],
    zoom: 6,
    country: 'USA',
    landmarks: [
      { name: 'Bardstown', coords: [37.8, -85.5], description: 'Bourbon Capital of the World', link: 'https://en.wikipedia.org/wiki/Bardstown,_Kentucky' },
      { name: 'Louisville', coords: [38.25, -85.76], description: 'Kentucky Bourbon Trail start', link: 'https://en.wikipedia.org/wiki/Louisville,_Kentucky' },
      { name: 'Frankfort', coords: [38.2, -84.87], description: 'Buffalo Trace & more', link: 'https://en.wikipedia.org/wiki/Frankfort,_Kentucky' },
      { name: 'Lawrenceburg', coords: [38.04, -84.9], description: 'Wild Turkey & Four Roses', link: 'https://en.wikipedia.org/wiki/Lawrenceburg,_Kentucky' }
    ]
  },
  'Tennessee': {
    center: [35.5, -86.0],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Lynchburg', coords: [35.28, -86.37], description: 'Jack Daniel\'s home', link: 'https://en.wikipedia.org/wiki/Lynchburg,_Tennessee' },
      { name: 'Tullahoma', coords: [35.37, -86.21], description: 'George Dickel distillery', link: 'https://en.wikipedia.org/wiki/Tullahoma,_Tennessee' }
    ]
  },
  'Indiana': {
    center: [39.8, -86.1],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Lawrenceburg', coords: [39.09, -84.85], description: 'MGP Distillery - major rye producer', link: 'https://en.wikipedia.org/wiki/MGP_of_Indiana' }
    ]
  },
  'Vermont': {
    center: [44.0, -72.7],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Waterbury', coords: [44.34, -72.76], description: 'WhistlePig Farm', link: 'https://en.wikipedia.org/wiki/WhistlePig' },
      { name: 'Warren', coords: [44.12, -72.86], description: 'Mad River Distillers', link: 'https://en.wikipedia.org/wiki/Warren,_Vermont' }
    ]
  },
  'Utah': {
    center: [40.76, -111.89],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Park City', coords: [40.65, -111.5], description: 'High West Distillery - 7,000 ft elevation', link: 'https://en.wikipedia.org/wiki/High_West_Distillery' },
      { name: 'Salt Lake City', coords: [40.76, -111.89], description: 'Utah craft spirits hub', link: 'https://en.wikipedia.org/wiki/Salt_Lake_City' }
    ]
  },
  'Massachusetts': {
    center: [42.36, -71.06],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Everett', coords: [42.41, -71.05], description: 'Short Path Distillery', link: 'https://en.wikipedia.org/wiki/Everett,_Massachusetts' },
      { name: 'Boston', coords: [42.36, -71.06], description: 'Historic whiskey territory', link: 'https://en.wikipedia.org/wiki/Boston' }
    ]
  },
  'Oregon': {
    center: [44.0, -120.5],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Portland', coords: [45.52, -122.68], description: 'Craft distillery scene', link: 'https://en.wikipedia.org/wiki/Portland,_Oregon' },
      { name: 'Hood River', coords: [45.71, -121.51], description: 'Pendleton bottling', link: 'https://en.wikipedia.org/wiki/Hood_River,_Oregon' }
    ]
  },
  'New York': {
    center: [42.5, -76.0],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Brooklyn', coords: [40.65, -73.95], description: 'Craft distillery scene', link: 'https://en.wikipedia.org/wiki/Brooklyn' },
      { name: 'Finger Lakes', coords: [42.6, -76.9], description: 'NY wine & spirits', link: 'https://en.wikipedia.org/wiki/Finger_Lakes' }
    ]
  },
  'Speyside': {
    center: [57.5, -3.2],
    zoom: 8,
    country: 'Scotland',
    landmarks: [
      { name: 'Dufftown', coords: [57.45, -3.12], description: 'Malt Whisky Capital - Glenfiddich, Balvenie', link: 'https://en.wikipedia.org/wiki/Dufftown' },
      { name: 'Rothes', coords: [57.53, -3.20], description: 'Glenrothes & Glen Grant', link: 'https://en.wikipedia.org/wiki/Rothes' },
      { name: 'Craigellachie', coords: [57.45, -3.18], description: 'Macallan nearby', link: 'https://en.wikipedia.org/wiki/Craigellachie,_Moray' }
    ]
  },
  'Islay': {
    center: [55.75, -6.2],
    zoom: 9,
    country: 'Scotland',
    landmarks: [
      { name: 'Port Ellen', coords: [55.63, -6.19], description: 'Ardbeg, Lagavulin, Laphroaig', link: 'https://en.wikipedia.org/wiki/Port_Ellen' },
      { name: 'Bowmore', coords: [55.76, -6.29], description: 'Oldest Islay distillery', link: 'https://en.wikipedia.org/wiki/Bowmore_distillery' },
      { name: 'Bruichladdich', coords: [55.77, -6.36], description: 'Progressive distillery', link: 'https://en.wikipedia.org/wiki/Bruichladdich_distillery' }
    ]
  },
  'Highland': {
    center: [57.5, -4.5],
    zoom: 7,
    country: 'Scotland',
    landmarks: [
      { name: 'Inverness', coords: [57.48, -4.22], description: 'Highland capital', link: 'https://en.wikipedia.org/wiki/Inverness' },
      { name: 'Tain', coords: [57.81, -4.05], description: 'Glenmorangie home', link: 'https://en.wikipedia.org/wiki/Tain' },
      { name: 'Oban', coords: [56.42, -5.47], description: 'West Highland gem', link: 'https://en.wikipedia.org/wiki/Oban_distillery' }
    ]
  },
  'Lowland': {
    center: [55.5, -3.5],
    zoom: 7,
    country: 'Scotland',
    landmarks: [
      { name: 'Edinburgh', coords: [55.95, -3.19], description: 'Scotland\'s capital', link: 'https://en.wikipedia.org/wiki/Edinburgh' },
      { name: 'Glenkinchie', coords: [55.89, -2.89], description: 'Lowland distillery', link: 'https://en.wikipedia.org/wiki/Glenkinchie_distillery' }
    ]
  },
  'Campbeltown': {
    center: [55.4, -5.6],
    zoom: 9,
    country: 'Scotland',
    landmarks: [
      { name: 'Campbeltown', coords: [55.43, -5.6], description: 'Historic whisky town - Springbank', link: 'https://en.wikipedia.org/wiki/Campbeltown' }
    ]
  },
  'Scotland': {
    center: [56.5, -4.0],
    zoom: 6,
    country: 'Scotland',
    landmarks: [
      { name: 'Edinburgh', coords: [55.95, -3.19], description: 'Scotland\'s capital', link: 'https://en.wikipedia.org/wiki/Edinburgh' },
      { name: 'Glasgow', coords: [55.86, -4.25], description: 'Largest city', link: 'https://en.wikipedia.org/wiki/Glasgow' }
    ]
  },
  'Ireland': {
    center: [53.3, -7.5],
    zoom: 7,
    country: 'Ireland',
    landmarks: [
      { name: 'Dublin', coords: [53.35, -6.26], description: 'Jameson & Teeling', link: 'https://en.wikipedia.org/wiki/Dublin' },
      { name: 'Midleton', coords: [51.91, -8.17], description: 'Irish Distillers home', link: 'https://en.wikipedia.org/wiki/Midleton_Distillery' }
    ]
  },
  'Japan': {
    center: [35.5, 136.5],
    zoom: 6,
    country: 'Japan',
    landmarks: [
      { name: 'Yamazaki', coords: [34.89, 135.68], description: 'Suntory\'s first distillery', link: 'https://en.wikipedia.org/wiki/Yamazaki_distillery' },
      { name: 'Yoichi', coords: [43.19, 140.78], description: 'Nikka\'s coastal distillery', link: 'https://en.wikipedia.org/wiki/Yoichi_distillery' }
    ]
  },
  'Canada': {
    center: [43.7, -79.4],
    zoom: 6,
    country: 'Canada',
    landmarks: [
      { name: 'Windsor', coords: [42.32, -83.04], description: 'Canadian Club home', link: 'https://en.wikipedia.org/wiki/Windsor,_Ontario' },
      { name: 'Walkerville', coords: [42.32, -82.95], description: 'Historic distillery district', link: 'https://en.wikipedia.org/wiki/Walkerville,_Ontario' }
    ]
  },
  // Cognac regions
  'Cognac': {
    center: [45.7, -0.33],
    zoom: 8,
    country: 'France',
    landmarks: [
      { name: 'Cognac', coords: [45.7, -0.33], description: 'Heart of Cognac production', link: 'https://en.wikipedia.org/wiki/Cognac' },
      { name: 'Jarnac', coords: [45.68, -0.17], description: 'Courvoisier & Delamain home', link: 'https://en.wikipedia.org/wiki/Jarnac' },
      { name: 'Segonzac', coords: [45.62, -0.22], description: 'Grande Champagne center', link: 'https://en.wikipedia.org/wiki/Segonzac,_Charente' }
    ]
  },
  'Grande Champagne': {
    center: [45.6, -0.2],
    zoom: 8,
    country: 'France',
    landmarks: [
      { name: 'Segonzac', coords: [45.62, -0.22], description: 'Premier cru of Cognac', link: 'https://en.wikipedia.org/wiki/Grande_Champagne' },
      { name: 'Cognac', coords: [45.7, -0.33], description: 'Cognac town', link: 'https://en.wikipedia.org/wiki/Cognac' }
    ]
  },
  'France': {
    center: [46.6, 2.0],
    zoom: 6,
    country: 'France',
    landmarks: [
      { name: 'Cognac', coords: [45.7, -0.33], description: 'Cognac region', link: 'https://en.wikipedia.org/wiki/Cognac' },
      { name: 'Paris', coords: [48.86, 2.35], description: 'Capital city', link: 'https://en.wikipedia.org/wiki/Paris' }
    ]
  },
  // Grappa & Amaro regions (Italy)
  'Veneto': {
    center: [45.5, 11.5],
    zoom: 7,
    country: 'Italy',
    landmarks: [
      { name: 'Bassano del Grappa', coords: [45.77, 11.73], description: 'Grappa capital of Italy', link: 'https://en.wikipedia.org/wiki/Bassano_del_Grappa' },
      { name: 'Verona', coords: [45.44, 10.99], description: 'Amarone & spirits', link: 'https://en.wikipedia.org/wiki/Verona' },
      { name: 'Vicenza', coords: [45.55, 11.55], description: 'Grappa distilleries', link: 'https://en.wikipedia.org/wiki/Vicenza' }
    ]
  },
  'Piedmont': {
    center: [44.7, 8.0],
    zoom: 7,
    country: 'Italy',
    landmarks: [
      { name: 'Alba', coords: [44.7, 8.04], description: 'Barolo & grappa', link: 'https://en.wikipedia.org/wiki/Alba,_Piedmont' },
      { name: 'Torino', coords: [45.07, 7.69], description: 'Vermouth & amaro capital', link: 'https://en.wikipedia.org/wiki/Turin' },
      { name: 'Asti', coords: [44.9, 8.21], description: 'Moscato & spirits', link: 'https://en.wikipedia.org/wiki/Asti' }
    ]
  },
  'Trentino': {
    center: [46.07, 11.12],
    zoom: 8,
    country: 'Italy',
    landmarks: [
      { name: 'Trento', coords: [46.07, 11.12], description: 'Alpine grappa region', link: 'https://en.wikipedia.org/wiki/Trento' },
      { name: 'Rovereto', coords: [45.89, 11.04], description: 'Historic distilleries', link: 'https://en.wikipedia.org/wiki/Rovereto' }
    ]
  },
  'Friuli': {
    center: [46.07, 13.23],
    zoom: 7,
    country: 'Italy',
    landmarks: [
      { name: 'Udine', coords: [46.07, 13.23], description: 'Friulian grappa', link: 'https://en.wikipedia.org/wiki/Udine' },
      { name: 'Gorizia', coords: [45.94, 13.62], description: 'Border distilleries', link: 'https://en.wikipedia.org/wiki/Gorizia' }
    ]
  },
  'Sicily': {
    center: [37.5, 14.0],
    zoom: 7,
    country: 'Italy',
    landmarks: [
      { name: 'Palermo', coords: [38.12, 13.36], description: 'Sicilian amaro', link: 'https://en.wikipedia.org/wiki/Palermo' },
      { name: 'Catania', coords: [37.51, 15.09], description: 'Etna spirits', link: 'https://en.wikipedia.org/wiki/Catania' }
    ]
  },
  'Lombardy': {
    center: [45.47, 9.19],
    zoom: 7,
    country: 'Italy',
    landmarks: [
      { name: 'Milano', coords: [45.47, 9.19], description: 'Amaro & aperitivo capital', link: 'https://en.wikipedia.org/wiki/Milan' },
      { name: 'Bergamo', coords: [45.7, 9.67], description: 'Fernet production', link: 'https://en.wikipedia.org/wiki/Bergamo' }
    ]
  },
  'Italy': {
    center: [42.5, 12.5],
    zoom: 6,
    country: 'Italy',
    landmarks: [
      { name: 'Milano', coords: [45.47, 9.19], description: 'Amaro capital', link: 'https://en.wikipedia.org/wiki/Milan' },
      { name: 'Bassano', coords: [45.77, 11.73], description: 'Grappa capital', link: 'https://en.wikipedia.org/wiki/Bassano_del_Grappa' },
      { name: 'Torino', coords: [45.07, 7.69], description: 'Vermouth home', link: 'https://en.wikipedia.org/wiki/Turin' }
    ]
  },
  // Port regions (Portugal)
  'Douro Valley': {
    center: [41.15, -7.8],
    zoom: 8,
    country: 'Portugal',
    landmarks: [
      { name: 'Pinhão', coords: [41.19, -7.54], description: 'Heart of Port country', link: 'https://en.wikipedia.org/wiki/Pinh%C3%A3o' },
      { name: 'Peso da Régua', coords: [41.16, -7.79], description: 'Douro wine capital', link: 'https://en.wikipedia.org/wiki/Peso_da_R%C3%A9gua' },
      { name: 'Lamego', coords: [41.1, -7.81], description: 'Historic wine town', link: 'https://en.wikipedia.org/wiki/Lamego' }
    ]
  },
  'Porto': {
    center: [41.16, -8.63],
    zoom: 8,
    country: 'Portugal',
    landmarks: [
      { name: 'Vila Nova de Gaia', coords: [41.13, -8.62], description: 'Port wine cellars', link: 'https://en.wikipedia.org/wiki/Vila_Nova_de_Gaia' },
      { name: 'Porto', coords: [41.16, -8.63], description: 'Port wine city', link: 'https://en.wikipedia.org/wiki/Porto' }
    ]
  },
  'Portugal': {
    center: [39.5, -8.0],
    zoom: 6,
    country: 'Portugal',
    landmarks: [
      { name: 'Porto', coords: [41.16, -8.63], description: 'Port wine capital', link: 'https://en.wikipedia.org/wiki/Porto' },
      { name: 'Douro Valley', coords: [41.15, -7.8], description: 'Port wine region', link: 'https://en.wikipedia.org/wiki/Douro_DOC' }
    ]
  },
  // US Amaro Regions
  'Washington DC': {
    center: [38.9, -77.0],
    zoom: 8,
    country: 'USA',
    landmarks: [
      { name: 'Washington DC', coords: [38.9, -77.0], description: 'Don Ciccio & Figli', link: 'https://en.wikipedia.org/wiki/Washington,_D.C.' }
    ]
  },
  'Brooklyn, NY': {
    center: [40.65, -73.95],
    zoom: 9,
    country: 'USA',
    landmarks: [
      { name: 'Red Hook', coords: [40.67, -74.01], description: 'Faccia Brutto craft amaro', link: 'https://en.wikipedia.org/wiki/Red_Hook,_Brooklyn' }
    ]
  },
  'Florida': {
    center: [27.6, -81.5],
    zoom: 7,
    country: 'USA',
    landmarks: [
      { name: 'Miami', coords: [25.76, -80.19], description: 'Perrine Key Lime Amaro', link: 'https://en.wikipedia.org/wiki/Miami' }
    ]
  },
  'USA': {
    center: [39.8, -98.6],
    zoom: 4,
    country: 'USA',
    landmarks: [
      { name: 'Craft Distilleries', coords: [39.8, -98.6], description: 'American craft amaro movement', link: 'https://en.wikipedia.org/wiki/Craft_distillery' }
    ]
  }
};

function SpiritsMapInteractive({ spirit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  
  if (!spirit || !spirit.region) return null;
  
  const regionData = regionalLandmarks[spirit.region];
  if (!regionData) return null;

  // Use spirit's coordinates if available, otherwise use region center
  const spiritCoords = spirit.coordinates || regionData.center;
  const spiritIcon = createWhiskeyIcon(regionColors[spirit.region] || '#B8860B');

  return (
    <div className="wine-map-interactive">
      <div 
        className="wine-map-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <span className="wine-map-toggle">
          🗺️ View {spirit.region} Map {isExpanded ? '▼' : '▶'}
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
            <span className="map-region-label">📍 {spirit.region}, {regionData.country}</span>
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
            
            {/* Spirit marker */}
            <Marker position={spiritCoords} icon={spiritIcon}>
              <Popup>
                <div className="wine-popup">
                  <strong>{spirit.name}</strong>
                  <p>{spirit.description}</p>
                  {spirit.distillery && <p><em>Distillery: {spirit.distillery}</em></p>}
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

export default SpiritsMapInteractive;
