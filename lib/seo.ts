// Single source of truth for site-wide SEO constants. Used by the root
// metadata, sitemap, robots, manifest, and the OG image so URLs and copy never
// drift apart.
export const SITE_URL = "https://learn-go.haihv.dev";
export const SITE_NAME = "Learn Go Interactively";
export const SITE_SHORT = "Learn Go";
export const SITE_DESCRIPTION =
  "An interactive, hands-on Go course — bite-size lessons, guided workshops, and coding labs that run in your browser, plus a T-shaped Atlas and Bloom-laddered deep stems. Free and open source.";

// Theme colors (light theme) for the manifest and OG image — kept literal
// because manifest/OG generation can't read the CSS @theme tokens.
export const BRAND = {
  paper: "#f4f1e8",
  ink: "#1c1917",
  inkMuted: "#57534e",
  cyan: "#0c7a68",
  border: "#d6cfba",
};
