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
    totals.cashTips += parseFloat(tip.cashTips) || 0;
    totals.creditTips += parseFloat(tip.creditTips) || 0;
    totals.sentToPartner += parseFloat(tip.sentToPartner) || 0;
    totals.receivedFromPartner += parseFloat(tip.receivedFromPartner) || 0;
    totals.totalTips = totals.cashTips + totals.creditTips;
    totals.netExchange = totals.receivedFromPartner - totals.sentToPartner;
    totals.netIncome = totals.totalTips + totals.netExchange;
    return totals;
  }, {
    cashTips: 0,
    creditTips: 0,
    sentToPartner: 0,
    receivedFromPartner: 0,
    totalTips: 0,
    netExchange: 0,
    netIncome: 0
  });
}

/**
 * Get all unique partners
 * @returns {Array} Array of unique partner names
 */
export function getAllPartners() {
  const tips = getAllTips();
  const partners = tips
    .map(tip => tip.partner)
    .filter(partner => partner && partner.trim() !== '');
  return [...new Set(partners)].sort();
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
