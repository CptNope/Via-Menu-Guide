import React, { useEffect, useRef, useState } from "react";
import "./MenuNav.css";
import { scrollToSettled } from "../utils/scrollSettle";

/**
 * Sticky navigation for a menu page.
 * - optional section tabs (drinks: Wine, Cocktails, ...)
 * - optional wine format toggle (By the glass, Bottles, ...)
 * - a scrollable row of category chips that follows the scroll position
 * - the Filters button
 */
export const anchorId = (group) => `category-${group.replace(/[^a-zA-Z0-9]/g, "-")}`;

function MenuNav({
  sections, activeSection, onSection,
  formats, activeFormat, onFormat, formatCounts,
  groups, onFiltersClick, filterCount, renderKey, onNeedAll,
}) {
  const barRef = useRef(null);
  const chipRowRef = useRef(null);
  const [current, setCurrent] = useState(groups[0]?.id);

  // Expose the bar's height so headings scroll to just below it.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    const set = () => document.documentElement.style.setProperty("--menu-nav-h", `${bar.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  // Highlight the chip for the heading currently at the top of the screen.
  useEffect(() => {
    const els = groups.map((g) => document.getElementById(anchorId(g.id))).filter(Boolean);
    if (!els.length) return undefined;
    const update = () => {
      const top = (barRef.current?.getBoundingClientRect().bottom || 0) + 24;
      let active = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= top) active = el.id;
      }
      const g = groups.find((x) => anchorId(x.id) === active);
      if (g) setCurrent(g.id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [groups, renderKey]);

  // Keep the active chip visible in its row without moving the page.
  useEffect(() => {
    const row = chipRowRef.current;
    const chip = row?.querySelector('[aria-current="true"]');
    if (row && chip) {
      const left = chip.offsetLeft - row.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2;
      row.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }, [current]);

  const jumpTo = (id, retried = false) => {
    const el = document.getElementById(anchorId(id));
    const section = el && el.querySelector('[id^="menu-item-"]');
    // Headings further down may not have their cards yet; render everything first
    if ((!el || !section) && !retried && onNeedAll) {
      onNeedAll();
      setTimeout(() => jumpTo(id, true), 80);
      return;
    }
    if (!el) return;
    const offset = (barRef.current?.offsetHeight || 0) + 8;
    scrollToSettled(() => document.getElementById(anchorId(id)), { offset });
    setCurrent(id);
  };


  return (
    <nav className="menu-nav" ref={barRef} aria-label="Menu sections">
      {sections && (
        <div className="menu-nav-tabs" role="tablist" aria-label="Drink sections">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === activeSection}
              className="menu-nav-tab"
              onClick={() => onSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {formats && (
        <div className="menu-nav-formats" role="radiogroup" aria-label="Wine format">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={f.id === activeFormat}
              aria-label={`${f.label}${formatCounts ? `, ${formatCounts[f.id] || 0}` : ""}`}
              className="menu-nav-format"
              onClick={() => onFormat(f.id)}
            >
              {f.short || f.label}
              {formatCounts && <span className="count">{formatCounts[f.id] || 0}</span>}
            </button>
          ))}
        </div>
      )}

      <div className="menu-nav-row">
        <button
          type="button"
          className={`menu-nav-filter${filterCount ? " is-on" : ""}`}
          onClick={onFiltersClick}
          aria-label={filterCount ? `Filters, ${filterCount} on` : "Filters"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18M6 12h12M10 19h4" /></svg>
          <span>Filters</span>
          {filterCount > 0 && <span className="badge">{filterCount}</span>}
        </button>
        <div className="menu-nav-chips" ref={chipRowRef}>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className="menu-nav-chip"
              aria-current={g.id === current ? "true" : undefined}
              onClick={() => jumpTo(g.id)}
            >
              {g.label}
              <span className="count">{g.count}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default MenuNav;
