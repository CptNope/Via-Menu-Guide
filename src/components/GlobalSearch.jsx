import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import './GlobalSearch.css';
import {
  buildSearchIndex,
  searchItems,
  highlightMatch,
  getCategoryDisplayName,
  getCategoryIcon
} from '../utils/menuSearch';

/**
 * Global search component with autocomplete
 */
function GlobalSearch({ menuData }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState([]);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Build search index when menu data changes
  useEffect(() => {
    if (menuData) {
      const index = buildSearchIndex(menuData);
      setSearchIndex(index);
    }
  }, [menuData]);

  // Handle search query changes
  useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults = searchItems(searchIndex, query, 8);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, searchIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setQuery('');
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectItem(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Handle item selection
  const handleSelectItem = (item) => {
    // Navigate to the category page
    navigate(item.route);
    
    // Scroll to the item after a brief delay
    setTimeout(() => {
      const element = document.getElementById(`menu-item-${item.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Briefly highlight the item
        element.classList.add('highlight-flash');
        setTimeout(() => {
          element.classList.remove('highlight-flash');
        }, 2000);
      }
    }, 100);

    // Close search and clear
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="global-search" ref={searchRef}>
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search menu items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button 
            className="search-clear" 
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          <div className="search-results">
            {results.map((result, index) => {
              const nameSegments = highlightMatch(result.name, query);
              
              return (
                <button
                  key={result.id}
                  className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectItem(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="result-icon">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="result-content">
                    <div className="result-name">
                      {nameSegments.map((segment, i) => (
                        <span 
                          key={i} 
                          className={segment.highlight ? 'highlight' : ''}
                        >
                          {segment.text}
                        </span>
                      ))}
                    </div>
                    <div className="result-meta">
                      <span className="result-category">
                        {getCategoryDisplayName(result.category)}
                      </span>
                      {result.type && (
                        <>
                          <span className="result-separator">•</span>
                          <span className="result-type">{result.type}</span>
                        </>
                      )}
                      {result.price && (
                        <>
                          <span className="result-separator">•</span>
                          <span className="result-price">{result.price}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="search-footer">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
