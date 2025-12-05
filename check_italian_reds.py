import json

# Check Italian Reds by-the-glass
print('=== ITALIAN REDS (By-the-Glass) ===')
with open('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-italian-reds.json', 'r', encoding='utf-8') as f:
    btg_data = json.load(f)

print(f'Total wines: {len(btg_data)}')
for i, wine in enumerate(btg_data):
    notes = wine.get('serverNotes', '')
    has_emoji = any(e in notes for e in ['📖', '🌿', '👑', '🍇'])
    has_website = '(' in notes and ')' in notes
    has_sections = all(s in notes for s in ['ABOUT:', 'STYLE:', 'PAIRS WITH:'])
    length = len(notes)
    
    status = 'OK' if (has_emoji and has_website and has_sections and length > 300) else 'MISSING'
    print(f'{status} {wine["name"]}: {length} chars, emoji: {has_emoji}, website: {has_website}, sections: {has_sections}')

# Check Italian Reds bottles
print('\n=== ITALIAN REDS BOTTLES ===')
with open('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-italian-reds-bottles.json', 'r', encoding='utf-8') as f:
    bottle_data = json.load(f)

print(f'Total wines: {len(bottle_data)}')
for i, wine in enumerate(bottle_data):
    notes = wine.get('serverNotes', '')
    has_emoji = any(e in notes for e in ['📖', '🌿', '👑', '🍇', '🏆'])
    has_website = '(' in notes and ')' in notes
    has_sections = all(s in notes for s in ['ABOUT:', 'STYLE:', 'PAIRS WITH:'])
    length = len(notes)
    
    status = 'OK' if (has_emoji and has_website and has_sections and length > 300) else 'MISSING'
    print(f'{status} {wine["name"]}: {length} chars, emoji: {has_emoji}, website: {has_website}, sections: {has_sections}')

print('\n=== SUMMARY ===')
btg_complete = sum(1 for w in btg_data if len(w.get('serverNotes', '')) > 300 and any(e in w.get('serverNotes', '') for e in ['📖', '🌿', '👑', '🍇']))
bottle_complete = sum(1 for w in bottle_data if len(w.get('serverNotes', '')) > 300 and any(e in w.get('serverNotes', '') for e in ['📖', '🌿', '👑', '🍇', '🏆']))

print(f'By-the-glass: {btg_complete}/{len(btg_data)} complete')
print(f'Bottles: {bottle_complete}/{len(bottle_data)} complete')
print(f'Total: {btg_complete + bottle_complete}/{len(btg_data) + len(bottle_data)} complete')
