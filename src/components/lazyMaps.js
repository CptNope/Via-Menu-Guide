import { lazy } from 'react';

/**
 * Map components load in their own chunk (Leaflet is large), so menu pages
 * appear and respond before the map code is parsed. preloadMaps() starts the
 * download right after a page with maps first renders.
 */
const loaders = {
  ItalianWineMapInteractive: () => import('./ItalianWineMapInteractive.jsx'),
  InternationalWineMapInteractive: () => import('./InternationalWineMapInteractive.jsx'),
  SpiritsMapInteractive: () => import('./SpiritsMapInteractive.jsx'),
  CategoryWineMap: () => import('./CategoryWineMap.jsx'),
  InternationalWineMap: () => import('./InternationalWineMap.jsx'),
  SpiritsMap: () => import('./SpiritsMap.jsx'),
};

export const ItalianWineMapInteractive = lazy(loaders.ItalianWineMapInteractive);
export const InternationalWineMapInteractive = lazy(loaders.InternationalWineMapInteractive);
export const SpiritsMapInteractive = lazy(loaders.SpiritsMapInteractive);
export const CategoryWineMap = lazy(loaders.CategoryWineMap);
export const InternationalWineMap = lazy(loaders.InternationalWineMap);
export const SpiritsMap = lazy(loaders.SpiritsMap);

let started = false;
export function preloadMaps() {
  if (started) return;
  started = true;
  const go = () => Object.values(loaders).forEach((load) => load());
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 1500 });
  else setTimeout(go, 300);
}
