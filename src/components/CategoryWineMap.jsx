import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Different colored wine icons for each region - elegant wine glass style
const createWineIcon = (color) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="16" cy="38" rx="8" ry="2" fill="#000" opacity="0.2"/>
  <!-- Glass stem -->
  <rect x="14" y="24" width="4" height="10" fill="#333" rx="1"/>
  <!-- Glass base -->
  <ellipse cx="16" cy="35" rx="6" ry="2" fill="#444"/>
  <!-- Wine glass bowl -->
  <path d="M8 8 C8 4 10 2 16 2 C22 2 24 4 24 8 L22 20 C22 24 19 26 16 26 C13 26 10 24 10 20 Z" fill="${color}" stroke="#333" stroke-width="1"/>
  <!-- Wine highlight -->
  <ellipse cx="14" cy="10" rx="3" ry="4" fill="#FFF" opacity="0.25"/>
  <!-- Glass rim shine -->
  <path d="M9 8 Q16 6 23 8" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.4"/>
</svg>`)}`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40]
});

const regionColors = {
  'Piedmont': '#8B0000',
  'Tuscany': '#DC143C',
  'Veneto': '#B22222',
  'Puglia': '#CD5C5C',
  'Sicily': '#A52A2A',
  'Abruzzo': '#C41E3A'
};

const regionIcons = Object.fromEntries(
  Object.entries(regionColors).map(([region, color]) => [region, createWineIcon(color)])
);

// Regional landmarks data
const regionalLandmarks = {
  'Piedmont': [
    { name: 'Alba', coords: [44.7006, 8.0356], description: 'Truffle capital & Barolo center', link: 'https://en.wikipedia.org/wiki/Alba,_Piedmont' },
    { name: 'Barolo', coords: [44.6089, 7.9425], description: 'King of Wines village', link: 'https://en.wikipedia.org/wiki/Barolo' },
    { name: 'Barbaresco', coords: [44.7258, 8.0828], description: 'Queen of Wines village', link: 'https://en.wikipedia.org/wiki/Barbaresco' },
    { name: 'Asti', coords: [44.9006, 8.2064], description: 'Historic wine town', link: 'https://en.wikipedia.org/wiki/Asti' }
  ],
  'Tuscany': [
    { name: 'Montalcino', coords: [43.0578, 11.4889], description: 'Brunello di Montalcino home', link: 'https://en.wikipedia.org/wiki/Montalcino' },
    { name: 'Montepulciano', coords: [43.0997, 11.7886], description: 'Vino Nobile village', link: 'https://en.wikipedia.org/wiki/Montepulciano' },
    { name: 'Greve in Chianti', coords: [43.5808, 11.3147], description: 'Chianti Classico heart', link: 'https://en.wikipedia.org/wiki/Greve_in_Chianti' },
    { name: 'Bolgheri', coords: [43.2222, 10.5931], description: 'Super Tuscan coast', link: 'https://en.wikipedia.org/wiki/Bolgheri' },
    { name: 'Siena', coords: [43.3188, 11.3308], description: 'Historic Tuscan city', link: 'https://en.wikipedia.org/wiki/Siena' }
  ],
  'Veneto': [
    { name: 'Valpolicella', coords: [45.5303, 10.8756], description: 'Amarone region', link: 'https://en.wikipedia.org/wiki/Valpolicella' },
    { name: 'Verona', coords: [45.4384, 10.9916], description: 'Romeo & Juliet city', link: 'https://en.wikipedia.org/wiki/Verona' },
    { name: 'Soave', coords: [45.4211, 11.2486], description: 'White wine region', link: 'https://en.wikipedia.org/wiki/Soave,_Veneto' }
  ],
  'Puglia': [
    { name: 'Manduria', coords: [40.4019, 17.6361], description: 'Primitivo di Manduria', link: 'https://en.wikipedia.org/wiki/Manduria' },
    { name: 'Lecce', coords: [40.3515, 18.1750], description: 'Baroque city of Salento', link: 'https://en.wikipedia.org/wiki/Lecce' }
  ],
  'Sicily': [
    { name: 'Mount Etna', coords: [37.7510, 14.9934], description: 'Active volcano, unique terroir', link: 'https://en.wikipedia.org/wiki/Mount_Etna' },
    { name: 'Catania', coords: [37.5079, 15.0830], description: 'Etna wine region base', link: 'https://en.wikipedia.org/wiki/Catania' }
  ],
  'Abruzzo': [
    { name: 'Chieti', coords: [42.3508, 14.1678], description: 'Montepulciano d\'Abruzzo zone', link: 'https://en.wikipedia.org/wiki/Chieti' },
    { name: 'L\'Aquila', coords: [42.3498, 13.3995], description: 'Mountain wine region', link: 'https://en.wikipedia.org/wiki/L%27Aquila' }
  ]
};

const regionCenters = {
  'Piedmont': [44.7, 8.0],
  'Tuscany': [43.4, 11.3],
  'Veneto': [45.5, 11.0],
  'Puglia': [40.8, 17.1],
  'Sicily': [37.6, 15.0],
  'Abruzzo': [42.3, 13.8]
};

function CategoryWineMap({ wines, categoryName }) {
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get unique regions from wines
  const regions = useMemo(() => {
    return [...new Set(wines.map(w => w.region).filter(Boolean))];
  }, [wines]);

  // Calculate map center (Italy center)
  const mapCenter = [42.8, 12.5];
  const mapZoom = 6;

  // Get all landmarks for regions present
  const allLandmarks = useMemo(() => {
    return regions.flatMap(region => regionalLandmarks[region] || []);
  }, [regions]);

  // Count wines by region
  const wineCounts = useMemo(() => {
    const counts = {};
    wines.forEach(wine => {
      if (wine.region) {
        counts[wine.region] = (counts[wine.region] || 0) + 1;
      }
    });
    return counts;
  }, [wines]);

  if (!wines || wines.length === 0) return null;

  return (
    <div className="category-wine-map">
      <div className="map-header" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        <div className="map-header-content">
          <div>
            <h3 className="map-title">
              🗺️ {categoryName} - Regional Map
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
        <button 
          className="map-toggle-btn"
          onClick={() => setShowLandmarks(!showLandmarks)}
        >
          {showLandmarks ? '🏛️ Hide' : '🏛️ Show'} Landmarks ({allLandmarks.length})
        </button>
        <div className="region-legend">
          {regions.map(region => (
            <div key={region} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: regionColors[region] }}
              />
              <span className="legend-label">{region} ({wineCounts[region]})</span>
            </div>
          ))}
        </div>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '500px', width: '100%', borderRadius: '0 0 8px 8px' }}
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
              icon={regionIcons[wine.region] || regionIcons['Tuscany']}
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

export default CategoryWineMap;
