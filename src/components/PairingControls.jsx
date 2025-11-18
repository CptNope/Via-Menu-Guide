import React, { useState } from "react";
import "./PairingControls.css";

function PairingControls({ preferences, onChange }) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [showExclusions, setShowExclusions] = useState(false);

  const handlePreferenceToggle = (key) => {
    const newPreferences = { ...preferences.prefer };
    if (newPreferences[key]) {
      delete newPreferences[key];
    } else {
      newPreferences[key] = true;
    }
    onChange({ ...preferences, prefer: newPreferences });
  };

  const handleExclusionToggle = (key) => {
    const newExclusions = { ...preferences.exclude };
    if (newExclusions[key]) {
      delete newExclusions[key];
    } else {
      newExclusions[key] = true;
    }
    onChange({ ...preferences, exclude: newExclusions });
  };

  const handlePriceRangeChange = (type, value) => {
    onChange({
      ...preferences,
      priceRange: {
        ...preferences.priceRange,
        [type]: value
      }
    });
  };

  const handleClearAll = () => {
    onChange({
      prefer: {},
      exclude: {},
      priceRange: { min: 0, max: 1000 },
      minScore: 0
    });
  };

  const preferenceCategories = [
    { key: "italian", label: "Italian Wines" },
    { key: "french", label: "French Wines" },
    { key: "california", label: "California Wines" },
    { key: "champagne", label: "Champagne/Sparkling" },
    { key: "red", label: "Red Wines" },
    { key: "white", label: "White Wines" },
    { key: "rosé", label: "Rosé Wines" },
    { key: "fullBody", label: "Full-Bodied" },
    { key: "lightBody", label: "Light-Bodied" },
    { key: "highAcidity", label: "High Acidity" },
    { key: "lowTannin", label: "Low Tannin" },
    { key: "mineral", label: "Mineral/Terroir" },
    { key: "fruity", label: "Fruit-Forward" },
    { key: "oaky", label: "Oaky/Aged" },
    { key: "crisp", label: "Crisp & Clean" },
  ];

  const exclusionOptions = [
    { key: "red", label: "Red Wines" },
    { key: "white", label: "White Wines" },
    { key: "sparkling", label: "Sparkling Wines" },
    { key: "sweetWines", label: "Sweet Wines" },
    { key: "highAlcohol", label: "High Alcohol (>7)" },
    { key: "tannic", label: "Tannic Wines" },
    { key: "oaky", label: "Heavily Oaked" },
    { key: "expensive", label: "Expensive ($100+)" },
    { key: "bottles", label: "Bottles (Glass Only)" },
    { key: "byGlass", label: "By Glass (Bottles Only)" },
  ];

  const activePreferenceCount = Object.keys(preferences.prefer || {}).length;
  const activeExclusionCount = Object.keys(preferences.exclude || {}).length;
  const hasPriceFilter = preferences.priceRange?.min > 0 || preferences.priceRange?.max < 1000;
  const hasMinScore = preferences.minScore > 0;
  const hasActiveFilters = activePreferenceCount > 0 || activeExclusionCount > 0 || hasPriceFilter || hasMinScore;

  return (
    <div className="pairing-controls">
      <div className="pairing-controls-header">
        <h3>🎯 Pairing Preferences</h3>
        {hasActiveFilters && (
          <button 
            className="clear-preferences-btn"
            onClick={handleClearAll}
            title="Clear all preferences"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Preferences Section */}
      <div className="pairing-section">
        <button
          className="pairing-section-toggle"
          onClick={() => setShowPreferences(!showPreferences)}
        >
          <span className="toggle-icon">{showPreferences ? "▼" : "▶"}</span>
          <span>Prefer in Pairings</span>
          {activePreferenceCount > 0 && (
            <span className="active-count">{activePreferenceCount}</span>
          )}
        </button>

        {showPreferences && (
          <div className="pairing-options">
            <p className="section-description">
              Select wine characteristics you'd like to see prioritized in pairing suggestions:
            </p>
            <div className="preference-pills">
              {preferenceCategories.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`preference-pill ${preferences.prefer?.[key] ? 'active' : ''}`}
                  onClick={() => handlePreferenceToggle(key)}
                >
                  <input 
                    type="checkbox" 
                    readOnly 
                    checked={preferences.prefer?.[key] || false} 
                  />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exclusions Section */}
      <div className="pairing-section">
        <button
          className="pairing-section-toggle"
          onClick={() => setShowExclusions(!showExclusions)}
        >
          <span className="toggle-icon">{showExclusions ? "▼" : "▶"}</span>
          <span>Exclude from Pairings</span>
          {activeExclusionCount > 0 && (
            <span className="active-count exclude">{activeExclusionCount}</span>
          )}
        </button>

        {showExclusions && (
          <div className="pairing-options">
            <p className="section-description">
              Select wine types or characteristics to exclude from pairing suggestions:
            </p>
            <div className="preference-pills">
              {exclusionOptions.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`preference-pill exclude ${preferences.exclude?.[key] ? 'active' : ''}`}
                  onClick={() => handleExclusionToggle(key)}
                >
                  <input 
                    type="checkbox" 
                    readOnly 
                    checked={preferences.exclude?.[key] || false} 
                  />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="pairing-section">
        <div className="price-range-controls">
          <label className="price-range-label">
            <span>💰 Price Range:</span>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                max="1000"
                value={preferences.priceRange?.min || 0}
                onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                className="price-input"
                placeholder="Min"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={preferences.priceRange?.max || 1000}
                onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 1000)}
                className="price-input"
                placeholder="Max"
              />
            </div>
          </label>
        </div>
      </div>

      {/* Minimum Score Filter */}
      <div className="pairing-section">
        <div className="min-score-controls">
          <label className="min-score-label">
            <span>⭐ Minimum Match Score:</span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={preferences.minScore || 0}
              onChange={(e) => onChange({ ...preferences, minScore: parseInt(e.target.value) })}
              className="score-slider"
            />
            <span className="score-value">{preferences.minScore || 0}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default PairingControls;
