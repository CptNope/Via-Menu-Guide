import React, { useState } from 'react';

/**
 * Reusable pairing section with toggle button
 * @param {string} icon - Emoji icon for the pairing type
 * @param {string} label - Label text (e.g., "Wine Pairings")
 * @param {string} buttonClass - Additional CSS class for the button
 * @param {ReactNode} children - Pairing content to display
 */
function PairingSection({ icon, label, buttonClass = '', children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <button 
        className={`pairing-toggle-btn ${buttonClass}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="toggle-arrow">{isExpanded ? '▼' : '▶'}</span>
        {icon} {isExpanded ? 'Hide' : 'View'} {label}
      </button>

      {isExpanded && (
        <div className="pairing-panel">
          {children}
        </div>
      )}
    </>
  );
}

export default PairingSection;
