import React, { useState } from 'react';
import { 
  calculatePerShiftAnalytics,
  calculatePerWeekAnalytics,
  calculatePerMonthAnalytics,
  calculatePerYearAnalytics 
} from '../utils/tipAnalytics';

/**
 * Component to display tip analytics and averages
 */
function TipAnalytics({ tips }) {
  const [viewType, setViewType] = useState('shift'); // shift, week, month, year

  if (!tips || tips.length === 0) {
    return (
      <div className="tip-analytics empty">
        <p>Add some entries with times to see analytics!</p>
      </div>
    );
  }

  const tipsWithTime = tips.filter(tip => tip.startTime && tip.endTime);
  const perShift = calculatePerShiftAnalytics(tips);
  const perWeek = calculatePerWeekAnalytics(tips);
  const perMonth = calculatePerMonthAnalytics(tips);
  const perYear = calculatePerYearAnalytics(tips);

  const renderShiftAnalytics = () => (
    <div className="analytics-grid">
      <div className="analytics-card">
        <div className="analytics-label">Average per Shift</div>
        <div className="analytics-value">${perShift.averageIncome.toFixed(2)}</div>
        <div className="analytics-detail">{perShift.count} shifts tracked</div>
      </div>
      
      {tipsWithTime.length > 0 && (
        <>
          <div className="analytics-card">
            <div className="analytics-label">Average Hours</div>
            <div className="analytics-value">{perShift.averageHours.toFixed(2)} hrs</div>
            <div className="analytics-detail">{tipsWithTime.length} shifts with times</div>
          </div>
          
          <div className="analytics-card highlight">
            <div className="analytics-label">Average Hourly Rate</div>
            <div className="analytics-value">${perShift.averageHourlyRate.toFixed(2)}/hr</div>
            <div className="analytics-detail">Based on {perShift.totalHours.toFixed(1)} total hours</div>
          </div>
        </>
      )}
    </div>
  );

  const renderWeekAnalytics = () => (
    <div className="analytics-section">
      {perWeek.average && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-label">Average per Week</div>
            <div className="analytics-value">${perWeek.average.income.toFixed(2)}</div>
            <div className="analytics-detail">{perWeek.weeks.length} weeks</div>
          </div>
          
          {perWeek.average.hours > 0 && (
            <>
              <div className="analytics-card">
                <div className="analytics-label">Average Hours per Week</div>
                <div className="analytics-value">{perWeek.average.hours.toFixed(2)} hrs</div>
              </div>
              
              <div className="analytics-card highlight">
                <div className="analytics-label">Hourly Rate</div>
                <div className="analytics-value">${perWeek.average.hourlyRate.toFixed(2)}/hr</div>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="analytics-breakdown">
        <h4>Weekly Breakdown</h4>
        {perWeek.weeks.slice(-8).reverse().map(week => (
          <div key={week.week} className="breakdown-item">
            <div className="breakdown-label">{week.week}</div>
            <div className="breakdown-values">
              <span>${week.totalIncome.toFixed(2)}</span>
              {week.totalHours > 0 && (
                <span className="breakdown-hours">
                  {week.totalHours.toFixed(1)}hrs · ${week.averageHourlyRate.toFixed(2)}/hr
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonthAnalytics = () => (
    <div className="analytics-section">
      {perMonth.average && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-label">Average per Month</div>
            <div className="analytics-value">${perMonth.average.income.toFixed(2)}</div>
            <div className="analytics-detail">{perMonth.months.length} months</div>
          </div>
          
          {perMonth.average.hours > 0 && (
            <>
              <div className="analytics-card">
                <div className="analytics-label">Average Hours per Month</div>
                <div className="analytics-value">{perMonth.average.hours.toFixed(2)} hrs</div>
              </div>
              
              <div className="analytics-card highlight">
                <div className="analytics-label">Hourly Rate</div>
                <div className="analytics-value">${perMonth.average.hourlyRate.toFixed(2)}/hr</div>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="analytics-breakdown">
        <h4>Monthly Breakdown</h4>
        {perMonth.months.slice(-6).reverse().map(month => (
          <div key={month.month} className="breakdown-item">
            <div className="breakdown-label">{month.monthName}</div>
            <div className="breakdown-values">
              <span>${month.totalIncome.toFixed(2)}</span>
              {month.totalHours > 0 && (
                <span className="breakdown-hours">
                  {month.totalHours.toFixed(1)}hrs · ${month.averageHourlyRate.toFixed(2)}/hr
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderYearAnalytics = () => (
    <div className="analytics-section">
      <div className="analytics-breakdown">
        <h4>Yearly Overview</h4>
        {perYear.map(year => (
          <div key={year.year} className="breakdown-item year">
            <div className="breakdown-label">
              <strong>{year.year}</strong>
              <span className="breakdown-count">{year.count} shifts</span>
            </div>
            <div className="breakdown-values">
              <span className="breakdown-total">${year.totalIncome.toFixed(2)}</span>
              {year.totalHours > 0 && (
                <span className="breakdown-hours">
                  {year.totalHours.toFixed(1)}hrs · ${year.averageHourlyRate.toFixed(2)}/hr
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tip-analytics">
      <div className="analytics-header">
        <h2>📊 Analytics & Averages</h2>
        <div className="analytics-tabs">
          <button 
            className={`tab-btn ${viewType === 'shift' ? 'active' : ''}`}
            onClick={() => setViewType('shift')}
          >
            Per Shift
          </button>
          <button 
            className={`tab-btn ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => setViewType('week')}
          >
            Per Week
          </button>
          <button 
            className={`tab-btn ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => setViewType('month')}
          >
            Per Month
          </button>
          <button 
            className={`tab-btn ${viewType === 'year' ? 'active' : ''}`}
            onClick={() => setViewType('year')}
          >
            Per Year
          </button>
        </div>
      </div>

      <div className="analytics-content">
        {viewType === 'shift' && renderShiftAnalytics()}
        {viewType === 'week' && renderWeekAnalytics()}
        {viewType === 'month' && renderMonthAnalytics()}
        {viewType === 'year' && renderYearAnalytics()}
      </div>
    </div>
  );
}

export default TipAnalytics;
