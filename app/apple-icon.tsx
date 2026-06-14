import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/seo";

// iOS home-screen icon. Generated with next/og (no network fonts) so it matches
// the brand and builds offline. The SVG icon.svg covers everything else.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND.cyan,
          color: BRAND.paper,
          fontSize: 104,
          fontWeight: 700,
        }}
      >
        Go
      </div>
    ),
    { ...size }
  );
}
