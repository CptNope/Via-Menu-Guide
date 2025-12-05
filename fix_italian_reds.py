import json

# Load the file
with open('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-italian-reds-bottles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'Total wines: {len(data)}')

# Check for issues
issues = []
for i, wine in enumerate(data):
    notes = wine.get('serverNotes', '')
    has_escaped = '\\n' in notes
    is_short = len(notes) < 200
    missing_emoji = not any(e in notes for e in ['📖', '🌿', '👑', '🍇', '🏆'])
    
    if has_escaped or is_short or missing_emoji:
        issues.append({
            'index': i,
            'name': wine['name'],
            'length': len(notes),
            'has_escaped': has_escaped,
            'missing_emoji': missing_emoji
        })

print(f'\nWines with issues: {len(issues)}')
for issue in issues:
    print(f"{issue['index']}: {issue['name']}")
    print(f"  - Length: {issue['length']}, Escaped: {issue['has_escaped']}, Missing emoji: {issue['missing_emoji']}")

# Fix escaped newlines
for wine in data:
    if 'serverNotes' in wine:
        wine['serverNotes'] = wine['serverNotes'].replace('\\n', '\n')

# Save the fixed file
with open('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-italian-reds-bottles.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('\n✅ Fixed escaped newlines!')
