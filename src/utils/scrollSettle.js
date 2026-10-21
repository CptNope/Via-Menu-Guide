/**
 * Scroll so `el` sits at `offset` px from the top of the screen (or centered),
 * then keep correcting for a few frames. Cards far off screen skip layout
 * (content-visibility), so their real heights only appear once they render;
 * an instant jump plus a short settle loop lands on the right spot.
 */
export function scrollToSettled(getEl, { offset = 0, center = false, frames = 8 } = {}) {
  const target = () => {
    const el = getEl();
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const want = center ? (window.innerHeight - r.height) / 2 : offset;
    return r.top - Math.max(0, want);
  };
  const first = target();
  if (first === null) return;
  window.scrollTo({ top: window.scrollY + first, behavior: 'auto' });
  let n = 0;
  const step = () => {
    const d = target();
    if (d === null) return;
    if (Math.abs(d) > 2) window.scrollTo({ top: window.scrollY + d, behavior: 'auto' });
    if (++n < frames) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
