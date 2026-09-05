// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs and, later, sitemap/RSS output.
  // Update this once the real domain is attached in Cloudflare.
  site: "https://race-ready-site.workers.dev",

  // Emit /about/index.html rather than /about.html. This pairs with
  // assets.html_handling = "auto-trailing-slash" in wrangler.jsonc.
  build: { format: "directory" },
});
