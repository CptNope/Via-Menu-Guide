import React, { useState } from 'react';
import { saveBulkTips } from '../utils/tipStorage';

/**
 * Bulk edit component for quickly adding multiple tip entries
 */
function TipBulkEdit({ onClose, onSave, partners = [] }) {
  const [rows, setRows] = useState([createEmptyRow()]);
  const [error, setError] = useState('');

  function createEmptyRow() {
    return {
      date: '',
      startTime: '',
      endTime: '',
      tipsOnCheck: '',
      cashWalking: '',
      partners: '',
      pops: '',
      popsReason: '',
      notes: ''
    };
  }

  const addRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const addMultipleRows = (count) => {
    const newRows = Array(count).fill(null).map(() => createEmptyRow());
    setRows([...rows, ...newRows]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const copyDateDown = (index) => {
    if (index === 0 || !rows[index - 1].date) return;
    const updated = [...rows];
    updated[index] = { ...updated[index], date: rows[index - 1].date };
    setRows(updated);
  };

  const handleSave = () => {
    // Filter out empty rows
    const validRows = rows.filter(row => 
      row.date && (row.tipsOnCheck || row.cashWalking)
    );

    if (validRows.length === 0) {
      setError('Please fill in at least one row with a date and amount');
      return;
    }

    // Validate dates
    for (const row of validRows) {
      if (!row.date) {
        setError('All rows must have a date');
        return;
      }
    }

    saveBulkTips(validRows);
    onSave();
    onClose();
  };

  const calculateRowTotal = (row) => {
    return (parseFloat(row.tipsOnCheck) || 0) + (parseFloat(row.cashWalking) || 0);
  };

  const grandTotal = rows.reduce((sum, row) => sum + calculateRowTotal(row), 0);
  const filledRows = rows.filter(row => row.date && (row.tipsOnCheck || row.cashWalking)).length;

  return (
    <div className="bulk-edit-overlay">
      <div className="bulk-edit-modal">
        <div className="bulk-edit-header">
          <h2>📝 Bulk Add Shifts</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="bulk-edit-info">
          <p>Quickly backfill multiple shifts. Only rows with a date and at least one amount will be saved.</p>
          <div className="bulk-stats">
            <span>{filledRows} valid rows</span>
            <span>Total: ${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {error && <div className="bulk-edit-error">{error}</div>}

        <div className="bulk-edit-table-wrapper">
          <table className="bulk-edit-table">
            <thead>
              <tr>
                <th className="col-actions"></th>
                <th className="col-date">Date *</th>
                <th className="col-time">Start</th>
                <th className="col-time">End</th>
                <th className="col-money">💳 Check</th>
                <th className="col-money">💵 Cash</th>
                <th className="col-partner">Partner</th>
                <th className="col-money">🍿 Pops</th>
                <th className="col-notes">Notes</th>
                <th className="col-total">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className={calculateRowTotal(row) > 0 ? 'has-data' : ''}>
                  <td className="col-actions">
                    <button 
                      onClick={() => removeRow(index)} 
                      className="row-btn delete"
                      title="Remove row"
                    >
                      ✕
                    </button>
                    {index > 0 && rows[index - 1].date && !row.date && (
                      <button 
                        onClick={() => copyDateDown(index)} 
                        className="row-btn copy"
                        title="Copy date from above"
                      >
                        ↓
                      </button>
                    )}
                  </td>
                  <td className="col-date">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => updateRow(index, 'date', e.target.value)}
                    />
                  </td>
                  <td className="col-time">
                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                    />
                  </td>
                  <td className="col-time">
                    <input
                      type="time"
                      value={row.endTime}
                      onChange={(e) => updateRow(index, 'endTime', e.target.value)}
                    />
                  </td>
                  <td className="col-money">
                    <input
                      type="number"
                      value={row.tipsOnCheck}
                      onChange={(e) => updateRow(index, 'tipsOnCheck', e.target.value)}
                      placeholder="0"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="col-money">
                    <input
                      type="number"
                      value={row.cashWalking}
                      onChange={(e) => updateRow(index, 'cashWalking', e.target.value)}
                      placeholder="0"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="col-partner">
                    <input
                      type="text"
                      value={row.partners}
                      onChange={(e) => updateRow(index, 'partners', e.target.value)}
                      list="partners-list"
                      placeholder="Partner"
                    />
                  </td>
                  <td className="col-money">
                    <input
                      type="number"
                      value={row.pops}
                      onChange={(e) => updateRow(index, 'pops', e.target.value)}
                      placeholder="0"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className="col-notes">
                    <input
                      type="text"
                      value={row.notes}
                      onChange={(e) => updateRow(index, 'notes', e.target.value)}
                      placeholder="Notes"
                    />
                  </td>
                  <td className="col-total">
                    ${calculateRowTotal(row).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <datalist id="partners-list">
          {partners.map((p, idx) => (
            <option key={idx} value={p} />
          ))}
        </datalist>

        <div className="bulk-edit-actions">
          <div className="add-rows">
            <button onClick={addRow} className="btn btn-secondary">+ Add Row</button>
            <button onClick={() => addMultipleRows(5)} className="btn btn-secondary">+ Add 5</button>
            <button onClick={() => addMultipleRows(10)} className="btn btn-secondary">+ Add 10</button>
          </div>
          <div className="save-actions">
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary">
              Save {filledRows} Shift{filledRows !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipBulkEdit;
