import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION, BRAND } from "@/lib/seo";

// Default social card for every route (pages can override). Rendered with
// next/og at build time — no external fonts so it works offline.
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: BRAND.paper,
          backgroundImage: `radial-gradient(${BRAND.border} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: BRAND.cyan, fontSize: 30 }}>
          <div style={{ width: 56, height: 8, borderRadius: 4, backgroundColor: BRAND.cyan }} />
          Free &amp; open source
        </div>
        <div style={{ fontSize: 112, fontWeight: 700, color: BRAND.ink, lineHeight: 1.05, marginTop: 24 }}>
          Learn Go
        </div>
        <div style={{ fontSize: 112, fontWeight: 700, color: BRAND.ink, lineHeight: 1.05 }}>
          Interactively
        </div>
        <div style={{ fontSize: 34, color: BRAND.inkMuted, marginTop: 32, maxWidth: 900 }}>
          {`${SITE_DESCRIPTION.split(".")[0]}.`}
        </div>
      </div>
    ),
    { ...size }
  );
}
