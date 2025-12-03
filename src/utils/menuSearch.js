/**
 * Menu Search Utilities
 * Search across all menu items with category information
 */

/**
 * Build searchable index from all menu data
 * @param {Object} menuData - Object containing all menu categories
 * @returns {Array} Searchable items with category info
 */
export function buildSearchIndex(menuData) {
  const index = [];
  
  // Map categories to their routes
  const categoryRoutes = {
    dinner: '/dinner',
    lunch: '/lunch',
    dessert: '/dessert',
    kids: '/kids',
    drinks: '/drinks'
  };

  Object.entries(menuData).forEach(([category, items]) => {
    if (!items || !Array.isArray(items)) return;
    
    items.forEach(item => {
      index.push({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: category,
        route: categoryRoutes[category] || `/${category}`,
        type: item.type || '',
        tags: item.tags || [],
        allergens: item.allergens || [],
        price: item.price || '',
        item: item // Keep full item for reference
      });
    });
  });

  return index;
}

/**
 * Search the index for matching items
 * @param {Array} index - Search index
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Array} Matching items
 */
export function searchItems(index, query, limit = 10) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results = [];

  index.forEach(item => {
    let score = 0;
    const name = item.name.toLowerCase();
    const description = item.description.toLowerCase();
    const type = item.type.toLowerCase();
    const tags = item.tags.map(t => t.toLowerCase()).join(' ');

    // Exact name match (highest priority)
    if (name === searchTerm) {
      score += 100;
    }
    // Name starts with search term
    else if (name.startsWith(searchTerm)) {
      score += 50;
    }
    // Name contains search term
    else if (name.includes(searchTerm)) {
      score += 30;
    }

    // Description contains search term
    if (description.includes(searchTerm)) {
      score += 15;
    }

    // Type matches
    if (type.includes(searchTerm)) {
      score += 20;
    }

    // Tags match
    if (tags.includes(searchTerm)) {
      score += 10;
    }

    // Word boundary matches (whole words)
    const nameWords = name.split(/\s+/);
    const queryWords = searchTerm.split(/\s+/);
    
    queryWords.forEach(queryWord => {
      nameWords.forEach(nameWord => {
        if (nameWord === queryWord) {
          score += 25;
        } else if (nameWord.startsWith(queryWord)) {
          score += 15;
        }
      });
    });

    if (score > 0) {
      results.push({
        ...item,
        score
      });
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Return top results
  return results.slice(0, limit);
}

/**
 * Highlight matching text in a string
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {Array} Array of text segments with highlight flags
 */
export function highlightMatch(text, query) {
  if (!query || !text) return [{ text, highlight: false }];

  const searchTerm = query.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(searchTerm);

  if (index === -1) {
    return [{ text, highlight: false }];
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);

  return [
    { text: before, highlight: false },
    { text: match, highlight: true },
    { text: after, highlight: false }
  ].filter(segment => segment.text.length > 0);
}

/**
 * Get category display name
 * @param {string} category - Category key
 * @returns {string} Display name
 */
export function getCategoryDisplayName(category) {
  const names = {
    dinner: 'Dinner',
    lunch: 'Lunch',
    dessert: 'Dessert',
    kids: 'Kids Menu',
    drinks: 'Drinks'
  };
  return names[category] || category;
}

/**
 * Get category icon
 * @param {string} category - Category key
 * @returns {string} Emoji icon
 */
export function getCategoryIcon(category) {
  const icons = {
    dinner: '🍽️',
    lunch: '🥗',
    dessert: '🍰',
    kids: '👶',
    drinks: '🍷'
  };
  return icons[category] || '📋';
}
