/**
 * Single source of truth for the site's public identity.
 *
 * The canonical host is the one Vercel actually serves: non-www 307-redirects
 * to www, so every canonical URL, sitemap entry and JSON-LD `url` must use www
 * or search engines see a mismatch between the declared and served URL.
 */
export const SITE_URL = "https://www.vitlaicodedao.tech";

export const SITE_NAME = "Vịt Lại Code Dạo";
export const AUTHOR_NAME = "VietDev";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

/** 1200x630 social card. `preview.png` is 3 MB at the wrong aspect ratio. */
export const DEFAULT_OG_IMAGE = absoluteUrl("/og-cover.jpg");

export const SOCIAL_PROFILES = [
  "https://github.com/tranviet0710",
  "https://www.facebook.com/vitlaicodedao",
  "https://www.youtube.com/@vitlaicodedao",
];
