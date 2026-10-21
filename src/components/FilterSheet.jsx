import React, { useEffect, useRef } from "react";
import PairingControls from "./PairingControls";
import "./FilterSheet.css";

export const SHOW_ONLY = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "glutenFree", label: "Gluten-free or can be" },
  { key: "kids", label: "Kid-friendly" },
];

export const AVOID = [
  { key: "nutFree", label: "Nuts" },
  { key: "dairyFree", label: "Dairy" },
  { key: "shellfishFree", label: "Shellfish" },
  { key: "fishFree", label: "Fish" },
  { key: "eggFree", label: "Eggs" },
  { key: "soyFree", label: "Soy" },
];

export const EMPTY_FILTERS = Object.fromEntries([...SHOW_ONLY, ...AVOID].map((f) => [f.key, false]));

/** Short label for an active filter, used in the summary chips. */
export function filterLabel(key) {
  const s = SHOW_ONLY.find((f) => f.key === key);
  if (s) return s.key === "glutenFree" ? "Gluten-free" : s.label;
  const a = AVOID.find((f) => f.key === key);
  return a ? `No ${a.label.toLowerCase()}` : key;
}

function Toggle({ on, label, onClick }) {
  return (
    <button type="button" className="fs-toggle" aria-pressed={on} onClick={onClick}>
      <span className="fs-check" aria-hidden="true">
        {on && <svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" /></svg>}
      </span>
      {label}
    </button>
  );
}

function FilterSheet({
  open, onClose, filters, onChange, resultCount,
  showKidsFilter = true, pairingPreferences, onPairingChange,
}) {
  const sheetRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  const toggle = (key) => onChange({ ...filters, [key]: !filters[key] });
  const anyOn = Object.values(filters).some(Boolean);
  const showOnly = showKidsFilter ? SHOW_ONLY : SHOW_ONLY.filter((f) => f.key !== "kids");

  return (
    <div className="fs-backdrop" onClick={onClose}>
      <div
        className="fs-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fs-title"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fs-head">
          <h2 id="fs-title">Filters</h2>
          {anyOn && (
            <button type="button" className="fs-link" onClick={() => onChange({ ...filters, ...EMPTY_FILTERS })}>
              Clear all
            </button>
          )}
          <button type="button" className="fs-close" onClick={onClose} ref={closeRef} aria-label="Close filters">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="fs-body">
          <section className="fs-group">
            <h3>Show only</h3>
            <div className="fs-toggles">
              {showOnly.map((f) => (
                <Toggle key={f.key} on={!!filters[f.key]} label={f.label} onClick={() => toggle(f.key)} />
              ))}
            </div>
          </section>

          <section className="fs-group">
            <h3>Leave out anything with</h3>
            <div className="fs-toggles">
              {AVOID.map((f) => (
                <Toggle key={f.key} on={!!filters[f.key]} label={f.label} onClick={() => toggle(f.key)} />
              ))}
            </div>
            <p className="fs-note">Allergen info is a guide. Always confirm allergies with the kitchen.</p>
          </section>

          {pairingPreferences && (
            <details className="fs-group fs-pairing">
              <summary>Pairing settings</summary>
              <PairingControls preferences={pairingPreferences} onChange={onPairingChange} />
            </details>
          )}
        </div>

        <div className="fs-foot">
          <button type="button" className="fs-done" onClick={onClose}>
            {resultCount === 1 ? "Show 1 item" : `Show ${resultCount} items`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterSheet;
