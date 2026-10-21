import React, { useState } from 'react';

/**
 * Reusable pairing section with toggle button
 * @param {string} icon - Emoji icon for the pairing type
 * @param {string} label - Label text (e.g., "Wine Pairings")
 * @param {string} buttonClass - Additional CSS class for the button
 * @param {ReactNode|Function} children - Pairing content, or a function that
 *   returns it (called only while the panel is open, so the work is skipped
 *   until someone taps the button)
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
          {typeof children === 'function' ? children() : children}
        </div>
      )}
    </>
  );
}

export default PairingSection;
