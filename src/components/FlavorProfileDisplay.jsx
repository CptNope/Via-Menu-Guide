import React from 'react';
import './FlavorProfileDisplay.css';

/**
 * Component to display flavor profile statistics visually
 * @param {Object} flavorProfile - The flavor profile object with stats
 * @param {string} title - Optional title for the section
 */
const FlavorProfileDisplay = ({ flavorProfile, title = "Flavor Profile" }) => {
  if (!flavorProfile) return null;

  // Define which stats to show
  const stats = [
    { key: 'sweetness', label: 'Sweetness', max: 10 },
    { key: 'acidity', label: 'Acidity', max: 10 },
    { key: 'bitterness', label: 'Bitterness', max: 10 },
    { key: 'richness', label: 'Richness', max: 10 },
    { key: 'spiciness', label: 'Spice', max: 10 },
    { key: 'umami', label: 'Umami', max: 10 },
    { key: 'tannin', label: 'Tannin', max: 10 },
    { key: 'alcohol', label: 'Alcohol', max: 10 },
    { key: 'carbonation', label: 'Carbonation', max: 10 },
    { key: 'saltiness', label: 'Salt', max: 10 },
  ];

  // Get the body descriptor
  const bodyLabel = flavorProfile.body ? `Body: ${flavorProfile.body}` : null;

  // Filter out stats with value 0 for cleaner display
  const activeStats = stats.filter(stat => flavorProfile[stat.key] > 0);

  return (
    <div className="flavor-profile-display">
      <div className="flavor-profile-header">
        <span className="flavor-profile-title">{title}</span>
        {bodyLabel && <span className="body-badge">{bodyLabel}</span>}
      </div>
      
      <div className="flavor-stats">
        {activeStats.map(stat => (
          <div key={stat.key} className="flavor-stat">
            <div className="stat-label-row">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{flavorProfile[stat.key]}</span>
            </div>
            <div className="stat-bar-container">
              <div 
                className={`stat-bar stat-bar-${stat.key}`}
                style={{ width: `${(flavorProfile[stat.key] / stat.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {flavorProfile.flavorNotes && flavorProfile.flavorNotes.length > 0 && (
        <div className="flavor-notes">
          <span className="flavor-notes-label">Notes:</span>
          <div className="flavor-tags">
            {flavorProfile.flavorNotes.map((note, idx) => (
              <span key={idx} className="flavor-tag">{note}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlavorProfileDisplay;
