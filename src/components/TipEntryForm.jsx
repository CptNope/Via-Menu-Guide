import React, { useState, useEffect } from 'react';

/**
 * Form component for adding/editing tip entries
 */
function TipEntryForm({ onSave, editingTip = null, partners = [] }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    cashWalkedWith: '',
    yourCreditTips: '',
    partners: '',
    ccTipsSent: '',
    ccTipsReceived: '',
    teamSize: '2',
    notes: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingTip) {
      setFormData({
        date: editingTip.date,
        startTime: editingTip.startTime || '',
        endTime: editingTip.endTime || '',
        cashWalkedWith: editingTip.cashWalkedWith || '',
        yourCreditTips: editingTip.yourCreditTips || '',
        partners: editingTip.partners || '',
        ccTipsSent: editingTip.ccTipsSent || '',
        ccTipsReceived: editingTip.ccTipsReceived || '',
        teamSize: editingTip.teamSize || '2',
        notes: editingTip.notes || ''
      });
    }
  }, [editingTip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate at least one field is filled
    if (!formData.cashWalkedWith && !formData.yourCreditTips && !formData.ccTipsSent && !formData.ccTipsReceived) {
      alert('Please enter at least one value');
      return;
    }

    onSave(formData);
    
    // Reset form if not editing
    if (!editingTip) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        cashWalkedWith: '',
        yourCreditTips: '',
        partners: '',
        ccTipsSent: '',
        ccTipsReceived: '',
        teamSize: '2',
        notes: ''
      });
    }
  };

  // Calculate shift duration in hours
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    let end = new Date(`2000-01-01T${formData.endTime}`);
    
    // Handle overnight shifts
    if (end < start) {
      end = new Date(`2000-01-02T${formData.endTime}`);
    }
    
    const diffMs = end - start;
    const hours = diffMs / (1000 * 60 * 60);
    return hours;
  };

  const cashWalked = parseFloat(formData.cashWalkedWith) || 0;
  const yourCC = parseFloat(formData.yourCreditTips) || 0;
  const ccSent = parseFloat(formData.ccTipsSent) || 0;
  const ccReceived = parseFloat(formData.ccTipsReceived) || 0;
  
  // Net Income = Cash you keep + CC tips received - CC tips sent
  const netIncome = cashWalked + ccReceived - ccSent;
  const duration = calculateDuration();
  const hourlyRate = duration > 0 ? netIncome / duration : 0;

  return (
    <form className="tip-entry-form" onSubmit={handleSubmit}>
      <h3>{editingTip ? 'Edit Entry' : 'Add New Entry'}</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="teamSize">Team Size</label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
          >
            <option value="1">Solo (1 person)</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="partners">Partner Names (optional)</label>
          <input
            type="text"
            id="partners"
            name="partners"
            value={formData.partners}
            onChange={handleChange}
            list="partner-list"
            placeholder="e.g., John, Sarah"
          />
          <datalist id="partner-list">
            {partners.map((p, idx) => (
              <option key={idx} value={p} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            placeholder="HH:MM"
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            placeholder="HH:MM"
          />
        </div>
      </div>

      {duration > 0 && (
        <div className="form-calculation">
          Shift Duration: <strong>{duration.toFixed(2)} hours</strong>
        </div>
      )}

      <div className="form-section">
        <h4>💵 Your Tips</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cashWalkedWith">
              Cash You're Walking With ($)
              <span className="field-hint">Final cash amount you keep</span>
            </label>
            <input
              type="number"
              id="cashWalkedWith"
              name="cashWalkedWith"
              value={formData.cashWalkedWith}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="yourCreditTips">
              Your Total CC Tips ($)
              <span className="field-hint">Before splitting</span>
            </label>
            <input
              type="number"
              id="yourCreditTips"
              name="yourCreditTips"
              value={formData.yourCreditTips}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
        {cashWalked > 0 && (
          <div className="form-calculation">
            Cash Walking With: <strong>${cashWalked.toFixed(2)}</strong>
          </div>
        )}
      </div>

      <div className="form-section">
        <h4>🤝 CC Tips Exchange with Partners</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ccTipsSent">
              CC Tips You Sent Out ($)
              <span className="field-hint">From YOUR CC tips to partners</span>
            </label>
            <input
              type="number"
              id="ccTipsSent"
              name="ccTipsSent"
              value={formData.ccTipsSent}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ccTipsReceived">
              CC Tips You Received ($)
              <span className="field-hint">From partners' CC tips to you</span>
            </label>
            <input
              type="number"
              id="ccTipsReceived"
              name="ccTipsReceived"
              value={formData.ccTipsReceived}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
        {(ccSent > 0 || ccReceived > 0) && (
          <div className="form-calculation">
            Net CC Exchange: <strong className={(ccReceived - ccSent) >= 0 ? 'positive' : 'negative'}>
              {(ccReceived - ccSent) >= 0 ? '+' : ''}${(ccReceived - ccSent).toFixed(2)}
            </strong>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Add any notes about this shift..."
        />
      </div>

      {netIncome > 0 && (
        <>
          <div className="form-total">
            <span>Net Income:</span>
            <strong>${netIncome.toFixed(2)}</strong>
          </div>
          {hourlyRate > 0 && (
            <div className="form-hourly">
              <span>Hourly Rate:</span>
              <strong>${hourlyRate.toFixed(2)}/hr</strong>
            </div>
          )}
        </>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTip ? 'Update Entry' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
}

export default TipEntryForm;
