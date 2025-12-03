import React, { useState, useEffect } from 'react';

/**
 * Form component for adding/editing tip entries
 */
function TipEntryForm({ onSave, editingTip = null, partners = [] }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cashTips: '',
    creditTips: '',
    partner: '',
    sentToPartner: '',
    receivedFromPartner: '',
    notes: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingTip) {
      setFormData({
        date: editingTip.date,
        cashTips: editingTip.cashTips || '',
        creditTips: editingTip.creditTips || '',
        partner: editingTip.partner || '',
        sentToPartner: editingTip.sentToPartner || '',
        receivedFromPartner: editingTip.receivedFromPartner || '',
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
    if (!formData.cashTips && !formData.creditTips && !formData.sentToPartner && !formData.receivedFromPartner) {
      alert('Please enter at least one value');
      return;
    }

    onSave(formData);
    
    // Reset form if not editing
    if (!editingTip) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        cashTips: '',
        creditTips: '',
        partner: '',
        sentToPartner: '',
        receivedFromPartner: '',
        notes: ''
      });
    }
  };

  const totalTips = (parseFloat(formData.cashTips) || 0) + (parseFloat(formData.creditTips) || 0);
  const netExchange = (parseFloat(formData.receivedFromPartner) || 0) - (parseFloat(formData.sentToPartner) || 0);
  const netIncome = totalTips + netExchange;

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
          <label htmlFor="partner">Partner</label>
          <input
            type="text"
            id="partner"
            name="partner"
            value={formData.partner}
            onChange={handleChange}
            list="partner-list"
            placeholder="Partner name"
          />
          <datalist id="partner-list">
            {partners.map((p, idx) => (
              <option key={idx} value={p} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="form-section">
        <h4>💵 Tips Earned</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cashTips">Cash Tips ($)</label>
            <input
              type="number"
              id="cashTips"
              name="cashTips"
              value={formData.cashTips}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="creditTips">Credit Tips ($)</label>
            <input
              type="number"
              id="creditTips"
              name="creditTips"
              value={formData.creditTips}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
        {totalTips > 0 && (
          <div className="form-calculation">
            Total Tips: <strong>${totalTips.toFixed(2)}</strong>
          </div>
        )}
      </div>

      <div className="form-section">
        <h4>🤝 Partner Exchange</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sentToPartner">Sent to Partner ($)</label>
            <input
              type="number"
              id="sentToPartner"
              name="sentToPartner"
              value={formData.sentToPartner}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="receivedFromPartner">Received from Partner ($)</label>
            <input
              type="number"
              id="receivedFromPartner"
              name="receivedFromPartner"
              value={formData.receivedFromPartner}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
        {(formData.sentToPartner || formData.receivedFromPartner) && (
          <div className="form-calculation">
            Net Exchange: <strong className={netExchange >= 0 ? 'positive' : 'negative'}>
              {netExchange >= 0 ? '+' : ''}{netExchange.toFixed(2)}
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
        <div className="form-total">
          <span>Net Income:</span>
          <strong>${netIncome.toFixed(2)}</strong>
        </div>
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
