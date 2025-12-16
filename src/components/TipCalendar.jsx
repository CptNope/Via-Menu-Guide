import React, { useState, useMemo } from 'react';
import { calculateShiftDuration } from '../utils/tipAnalytics';

/**
 * Calendar view for tip tracking with weekly totals
 */
function TipCalendar({ tips, selectedYear, onEditTip, onDeleteTip, onAddEntry }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingTip, setEditingTip] = useState(null);

  // Get today's date string for highlighting
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Get tips for the selected year
  const yearTips = useMemo(() => {
    return tips.filter(tip => new Date(tip.date).getFullYear() === selectedYear);
  }, [tips, selectedYear]);

  // Create a map of date -> tips for quick lookup
  const tipsByDate = useMemo(() => {
    const map = {};
    yearTips.forEach(tip => {
      const dateKey = tip.date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(tip);
    });
    return map;
  }, [yearTips]);

  // Generate calendar data for selected month
  const calendarData = useMemo(() => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const weeks = [];
    let currentWeek = [];
    let weekTotal = { tipsOnCheck: 0, cashWalking: 0, pops: 0, hours: 0, shifts: 0 };

    // Add empty cells for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTips = tipsByDate[dateStr] || [];
      
      let dayData = {
        day,
        date: dateStr,
        tips: dayTips,
        tipsOnCheck: 0,
        cashWalking: 0,
        pops: 0,
        hours: 0,
        total: 0
      };

      dayTips.forEach(tip => {
        const tipsOnCheck = parseFloat(tip.tipsOnCheck) || 0;
        const cashWalking = parseFloat(tip.cashWalking) || 0;
        const pops = parseFloat(tip.pops) || 0;
        const hours = calculateShiftDuration(tip.startTime, tip.endTime);
        
        dayData.tipsOnCheck += tipsOnCheck;
        dayData.cashWalking += cashWalking;
        dayData.pops += pops;
        dayData.hours += hours;
        dayData.total += tipsOnCheck + cashWalking;

        weekTotal.tipsOnCheck += tipsOnCheck;
        weekTotal.cashWalking += cashWalking;
        weekTotal.pops += pops;
        weekTotal.hours += hours;
        weekTotal.shifts += 1;
      });

      currentWeek.push(dayData);

      // End of week (Saturday) or end of month
      if (currentWeek.length === 7) {
        weeks.push({ days: currentWeek, totals: { ...weekTotal } });
        currentWeek = [];
        weekTotal = { tipsOnCheck: 0, cashWalking: 0, pops: 0, hours: 0, shifts: 0 };
      }
    }

    // Add remaining days and empty cells
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push({ days: currentWeek, totals: { ...weekTotal } });
    }

    return weeks;
  }, [selectedYear, selectedMonth, tipsByDate]);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get selected day details
  const selectedDayData = selectedDay ? tipsByDate[selectedDay] : null;

  return (
    <div className="tip-calendar">
      <div className="calendar-header">
        <h2>📅 Calendar View</h2>
        <div className="month-nav">
          <button 
            onClick={() => setSelectedMonth(m => m > 0 ? m - 1 : 11)}
            className="nav-btn"
          >
            ◀
          </button>
          <span className="current-month">{monthNames[selectedMonth]} {selectedYear}</span>
          <button 
            onClick={() => setSelectedMonth(m => m < 11 ? m + 1 : 0)}
            className="nav-btn"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Day headers */}
        <div className="calendar-day-headers">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
          <div className="day-header week-total-header">Week Total</div>
        </div>

        {/* Calendar weeks */}
        {calendarData.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.days.map((dayData, dayIndex) => {
              const hasTips = dayData && dayData.tips && dayData.tips.length > 0;
              const isToday = dayData && dayData.date === todayStr;
              
              const handleDayClick = () => {
                if (!dayData) return;
                if (hasTips) {
                  setSelectedDay(dayData.date);
                } else if (onAddEntry) {
                  // Click on empty day to add new entry
                  onAddEntry(dayData.date);
                }
              };
              
              return (
                <button 
                  key={dayIndex} 
                  type="button"
                  className={`calendar-day ${!dayData ? 'empty' : ''} ${hasTips ? 'has-tips' : ''} ${selectedDay === dayData?.date ? 'selected' : ''} ${isToday ? 'is-today' : ''}`}
                  onClick={handleDayClick}
                  disabled={!dayData}
                  aria-label={dayData ? `${dayData.day}, ${hasTips ? `$${dayData.total.toFixed(0)} earned` : 'click to add entry'}` : ''}
                >
                  {dayData && (
                    <>
                      <span className="day-number">{dayData.day}</span>
                      {dayData.total > 0 && (
                        <span className="day-amount">${dayData.total.toFixed(0)}</span>
                      )}
                      {dayData.hours > 0 && (
                        <span className="day-hours">{dayData.hours.toFixed(1)}h</span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
            {/* Weekly totals column */}
            <div className="week-totals">
              {week.totals.shifts > 0 ? (
                <>
                  <div className="week-total-amount">
                    ${(week.totals.tipsOnCheck + week.totals.cashWalking).toFixed(0)}
                  </div>
                  <div className="week-total-detail">
                    {week.totals.shifts} shift{week.totals.shifts !== 1 ? 's' : ''}
                  </div>
                  {week.totals.hours > 0 && (
                    <div className="week-total-detail">
                      {week.totals.hours.toFixed(1)}h · ${((week.totals.tipsOnCheck + week.totals.cashWalking) / week.totals.hours).toFixed(0)}/hr
                    </div>
                  )}
                  {week.totals.pops > 0 && (
                    <div className="week-total-pops">🍿 ${week.totals.pops.toFixed(0)}</div>
                  )}
                </>
              ) : (
                <div className="week-total-empty">—</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected day details */}
      {selectedDayData && selectedDayData.length > 0 && (
        <div className="selected-day-details">
          <div className="details-header">
            <h3>
              {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button onClick={() => setSelectedDay(null)} className="close-btn">✕</button>
          </div>
          {selectedDayData.map((tip, index) => {
            const tipsOnCheck = parseFloat(tip.tipsOnCheck) || 0;
            const cashWalking = parseFloat(tip.cashWalking) || 0;
            const pops = parseFloat(tip.pops) || 0;
            const total = tipsOnCheck + cashWalking;
            const hours = calculateShiftDuration(tip.startTime, tip.endTime);
            const hourlyRate = hours > 0 ? total / hours : 0;

            // Inline editing mode
            if (editingTip && editingTip.id === tip.id) {
              return (
                <div key={tip.id} className="day-tip-detail editing">
                  <div className="inline-edit-form">
                    <div className="edit-row">
                      <input
                        type="time"
                        value={editingTip.startTime || ''}
                        onChange={(e) => setEditingTip({...editingTip, startTime: e.target.value})}
                        placeholder="Start"
                      />
                      <input
                        type="time"
                        value={editingTip.endTime || ''}
                        onChange={(e) => setEditingTip({...editingTip, endTime: e.target.value})}
                        placeholder="End"
                      />
                    </div>
                    <div className="edit-row">
                      <div className="edit-field">
                        <label>💳 Check</label>
                        <input
                          type="number"
                          value={editingTip.tipsOnCheck || ''}
                          onChange={(e) => setEditingTip({...editingTip, tipsOnCheck: e.target.value})}
                          step="0.01"
                          placeholder="0"
                        />
                      </div>
                      <div className="edit-field">
                        <label>💵 Cash</label>
                        <input
                          type="number"
                          value={editingTip.cashWalking || ''}
                          onChange={(e) => setEditingTip({...editingTip, cashWalking: e.target.value})}
                          step="0.01"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="edit-row">
                      <input
                        type="text"
                        value={editingTip.partners || ''}
                        onChange={(e) => setEditingTip({...editingTip, partners: e.target.value})}
                        placeholder="Partner(s)"
                      />
                    </div>
                    <div className="edit-row">
                      <div className="edit-field">
                        <label>🍿 Pops</label>
                        <input
                          type="number"
                          value={editingTip.pops || ''}
                          onChange={(e) => setEditingTip({...editingTip, pops: e.target.value})}
                          step="0.01"
                          placeholder="0"
                        />
                      </div>
                      <input
                        type="text"
                        value={editingTip.popsReason || ''}
                        onChange={(e) => setEditingTip({...editingTip, popsReason: e.target.value})}
                        placeholder="Pops reason"
                      />
                    </div>
                    <div className="edit-row">
                      <input
                        type="text"
                        value={editingTip.notes || ''}
                        onChange={(e) => setEditingTip({...editingTip, notes: e.target.value})}
                        placeholder="Notes"
                      />
                    </div>
                    <div className="edit-actions">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onEditTip(editingTip);
                          setEditingTip(null);
                        }}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingTip(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={tip.id} className="day-tip-detail">
                <div className="tip-detail-header">
                  <div className="tip-detail-row main">
                    <span className="tip-total">${total.toFixed(2)}</span>
                    {hourlyRate > 0 && <span className="tip-hourly">${hourlyRate.toFixed(2)}/hr</span>}
                  </div>
                  <div className="tip-detail-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => setEditingTip({...tip})}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => {
                        if (window.confirm('Delete this entry?')) {
                          onDeleteTip(tip.id);
                        }
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="tip-detail-row">
                  <span>💳 ${tipsOnCheck.toFixed(2)}</span>
                  <span>💵 ${cashWalking.toFixed(2)}</span>
                </div>
                {hours > 0 && (
                  <div className="tip-detail-row">
                    <span>⏱️ {tip.startTime} - {tip.endTime} ({hours.toFixed(1)}h)</span>
                  </div>
                )}
                {tip.partners && (
                  <div className="tip-detail-row">
                    <span>🤝 {tip.partners}</span>
                  </div>
                )}
                {pops > 0 && (
                  <div className="tip-detail-row pops">
                    <span>🍿 ${pops.toFixed(2)} {tip.popsReason && `- ${tip.popsReason}`}</span>
                  </div>
                )}
                {tip.notes && (
                  <div className="tip-detail-row notes">
                    <span>📝 {tip.notes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly summary */}
      <div className="monthly-summary">
        <h3>📊 {monthNames[selectedMonth]} Summary</h3>
        {(() => {
          const monthTips = yearTips.filter(tip => {
            const tipMonth = new Date(tip.date).getMonth();
            return tipMonth === selectedMonth;
          });
          
          if (monthTips.length === 0) {
            return <p className="no-data">No shifts recorded this month</p>;
          }

          let totalCheck = 0, totalCash = 0, totalPops = 0, totalHours = 0;
          monthTips.forEach(tip => {
            totalCheck += parseFloat(tip.tipsOnCheck) || 0;
            totalCash += parseFloat(tip.cashWalking) || 0;
            totalPops += parseFloat(tip.pops) || 0;
            totalHours += calculateShiftDuration(tip.startTime, tip.endTime);
          });
          const total = totalCheck + totalCash;
          const avgPerShift = total / monthTips.length;
          const avgHourly = totalHours > 0 ? total / totalHours : 0;

          return (
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Income</span>
                <span className="summary-value">${total.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Shifts</span>
                <span className="summary-value">{monthTips.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Avg per Shift</span>
                <span className="summary-value">${avgPerShift.toFixed(2)}</span>
              </div>
              {totalHours > 0 && (
                <>
                  <div className="summary-item">
                    <span className="summary-label">Total Hours</span>
                    <span className="summary-value">{totalHours.toFixed(1)}h</span>
                  </div>
                  <div className="summary-item highlight">
                    <span className="summary-label">Avg Hourly</span>
                    <span className="summary-value">${avgHourly.toFixed(2)}/hr</span>
                  </div>
                </>
              )}
              {totalPops > 0 && (
                <div className="summary-item pops">
                  <span className="summary-label">🍿 Pops</span>
                  <span className="summary-value">${totalPops.toFixed(2)}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default TipCalendar;
