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

// Wine glass marker
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
  // Europe
  'Bordeaux': '#722F37',
  'Burgundy': '#800020',
  'Rhone Valley': '#9B111E',
  'Champagne': '#FADA5E',
  'Loire Valley': '#E0C097',
  'Alsace': '#C04000',
  'Italy': '#DC143C',
  'Spain': '#AA151B',
  'Portugal': '#006847',
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
  'South Africa': '#007A4D'
};

const regionIcons = Object.fromEntries(
  Object.entries(regionColors).map(([region, color]) => [region, createWineIcon(color)])
);

const regionCenters = {
  // France
  'Bordeaux': [44.8378, -0.5792],
  'Burgundy': [47.0, 4.8],
  'Rhone Valley': [44.5, 4.8],
  'Champagne': [49.0, 4.0],
  'Loire Valley': [47.3, 0.5],
  'Alsace': [48.3, 7.5],
  // Italy
  'Italy': [42.8, 12.5],
  // USA
  'Napa Valley': [38.5, -122.4],
  'Sonoma': [38.3, -122.6],
  'California': [37.0, -120.0],
  'Oregon': [44.0, -121.0],
  'Washington State': [47.0, -120.5],
  'Paso Robles': [35.6, -120.7],
  // Southern Hemisphere
  'Argentina': [-33.0, -68.5],
  'Chile': [-33.5, -70.5],
  'Australia': [-34.5, 138.5],
  'New Zealand': [-41.5, 174.0],
  'South Africa': [-33.9, 18.9],
  // Europe Other
  'Spain': [42.0, -3.0],
  'Portugal': [41.5, -8.5]
};

// Wine region landmarks
const regionalLandmarks = {
  'Napa Valley': [
    { name: 'Napa', coords: [38.2975, -122.2869], description: 'Napa Valley wine capital', link: 'https://en.wikipedia.org/wiki/Napa,_California' },
    { name: 'St. Helena', coords: [38.5052, -122.4703], description: 'Heart of Napa Valley', link: 'https://en.wikipedia.org/wiki/St._Helena,_California' },
    { name: 'Yountville', coords: [38.4016, -122.3608], description: 'Culinary & wine destination', link: 'https://en.wikipedia.org/wiki/Yountville,_California' }
  ],
  'Sonoma': [
    { name: 'Healdsburg', coords: [38.6102, -122.8695], description: 'Sonoma wine hub', link: 'https://en.wikipedia.org/wiki/Healdsburg,_California' },
    { name: 'Sonoma Plaza', coords: [38.2919, -122.4580], description: 'Historic wine town', link: 'https://en.wikipedia.org/wiki/Sonoma,_California' }
  ],
  'Paso Robles': [
    { name: 'Paso Robles', coords: [35.6266, -120.6907], description: 'Central Coast wine region', link: 'https://en.wikipedia.org/wiki/Paso_Robles,_California' }
  ],
  'Oregon': [
    { name: 'Willamette Valley', coords: [45.2, -123.0], description: 'Pinot Noir paradise', link: 'https://en.wikipedia.org/wiki/Willamette_Valley_AVA' },
    { name: 'McMinnville', coords: [45.2104, -123.1987], description: 'Oregon wine country', link: 'https://en.wikipedia.org/wiki/McMinnville,_Oregon' }
  ],
  'Bordeaux': [
    { name: 'Bordeaux', coords: [44.8378, -0.5792], description: 'World wine capital', link: 'https://en.wikipedia.org/wiki/Bordeaux' },
    { name: 'Médoc', coords: [45.2, -0.8], description: 'Left Bank Cabernet', link: 'https://en.wikipedia.org/wiki/M%C3%A9doc' }
  ],
  'Burgundy': [
    { name: 'Beaune', coords: [47.0253, 4.8395], description: 'Burgundy wine capital', link: 'https://en.wikipedia.org/wiki/Beaune' },
    { name: 'Côte de Nuits', coords: [47.2, 4.95], description: 'Premier Pinot Noir', link: 'https://en.wikipedia.org/wiki/C%C3%B4te_de_Nuits' }
  ],
  'Champagne': [
    { name: 'Reims', coords: [49.2583, 4.0317], description: 'Champagne capital', link: 'https://en.wikipedia.org/wiki/Reims' },
    { name: 'Épernay', coords: [49.0417, 3.9592], description: 'Avenue de Champagne', link: 'https://en.wikipedia.org/wiki/%C3%89pernay' }
  ],
  'Loire Valley': [
    { name: 'Sancerre', coords: [47.3333, 2.8333], description: 'Sauvignon Blanc home', link: 'https://en.wikipedia.org/wiki/Sancerre' }
  ],
  'Argentina': [
    { name: 'Mendoza', coords: [-32.8895, -68.8458], description: 'Malbec capital', link: 'https://en.wikipedia.org/wiki/Mendoza,_Argentina' }
  ],
  'New Zealand': [
    { name: 'Marlborough', coords: [-41.5, 173.8], description: 'Sauvignon Blanc region', link: 'https://en.wikipedia.org/wiki/Marlborough_Region' }
  ]
};

function InternationalWineMap({ wines, categoryName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  
  const regions = useMemo(() => {
    return [...new Set(wines.map(w => w.region).filter(Boolean))];
  }, [wines]);

  const wineCounts = useMemo(() => {
    const counts = {};
    wines.forEach(wine => {
      if (wine.region) {
        counts[wine.region] = (counts[wine.region] || 0) + 1;
      }
    });
    return counts;
  }, [wines]);

  // Get relevant landmarks
  const allLandmarks = useMemo(() => {
    return regions.flatMap(region => regionalLandmarks[region] || []);
  }, [regions]);

  // Smart zoom based on wine regions
  const { mapCenter, mapZoom } = useMemo(() => {
    // If only California regions, zoom to California
    const allCalifornia = regions.every(r => 
      ['Napa Valley', 'Sonoma', 'California', 'Paso Robles'].includes(r)
    );
    if (allCalifornia) return { mapCenter: [37.5, -121.5], mapZoom: 6 };
    
    // If only USA, zoom to USA
    const allUSA = regions.every(r => 
      ['Napa Valley', 'Sonoma', 'California', 'Oregon', 'Washington State', 'Paso Robles'].includes(r)
    );
    if (allUSA) return { mapCenter: [40.0, -100.0], mapZoom: 4 };
    
    // If only France, zoom to France
    const allFrance = regions.every(r => 
      ['Bordeaux', 'Burgundy', 'Champagne', 'Loire Valley', 'Rhone Valley', 'Alsace'].includes(r)
    );
    if (allFrance) return { mapCenter: [47.0, 2.5], mapZoom: 6 };
    
    // Default world view
    return { mapCenter: [20, 0], mapZoom: 2 };
  }, [regions]);

  if (!wines || wines.length === 0) return null;

  return (
    <div className="category-wine-map">
      <div className="map-header" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        <div className="map-header-content">
          <div>
            <h3 className="map-title">
              🌍 {categoryName} - World Map
              <span className="map-toggle-icon">{isExpanded ? '▼' : '▶'}</span>
            </h3>
            <p className="map-subtitle">
              {wines.length} wines across {regions.length} {regions.length === 1 ? 'region' : 'regions'}
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
                {showLandmarks ? '🏛️ Hide' : '🏛️ Show'} Landmarks ({allLandmarks.length})
              </button>
            )}
            <div className="region-legend">
              {regions.map(region => (
                <div key={region} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: regionColors[region] || '#8B0000' }}
                  />
                  <span className="legend-label">{region} ({wineCounts[region]})</span>
                </div>
              ))}
            </div>
          </div>

          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '450px', width: '100%', borderRadius: '0 0 8px 8px' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Wine markers */}
            {wines.map((wine, idx) => {
              const coords = wine.coordinates || (wine.region ? regionCenters[wine.region] : null);
              if (!coords) return null;
              
              return (
                <Marker 
                  key={`wine-${idx}`} 
                  position={coords} 
                  icon={regionIcons[wine.region] || regionIcons['California']}
                >
                  <Popup>
                    <div className="wine-popup">
                      <strong>{wine.name}</strong>
                      <p>{wine.description}</p>
                      <p><em>Region: {wine.region}</em></p>
                      {wine.price && <p><strong>${wine.price}</strong></p>}
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

export default InternationalWineMap;
