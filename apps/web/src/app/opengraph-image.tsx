import { ImageResponse } from "next/og";

export const alt = "Powered Land Scout: find powered land communities will support";
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
          padding: 96,
          background: "#fbfbfd",
          color: "#1d1d1f",
        }}
      >
        <div style={{ fontSize: 28, color: "#6e6e73", display: "flex" }}>Powered Land Scout</div>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05, marginTop: 24, display: "flex" }}>
          Powered land communities will support.
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 56 }}>
          <div style={{ height: 14, width: 360, borderRadius: 999, background: "#2a78d6", display: "flex" }} />
          <div style={{ height: 14, width: 240, borderRadius: 999, background: "#1baf7a", display: "flex" }} />
        </div>
      </div>
    ),
    size,
  );
}
