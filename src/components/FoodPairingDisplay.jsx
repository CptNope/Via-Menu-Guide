import React from 'react';
import { PairingItemDetailed, PairingItemCompact } from './PairingItem.jsx';

/**
 * Displays food pairing recommendations for drinks
 * Shows top matches and best match by category
 */
function FoodPairingDisplay({ pairings }) {
  if (!pairings?.recommendations) return null;

  const { recommendations } = pairings;

  return (
    <>
      {/* Top Food Matches */}
      {recommendations.topMatches?.length > 0 && (
        <div className="pairing-section">
          <h4>🍽️ Top Food Pairings</h4>
          
          {recommendations.topMatches.slice(0, 5).map((pairing, idx) => (
            <PairingItemDetailed 
              key={idx} 
              pairing={pairing} 
              nameField="foodName"
              priceField="foodPrice"
            />
          ))}
        </div>
      )}

      {/* Best Match by Category */}
      {recommendations.bestByCategory && Object.keys(recommendations.bestByCategory).length > 0 && (
        <div className="pairing-section">
          <h4>📋 Best Match by Course</h4>
          
          {Object.entries(recommendations.bestByCategory).map(([category, pairing]) => (
            <div key={category} className="category-pairing">
              <label>{category}</label>
              <PairingItemCompact 
                pairing={pairing} 
                nameField="foodName"
                priceField="foodPrice"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FoodPairingDisplay;
