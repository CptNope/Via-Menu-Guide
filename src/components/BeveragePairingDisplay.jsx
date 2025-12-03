import React from 'react';
import { PairingItemDetailed } from './PairingItem.jsx';

/**
 * Displays beverage pairing recommendations
 * Handles: Beer, Bourbon/Whiskey, After-Dinner Drinks, and Desserts
 */
function BeveragePairingDisplay({ pairings, title, nameField = 'drinkName', priceField = 'drinkPrice' }) {
  if (!pairings?.recommendations?.topMatches?.length) return null;

  return (
    <div className="pairing-section">
      <h4>{title}</h4>
      
      {pairings.recommendations.topMatches.slice(0, 6).map((pairing, idx) => (
        <PairingItemDetailed 
          key={idx} 
          pairing={pairing}
          nameField={nameField}
          priceField={priceField}
        />
      ))}
    </div>
  );
}

export default BeveragePairingDisplay;
