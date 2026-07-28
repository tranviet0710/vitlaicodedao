/**
 * Which images Next's optimizer is allowed to touch.
 *
 * `next.config.js` deliberately allowlists only our own Supabase storage —
 * a wildcard would let anyone use the deployment as a free image-resizing
 * proxy. Content authored before that (and any future external URL) must still
 * render, so callers use this to decide between `next/image` and a plain `img`
 * rather than crashing the page on an unconfigured host.
 *
 * Keep in sync with `images.remotePatterns` in next.config.js.
 */
export function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}
