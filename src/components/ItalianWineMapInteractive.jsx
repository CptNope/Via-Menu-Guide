import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Wine-colored marker icon
const wineIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAyNCAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMEMxOC42MjcgMCAyNCAxMC4wNzQgMjQgMThDMjQgMjYuODM3IDE4LjYyNyAzNiAxMiAzNkM1LjM3MyAzNiAwIDI2LjgzNyAwIDE4QzAgMTAuMDc0IDUuMzczIDAgMTIgMFoiIGZpbGw9IiM4QjAwMDAiLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE1IiByPSI1IiBmaWxsPSIjRkZGIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4=',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36]
});

// Regional landmarks data
const regionalLandmarks = {
  'Piedmont': {
    center: [44.7, 8.0],
    zoom: 9,
    landmarks: [
      { name: 'Alba', coords: [44.7006, 8.0356], description: 'Truffle capital & Barolo center', link: 'https://en.wikipedia.org/wiki/Alba,_Piedmont' },
      { name: 'Barolo', coords: [44.6089, 7.9425], description: 'King of Wines village', link: 'https://en.wikipedia.org/wiki/Barolo' },
      { name: 'Barbaresco', coords: [44.7258, 8.0828], description: 'Queen of Wines village', link: 'https://en.wikipedia.org/wiki/Barbaresco' },
      { name: 'Asti', coords: [44.9006, 8.2064], description: 'Historic wine town', link: 'https://en.wikipedia.org/wiki/Asti' }
    ]
  },
  'Tuscany': {
    center: [43.4, 11.3],
    zoom: 8,
    landmarks: [
      { name: 'Montalcino', coords: [43.0578, 11.4889], description: 'Brunello di Montalcino home', link: 'https://en.wikipedia.org/wiki/Montalcino' },
      { name: 'Montepulciano', coords: [43.0997, 11.7886], description: 'Vino Nobile village', link: 'https://en.wikipedia.org/wiki/Montepulciano' },
      { name: 'Greve in Chianti', coords: [43.5808, 11.3147], description: 'Chianti Classico heart', link: 'https://en.wikipedia.org/wiki/Greve_in_Chianti' },
      { name: 'Bolgheri', coords: [43.2222, 10.5931], description: 'Super Tuscan coast', link: 'https://en.wikipedia.org/wiki/Bolgheri' },
      { name: 'Siena', coords: [43.3188, 11.3308], description: 'Historic Tuscan city', link: 'https://en.wikipedia.org/wiki/Siena' }
    ]
  },
  'Veneto': {
    center: [45.5, 11.0],
    zoom: 9,
    landmarks: [
      { name: 'Valpolicella', coords: [45.5303, 10.8756], description: 'Amarone region', link: 'https://en.wikipedia.org/wiki/Valpolicella' },
      { name: 'Verona', coords: [45.4384, 10.9916], description: 'Romeo & Juliet city', link: 'https://en.wikipedia.org/wiki/Verona' },
      { name: 'Soave', coords: [45.4211, 11.2486], description: 'White wine region', link: 'https://en.wikipedia.org/wiki/Soave,_Veneto' }
    ]
  },
  'Puglia': {
    center: [40.8, 17.1],
    zoom: 8,
    landmarks: [
      { name: 'Manduria', coords: [40.4019, 17.6361], description: 'Primitivo di Manduria', link: 'https://en.wikipedia.org/wiki/Manduria' },
      { name: 'Lecce', coords: [40.3515, 18.1750], description: 'Baroque city of Salento', link: 'https://en.wikipedia.org/wiki/Lecce' }
    ]
  },
  'Sicily': {
    center: [37.6, 15.0],
    zoom: 9,
    landmarks: [
      { name: 'Mount Etna', coords: [37.7510, 14.9934], description: 'Active volcano, unique terroir', link: 'https://en.wikipedia.org/wiki/Mount_Etna' },
      { name: 'Catania', coords: [37.5079, 15.0830], description: 'Etna wine region base', link: 'https://en.wikipedia.org/wiki/Catania' }
    ]
  },
  'Abruzzo': {
    center: [42.3, 13.8],
    zoom: 9,
    landmarks: [
      { name: 'Chieti', coords: [42.3508, 14.1678], description: 'Montepulciano d\'Abruzzo zone', link: 'https://en.wikipedia.org/wiki/Chieti' },
      { name: 'L\'Aquila', coords: [42.3498, 13.3995], description: 'Mountain wine region', link: 'https://en.wikipedia.org/wiki/L%27Aquila' }
    ]
  }
};

function MapView({ wine }) {
  const [showLandmarks, setShowLandmarks] = useState(true);
  
  if (!wine || !wine.region) return null;
  
  const regionData = regionalLandmarks[wine.region];
  if (!regionData) return null;

  // Use wine's coordinates if available, otherwise use region center
  const wineCoords = wine.coordinates || regionData.center;

  return (
    <div className="wine-map-container">
      <div className="map-controls">
        <button 
          className="map-toggle-btn"
          onClick={() => setShowLandmarks(!showLandmarks)}
        >
          {showLandmarks ? '🏛️ Hide' : '🏛️ Show'} Landmarks
        </button>
        <span className="map-region-label">📍 {wine.region}, Italy</span>
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
  );
}

export default MapView;
