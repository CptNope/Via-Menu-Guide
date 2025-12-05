import json
import glob

# Get all drink JSON files
files = glob.glob('c:/Users/jca20/Desktop/Via-Menu-Guide/src/data/drinks-*.json')

print(f'Found {len(files)} drink files\n')

fixed_count = 0

for filepath in files:
    try:
        # Load the file
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Ensure data is a list
        if not isinstance(data, list):
            print(f'Skipping {filepath} - not a list')
            continue
        
        # Check and fix escaped newlines
        modified = False
        for item in data:
            if 'serverNotes' in item and '\\n' in item['serverNotes']:
                item['serverNotes'] = item['serverNotes'].replace('\\n', '\n')
                modified = True
        
        # Save if modified
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            filename = filepath.split('/')[-1]
            print(f'Fixed: {filename}')
            fixed_count += 1
    
    except Exception as e:
        filename = filepath.split('/')[-1]
        print(f'Error with {filename}: {e}')

print(f'\nFixed {fixed_count} files with escaped newlines')
