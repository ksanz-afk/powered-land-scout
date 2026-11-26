import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d1d1f",
          borderRadius: 14,
        }}
      >
        <div style={{ width: 22, height: 22, borderRadius: 999, background: "#2a78d6", display: "flex" }} />
        <div style={{ width: 10, height: 10, borderRadius: 999, background: "#1baf7a", marginLeft: 4, display: "flex" }} />
      </div>
    ),
    size,
  );
}
