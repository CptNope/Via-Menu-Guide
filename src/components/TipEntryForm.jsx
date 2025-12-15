import React, { useState, useEffect } from 'react';

/**
 * Tip entry form with partners and shift times for hourly tracking
 */
function TipEntryForm({ onSave, editingTip = null, partners = [] }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    tipsOnCheck: '',
    cashWalking: '',
    partners: '',
    pops: '',
    popsReason: '',
    notes: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingTip) {
      setFormData({
        date: editingTip.date,
        startTime: editingTip.startTime || '',
        endTime: editingTip.endTime || '',
        tipsOnCheck: editingTip.tipsOnCheck || '',
        cashWalking: editingTip.cashWalking || '',
        partners: editingTip.partners || '',
        pops: editingTip.pops || '',
        popsReason: editingTip.popsReason || '',
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
    
    if (!formData.tipsOnCheck && !formData.cashWalking) {
      alert('Please enter at least one amount');
      return;
    }

    onSave(formData);
    
    // Reset form if not editing
    if (!editingTip) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        tipsOnCheck: '',
        cashWalking: '',
        partners: '',
        pops: '',
        popsReason: '',
        notes: ''
      });
    }
  };

  // Calculate shift duration
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    let end = new Date(`2000-01-01T${formData.endTime}`);
    if (end < start) end = new Date(`2000-01-02T${formData.endTime}`);
    return (end - start) / (1000 * 60 * 60);
  };

  const tipsOnCheck = parseFloat(formData.tipsOnCheck) || 0;
  const cashWalking = parseFloat(formData.cashWalking) || 0;
  const totalTakeHome = tipsOnCheck + cashWalking;
  const duration = calculateDuration();
  const hourlyRate = duration > 0 ? totalTakeHome / duration : 0;

  return (
    <form className="tip-entry-form" onSubmit={handleSubmit}>
      <h3>{editingTip ? 'Edit Entry' : 'Add Shift'}</h3>
      
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
          <label htmlFor="partners">Partner(s)</label>
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
          />
        </div>
      </div>

      {duration > 0 && (
        <div className="form-calculation">
          Shift: <strong>{duration.toFixed(1)} hours</strong>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipsOnCheck">💳 Tips on Check ($)</label>
          <input
            type="number"
            id="tipsOnCheck"
            name="tipsOnCheck"
            value={formData.tipsOnCheck}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cashWalking">💵 Cash Walking ($)</label>
          <input
            type="number"
            id="cashWalking"
            name="cashWalking"
            value={formData.cashWalking}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
      </div>

      {totalTakeHome > 0 && (
        <div className="form-total">
          <span>Total:</span>
          <strong>${totalTakeHome.toFixed(2)}</strong>
        </div>
      )}

      {hourlyRate > 0 && (
        <div className="form-hourly">
          <span>Hourly Rate:</span>
          <strong>${hourlyRate.toFixed(2)}/hr</strong>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pops">🍿 Pops Earned ($)</label>
          <input
            type="number"
            id="pops"
            name="pops"
            value={formData.pops}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label htmlFor="popsReason">Pops Reason</label>
          <input
            type="text"
            id="popsReason"
            name="popsReason"
            value={formData.popsReason}
            onChange={handleChange}
            placeholder="e.g., Great upselling"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <input
          type="text"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g., Busy Friday night"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTip ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default TipEntryForm;
