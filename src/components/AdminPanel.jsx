import React, { useState } from "react";
import ingredientsData from "../data/ingredients.json";
import dinnerData from "../data/dinner.json";

function AdminPanel({ onLogout }) {
  // In a real app we would fetch and persist; here we keep local editable copies
  const [dinner, setDinner] = useState(dinnerData);
  const [ingredients] = useState(ingredientsData);
  const [editingItem, setEditingItem] = useState(null);

  const handleEditClick = (item) => {
    setEditingItem({ ...item });
  };

  const handleItemChange = (field, value) => {
    setEditingItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!editingItem) return;
    setDinner((prev) =>
      prev.map((i) => (i.id === editingItem.id ? editingItem : i))
    );
    setEditingItem(null);
  };

  return (
    <div className="page">
      <div className="admin-shell">
        <div className="admin-toolbar">
          <h1 className="menu-title">Admin Panel</h1>
          <button className="button secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
        <p className="menu-subtitle">
          Editing is in-memory only in this starter. Wire these up to a backend
          or CMS to persist JSON changes.
        </p>

        <section className="admin-section">
          <h2 className="menu-category-title">Dinner Items (sample)</h2>
          <p className="menu-item-description">
            Click an item to edit its name, description, price, flags and
            allergens.
          </p>
          <div className="admin-list">
            {dinner.map((item) => (
              <div key={item.id} className="admin-item-row">
                <span>
                  <strong>{item.name}</strong>
                  <span style={{ fontSize: "0.8rem", marginLeft: 4 }}>
                    (${item.price})
                  </span>
                </span>
                <button
                  className="button small secondary"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {editingItem && (
            <div style={{ marginTop: "0.75rem" }}>
              <h3 className="menu-category-title">Editing: {editingItem.name}</h3>
              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={editingItem.name}
                    onChange={(e) => handleItemChange("name", e.target.value)}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    value={editingItem.description}
                    onChange={(e) =>
                      handleItemChange("description", e.target.value)
                    }
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) =>
                      handleItemChange("price", Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Vegetarian
                  <input
                    type="checkbox"
                    checked={editingItem.vegetarian}
                    onChange={(e) =>
                      handleItemChange("vegetarian", e.target.checked)
                    }
                  />
                </label>
                <label>
                  Gluten-free
                  <input
                    type="checkbox"
                    checked={editingItem.glutenFree}
                    onChange={(e) =>
                      handleItemChange("glutenFree", e.target.checked)
                    }
                  />
                </label>
                <label>
                  Nut-free
                  <input
                    type="checkbox"
                    checked={editingItem.nutFree}
                    onChange={(e) =>
                      handleItemChange("nutFree", e.target.checked)
                    }
                  />
                </label>
                <label>
                  Kids item
                  <input
                    type="checkbox"
                    checked={editingItem.kids}
                    onChange={(e) =>
                      handleItemChange("kids", e.target.checked)
                    }
                  />
                </label>
                <label>
                  Allergens (comma separated)
                  <input
                    value={editingItem.allergens?.join(", ") || ""}
                    onChange={(e) =>
                      handleItemChange(
                        "allergens",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </label>
                <button className="button" onClick={handleSave}>
                  Save (local only)
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="admin-section">
          <h2 className="menu-category-title">Ingredients (read-only sample)</h2>
          <p className="menu-item-description">
            Global ingredient list with attached allergens. Extend this in a
            real CMS to drive automatic allergen tagging per dish.
          </p>
          <div className="admin-list">
            {ingredients.map((ing) => (
              <div key={ing.id} className="admin-item-row">
                <span>{ing.name}</span>
                <span style={{ fontSize: "0.8rem" }}>
                  Allergens:{" "}
                  {ing.allergens && ing.allergens.length > 0
                    ? ing.allergens.join(", ")
                    : "none"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
