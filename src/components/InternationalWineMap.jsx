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

function InternationalWineMap({ wines, categoryName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  // World center for showing all wines
  const mapCenter = [20, 0];
  const mapZoom = 2;

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
          </MapContainer>
        </>
      )}
    </div>
  );
}

export default InternationalWineMap;
