import React, { useMemo, useState } from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { TbLeaf } from "react-icons/tb";
import FlavorProfileDisplay from "./FlavorProfileDisplay.jsx";
import PairingSection from "./PairingSection.jsx";
import WinePairingDisplay from "./WinePairingDisplay.jsx";
import FoodPairingDisplay from "./FoodPairingDisplay.jsx";
import BeveragePairingDisplay from "./BeveragePairingDisplay.jsx";
import ItalianWineMapInteractive from "./ItalianWineMapInteractive.jsx";
import { usePairingData } from "../hooks/usePairingData.js";

function MenuItemCard({ item, pairingPreferences = null, isGlutenFilterActive = false }) {
  
  // State for sauce selection (for pasta & sauce items)
  const [selectedSauce, setSelectedSauce] = useState(
    item.hasSauceSelection && item.sauceOptions?.length > 0 ? item.sauceOptions[0] : null
  );

  // Create modified item with selected sauce's flavor profile for pairings
  const itemForPairing = useMemo(() => {
    if (item.hasSauceSelection && selectedSauce?.flavorProfile) {
      return { ...item, flavorProfile: selectedSauce.flavorProfile };
    }
    return item;
  }, [item, selectedSauce]);

  // Use custom hook for all pairing data calculations
  const {
    winePairings,
    foodPairings,
    afterDinnerPairings,
    beerPairings,
    bourbonPairings,
    whiskeyPairings,
    dessertPairings
  } = usePairingData(itemForPairing, pairingPreferences);

  // Memoize tags array to avoid recreation on every render
  const tags = useMemo(() => {
    const tagList = [];
    if (item.vegetarian) tagList.push("Vegetarian");
    if (item.glutenFree) tagList.push("Gluten-free");
    if (item.canBeMadeGlutenFree) tagList.push("Can be made GF");
    if (item.glutenFreeAvailable) tagList.push("GF option available");
    if (item.nutFree) tagList.push("Nut-free");
    if (item.kids) tagList.push("Kids");
    return tagList;
  }, [item.vegetarian, item.glutenFree, item.canBeMadeGlutenFree, item.glutenFreeAvailable, item.nutFree, item.kids]);

  // Memoize allergen icons
  const allergenIcons = useMemo(() => {
    const icons = [];
    if (item.allergens?.includes("gluten")) icons.push(<GiWheat key="gluten" />);
    if (item.allergens?.includes("nuts")) icons.push(<GiPeanut key="nuts" />);
    if (item.allergens?.includes("dairy")) icons.push(<GiCow key="dairy" />);
    return icons;
  }, [item.allergens]);

  return (
    <article 
      className={`menu-item-card ${(item.canBeMadeGlutenFree || item.glutenFreeAvailable) && isGlutenFilterActive ? 'can-be-gf-active' : ''}`} 
      id={`menu-item-${item.id}`}
    >
      {item.canBeMadeGlutenFree && isGlutenFilterActive && (
        <div className="gf-modification-banner">
          ⚠️ Can be made gluten-free upon request — 
          {item.id.includes('pizzette') 
            ? ' Substitute cauliflower-parm crust' 
            : item.id.includes('chicken-parmesan') || item.id.includes('eggplant-parmesan') || item.id.includes('meatball')
            ? ' Substitute GF penne & GF breading'
            : item.id.includes('orzo-soup')
            ? ' Hold the orzo'
            : item.id.includes('caesar')
            ? ' Hold the croutons'
            : item.id.includes('ricotta') || item.id.includes('charcuterie')
            ? ' Substitute cucumber slices for bread'
            : ' Substitute GF penne'}
        </div>
      )}
      {item.glutenFreeAvailable && isGlutenFilterActive && (
        <div className="gf-modification-banner">
          ⚠️ Gluten-free option available — 
          {item.glutenFreeCrust && ` Substitute ${item.glutenFreeCrust} crust`}
          {item.glutenFreeUpcharge > 0 && ` (+$${item.glutenFreeUpcharge.toFixed(2)})`}
        </div>
      )}
      <div className="menu-item-header">
        <div className="menu-item-name">
          {item.name}
          {item.pronunciation && (
            <span className="pronunciation"> ({item.pronunciation})</span>
          )}
        </div>
        <div className="menu-item-price">
          {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price}
        </div>
      </div>
      {item.description && (
        <p className="menu-item-description">{item.description}</p>
      )}

      {/* Sauce Selection for Pasta & Sauce items */}
      {item.hasSauceSelection && item.sauceOptions && (
        <div className="sauce-selection">
          <div className="sauce-selection-label">
            <strong>🍝 Select Your Sauce for Pairings:</strong>
          </div>
          <div className="sauce-options">
            {item.sauceOptions.map((sauce) => (
              <button
                key={sauce.name}
                className={`sauce-option-btn ${selectedSauce?.name === sauce.name ? 'selected' : ''}`}
                onClick={() => setSelectedSauce(sauce)}
              >
                <span className="sauce-name">{sauce.name}</span>
                <span className="sauce-desc">{sauce.description}</span>
              </button>
            ))}
          </div>
          {selectedSauce && (
            <div className="selected-sauce-info">
              <em>Showing pairings for: <strong>{selectedSauce.name}</strong> sauce</em>
              {selectedSauce.allergens?.length > 0 && (
                <span className="sauce-allergens"> (Contains: {selectedSauce.allergens.join(', ')})</span>
              )}
            </div>
          )}
        </div>
      )}

      {item.region && (item.category === "Italian Reds Bottles" || item.category === "Super Tuscan Bottles") && (
        <ItalianWineMapInteractive wine={item} />
      )}

      {item.serverNotes && (
        <div className="server-notes">
          <strong>Server Notes:</strong>{' '}
          {item.serverNotes.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < item.serverNotes.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Brewery/Winery Website Link */}
      {item.website && (
        <div className="website-link">
          <strong>🔗 Website:</strong>{' '}
          <a href={item.website} target="_blank" rel="noopener noreferrer">
            {item.website.replace('https://', '').replace('http://', '').replace('www.', '')}
          </a>
        </div>
      )}

      {/* Garnish Information for Cocktails */}
      {item.garnish && (
        <div className="garnish-info">
          <strong>🍋 Garnish:</strong> {item.garnish}
        </div>
      )}

      {/* Standalone Flavor Profile - Available for all items */}
      {item.flavorProfile && (
        <div className="standalone-flavor-profile">
          <FlavorProfileDisplay 
            flavorProfile={item.flavorProfile}
            title="Flavor Profile"
          />
        </div>
      )}

      {/* Wine Pairings for Food Items */}
      {foodPairings && (
        <PairingSection icon="🍷" label="Wine Pairings">
          <WinePairingDisplay pairings={foodPairings} />
        </PairingSection>
      )}

      {/* Food Pairings for Wines (by glass/bottle) and After-Dinner Drinks */}
      {winePairings && (
        <PairingSection icon="🍽️" label="Food Pairings">
          <FoodPairingDisplay pairings={winePairings} />
        </PairingSection>
      )}

      {/* Beer Pairings for Appetizers & Pizzas */}
      {beerPairings && (
        <PairingSection icon="🍺" label="Beer Pairings" buttonClass="beer-btn">
          <BeveragePairingDisplay 
            pairings={beerPairings} 
            title="🍺 Top Beer Pairings"
          />
        </PairingSection>
      )}

      {/* Bourbon/Whiskey Pairings for Appetizers & Pizzas */}
      {bourbonPairings && (
        <PairingSection icon="🥃" label="Bourbon & Whiskey Pairings" buttonClass="bourbon-btn">
          <BeveragePairingDisplay 
            pairings={bourbonPairings} 
            title="🥃 Top Bourbon & Whiskey Pairings"
          />
        </PairingSection>
      )}

      {/* After-Dinner Drink Pairings for Desserts */}
      {afterDinnerPairings && (
        <PairingSection icon="☕" label="After-Dinner Drink Pairings" buttonClass="after-dinner-btn">
          <BeveragePairingDisplay 
            pairings={afterDinnerPairings} 
            title="☕ Top After-Dinner Drink Pairings"
          />
        </PairingSection>
      )}

      {/* Whiskey Pairings for Desserts & Beers */}
      {whiskeyPairings && (
        <PairingSection icon="🥃" label="Whiskey Pairings" buttonClass="bourbon-btn">
          <BeveragePairingDisplay 
            pairings={whiskeyPairings} 
            title="🥃 Top Whiskey Pairings"
          />
        </PairingSection>
      )}

      {/* Dessert Pairings for After-Dinner Drinks & Whiskeys */}
      {dessertPairings && (
        <PairingSection icon="🍰" label="Dessert Pairings">
          <BeveragePairingDisplay 
            pairings={dessertPairings} 
            title="🍰 Top Dessert Pairings"
            nameField="foodName"
            priceField="foodPrice"
          />
        </PairingSection>
      )}

      <div className="menu-item-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag === "Vegetarian" && <TbLeaf />} {tag}
          </span>
        ))}
        {item.allergens &&
          item.allergens.length > 0 &&
          item.allergens.map((a) => (
            <span key={a} className="tag-pill danger">
              {a}
            </span>
          ))}
        {allergenIcons.length > 0 && (
          <span className="tag-pill danger">{allergenIcons}</span>
        )}
      </div>
    </article>
  );
}

export default MenuItemCard;
