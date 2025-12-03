import React from 'react';
import { PairingItemDetailed, PairingItemCompact } from './PairingItem.jsx';

/**
 * Displays wine pairing recommendations for food items
 * Organized by: By the Glass, Bottles (3 tiers), and Half Bottles
 */
function WinePairingDisplay({ pairings }) {
  if (!pairings?.recommendations) return null;

  const { recommendations } = pairings;

  return (
    <>
      {/* By the Glass - Show top 3 */}
      {recommendations.byTheGlass && (
        <div className="pairing-section">
          <h4>🍷 By the Glass</h4>
          
          {/* Best glass */}
          <PairingItemDetailed pairing={recommendations.byTheGlass} />

          {/* Alternative glasses */}
          {recommendations.alternativeGlasses?.length > 0 && (
            <div className="alternatives">
              <label>Also pairs well with:</label>
              {recommendations.alternativeGlasses.slice(0, 2).map((alt, idx) => (
                <PairingItemCompact key={idx} pairing={alt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottles by Price Tier - Show top 3 in each */}
      <div className="pairing-section">
        <h4>🍾 Bottle Recommendations</h4>
        
        {/* Budget Tier */}
        {recommendations.bottles?.lowTier?.best && (
          <BottleTier
            label="Budget-Friendly (Under $60)"
            best={recommendations.bottles.lowTier.best}
            alternatives={recommendations.bottles.lowTier.alternatives}
          />
        )}

        {/* Premium Tier */}
        {recommendations.bottles?.midTier?.best && (
          <BottleTier
            label="Premium ($60-$120)"
            best={recommendations.bottles.midTier.best}
            alternatives={recommendations.bottles.midTier.alternatives}
          />
        )}

        {/* Luxury Tier */}
        {recommendations.bottles?.highTier?.best && (
          <BottleTier
            label="Luxury ($120+)"
            best={recommendations.bottles.highTier.best}
            alternatives={recommendations.bottles.highTier.alternatives}
          />
        )}
      </div>

      {/* Half Bottles Section */}
      {recommendations.halfBottles?.best && (
        <div className="pairing-section">
          <h4>🍾 Half Bottle Recommendations (375ml)</h4>
          
          <div className="bottle-tier">
            <label>Perfect for Two</label>
            
            <PairingItemDetailed pairing={recommendations.halfBottles.best} />

            {/* Alternative half bottles */}
            {recommendations.halfBottles.alternatives?.length > 0 && (
              <div className="alternatives-compact">
                {recommendations.halfBottles.alternatives.slice(0, 2).map((alt, idx) => (
                  <PairingItemCompact key={idx} pairing={alt} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Helper component for displaying a bottle tier
 */
function BottleTier({ label, best, alternatives }) {
  return (
    <div className="bottle-tier">
      <label>{label}</label>
      
      <PairingItemDetailed pairing={best} />

      {alternatives?.length > 0 && (
        <div className="alternatives-compact">
          {alternatives.slice(0, 2).map((alt, idx) => (
            <PairingItemCompact key={idx} pairing={alt} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WinePairingDisplay;
