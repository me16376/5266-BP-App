// src/lib/apiConfig.js
/**
 * Central API configuration helper.
 * When running on localhost (or dev environment), requests route to the production
 * Cloudflare Pages deployment (https://5266-bp-app.pages.dev) so that the Cloudflare D1
 * authentication APIs work seamlessly in local development.
 * In production (when deployed on Cloudflare Pages), relative paths (/api/...) are always
 * used so that requests hit the local Cloudflare Pages Functions and the correct D1 binding.
 */

export const PRODUCTION_API_URL = 'https://5266-bp-app.pages.dev';

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Client-side execution in the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Only route localhost / loopback to the live Cloudflare deployment
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      const base = (process.env?.NEXT_PUBLIC_API_BASE_URL || PRODUCTION_API_URL).replace(/\/$/, '');
      return `${base}${cleanEndpoint}`;
    }
    // In production on Cloudflare Pages (or custom domain), ALWAYS use relative URL
    return cleanEndpoint;
  }

  // Server-side / build-time execution fallback
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
    return `${base}${cleanEndpoint}`;
  }

  return cleanEndpoint;
}

