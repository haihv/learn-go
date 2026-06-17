import { ImageResponse } from "next/og";

// iOS home-screen icon — the same gopher mark as app/icon.svg, rasterized to a
// 180x180 PNG via next/og. The SVG is rendered through an <img> data URI so the
// two icons can never drift.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const GOPHER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#0c7a68"/>
  <circle cx="9.5" cy="8.5" r="3.1" fill="#f4f1e8"/>
  <circle cx="22.5" cy="8.5" r="3.1" fill="#f4f1e8"/>
  <circle cx="9.5" cy="8.5" r="1.2" fill="#0c7a68"/>
  <circle cx="22.5" cy="8.5" r="1.2" fill="#0c7a68"/>
  <ellipse cx="16" cy="17.5" rx="10.5" ry="9.3" fill="#f4f1e8"/>
  <circle cx="12" cy="14.8" r="3.3" fill="#ffffff" stroke="#0c7a68" stroke-width="0.6"/>
  <circle cx="20" cy="14.8" r="3.3" fill="#ffffff" stroke="#0c7a68" stroke-width="0.6"/>
  <circle cx="13.3" cy="15.2" r="1.5" fill="#1c1917"/>
  <circle cx="18.7" cy="15.2" r="1.5" fill="#1c1917"/>
  <ellipse cx="16" cy="19.4" rx="1.5" ry="1.1" fill="#1c1917"/>
  <rect x="14.85" y="20.4" width="1.1" height="2.9" rx="0.35" fill="#ffffff" stroke="#0c7a68" stroke-width="0.4"/>
  <rect x="16.05" y="20.4" width="1.1" height="2.9" rx="0.35" fill="#ffffff" stroke="#0c7a68" stroke-width="0.4"/>
</svg>`;

export default function AppleIcon() {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(GOPHER)}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={180} height={180} alt="" />
      </div>
    ),
    { ...size }
  );
}
