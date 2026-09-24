/**
 * Username Estate Properties — Cloudflare Worker
 * Static assets (public/) are served via the ASSETS binding.
 * The router adds long-lived caching for images and clean 404s.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response("ok", { status: 200 });
    }

    // Never cache the HTML shell or script — always fresh
    if (url.pathname === "/" || url.pathname === "/index.html" || url.pathname === "/script.js") {
      return env.ASSETS.fetch(request);
    }

    // Images / logos: cache at the edge for a day, stale-while-revalidate
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 200) {
      const res = new Response(assetResponse.body, assetResponse);
      res.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      return res;
    }

    // Clean 404 → back to the landing page
    return Response.redirect(url.origin + "/", 302);
  },
};
