import { useId } from "react";

/**
 * Final Ravira `.R` brand mark — exact vector match to the official Ravira logo asset.
 * Transparent background with generous viewBox padding so the mark is never clipped.
 */
export function RaviraOwlIcon({
  size = 40,
}: {
  size?: number;
  gradient?: boolean;
}) {
  const rawId = useId().replace(/:/g, "");
  const topGradId = `ravira-top-${rawId}`;
  const legGradId = `ravira-leg-${rawId}`;
  const dotGradId = `ravira-dot-${rawId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      style={{
        display: "block",
        flexShrink: 0,
        overflow: "visible",
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={topGradId} x1="8" y1="22" x2="92" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0039FD" />
          <stop offset="52%" stopColor="#016BFC" />
          <stop offset="100%" stopColor="#02A9FD" />
        </linearGradient>
        <linearGradient id={legGradId} x1="34" y1="50" x2="86" y2="83" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0154FC" />
          <stop offset="48%" stopColor="#038BFD" />
          <stop offset="100%" stopColor="#00D5FE" />
        </linearGradient>
        <linearGradient id={dotGradId} x1="17.65" y1="64.05" x2="17.65" y2="81.15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0041FC" />
          <stop offset="100%" stopColor="#00D3FE" />
        </linearGradient>
      </defs>

      {/* Upper R bar and curved loop with 45-degree left and bottom-right cuts */}
      <path
        d="M 8 17 L 70.2 17 C 82.8 17 92 26.2 92 38.5 C 92 47.4 86.8 54.8 78.47 60.07 L 68.4 49.83 C 71.25 47.7 72.86 45.1 72.86 42.1 C 72.86 37.5 69.2 34.16 64.2 34.16 L 26.25 34.16 Z"
        fill={`url(#${topGradId})`}
      />

      {/* Detached 45-degree diagonal leg of the R */}
      <path
        d="M 26.65 49.83 L 55.69 49.83 L 90.02 83.01 L 60.81 83.01 Z"
        fill={`url(#${legGradId})`}
      />

      {/* Signature lower-left dot */}
      <circle cx="17.65" cy="72.6" r="8.55" fill={`url(#${dotGradId})`} />
    </svg>
  );
}

/** Horizontal wordmark: `.R` icon + "Ravira" text + optional sub-label. */
export function RaviraWordmark({
  iconSize = 40,
  textSize = 24,
  dark = false,
  subLabel,
}: {
  iconSize?: number;
  textSize?: number;
  dark?: boolean;
  subLabel?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <RaviraOwlIcon size={iconSize} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: textSize,
            fontWeight: 700,
            color: dark ? "#0A1B3D" : "#FFFFFF",
            letterSpacing: "-0.3px",
          }}
        >
          Ravira
        </span>
        {subLabel && (
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: Math.max(7, textSize * 0.32),
              fontWeight: 600,
              color: dark ? "#1146F6" : "#00C8FF",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
