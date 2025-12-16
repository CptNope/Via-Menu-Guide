import React, { useState, useEffect } from 'react';
import TipEntryForm from './TipEntryForm';
import TipAnalytics from './TipAnalytics';
import TipCalendar from './TipCalendar';
import TipBulkEdit from './TipBulkEdit';
import './TipTracker.css';
import {
  getAllTips,
  saveTip,
  updateTip,
  deleteTip,
  getTipsByYear,
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
  const [showForm, setShowForm] = useState(false);
  const [partners, setPartners] = useState([]);
  const [filterPartner, setFilterPartner] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showBulkEdit, setShowBulkEdit] = useState(false);

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
      filtered = filtered.filter(tip => tip.partners && tip.partners.includes(filterPartner));
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

  // Calculate totals for filtered tips
  const totals = filteredTips.reduce((acc, tip) => {
    acc.tipsOnCheck += parseFloat(tip.tipsOnCheck) || 0;
    acc.cashWalking += parseFloat(tip.cashWalking) || 0;
    acc.pops += parseFloat(tip.pops) || 0;
    return acc;
  }, { tipsOnCheck: 0, cashWalking: 0, pops: 0 });
  totals.total = totals.tipsOnCheck + totals.cashWalking;

  const availableYears = [...new Set(tips.map(tip => new Date(tip.date).getFullYear()))].sort((a, b) => b - a);

  return (
    <div className="tip-tracker">
      <div className="tip-tracker-header">
        <h1>💰 Tip Tracker</h1>
        <p>Track your tips each shift</p>
      </div>

      {/* Summary Cards */}
      <div className="tip-summary-cards">
        <div className="summary-card">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <div className="card-label">Tips on Check</div>
            <div className="card-value">${totals.tipsOnCheck.toFixed(2)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <div className="card-label">Cash Walking</div>
            <div className="card-value">${totals.cashWalking.toFixed(2)}</div>
          </div>
        </div>

        <div className="summary-card highlight">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Total</div>
            <div className="card-value">${totals.total.toFixed(2)}</div>
            <div className="card-breakdown">{filteredTips.length} shifts</div>
          </div>
        </div>

        {totals.pops > 0 && (
          <div className="summary-card pops">
            <div className="card-icon">🍿</div>
            <div className="card-content">
              <div className="card-label">Pops Earned</div>
              <div className="card-value">${totals.pops.toFixed(2)}</div>
              <div className="card-breakdown">Food credits</div>
            </div>
          </div>
        )}
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
          {partners.length > 0 && (
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
          )}
        </div>

        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar
          </button>
        </div>

        <div className="actions">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add'}
          </button>
          <button onClick={() => setShowBulkEdit(true)} className="btn btn-secondary" title="Bulk Add">
            📝 Bulk
          </button>
          <button onClick={handleExport} className="btn btn-secondary" title="Export">
            📥
          </button>
          <label className="btn btn-secondary" title="Import">
            📤
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

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <TipCalendar 
          tips={tips} 
          selectedYear={selectedYear}
          onEditTip={(tipData) => {
            updateTip(tipData.id, tipData);
            loadTips();
          }}
          onDeleteTip={(id) => {
            deleteTip(id);
            loadTips();
          }}
          onAddEntry={(date) => {
            // Show form with pre-filled date (stay on calendar)
            setEditingTip({ date });
            setShowForm(true);
          }}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Analytics */}
          {filteredTips.length > 0 && (
            <TipAnalytics tips={filteredTips} />
          )}
        </>
      )}

      {/* Tip Entries List */}
      {viewMode === 'list' && (
      <div className="tip-entries">
        <h2>{selectedYear} Shifts</h2>
        
        {filteredTips.length === 0 ? (
          <div className="empty-state">
            <p>No entries yet for {selectedYear}</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add Your First Shift
            </button>
          </div>
        ) : (
          <div className="entries-list">
            {filteredTips.map(tip => {
              const tipsOnCheck = parseFloat(tip.tipsOnCheck) || 0;
              const cashWalking = parseFloat(tip.cashWalking) || 0;
              const total = tipsOnCheck + cashWalking;
              const duration = calculateShiftDuration(tip.startTime, tip.endTime);
              const hourlyRate = duration > 0 ? total / duration : 0;

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
                        <span className="entry-time">
                          {tip.startTime}-{tip.endTime} ({duration.toFixed(1)}h)
                        </span>
                      )}
                    </div>
                    <div className="entry-total">
                      ${total.toFixed(2)}
                      {hourlyRate > 0 && (
                        <span className="entry-hourly">${hourlyRate.toFixed(2)}/hr</span>
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
                      <span className="detail-label">💳 Check:</span>
                      <span className="detail-value">${tipsOnCheck.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">💵 Cash:</span>
                      <span className="detail-value">${cashWalking.toFixed(2)}</span>
                    </div>
                    {tip.partners && (
                      <div className="detail-row">
                        <span className="detail-label">🤝 Partner:</span>
                        <span className="detail-value">{tip.partners}</span>
                      </div>
                    )}
                    {parseFloat(tip.pops) > 0 && (
                      <div className="detail-row pops">
                        <span className="detail-label">🍿 Pops:</span>
                        <span className="detail-value">${parseFloat(tip.pops).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {tip.popsReason && (
                    <div className="entry-pops-reason">🍿 {tip.popsReason}</div>
                  )}

                  {tip.notes && (
                    <div className="entry-notes">{tip.notes}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Danger Zone */}
      {tips.length > 0 && (
        <div className="danger-zone">
          <button onClick={handleClearAll} className="btn btn-danger">
            ⚠️ Clear All Data
          </button>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {showBulkEdit && (
        <TipBulkEdit
          onClose={() => setShowBulkEdit(false)}
          onSave={loadTips}
          partners={partners}
        />
      )}
    </div>
  );
}

export default TipTracker;
