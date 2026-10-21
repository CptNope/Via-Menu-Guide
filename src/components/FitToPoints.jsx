import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/** Distance in km between two [lat, lon] points. */
export function kmBetween(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/**
 * Zooms a react-leaflet map so every point is in view.
 * One point: centers on it at `singleZoom`. Several: fits them with padding.
 */
function FitToPoints({ points, maxZoom = 11, singleZoom = 10, padding = 32 }) {
  const map = useMap();
  const key = JSON.stringify(points);

  useEffect(() => {
    const pts = (points || []).filter((p) => Array.isArray(p) && p.length === 2);
    if (!pts.length) return undefined;
    const fit = () => {
      map.invalidateSize();
      if (pts.length === 1) map.setView(pts[0], singleZoom);
      else map.fitBounds(pts, { padding: [padding, padding], maxZoom });
    };
    fit();
    const t = setTimeout(fit, 150); // after the map's container has its final size
    return () => clearTimeout(t);
    // points are compared by value through `key`
    // eslint-disable-next-line
  }, [map, key, maxZoom, singleZoom, padding]);

  return null;
}

export default FitToPoints;
