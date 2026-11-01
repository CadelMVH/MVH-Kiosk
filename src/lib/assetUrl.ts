/**
 * Builds a URL for a file in /public that works both locally ("/")
 * and on GitHub Pages ("/MVH-Kiosk/"). Absolute URLs pass through untouched.
 */
export function assetUrl(path: string): string {
  if (!path || /^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}
