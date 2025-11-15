/**
 * Pairing Algorithm Demo
 * 
 * Demonstrates how to use the pairing algorithm with your menu data
 */

import { findPairings, findFoodPairings } from './pairingAlgorithm.js';

/**
 * Example: Find wine pairings for a specific appetizer
 */
export function demonstrateFoodToDrink() {
  // Example appetizer: Fried Calamari
  const friedCalamari = {
    id: "fried-calamari",
    name: "Fried Calamari",
    price: 16.99,
    category: "Appetizers",
    flavorProfile: {
      sweetness: 2,
      acidity: 6,
      body: "light",
      spiciness: 4,
      saltiness: 5,
      richness: 5,
      umami: 5,
      bitterness: 0,
      flavorNotes: ["crispy", "bright", "spicy", "fried"]
    }
  };

  // Example wines
  const wines = [
    {
      id: "matua-sauvignon-blanc",
      name: "Matua Sauvignon Blanc",
      price: 12,
      category: "Sauvignon Blanc",
      flavorProfile: {
        sweetness: 1,
        acidity: 9,
        body: "light",
        spiciness: 0,
        saltiness: 0,
        richness: 2,
        umami: 1,
        bitterness: 1,
        tannin: 0,
        alcohol: 6,
        carbonation: 0,
        flavorNotes: ["grapefruit", "passion-fruit", "grass", "crisp"]
      }
    },
    {
      id: "pasqua-prosecco",
      name: "Pasqua Prosecco",
      price: 13,
      category: "Sparkling",
      flavorProfile: {
        sweetness: 2,
        acidity: 8,
        body: "light",
        spiciness: 0,
        saltiness: 0,
        richness: 2,
        umami: 0,
        bitterness: 0,
        tannin: 0,
        alcohol: 5,
        carbonation: 8,
        flavorNotes: ["green-apple", "pear", "citrus", "crisp"]
      }
    },
    {
      id: "band-of-vintners",
      name: "Band of Vintners Cabernet",
      price: 15,
      category: "Cabernet & Blends",
      flavorProfile: {
        sweetness: 1,
        acidity: 5,
        body: "full",
        spiciness: 0,
        saltiness: 0,
        richness: 8,
        umami: 6,
        bitterness: 2,
        tannin: 8,
        alcohol: 7,
        carbonation: 0,
        flavorNotes: ["blackberry", "cassis", "oak", "structured"]
      }
    }
  ];

  const pairings = findPairings(friedCalamari, wines, 3);
  
  console.log('\n=== FRIED CALAMARI WINE PAIRINGS ===\n');
  pairings.forEach((pairing, index) => {
    console.log(`${index + 1}. ${pairing.drinkName} (${pairing.compatibility})`);
    console.log(`   Score: ${pairing.score}/100`);
    console.log(`   Price: $${pairing.drinkPrice}`);
    console.log(`   Why: ${pairing.explanation}`);
    console.log('');
  });

  return pairings;
}

/**
 * Example: Find food pairings for a specific wine
 */
export function demonstrateDrinkToFood() {
  // Example wine: Barolo
  const barolo = {
    id: "ascher-barolo",
    name: "Ascher Barolo",
    price: 15,
    category: "Italian Reds",
    flavorProfile: {
      sweetness: 1,
      acidity: 8,
      body: "full",
      spiciness: 0,
      saltiness: 0,
      richness: 7,
      umami: 7,
      bitterness: 3,
      tannin: 9,
      alcohol: 7,
      carbonation: 0,
      flavorNotes: ["rose", "tar", "dark-cherry", "truffle", "complex"]
    }
  };

  // Example foods
  const foods = [
    {
      id: "truffle-frites-parmigiano",
      name: "Truffle Frites with Parmigiano",
      price: 12.99,
      category: "Appetizers",
      flavorProfile: {
        sweetness: 1,
        acidity: 1,
        body: "medium",
        spiciness: 0,
        saltiness: 6,
        richness: 7,
        umami: 8,
        bitterness: 0,
        flavorNotes: ["earthy", "truffle", "rich", "luxurious"]
      }
    },
    {
      id: "pan-seared-octopus-sausage",
      name: "Pan Seared Octopus & Sausage",
      price: 18.99,
      category: "Appetizers",
      flavorProfile: {
        sweetness: 2,
        acidity: 4,
        body: "full",
        spiciness: 3,
        saltiness: 6,
        richness: 8,
        umami: 9,
        bitterness: 1,
        flavorNotes: ["bold", "sophisticated", "meaty", "creamy"]
      }
    },
    {
      id: "house-made-ricotta",
      name: "House Made Ricotta",
      price: 14.99,
      category: "Appetizers",
      flavorProfile: {
        sweetness: 6,
        acidity: 2,
        body: "medium",
        spiciness: 0,
        saltiness: 3,
        richness: 6,
        umami: 2,
        bitterness: 0,
        flavorNotes: ["creamy", "sweet", "simple", "elegant"]
      }
    }
  ];

  const pairings = findFoodPairings(barolo, foods, 3);
  
  console.log('\n=== BAROLO FOOD PAIRINGS ===\n');
  pairings.forEach((pairing, index) => {
    console.log(`${index + 1}. ${pairing.foodName} (${pairing.compatibility})`);
    console.log(`   Score: ${pairing.score}/100`);
    console.log(`   Price: $${pairing.foodPrice}`);
    console.log(`   Why: ${pairing.explanation}`);
    console.log('');
  });

  return pairings;
}

/**
 * Integrate with your app - example React component usage
 */
export function integrationExample() {
  const example = `
// Example React Component Usage:

import React, { useState, useEffect } from 'react';
import { findPairings } from './utils/pairingAlgorithm';
import appetizers from './data/appetizers.json';
import drinks from './data/drinks.json';

function MenuItemWithPairings({ item }) {
  const [pairings, setPairings] = useState([]);

  useEffect(() => {
    if (item.flavorProfile) {
      // Filter to wines by the glass only
      const winesByGlass = drinks.filter(d => 
        ['Italian Reds', 'Super Tuscan', 'Merlot & Malbec', 
         'Organic Pinot Noir', 'Cabernet & Blends', 'Sauvignon Blanc', 
         'Chardonnay', 'Interesting Whites', 'Sparkling'].includes(d.category)
      );
      
      const recommendations = findPairings(item, winesByGlass, 3);
      setPairings(recommendations);
    }
  }, [item]);

  return (
    <div className="menu-item">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p className="price">$\{item.price}</p>
      
      {pairings.length > 0 && (
        <div className="wine-pairings">
          <h4>🍷 Recommended Pairings</h4>
          {pairings.map(pairing => (
            <div key={pairing.drinkId} className="pairing">
              <div className="pairing-header">
                <span className="wine-name">{pairing.drinkName}</span>
                <span className="compatibility">{pairing.compatibility}</span>
              </div>
              <p className="explanation">{pairing.explanation}</p>
              <p className="price">$\{pairing.drinkPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuItemWithPairings;
`;
  return example;
}

// Run demos if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running Pairing Algorithm Demonstrations...\n');
  demonstrateFoodToDrink();
  demonstrateDrinkToFood();
  console.log('\n=== INTEGRATION EXAMPLE ===');
  console.log(integrationExample());
}
