# 💰 Tip Tracker Feature

## Overview

The Tip Tracker is a comprehensive tool for servers to track their earnings, including cash tips, credit tips, and partner exchanges across multiple years.

## Features

### 📊 Summary Dashboard
- **Total Tips**: Combined cash and credit tips
- **Partner Exchange**: Net sent/received with partners
- **Net Income**: Total earnings after exchanges
- Visual cards with color-coded indicators

### 📝 Tip Entry Tracking
- **Date**: When you worked
- **Cash Tips**: Tips received in cash
- **Credit Tips**: Tips received via credit cards
- **Partner Name**: Who you worked with
- **Sent to Partner**: Money you gave to your partner
- **Received from Partner**: Money your partner gave you
- **Notes**: Any additional details about the shift

### 📅 Filtering & Organization
- **Filter by Year**: View tips for specific years
- **Filter by Partner**: See earnings with specific partners
- **Chronological Display**: Most recent entries first
- **Multi-Year Support**: Track tips across multiple years

### 💾 Data Management
- **Local Storage**: Data saved in your browser
- **Export**: Download your data as JSON file
- **Import**: Upload previously exported data
- **Clear All**: Remove all data (with double confirmation)

## How to Use

### Adding a New Entry

1. Click **"+ Add Entry"** button
2. Fill in the form:
   - **Date**: Select the date you worked
   - **Partner**: Enter partner's name (autocompletes from history)
   - **Cash Tips**: Amount received in cash
   - **Credit Tips**: Amount received via credit
   - **Sent to Partner**: Amount you gave to partner
   - **Received from Partner**: Amount you received from partner
   - **Notes**: Any additional information
3. Click **"Add Entry"**

The form automatically calculates:
- Total tips (cash + credit)
- Net exchange (received - sent)
- Net income (total tips + net exchange)

### Viewing Your Tips

**Summary Cards** at the top show:
- 💵 **Total Tips**: All tips earned in selected period
- 🤝 **Partner Exchange**: Net amount from partner transactions
- 💰 **Net Income**: Your actual take-home earnings

**Tip Entries** below show:
- Date and partner for each shift
- Breakdown of cash vs credit tips
- Partner exchange details
- Net income for each shift
- Any notes you added

### Editing an Entry

1. Click the ✏️ **Edit** icon on any entry
2. Modify the fields
3. Click **"Update Entry"**

### Deleting an Entry

1. Click the 🗑️ **Delete** icon on any entry
2. Confirm deletion

### Filtering Data

**By Year:**
- Use the year dropdown to view specific years
- Summary updates automatically

**By Partner:**
- Select a partner from the dropdown
- See only shifts with that partner
- Summary shows totals for that partner

### Exporting Your Data

1. Click **"📥 Export"** button
2. JSON file downloads with format: `tips-[year].json`
3. Save this file as a backup

### Importing Data

1. Click **"📤 Import"** button
2. Select a previously exported JSON file
3. Data is merged with existing entries

### Clearing All Data

⚠️ **Warning**: This is permanent and cannot be undone

1. Scroll to bottom of page
2. Click **"⚠️ Clear All Data"**
3. Confirm twice

## Data Structure

Each tip entry contains:

```json
{
  "id": "1701620400000",
  "date": "2024-12-03",
  "cashTips": "45.50",
  "creditTips": "123.25",
  "partner": "John Smith",
  "sentToPartner": "20.00",
  "receivedFromPartner": "35.00",
  "notes": "Busy Saturday night",
  "createdAt": "2024-12-03T10:00:00.000Z"
}
```

## Calculations

### Total Tips
```
Total Tips = Cash Tips + Credit Tips
```

### Net Exchange
```
Net Exchange = Received from Partner - Sent to Partner
```
- Positive value (green): You received more than you sent
- Negative value (red): You sent more than you received

### Net Income
```
Net Income = Total Tips + Net Exchange
```
This is your actual take-home amount for the shift.

## Use Cases

### Tracking Daily Earnings
Add an entry after each shift to track your daily earnings and see immediate totals.

### Partner Settlements
Record money exchanges with partners to keep accurate records of who owes whom.

### Year-End Tax Prep
Export your data at end of year for tax preparation. Shows total cash vs credit income.

### Performance Analysis
Compare earnings:
- Across different years
- With different partners
- By time periods

### Budgeting
Use summary data to:
- Calculate average daily/weekly earnings
- Budget monthly expenses
- Track income trends

## Tips for Best Results

### Consistent Entry
- Add entries daily or immediately after shifts
- Don't wait too long or you might forget details

### Accurate Amounts
- Be precise with dollar amounts
- Round to nearest cent

### Partner Names
- Use consistent spelling for partner names
- Autocomplete helps with this

### Notes
- Add context that might be helpful later
- Example: "Friday dinner rush" or "Private party"

### Regular Backups
- Export data monthly
- Store backups in cloud storage or email to yourself
- Helps prevent data loss

### Year-End Procedure
1. Export data for the year
2. Save in multiple locations
3. Use for tax preparation
4. Start fresh next year or keep accumulating

## Privacy & Security

- **Local Storage**: All data stays in your browser
- **No Server**: Nothing is sent to external servers
- **No Account**: No login required, no passwords
- **Your Device Only**: Data only accessible on device you're using
- **Clear History**: Use browser's "Clear Site Data" to remove everything

## Troubleshooting

### Data Not Saving
- Check browser storage permissions
- Try a different browser
- Clear browser cache and try again

### Can't See Old Entries
- Check year filter is set correctly
- Check partner filter isn't excluding entries

### Export Not Working
- Check browser download permissions
- Try different browser
- Use "Save As" if download doesn't start

### Import Failed
- Verify file is JSON format
- Check file isn't corrupted
- Try exporting again from source

## Mobile Use

The tip tracker is fully responsive and works great on mobile:
- Forms adapt to smaller screens
- Easy touch-friendly buttons
- Cards stack vertically
- All features available

## Future Enhancements

Potential additions:
- Charts and graphs
- Average calculations
- Tax estimation
- CSV export
- Print-friendly view
- Shift duration tracking
- Tips per hour calculation

## Support

For issues or questions:
- Check this guide first
- Contact restaurant management
- Check browser console for errors

## Quick Start Example

1. Navigate to **Tips** in menu
2. Click **"+ Add Entry"**
3. Fill in:
   - Date: Today
   - Partner: "Sarah"
   - Cash Tips: $50.00
   - Credit Tips: $150.00
   - Received from Partner: $25.00
4. Click **"Add Entry"**
5. See your entry appear with Net Income: $225.00

That's it! You're tracking tips! 🎉
