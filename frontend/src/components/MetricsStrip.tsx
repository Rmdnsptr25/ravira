import { Users, Briefcase, Target, Clock } from "lucide-react";

const stats = [
  { value: "50K+", label: "Pengguna Terdaftar", icon: Users },
  { value: "15K+", label: "Lowongan Aktif", icon: Briefcase },
  { value: "94%", label: "Match Accuracy", icon: Target },
  { value: "40%", label: "Reduksi Time-to-Hire", icon: Clock },
];

export function MetricsStrip() {
  return (
    <section style={{ background: "#ffffff", padding: "32px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            alignItems: "center",
          }}
          className="metrics-strip-grid"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "10px 16px",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#EDF1F6",
                  color: "#4A5568",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <s.icon size={16} aria-hidden="true" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#0D1117",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    color: "#4A5568",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
