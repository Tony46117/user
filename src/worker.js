/**
 * Username Estate Properties — Cloudflare Worker
 * Serves static assets from public/ with SEO + performance headers:
 *  - immutable, long-lived caching for images
 *  - moderate caching for HTML/JS (fast + fresh)
 *  - security headers (XSS, clickjacking, referrer)
 *  - clean 404 handling back to the landing page
 */

const CACHE_HEADERS = {
  html: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  script: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  image: "public, max-age=31536000, immutable",
  text: "public, max-age=86400, s-maxage=604800",
};

function cacheType(pathname) {
  if (pathname.startsWith("/assets/") || pathname.startsWith("/images/") || pathname === "/og-image.jpg") return "image";
  if (pathname.endsWith(".js")) return "script";
  if (pathname.endsWith(".xml") || pathname.endsWith(".txt") || pathname.endsWith(".webmanifest")) return "text";
  return "html";
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=()",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response("ok", { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    // Serve the asset as-requested. The assets layer natively serves
    // index.html for "/" — rewriting "/" to "/index.html" here would
    // trigger its trailing-slash normalization back to "/" (redirect loop).
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status === 404) {
      // Clean 404: redirect unknown paths to the landing page (keeps SEO equity)
      return Response.redirect(url.origin + "/", 302);
    }

    const res = new Response(assetResponse.body, assetResponse);
    const type = cacheType(url.pathname);
    res.headers.set("Cache-Control", CACHE_HEADERS[type]);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);

    return res;
  },
};
