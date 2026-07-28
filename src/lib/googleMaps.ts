declare global {
  interface Window {
    google?: any;
    __genhiMapsLoading?: Promise<void>;
  }
}

/**
 * Loads the Google Maps JS API once and caches the in-flight promise so
 * multiple components (catalog map, dashboard location picker) share one script.
 */
export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__genhiMapsLoading) return window.__genhiMapsLoading;

  window.__genhiMapsLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return window.__genhiMapsLoading;
}

// Default center: Yogyakarta city.
export const YOGYA_CENTER = { lat: -7.7956, lng: 110.3695 };

/**
 * Extracts { lat, lng } from a Google Maps URL or from raw HTML/text of a
 * Google Maps page. Handles the common share/URL formats, preferring the
 * place-pin coordinates (!3d!4d) over the map-center coordinates (@lat,lng).
 * Pure regex — safe to run on both server and client (no browser deps).
 */
export function parseGoogleMapsCoords(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const patterns = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,                                // place pin (most accurate)
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,                                    // map center
    /[?&](?:q|ll|sll|daddr|destination)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/, // ?q=lat,lng etc.
    /\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/,                                // /lat,lng path
  ];
  for (const re of patterns) {
    const m = input.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
  }
  return null;
}

// Google Maps "Share" produces shortened links that must be followed (server-side) to reveal coords.
export function isShortMapsLink(url: string): boolean {
  return /(?:maps\.app\.goo\.gl|goo\.gl\/maps)/.test(url);
}
