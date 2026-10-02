import { useEffect, useState } from 'react';

/**
 * Reads the route from the hash. Routes start with "#/": "#/job-open" -> "job-open", "#/" or "" -> "".
 * A hash without the slash ("#main", "#s-check") is an in-page anchor and returns null, so the
 * skip link and section anchors never change the page.
 */
export function routeFromHash(hash: string): string | null {
  if (hash === '' || hash === '#') return '';
  if (!hash.startsWith('#/')) return null;
  return hash.slice(2).split('?')[0].replace(/\/+$/, '');
}

export function hrefFor(slug: string): string {
  return slug ? `#/${slug}` : '#/';
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(() => routeFromHash(window.location.hash) ?? '');
  useEffect(() => {
    const onChange = () => {
      const next = routeFromHash(window.location.hash);
      if (next !== null) setRoute(next);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
