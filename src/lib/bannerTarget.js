/**
 * Where a promotional banner should take you on the web store.
 *
 * The API's `linkUrl` is built for the Flutter app, whose routes differ from
 * this site's (`/ebook-store?bookId=` vs `/ebooks/:id`, `/session/:id` vs
 * `/sessions/:id`, `/revision-series?packageId=` vs `/packages/:id`). Following
 * it here produced dead links, so map from `bannerType` + `targetId` — which
 * the API now also returns — to the route this app actually has.
 *
 * Returns:
 *   { kind: 'internal', to }  → render a <Link to={to}>
 *   { kind: 'external', href} → render an <a href> with rel="noopener"
 *   { kind: 'none' }          → render the image alone, no link
 */
const ROUTE_BY_TYPE = {
  theory_package: (id) => `/packages/${id}`,
  practical_package: (id) => `/packages/${id}`,
  combo_package: (id) => `/packages/${id}`,
  ebook: (id) => `/ebooks/${id}`,
  live_session: (id) => `/sessions/${id}`,
  workshop: (id) => `/workshops/${id}`,
};

export function bannerTarget(banner) {
  if (!banner) return { kind: 'none' };

  const linkType = banner.linkType || banner.link_type || 'none';
  const url = banner.linkUrl || banner.click_url || '';

  if (linkType === 'external') {
    return url ? { kind: 'external', href: url } : { kind: 'none' };
  }
  if (linkType === 'none') return { kind: 'none' };

  const type = banner.bannerType || banner.banner_type;
  const id = banner.targetId || banner.target_id;
  const build = ROUTE_BY_TYPE[type];
  if (build && id) return { kind: 'internal', to: build(id) };

  // A generic internal banner with a hand-written click_url: honour it as long
  // as it's a site-relative path. App-style paths that this site has no route
  // for are dropped rather than shown as links that 404.
  if (url.startsWith('/') && !isAppOnlyPath(url)) {
    return { kind: 'internal', to: url };
  }
  return { kind: 'none' };
}

const APP_ONLY_PREFIXES = [
  '/revision-series',
  '/practical-series',
  '/ebook-store',
  '/session/',
  '/workshop/',
  '/package-access',
  '/all-packages',
  '/home',
  '/course/',
  '/lecture/',
];

function isAppOnlyPath(url) {
  return APP_ONLY_PREFIXES.some((p) => url === p || url.startsWith(p));
}
