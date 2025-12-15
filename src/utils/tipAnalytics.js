/**
 * Tip Analytics Utilities
 * Calculate averages and statistics
 */

/**
 * Calculate shift duration in hours
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} Duration in hours
 */
export function calculateShiftDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}`);
  let end = new Date(`2000-01-01T${endTime}`);
  
  // Handle overnight shifts
  if (end < start) {
    end = new Date(`2000-01-02T${endTime}`);
  }
  
  const diffMs = end - start;
  const hours = diffMs / (1000 * 60 * 60);
  return hours;
}

/**
 * Calculate net income from a tip entry
 * @param {Object} tip - Tip entry
 * @returns {number} Net income (tips on check + cash walking)
 */
export function calculateNetIncome(tip) {
  const tipsOnCheck = parseFloat(tip.tipsOnCheck) || 0;
  const cashWalking = parseFloat(tip.cashWalking) || 0;
  return tipsOnCheck + cashWalking;
}

/**
 * Calculate per-shift analytics
 * @param {Array} tips - Array of tip entries
 * @returns {Object} Per-shift statistics
 */
export function calculatePerShiftAnalytics(tips) {
  if (!tips || tips.length === 0) {
    return {
      count: 0,
      totalIncome: 0,
      totalHours: 0,
      averageIncome: 0,
      averageHours: 0,
      averageHourlyRate: 0
    };
  }

  const tipsWithTime = tips.filter(tip => tip.startTime && tip.endTime);
  const totalIncome = tips.reduce((sum, tip) => sum + calculateNetIncome(tip), 0);
  const totalHours = tipsWithTime.reduce((sum, tip) => {
    return sum + calculateShiftDuration(tip.startTime, tip.endTime);
  }, 0);

  return {
    count: tips.length,
    totalIncome,
    totalHours,
    averageIncome: totalIncome / tips.length,
    averageHours: tipsWithTime.length > 0 ? totalHours / tipsWithTime.length : 0,
    averageHourlyRate: totalHours > 0 ? totalIncome / totalHours : 0
  };
}

/**
 * Get week number for a date
 * @param {Date} date - Date object
 * @returns {number} Week number
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

/**
 * Group tips by week
 * @param {Array} tips - Array of tip entries
 * @returns {Object} Tips grouped by year-week
 */
export function groupTipsByWeek(tips) {
  const grouped = {};
  
  tips.forEach(tip => {
    const date = new Date(tip.date);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const key = `${year}-W${week}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(tip);
  });
  
  return grouped;
}

/**
 * Calculate per-week analytics
 * @param {Array} tips - Array of tip entries
 * @returns {Array} Weekly statistics
 */
export function calculatePerWeekAnalytics(tips) {
  const weeklyGroups = groupTipsByWeek(tips);
  const weeks = [];
  
  Object.entries(weeklyGroups).forEach(([weekKey, weekTips]) => {
    const stats = calculatePerShiftAnalytics(weekTips);
    weeks.push({
      week: weekKey,
      ...stats
    });
  });
  
  // Calculate average across all weeks
  if (weeks.length === 0) {
    return { weeks: [], average: null };
  }
  
  const totalIncome = weeks.reduce((sum, week) => sum + week.totalIncome, 0);
  const totalHours = weeks.reduce((sum, week) => sum + week.totalHours, 0);
  
  return {
    weeks,
    average: {
      income: totalIncome / weeks.length,
      hours: totalHours / weeks.length,
      hourlyRate: totalHours > 0 ? totalIncome / totalHours : 0
    }
  };
}

/**
 * Group tips by month
 * @param {Array} tips - Array of tip entries
 * @returns {Object} Tips grouped by year-month
 */
export function groupTipsByMonth(tips) {
  const grouped = {};
  
  tips.forEach(tip => {
    const date = new Date(tip.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(tip);
  });
  
  return grouped;
}

/**
 * Calculate per-month analytics
 * @param {Array} tips - Array of tip entries
 * @returns {Array} Monthly statistics
 */
export function calculatePerMonthAnalytics(tips) {
  const monthlyGroups = groupTipsByMonth(tips);
  const months = [];
  
  Object.entries(monthlyGroups).forEach(([monthKey, monthTips]) => {
    const stats = calculatePerShiftAnalytics(monthTips);
    const date = new Date(monthKey + '-01');
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    months.push({
      month: monthKey,
      monthName,
      ...stats
    });
  });
  
  // Sort by month
  months.sort((a, b) => a.month.localeCompare(b.month));
  
  // Calculate average across all months
  if (months.length === 0) {
    return { months: [], average: null };
  }
  
  const totalIncome = months.reduce((sum, month) => sum + month.totalIncome, 0);
  const totalHours = months.reduce((sum, month) => sum + month.totalHours, 0);
  
  return {
    months,
    average: {
      income: totalIncome / months.length,
      hours: totalHours / months.length,
      hourlyRate: totalHours > 0 ? totalIncome / totalHours : 0
    }
  };
}

/**
 * Calculate per-year analytics
 * @param {Array} tips - Array of tip entries
 * @returns {Object} Yearly statistics
 */
export function calculatePerYearAnalytics(tips) {
  const yearlyGroups = {};
  
  tips.forEach(tip => {
    const year = new Date(tip.date).getFullYear();
    if (!yearlyGroups[year]) {
      yearlyGroups[year] = [];
    }
    yearlyGroups[year].push(tip);
  });
  
  const years = [];
  
  Object.entries(yearlyGroups).forEach(([year, yearTips]) => {
    const stats = calculatePerShiftAnalytics(yearTips);
    years.push({
      year: parseInt(year),
      ...stats
    });
  });
  
  // Sort by year
  years.sort((a, b) => b.year - a.year);
  
  return years;
}

/**
 * Get comprehensive analytics for tips
 * @param {Array} tips - Array of tip entries
 * @returns {Object} Complete analytics
 */
export function getComprehensiveAnalytics(tips) {
  return {
    perShift: calculatePerShiftAnalytics(tips),
    perWeek: calculatePerWeekAnalytics(tips),
    perMonth: calculatePerMonthAnalytics(tips),
    perYear: calculatePerYearAnalytics(tips)
  };
}
