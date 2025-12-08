import React from 'react';

function ItalianWineMap({ region }) {
  if (!region) return null;

  const regionStyles = {
    'Piedmont': { fill: '#8B0000', name: 'Piedmont (Northwest)' },
    'Tuscany': { fill: '#DC143C', name: 'Tuscany (Central)' },
    'Veneto': { fill: '#B22222', name: 'Veneto (Northeast)' },
    'Puglia': { fill: '#CD5C5C', name: 'Puglia (Southeast)' },
    'Sicily': { fill: '#A52A2A', name: 'Sicily (Island)' },
    'Abruzzo': { fill: '#C41E3A', name: 'Abruzzo (Central East)' }
  };

  const style = regionStyles[region];
  if (!style) return null;

  return (
    <div className="italian-wine-map">
      <div className="map-badge">
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Simplified Italy shape */}
          <path 
            d="M12 2 L14 4 L16 6 L17 10 L18 14 L19 18 L18 22 L16 24 L14 26 L12 27 L10 26 L8 24 L6 22 L5 18 L6 14 L7 10 L8 6 L10 4 Z"
            fill={style.fill}
            stroke="#4a2f1e"
            strokeWidth="0.5"
          />
          {/* Sicily */}
          {region === 'Sicily' && (
            <circle cx="14" cy="25" r="2" fill={style.fill} stroke="#4a2f1e" strokeWidth="0.5" />
          )}
        </svg>
        <span className="region-name">{style.name}</span>
      </div>
    </div>
  );
}

export default ItalianWineMap;
