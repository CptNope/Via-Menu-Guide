import json
import re

# Load the file
with open('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-italian-reds.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Wine websites
websites = {
    '"Rosina" Barbera D\'Asti by Garetto': 'garettovini.it',
    'San Felice Chianti Classico': 'agricolasanfelice.it',
    'Bussola Valpolicella Ripasso': 'bussola.eu',
    'Caparzo Brunello di Montalcino': 'caparzo.com'
}

# Fix each wine
for wine in data:
    if wine['name'] in websites:
        notes = wine['serverNotes']
        website = websites[wine['name']]
        
        # Check if website is already in notes
        if f'({website})' not in notes:
            # Add website after ABOUT: emoji
            notes = re.sub(
                r'(📖|🌿|👑|🍇) ABOUT:',
                f'\\1 ABOUT: ({website})',
                notes
            )
            wine['serverNotes'] = notes
            print(f'Added website to: {wine["name"]}')

# Save the file
with open('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-italian-reds.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('\nFixed Italian Reds by-the-glass!')
