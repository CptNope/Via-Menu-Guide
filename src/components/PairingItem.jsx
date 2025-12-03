import React from 'react';
import FlavorProfileDisplay from './FlavorProfileDisplay.jsx';

/**
 * Detailed pairing item display
 */
export function PairingItemDetailed({ pairing, nameField = 'drinkName', priceField = 'drinkPrice' }) {
  const name = pairing[nameField];
  const pronunciation = pairing[nameField.replace('Name', 'Pronunciation')];
  const price = pairing[priceField];
  const region = pairing.drinkRegion || pairing.foodRegion;
  const description = pairing.drinkDescription || pairing.foodDescription;
  const category = pairing.drinkCategory || pairing.foodCategory;

  return (
    <div className="pairing-item-detailed">
      <div className="wine-info">
        <div className="wine-header">
          <span className="wine-name">
            {name}
            {pronunciation && (
              <span className="pronunciation"> ({pronunciation})</span>
            )}
          </span>
          {price && <span className="wine-price">${price}</span>}
        </div>
        {region && <div className="wine-region">{region}</div>}
        {category && <div className="wine-category">{category}</div>}
        {description && <div className="wine-description">{description}</div>}
        {pairing.explanation && <div className="pairing-explanation">{pairing.explanation}</div>}
        {pairing.flavorProfile && (
          <FlavorProfileDisplay 
            flavorProfile={pairing.flavorProfile}
            title="Tasting Profile"
          />
        )}
      </div>
      <span className={`match-badge ${pairing.compatibility.toLowerCase().replace(' ', '-')}`}>
        {pairing.compatibility}
      </span>
    </div>
  );
}

/**
 * Compact pairing item display
 */
export function PairingItemCompact({ pairing, nameField = 'drinkName', priceField = 'drinkPrice' }) {
  const name = pairing[nameField];
  const price = pairing[priceField];

  return (
    <div className="pairing-item-compact">
      <span className="wine-name">{name}</span>
      {price && <span className="wine-price">${price}</span>}
      <span className={`match-badge-small ${pairing.compatibility.toLowerCase().replace(' ', '-')}`}>
        {pairing.compatibility}
      </span>
    </div>
  );
}
