import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { BarChart2, Users, TrendingUp, ArrowRight, Shield } from "lucide-react";

const stats = [
  { value: "2.3 juta", label: "Kandidat Terdaftar", color: "#4DB8FF" },
  { value: "48K+", label: "Lowongan Aktif", color: "#10d98e" },
  { value: "94%", label: "Akurasi Match AI", color: "#1677FF" },
  { value: "18 Provinsi", label: "Jangkauan Wilayah", color: "#8b5cf6" },
];

const supplyDemand = [
  { sektor: "Teknologi & IT", supply: 82, demand: 100, gap: -18, trend: "Shortage" },
  { sektor: "Manufaktur", supply: 95, demand: 88, gap: +7, trend: "Surplus" },
  { sektor: "Kesehatan", supply: 74, demand: 100, gap: -26, trend: "Shortage" },
  { sektor: "Logistik", supply: 91, demand: 97, gap: -6, trend: "Sedikit Kurang" },
  { sektor: "Perdagangan", supply: 110, demand: 90, gap: +20, trend: "Surplus" },
  { sektor: "Pendidikan", supply: 85, demand: 92, gap: -7, trend: "Sedikit Kurang" },
];

export default function UntukPemerintahAnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021220 0%, #041c2e 55%, #062640 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,184,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Analytics
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Supply-Demand Tenaga Kerja
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a9ab8", lineHeight: 1.7, marginBottom: 20 }}>
            Data agregat keseimbangan antara ketersediaan tenaga kerja dan kebutuhan industri per sektor, diperbarui secara berkala.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.2)", borderRadius: 10, padding: "8px 16px" }}>
            <Shield size={14} color="#10d98e" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#10d98e" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(22,119,255,0.08)", padding: "20px 16px", textAlign: "center", boxShadow: "0 2px 10px rgba(10,27,61,0.04)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Supply Demand Table */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <BarChart2 size={20} color="#4DB8FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D" }}>Keseimbangan Supply-Demand per Sektor</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {supplyDemand.map((row, i) => {
              const isShortage = row.gap < 0;
              const gapColor = row.gap > 5 ? "#10d98e" : row.gap < -10 ? "#ff6b6b" : "#f59e0b";
              return (
                <div key={row.sektor} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, padding: "16px 0", borderBottom: i < supplyDemand.length - 1 ? "1px solid rgba(22,119,255,0.07)" : "none", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>{row.sektor}</div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>Supply</div>
                    <div style={{ height: 6, background: "#eef4ff", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(row.supply, 100)}%`, background: "#4DB8FF", borderRadius: 99 }} />
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", marginTop: 3 }}>{row.supply}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 4 }}>Demand</div>
                    <div style={{ height: 6, background: "#eef4ff", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(row.demand, 100)}%`, background: "#1677FF", borderRadius: 99 }} />
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#1677FF", marginTop: 3 }}>{row.demand}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 800, color: gapColor }}>
                      {row.gap > 0 ? "+" : ""}{row.gap}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: gapColor, background: `${gapColor}14`, border: `1px solid ${gapColor}30`, borderRadius: 99, padding: "3px 10px" }}>
                      {row.trend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
          {[
            { icon: TrendingUp, color: "#10d98e", bg: "rgba(16,217,142,0.08)", title: "Sektor dengan Shortage Tertinggi", desc: "Kesehatan dan Teknologi & IT menunjukkan gap terbesar antara jumlah kandidat tersedia dan kebutuhan industri." },
            { icon: Users, color: "#4DB8FF", bg: "rgba(77,184,255,0.08)", title: "Insight Kebutuhan Tenaga Kerja", desc: "Sektor Manufaktur dan Perdagangan memiliki surplus tenaga kerja, menandakan peluang redistribusi ke sektor yang kekurangan." },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.08)", padding: "24px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={20} color={card.color} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{card.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/daftar/pemerintah")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
            Akses Dashboard Analytics <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
