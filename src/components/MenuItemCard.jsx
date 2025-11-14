import React from "react";
import { GiWheat, GiPeanut, GiCow } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";

function MenuItemCard({ item }) {
  const tags = [];
  if (item.vegetarian) tags.push("Vegetarian");
  if (item.glutenFree) tags.push("Gluten-free");
  if (item.nutFree) tags.push("Nut-free");
  if (item.kids) tags.push("Kids");

  const allergenIcons = [];
  if (item.allergens?.includes("gluten")) allergenIcons.push(<GiWheat key="gluten" />);
  if (item.allergens?.includes("nuts")) allergenIcons.push(<GiPeanut key="nuts" />);
  if (item.allergens?.includes("dairy")) allergenIcons.push(<GiCow key="dairy" />);

  return (
    <article className="menu-item-card">
      <div className="menu-item-header">
        <div className="menu-item-name">{item.name}</div>
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
