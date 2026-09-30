import { ImageResponse } from "next/og";

export const alt = "Career OS: land the role you're aiming for";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#ffffff",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(12,20,36,0.12) 1px, transparent 0)",
        backgroundSize: "26px 26px",
        color: "#0b1220",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <path
            d="M24.67 9.23A11 11 0 1 0 24.67 22.77"
            fill="none"
            stroke="#0b1220"
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          <circle cx="27.2" cy="16" r="3.3" fill="#2447f5" />
        </svg>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Career OS</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{ fontSize: 88, fontWeight: 800, lineHeight: 1, letterSpacing: -3, display: "flex", flexWrap: "wrap" }}
        >
          <span>Land the role you&apos;re actually&nbsp;</span>
          <span style={{ color: "#2447f5" }}>aiming for.</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#5c6576" }}>
          Resume scoring · 1-1 coaching · applications only where you fit
        </div>
      </div>
    </div>,
    size,
  );
}
