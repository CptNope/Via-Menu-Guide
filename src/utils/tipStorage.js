/**
 * Tip Tracker Storage Utilities
 * Handles localStorage operations for tip tracking
 */

const TIP_STORAGE_KEY = 'via-tip-tracker';

/**
 * Get all tip entries from localStorage
 * @returns {Array} Array of tip entries
 */
export function getAllTips() {
  try {
    const data = localStorage.getItem(TIP_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tips:', error);
    return [];
  }
}

/**
 * Save a new tip entry
 * @param {Object} tipEntry - Tip entry object
 * @returns {Array} Updated tips array
 */
export function saveTip(tipEntry) {
  const tips = getAllTips();
  const newTip = {
    ...tipEntry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  tips.push(newTip);
  localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(tips));
  return tips;
}

/**
 * Update an existing tip entry
 * @param {string} id - Tip entry ID
 * @param {Object} updates - Updated fields
 * @returns {Array} Updated tips array
 */
export function updateTip(id, updates) {
  const tips = getAllTips();
  const index = tips.findIndex(tip => tip.id === id);
  if (index !== -1) {
    tips[index] = { ...tips[index], ...updates };
    localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(tips));
  }
  return tips;
}

/**
 * Delete a tip entry
 * @param {string} id - Tip entry ID
 * @returns {Array} Updated tips array
 */
export function deleteTip(id) {
  const tips = getAllTips();
  const filtered = tips.filter(tip => tip.id !== id);
  localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Get tips filtered by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered tips
 */
export function getTipsByDateRange(startDate, endDate) {
  const tips = getAllTips();
  return tips.filter(tip => {
    const tipDate = new Date(tip.date);
    return tipDate >= startDate && tipDate <= endDate;
  });
}

/**
 * Get tips for a specific year
 * @param {number} year - Year to filter by
 * @returns {Array} Tips for the year
 */
export function getTipsByYear(year) {
  const tips = getAllTips();
  return tips.filter(tip => {
    const tipYear = new Date(tip.date).getFullYear();
    return tipYear === year;
  });
}

/**
 * Calculate totals from tip entries
 * @param {Array} tips - Array of tip entries
 * @returns {Object} Totals object
 */
export function calculateTotals(tips) {
  return tips.reduce((totals, tip) => {
    const cashWalked = parseFloat(tip.cashWalkedWith) || 0;
    const yourCC = parseFloat(tip.yourCreditTips) || 0;
    const ccSent = parseFloat(tip.ccTipsSent) || 0;
    const ccReceived = parseFloat(tip.ccTipsReceived) || 0;
    
    totals.cashWalked += cashWalked;
    totals.yourCCTips += yourCC;
    totals.ccSent += ccSent;
    totals.ccReceived += ccReceived;
    totals.netCCExchange = totals.ccReceived - totals.ccSent;
    totals.netIncome = totals.cashWalked + totals.ccReceived - totals.ccSent;
    return totals;
  }, {
    cashWalked: 0,
    yourCCTips: 0,
    ccSent: 0,
    ccReceived: 0,
    netCCExchange: 0,
    netIncome: 0
  });
}

/**
 * Get all unique partners
 * @returns {Array} Array of unique partner names
 */
export function getAllPartners() {
  const tips = getAllTips();
  const partnersSet = new Set();
  
  tips.forEach(tip => {
    if (tip.partners && tip.partners.trim() !== '') {
      // Split by comma and add each partner
      const partnerList = tip.partners.split(',').map(p => p.trim());
      partnerList.forEach(p => {
        if (p) partnersSet.add(p);
      });
    }
  });
  
  return Array.from(partnersSet).sort();
}

/**
 * Export tips as JSON
 * @returns {string} JSON string of all tips
 */
export function exportTips() {
  const tips = getAllTips();
  return JSON.stringify(tips, null, 2);
}

/**
 * Import tips from JSON
 * @param {string} jsonString - JSON string of tips
 * @returns {boolean} Success status
 */
export function importTips(jsonString) {
  try {
    const importedTips = JSON.parse(jsonString);
    if (!Array.isArray(importedTips)) {
      throw new Error('Invalid format');
    }
    localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(importedTips));
    return true;
  } catch (error) {
    console.error('Error importing tips:', error);
    return false;
  }
}

/**
 * Clear all tips (with confirmation)
 * @returns {boolean} Success status
 */
export function clearAllTips() {
  localStorage.removeItem(TIP_STORAGE_KEY);
  return true;
}

/**
 * Save multiple tips at once (for bulk import/edit)
 * @param {Array} newTips - Array of tip entries to add
 * @returns {Array} Updated tips array
 */
export function saveBulkTips(newTips) {
  const tips = getAllTips();
  const tipsWithIds = newTips.map(tip => ({
    ...tip,
    id: tip.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: tip.createdAt || new Date().toISOString()
  }));
  const updatedTips = [...tips, ...tipsWithIds];
  localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(updatedTips));
  return updatedTips;
}

/**
 * Delete multiple tips at once
 * @param {Array} ids - Array of tip IDs to delete
 * @returns {Array} Updated tips array
 */
export function deleteBulkTips(ids) {
  const tips = getAllTips();
  const filtered = tips.filter(tip => !ids.includes(tip.id));
  localStorage.setItem(TIP_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}
