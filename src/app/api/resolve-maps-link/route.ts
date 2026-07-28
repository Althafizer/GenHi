import { NextRequest, NextResponse } from 'next/server';
import { parseGoogleMapsCoords } from '@/lib/googleMaps';

// Only allow following links on Google's own domains (prevents SSRF to arbitrary hosts).
const ALLOWED_HOST = /(?:^|\.)google\.com$|(?:^|\.)goo\.gl$/;

/**
 * GET /api/resolve-maps-link?url=<google maps share link>
 * Follows the (possibly shortened) link server-side and extracts { lat, lng }.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')?.trim();
  if (!url) return NextResponse.json({ error: 'Link kosong' }, { status: 400 });

  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
  }
  if (!ALLOWED_HOST.test(host)) {
    return NextResponse.json({ error: 'Hanya link Google Maps yang didukung' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GenHiBot/1.0)' },
    });

    // Coordinates usually live in the final (expanded) URL; fall back to the page body.
    let coords = parseGoogleMapsCoords(res.url);
    if (!coords) {
      const body = await res.text();
      coords = parseGoogleMapsCoords(body);
    }

    if (!coords) {
      return NextResponse.json({ error: 'Koordinat tidak ditemukan di link' }, { status: 422 });
    }
    return NextResponse.json(coords);
  } catch {
    return NextResponse.json({ error: 'Gagal membuka link' }, { status: 502 });
  }
}
