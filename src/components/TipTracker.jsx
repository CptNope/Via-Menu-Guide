import React, { useState, useEffect } from 'react';
import TipEntryForm from './TipEntryForm';
import TipAnalytics from './TipAnalytics';
import './TipTracker.css';
import {
  getAllTips,
  saveTip,
  updateTip,
  deleteTip,
  getTipsByYear,
  calculateTotals,
  getAllPartners,
  exportTips,
  importTips,
  clearAllTips
} from '../utils/tipStorage';
import { calculateShiftDuration } from '../utils/tipAnalytics';

function TipTracker() {
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingTip, setEditingTip] = useState(null);
  const [partners, setPartners] = useState([]);
  const [filterPartner, setFilterPartner] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Load tips on mount
  useEffect(() => {
    loadTips();
  }, []);

  // Filter tips when year or partner changes
  useEffect(() => {
    filterTips();
  }, [selectedYear, filterPartner, tips]);

  const loadTips = () => {
    const allTips = getAllTips();
    setTips(allTips);
    setPartners(getAllPartners());
  };

  const filterTips = () => {
    let filtered = getTipsByYear(selectedYear);
    
    if (filterPartner) {
      filtered = filtered.filter(tip => tip.partner === filterPartner);
    }
    
    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTips(filtered);
  };

  const handleSaveTip = (tipData) => {
    if (editingTip) {
      updateTip(editingTip.id, tipData);
      setEditingTip(null);
    } else {
      saveTip(tipData);
    }
    loadTips();
    setShowForm(false);
  };

  const handleEditTip = (tip) => {
    setEditingTip(tip);
    setShowForm(true);
  };

  const handleDeleteTip = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteTip(id);
      loadTips();
    }
  };

  const handleExport = () => {
    const data = exportTips();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tips-${selectedYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (importTips(event.target.result)) {
          alert('Tips imported successfully!');
          loadTips();
        } else {
          alert('Error importing tips. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ This will delete ALL tip entries. This cannot be undone. Are you sure?')) {
      if (window.confirm('Really sure? This is permanent!')) {
        clearAllTips();
        loadTips();
      }
    }
  };

  const totals = calculateTotals(filteredTips);
  const availableYears = [...new Set(tips.map(tip => new Date(tip.date).getFullYear()))].sort((a, b) => b - a);

  return (
    <div className="tip-tracker">
      <div className="tip-tracker-header">
        <h1>💰 Tip Tracker</h1>
        <p>Track your tips, cash, credit, and partner exchanges</p>
      </div>

      {/* Summary Cards */}
      <div className="tip-summary-cards">
        <div className="summary-card total">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <div className="card-label">Cash Walked With</div>
            <div className="card-value">${totals.cashWalked.toFixed(2)}</div>
            <div className="card-breakdown">
              Total CC Tips: ${totals.yourCCTips.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="summary-card exchange">
          <div className="card-icon">🤝</div>
          <div className="card-content">
            <div className="card-label">CC Tips Exchange</div>
            <div className={`card-value ${totals.netCCExchange >= 0 ? 'positive' : 'negative'}`}>
              {totals.netCCExchange >= 0 ? '+' : ''}${totals.netCCExchange.toFixed(2)}
            </div>
            <div className="card-breakdown">
              Received: ${totals.ccReceived.toFixed(2)} | Sent: ${totals.ccSent.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="summary-card net">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Net Income</div>
            <div className="card-value highlight">${totals.netIncome.toFixed(2)}</div>
            <div className="card-breakdown">
              {filteredTips.length} shifts tracked
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="tip-controls">
        <div className="filters">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-select"
          >
            {availableYears.length > 0 ? (
              availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))
            ) : (
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            )}
          </select>

          <select 
            value={filterPartner} 
            onChange={(e) => setFilterPartner(e.target.value)}
            className="partner-filter"
          >
            <option value="">All Partners</option>
            {partners.map((partner, idx) => (
              <option key={idx} value={partner}>{partner}</option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add Entry'}
          </button>
          <button onClick={handleExport} className="btn btn-secondary" title="Export">
            📥 Export
          </button>
          <label className="btn btn-secondary" title="Import">
            📤 Import
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="form-container">
          <TipEntryForm 
            onSave={handleSaveTip}
            editingTip={editingTip}
            partners={partners}
          />
        </div>
      )}

      {/* Analytics & Averages */}
      {filteredTips.length > 0 && (
        <TipAnalytics tips={filteredTips} />
      )}

      {/* Tip Entries List */}
      <div className="tip-entries">
        <h2>Entries for {selectedYear}</h2>
        
        {filteredTips.length === 0 ? (
          <div className="empty-state">
            <p>No entries found for {selectedYear}</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add Your First Entry
            </button>
          </div>
        ) : (
          <div className="entries-list">
            {filteredTips.map(tip => {
              const cashWalked = parseFloat(tip.cashWalkedWith) || 0;
              const yourCC = parseFloat(tip.yourCreditTips) || 0;
              const ccSent = parseFloat(tip.ccTipsSent) || 0;
              const ccReceived = parseFloat(tip.ccTipsReceived) || 0;
              const netIncome = cashWalked + ccReceived - ccSent;
              const duration = calculateShiftDuration(tip.startTime, tip.endTime);
              const hourlyRate = duration > 0 ? netIncome / duration : 0;

              return (
                <div key={tip.id} className="tip-entry-card">
                  <div className="entry-header">
                    <div className="entry-date">
                      {new Date(tip.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      {duration > 0 && (
                        <div className="entry-time">
                          {tip.startTime} - {tip.endTime} ({duration.toFixed(1)}hrs)
                        </div>
                      )}
                    </div>
                    <div className="entry-meta">
                      {tip.teamSize && (
                        <div className="entry-team">Team: {tip.teamSize} {tip.teamSize === '1' ? 'person' : 'people'}</div>
                      )}
                      {tip.partners && (
                        <div className="entry-partner">Partners: {tip.partners}</div>
                      )}
                    </div>
                    <div className="entry-actions">
                      <button onClick={() => handleEditTip(tip)} className="btn-icon" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteTip(tip.id)} className="btn-icon" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="entry-details">
                    <div className="detail-row">
                      <span className="detail-label">Cash Walked With:</span>
                      <span className="detail-value">${cashWalked.toFixed(2)}</span>
                    </div>
                    {yourCC > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Your CC Tips:</span>
                        <span className="detail-value">${yourCC.toFixed(2)}</span>
                      </div>
                    )}
                    {(ccSent > 0 || ccReceived > 0) && (
                      <>
                        <div className="detail-divider"></div>
                        {ccSent > 0 && (
                          <div className="detail-row exchange">
                            <span className="detail-label">CC Tips Sent:</span>
                            <span className="detail-value negative">-${ccSent.toFixed(2)}</span>
                          </div>
                        )}
                        {ccReceived > 0 && (
                          <div className="detail-row exchange">
                            <span className="detail-label">CC Tips Received:</span>
                            <span className="detail-value positive">+${ccReceived.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="detail-divider"></div>
                    <div className="detail-row total">
                      <span className="detail-label">Net Income:</span>
                      <span className="detail-value highlight">${netIncome.toFixed(2)}</span>
                    </div>
                    {hourlyRate > 0 && (
                      <div className="detail-row hourly">
                        <span className="detail-label">Hourly Rate:</span>
                        <span className="detail-value hourly-rate">${hourlyRate.toFixed(2)}/hr</span>
                      </div>
                    )}
                  </div>

                  {tip.notes && (
                    <div className="entry-notes">
                      <strong>Notes:</strong> {tip.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      {tips.length > 0 && (
        <div className="danger-zone">
          <button onClick={handleClearAll} className="btn btn-danger">
            ⚠️ Clear All Data
          </button>
        </div>
      )}
    </div>
  );
}

export default TipTracker;
