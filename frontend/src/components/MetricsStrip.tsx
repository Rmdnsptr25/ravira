const stats = [
  { value: "50K+", label: "Pengguna Terdaftar", color: "#1677FF" },
  { value: "15K+", label: "Lowongan Aktif", color: "#0D47A1" },
  { value: "94%", label: "Match Accuracy", color: "#1677FF" },
  { value: "40%", label: "Reduksi Time-to-Hire", color: "#0D47A1" },
];

export function MetricsStrip() {
  return (
    <section style={{ background: "#ffffff", borderBottom: "1px solid rgba(22,119,255,0.1)", borderTop: "1px solid rgba(22,119,255,0.08)", padding: "28px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }} className="metrics-strip-grid">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                padding: "8px 16px",
                borderRight: i < stats.length - 1 ? "1px solid rgba(22,119,255,0.1)" : "none",
              }}
            >
              <div style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(26px, 3vw, 40px)",
                fontWeight: 800,
                color: s.color,
                lineHeight: 1,
                marginBottom: 4,
                letterSpacing: "-0.5px",
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#6a88b8",
                fontWeight: 500,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
