import React, { useState } from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { getMenuPairingSummary } from "../utils/enhancedPairing.js";
import drinks from "../data/drinks.json";

function MenuItemCard({ item }) {
  const [showPairings, setShowPairings] = useState(false);
  const tags = [];
  if (item.vegetarian) tags.push("Vegetarian");
  if (item.glutenFree) tags.push("Gluten-free");
  if (item.nutFree) tags.push("Nut-free");
  if (item.kids) tags.push("Kids");

  const allergenIcons = [];
  if (item.allergens?.includes("gluten")) allergenIcons.push(<GiWheat key="gluten" />);
  if (item.allergens?.includes("nuts")) allergenIcons.push(<GiPeanut key="nuts" />);
  if (item.allergens?.includes("dairy")) allergenIcons.push(<GiCow key="dairy" />);

  // Get dynamic pairings if item has flavor profile
  const pairings = item.flavorProfile ? getMenuPairingSummary(item, drinks) : null;

  return (
    <article className="menu-item-card">
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

      {item.serverNotes && (
        <div className="server-notes">
          <strong>Server Notes:</strong> {item.serverNotes}
        </div>
      )}

      {pairings && (
        <>
          <button 
            className="pairing-toggle-btn"
            onClick={() => setShowPairings(!showPairings)}
          >
            🍷 {showPairings ? 'Hide' : 'View'} Wine Pairings
          </button>

          {showPairings && (
            <div className="pairing-panel">
              {pairings.glass && (
                <div className="pairing-section">
                  <h4>By the Glass</h4>
                  <div className="pairing-item">
                    <span className="wine-name">{pairings.glass.name}</span>
                    <span className="wine-price">${pairings.glass.price}</span>
                    <span className={`match-badge ${pairings.glass.match.toLowerCase().replace(' ', '-')}`}>
                      {pairings.glass.match}
                    </span>
                  </div>
                </div>
              )}

              {(pairings.bottles?.budget || pairings.bottles?.premium || pairings.bottles?.luxury) && (
                <div className="pairing-section">
                  <h4>Bottle Recommendations</h4>
                  
                  {pairings.bottles.budget && (
                    <div className="bottle-rec">
                      <label>Budget-Friendly (Under $60)</label>
                      <div className="pairing-item">
                        <span className="wine-name">{pairings.bottles.budget.name}</span>
                        <span className="wine-price">${pairings.bottles.budget.price}</span>
                        <span className="match-badge">{pairings.bottles.budget.match}</span>
                      </div>
                    </div>
                  )}

                  {pairings.bottles.premium && (
                    <div className="bottle-rec">
                      <label>Premium ($60-$120)</label>
                      <div className="pairing-item">
                        <span className="wine-name">{pairings.bottles.premium.name}</span>
                        <span className="wine-price">${pairings.bottles.premium.price}</span>
                        <span className="match-badge">{pairings.bottles.premium.match}</span>
                      </div>
                    </div>
                  )}

                  {pairings.bottles.luxury && (
                    <div className="bottle-rec">
                      <label>Luxury ($120+)</label>
                      <div className="pairing-item">
                        <span className="wine-name">{pairings.bottles.luxury.name}</span>
                        <span className="wine-price">${pairings.bottles.luxury.price}</span>
                        <span className="match-badge">{pairings.bottles.luxury.match}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
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
