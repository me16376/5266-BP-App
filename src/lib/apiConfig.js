// src/lib/apiConfig.js
/**
 * Central API configuration helper.
 * When running on localhost (or dev environment), requests route to the production
 * Cloudflare Pages deployment (https://5266-bp-app.pages.dev) so that the Cloudflare D1
 * authentication APIs work seamlessly in local development.
 */

export const PRODUCTION_API_URL = 'https://5266-bp-app.pages.dev';

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If NEXT_PUBLIC_API_BASE_URL is explicitly set, use it
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
    return `${base}${cleanEndpoint}`;
  }

  // Client-side execution
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Route localhost / loopback to the live Cloudflare deployment
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return `${PRODUCTION_API_URL}${cleanEndpoint}`;
    }
    // When deployed on Cloudflare Pages (or custom domain), use relative URL
    return cleanEndpoint;
  }

  // Server-side default
  return `${PRODUCTION_API_URL}${cleanEndpoint}`;
}
