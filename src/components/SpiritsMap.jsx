import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Whiskey glass icon creator
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
  // Scotland
  'Speyside': '#8B4789',
  'Islay': '#4B0082',
  'Highland': '#9370DB',
  'Lowland': '#BA55D3',
  'Campbeltown': '#8B008B',
  'Scotland': '#663399',
  // Other
  'Canada': '#DC143C',
  'Ireland': '#228B22',
  'Japan': '#B22222',
  // Cognac
  'Cognac': '#D4AF37',
  'France': '#0055A4',
  // Amaro & Italian Regions
  'Sicily': '#FF6B35',
  'Lombardy': '#C41E3A',
  'Piedmont': '#8B0000',
  'Veneto': '#B22222',
  'Friuli': '#CD5C5C',
  'Trentino': '#DC143C',
  // US Amaro Regions
  'Washington DC': '#3C3B6E',
  'USA': '#B22234',
  'Brooklyn, NY': '#FF6600',
  'New York': '#1C3879',
  'Florida': '#F4A460',
  // Port
  'Douro Valley': '#006847',
  'Portugal': '#FF0000',
  'Porto': '#003399'
};

const regionIcons = Object.fromEntries(
  Object.entries(regionColors).map(([region, color]) => [region, createWhiskeyIcon(color)])
);

const regionCenters = {
  // USA
  'Kentucky': [38.0, -84.5],
  'Tennessee': [35.5, -86.0],
  'Indiana': [39.8, -86.1],
  'Vermont': [44.0, -72.7],
  'Utah': [40.8, -111.9],
  'Massachusetts': [42.4, -71.1],
  'Oregon': [44.0, -121.0],
  // Scotland
  'Speyside': [57.5, -3.2],
  'Islay': [55.75, -6.2],
  'Highland': [57.5, -4.5],
  'Lowland': [55.5, -3.5],
  'Campbeltown': [55.4, -5.6],
  'Scotland': [56.5, -4.0],
  // Other
  'Canada': [43.7, -79.4],
  'Ireland': [53.3, -6.3],
  'Japan': [34.7, 135.5],
  // Cognac
  'Cognac': [45.7, -0.33],
  'France': [46.6, 2.0],
  // Italian Amaro Regions
  'Sicily': [37.5, 14.0],
  'Lombardy': [45.47, 9.19],
  'Piedmont': [44.7, 8.0],
  'Veneto': [45.5, 11.5],
  'Friuli': [46.07, 13.23],
  'Trentino': [46.07, 11.12],
  // US Amaro Regions
  'Washington DC': [38.9, -77.0],
  'USA': [39.8, -98.6],
  'Brooklyn, NY': [40.65, -73.95],
  'New York': [42.5, -76.0],
  'Florida': [27.6, -81.5],
  // Port
  'Douro Valley': [41.15, -7.8],
  'Portugal': [39.5, -8.0],
  'Porto': [41.16, -8.63]
};

// Landmarks/distillery regions
const regionLandmarks = {
  'Kentucky': [
    { name: 'Bardstown', coords: [37.8, -85.5], description: 'Bourbon Capital of the World', link: 'https://en.wikipedia.org/wiki/Bardstown,_Kentucky' },
    { name: 'Louisville', coords: [38.25, -85.76], description: 'Kentucky Bourbon Trail start', link: 'https://en.wikipedia.org/wiki/Louisville,_Kentucky' },
    { name: 'Frankfort', coords: [38.2, -84.87], description: 'Buffalo Trace Distillery', link: 'https://en.wikipedia.org/wiki/Frankfort,_Kentucky' }
  ],
  'Tennessee': [
    { name: 'Lynchburg', coords: [35.28, -86.37], description: 'Jack Daniel\'s home', link: 'https://en.wikipedia.org/wiki/Lynchburg,_Tennessee' },
    { name: 'Shelbyville', coords: [35.48, -86.46], description: 'Uncle Nearest Distillery', link: 'https://en.wikipedia.org/wiki/Shelbyville,_Tennessee' }
  ],
  'Vermont': [
    { name: 'Waterbury', coords: [44.34, -72.76], description: 'WhistlePig Farm', link: 'https://en.wikipedia.org/wiki/WhistlePig' },
    { name: 'Warren', coords: [44.12, -72.86], description: 'Mad River Distillers', link: 'https://en.wikipedia.org/wiki/Warren,_Vermont' }
  ],
  'Utah': [
    { name: 'Park City', coords: [40.65, -111.5], description: 'High West Distillery', link: 'https://en.wikipedia.org/wiki/High_West_Distillery' }
  ],
  'Massachusetts': [
    { name: 'Everett', coords: [42.41, -71.05], description: 'Short Path Distillery', link: 'https://en.wikipedia.org/wiki/Everett,_Massachusetts' }
  ],
  // Scottish Whisky Regions - ALL 5 official regions
  'Speyside': [
    { name: 'Dufftown', coords: [57.45, -3.12], description: 'Malt Whisky Capital - Glenfiddich, Balvenie', link: 'https://en.wikipedia.org/wiki/Dufftown' },
    { name: 'Rothes', coords: [57.53, -3.20], description: 'Glenrothes & Glen Grant', link: 'https://en.wikipedia.org/wiki/Rothes' },
    { name: 'Craigellachie', coords: [57.45, -3.18], description: 'Macallan nearby', link: 'https://en.wikipedia.org/wiki/Craigellachie,_Moray' }
  ],
  'Islay': [
    { name: 'Port Ellen', coords: [55.63, -6.19], description: 'Ardbeg, Lagavulin, Laphroaig', link: 'https://en.wikipedia.org/wiki/Port_Ellen' },
    { name: 'Bowmore', coords: [55.76, -6.29], description: 'Oldest Islay distillery', link: 'https://en.wikipedia.org/wiki/Bowmore_distillery' },
    { name: 'Bruichladdich', coords: [55.77, -6.36], description: 'Port Charlotte distillery', link: 'https://en.wikipedia.org/wiki/Bruichladdich_distillery' }
  ],
  'Highland': [
    { name: 'Inverness', coords: [57.48, -4.22], description: 'Highland capital', link: 'https://en.wikipedia.org/wiki/Inverness' },
    { name: 'Tain', coords: [57.81, -4.05], description: 'Glenmorangie home', link: 'https://en.wikipedia.org/wiki/Tain' },
    { name: 'Oban', coords: [56.42, -5.47], description: 'West Highland gem', link: 'https://en.wikipedia.org/wiki/Oban_distillery' }
  ],
  'Lowland': [
    { name: 'Edinburgh', coords: [55.95, -3.19], description: 'Scotland\'s capital', link: 'https://en.wikipedia.org/wiki/Edinburgh' },
    { name: 'Glenkinchie', coords: [55.89, -2.89], description: 'Lowland single malt', link: 'https://en.wikipedia.org/wiki/Glenkinchie_distillery' },
    { name: 'Auchentoshan', coords: [55.92, -4.44], description: 'Triple distilled', link: 'https://en.wikipedia.org/wiki/Auchentoshan_distillery' }
  ],
  'Campbeltown': [
    { name: 'Campbeltown', coords: [55.43, -5.6], description: 'Historic whisky town - Springbank', link: 'https://en.wikipedia.org/wiki/Campbeltown' }
  ],
  'Scotland': [
    { name: 'Edinburgh', coords: [55.95, -3.19], description: 'Scotland\'s capital', link: 'https://en.wikipedia.org/wiki/Edinburgh' },
    { name: 'Glasgow', coords: [55.86, -4.25], description: 'Largest city', link: 'https://en.wikipedia.org/wiki/Glasgow' }
  ],
  'Canada': [
    { name: 'Windsor', coords: [42.32, -83.04], description: 'Canadian Club home', link: 'https://en.wikipedia.org/wiki/Windsor,_Ontario' }
  ],
  // Cognac Region
  'Cognac': [
    { name: 'Cognac', coords: [45.7, -0.33], description: 'Heart of Cognac - Hennessy, Courvoisier', link: 'https://en.wikipedia.org/wiki/Cognac' },
    { name: 'Jarnac', coords: [45.68, -0.17], description: 'Courvoisier & Delamain', link: 'https://en.wikipedia.org/wiki/Jarnac' },
    { name: 'Segonzac', coords: [45.62, -0.22], description: 'Grande Champagne - premier cru', link: 'https://en.wikipedia.org/wiki/Segonzac,_Charente' }
  ],
  'France': [
    { name: 'Cognac', coords: [45.7, -0.33], description: 'Cognac region', link: 'https://en.wikipedia.org/wiki/Cognac' }
  ],
  // Italian Amaro Regions
  'Sicily': [
    { name: 'Catania', coords: [37.51, 15.09], description: 'Mt. Etna amaro region', link: 'https://en.wikipedia.org/wiki/Catania' },
    { name: 'Palermo', coords: [38.12, 13.36], description: 'Sicilian amaro tradition', link: 'https://en.wikipedia.org/wiki/Palermo' }
  ],
  'Italy': [
    { name: 'Milan', coords: [45.47, 9.19], description: 'Campari & Fernet Branca home', link: 'https://en.wikipedia.org/wiki/Milan' },
    { name: 'Bologna', coords: [44.49, 11.34], description: 'Amaro Montenegro home', link: 'https://en.wikipedia.org/wiki/Bologna' },
    { name: 'Benevento', coords: [41.13, 14.78], description: 'Strega liqueur home', link: 'https://en.wikipedia.org/wiki/Benevento' }
  ],
  'Lombardy': [
    { name: 'Milan', coords: [45.47, 9.19], description: 'Campari & amaro capital', link: 'https://en.wikipedia.org/wiki/Milan' },
    { name: 'Bergamo', coords: [45.7, 9.67], description: 'Fernet Branca production', link: 'https://en.wikipedia.org/wiki/Bergamo' }
  ],
  'Friuli': [
    { name: 'Udine', coords: [46.07, 13.23], description: 'Nonino grappa & amaro', link: 'https://en.wikipedia.org/wiki/Udine' }
  ],
  // US Amaro Regions
  'Massachusetts': [
    { name: 'Boston', coords: [42.36, -71.06], description: 'Bully Boy Distillers', link: 'https://en.wikipedia.org/wiki/Boston' }
  ],
  'Washington DC': [
    { name: 'Washington DC', coords: [38.9, -77.0], description: 'Don Ciccio & Figli', link: 'https://en.wikipedia.org/wiki/Washington,_D.C.' }
  ],
  'Brooklyn, NY': [
    { name: 'Red Hook', coords: [40.67, -74.01], description: 'Faccia Brutto craft amaro', link: 'https://en.wikipedia.org/wiki/Red_Hook,_Brooklyn' }
  ],
  'Florida': [
    { name: 'Miami', coords: [25.76, -80.19], description: 'Perrine Key Lime Amaro', link: 'https://en.wikipedia.org/wiki/Miami' }
  ],
  'USA': [
    { name: 'Craft Distilleries', coords: [39.8, -98.6], description: 'American craft amaro movement', link: 'https://en.wikipedia.org/wiki/Craft_distillery' }
  ],
  // Port Regions
  'Douro Valley': [
    { name: 'Pinhão', coords: [41.19, -7.54], description: 'Heart of Port country', link: 'https://en.wikipedia.org/wiki/Pinh%C3%A3o' },
    { name: 'Peso da Régua', coords: [41.16, -7.79], description: 'Douro wine capital', link: 'https://en.wikipedia.org/wiki/Peso_da_R%C3%A9gua' }
  ],
  'Porto': [
    { name: 'Vila Nova de Gaia', coords: [41.13, -8.62], description: 'Port wine cellars', link: 'https://en.wikipedia.org/wiki/Vila_Nova_de_Gaia' }
  ],
  'Portugal': [
    { name: 'Porto', coords: [41.16, -8.63], description: 'Port wine capital', link: 'https://en.wikipedia.org/wiki/Porto' }
  ]
};

function SpiritsMap({ spirits, categoryName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  
  const regions = useMemo(() => {
    return [...new Set(spirits.map(s => s.region).filter(Boolean))];
  }, [spirits]);

  const spiritCounts = useMemo(() => {
    const counts = {};
    spirits.forEach(spirit => {
      if (spirit.region) {
        counts[spirit.region] = (counts[spirit.region] || 0) + 1;
      }
    });
    return counts;
  }, [spirits]);

  const allLandmarks = useMemo(() => {
    return regions.flatMap(region => regionLandmarks[region] || []);
  }, [regions]);

  // Different map centers based on category
  const getMapCenter = () => {
    if (categoryName === 'Scotch') return [56.5, -4.0]; // Scotland
    if (categoryName === 'Bourbon') return [38.0, -85.5]; // Kentucky
    if (categoryName === 'Rye') return [42.0, -75.0]; // Northeast USA
    if (categoryName === 'Cognac') return [45.7, -0.33]; // Cognac, France
    if (categoryName === 'Grappa') return [45.5, 11.5]; // Veneto, Italy
    if (categoryName === 'Port') return [41.15, -7.8]; // Douro, Portugal
    if (categoryName === 'Amaro & Digestivo') return [42.5, 12.5]; // Italy
    return [40.0, -80.0]; // Default USA center
  };

  const getMapZoom = () => {
    if (categoryName === 'Scotch') return 5;      // Show all 5 Scottish regions
    if (categoryName === 'Bourbon') return 5;     // Show KY, TN, and other states
    if (categoryName === 'Rye') return 4;         // Wide spread: VT, MA, KY, UT, Canada
    if (categoryName === 'Cognac') return 7;      // Cognac region is small
    if (categoryName === 'Grappa') return 6;      // Northern Italy
    if (categoryName === 'Port') return 7;        // Douro Valley to Porto
    if (categoryName === 'Amaro & Digestivo') return 5; // All of Italy + some US
    return 4;                                     // Default more zoomed out
  };

  if (!spirits || spirits.length === 0) return null;

  return (
    <div className="category-wine-map">
      <div className="map-header" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        <div className="map-header-content">
          <div>
            <h3 className="map-title">
              🥃 {categoryName} - Regional Map
              <span className="map-toggle-icon">{isExpanded ? '▼' : '▶'}</span>
            </h3>
            <p className="map-subtitle">
              {spirits.length} {categoryName.toLowerCase()} across {regions.length} {regions.length === 1 ? 'region' : 'regions'}
              {!isExpanded && ' • Click to expand map'}
            </p>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <>
          <div className="map-controls">
            {allLandmarks.length > 0 && (
              <button 
                className="map-toggle-btn"
                onClick={() => setShowLandmarks(!showLandmarks)}
              >
                {showLandmarks ? '🏭 Hide' : '🏭 Show'} Distillery Regions ({allLandmarks.length})
              </button>
            )}
            <div className="region-legend">
              {regions.map(region => (
                <div key={region} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: regionColors[region] || '#8B4513' }}
                  />
                  <span className="legend-label">{region} ({spiritCounts[region]})</span>
                </div>
              ))}
            </div>
          </div>

          <MapContainer 
            center={getMapCenter()} 
            zoom={getMapZoom()} 
            style={{ height: '450px', width: '100%', borderRadius: '0 0 8px 8px' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Spirit markers */}
            {spirits.map((spirit, idx) => {
              const coords = spirit.coordinates || (spirit.region ? regionCenters[spirit.region] : null);
              if (!coords) return null;
              
              return (
                <Marker 
                  key={`spirit-${idx}`} 
                  position={coords} 
                  icon={regionIcons[spirit.region] || regionIcons['Kentucky']}
                >
                  <Popup>
                    <div className="wine-popup">
                      <strong>{spirit.name}</strong>
                      <p>{spirit.description}</p>
                      <p><em>{spirit.region} • {spirit.style}</em></p>
                      {spirit.price && <p><strong>${spirit.price}</strong></p>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Landmark markers */}
            {showLandmarks && allLandmarks.map((landmark, idx) => (
              <Marker key={`landmark-${idx}`} position={landmark.coords}>
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
        </>
      )}
    </div>
  );
}

export default SpiritsMap;
