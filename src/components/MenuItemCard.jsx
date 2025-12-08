import React, { useMemo } from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { TbLeaf } from "react-icons/tb";
import FlavorProfileDisplay from "./FlavorProfileDisplay.jsx";
import PairingSection from "./PairingSection.jsx";
import WinePairingDisplay from "./WinePairingDisplay.jsx";
import FoodPairingDisplay from "./FoodPairingDisplay.jsx";
import BeveragePairingDisplay from "./BeveragePairingDisplay.jsx";
import ItalianWineMap from "./ItalianWineMap.jsx";
import { usePairingData } from "../hooks/usePairingData.js";

function MenuItemCard({ item, pairingPreferences = null, isGlutenFilterActive = false }) {
  
  // Use custom hook for all pairing data calculations
  const {
    winePairings,
    foodPairings,
    afterDinnerPairings,
    beerPairings,
    bourbonPairings,
    whiskeyPairings,
    dessertPairings
  } = usePairingData(item, pairingPreferences);

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

      {item.region && item.category === "Italian Reds Bottles" && (
        <ItalianWineMap region={item.region} />
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
