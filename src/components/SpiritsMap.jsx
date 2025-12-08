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
  'Japan': '#B22222'
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
  'Japan': [34.7, 135.5]
};

// Landmarks/distillery regions
const regionLandmarks = {
  'Kentucky': [
    { name: 'Bardstown', coords: [37.8, -85.5], description: 'Bourbon Capital of the World', link: 'https://en.wikipedia.org/wiki/Bardstown,_Kentucky' },
    { name: 'Louisville', coords: [38.25, -85.76], description: 'Kentucky Bourbon Trail start', link: 'https://en.wikipedia.org/wiki/Louisville,_Kentucky' }
  ],
  'Speyside': [
    { name: 'Dufftown', coords: [57.45, -3.12], description: 'Malt Whisky Capital', link: 'https://en.wikipedia.org/wiki/Dufftown' },
    { name: 'Rothes', coords: [57.53, -3.20], description: 'Historic distillery town', link: 'https://en.wikipedia.org/wiki/Rothes' }
  ],
  'Islay': [
    { name: 'Port Ellen', coords: [55.63, -6.19], description: 'Peated whisky center', link: 'https://en.wikipedia.org/wiki/Port_Ellen' },
    { name: 'Bowmore', coords: [55.76, -6.29], description: 'Oldest Islay distillery', link: 'https://en.wikipedia.org/wiki/Bowmore_distillery' }
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
    return [40.0, -80.0]; // Default USA center
  };

  const getMapZoom = () => {
    if (categoryName === 'Scotch') return 6;
    if (categoryName === 'Bourbon') return 6;
    return 5;
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
