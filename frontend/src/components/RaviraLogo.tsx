/**
 * Ravira R mark logo — modern letterform with blue/cyan gradient.
 * Replaces the old owl mascot across the entire app.
 *
 * Exports kept backward-compatible so all consumers work without changes:
 *   RaviraOwlIcon  → now renders the R icon mark
 *   RaviraWordmark → icon + "Ravira" wordmark
 */

/** Icon-only R mark. Transparent background — works on any surface. */
export function RaviraOwlIcon({
  size = 40,
}: {
  size?: number;
  gradient?: boolean; // accepted for backward compat, unused
}) {
  const gId = `rg${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gId} x1="5" y1="5" x2="95" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0055FF" />
          <stop offset="55%"  stopColor="#0099EE" />
          <stop offset="100%" stopColor="#00C8FF" />
        </linearGradient>
      </defs>

      {/*
        Spine + Bowl as one even-odd path:
        Outer boundary → spine left bar + bowl arch
        Inner subpath  → arrow notch (transparent cutout, works on any bg)
      */}
      <path
        d="
          M 8 8
          L 78 8
          Q 88 8 88 30
          Q 88 54 54 58
          L 26 58
          L 26 66
          L 8 66
          Z
          M 39 20 L 70 34 L 39 48 Z
        "
        fill={`url(#${gId})`}
        fillRule="evenodd"
      />

      {/* Diagonal leg of the R */}
      <path
        d="M 34 58 L 56 58 L 90 92 L 68 92 Z"
        fill={`url(#${gId})`}
      />

      {/* Signature dot — brand mark at lower-left */}
      <circle cx="17" cy="82" r="9" fill={`url(#${gId})`} />
    </svg>
  );
}

/** Horizontal wordmark: R icon + "Ravira" text + optional sub-label. */
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
            background: dark
              ? "linear-gradient(90deg, #0055FF 0%, #0099EE 100%)"
              : "linear-gradient(90deg, #ffffff 0%, #4DB8FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
              color: dark ? "#0055FF" : "#4DB8FF",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginTop: 1,
            }}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
