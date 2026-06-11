import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { MapPin, Users, TrendingUp, Shield, ArrowRight } from "lucide-react";

const regionData = [
  { kota: "Jakarta", kandidat: 684000, density: 100, top_skill: "Teknologi & IT", mobility: "High", color: "#4DB8FF" },
  { kota: "Surabaya", kandidat: 312000, density: 75, top_skill: "Manufaktur", mobility: "Medium", color: "#10d98e" },
  { kota: "Bandung", kandidat: 248000, density: 62, top_skill: "Teknologi & Tekstil", mobility: "High", color: "#8b5cf6" },
  { kota: "Tangerang", kandidat: 198000, density: 54, top_skill: "Logistik", mobility: "Medium", color: "#1677FF" },
  { kota: "Bekasi", kandidat: 176000, density: 48, top_skill: "Manufaktur", mobility: "Low", color: "#f59e0b" },
  { kota: "Semarang", kandidat: 142000, density: 40, top_skill: "Perdagangan", mobility: "Medium", color: "#ff6b6b" },
  { kota: "Depok", kandidat: 118000, density: 33, top_skill: "Pendidikan", mobility: "Low", color: "#4DB8FF" },
  { kota: "Yogyakarta", kandidat: 96000, density: 27, top_skill: "Pendidikan & Pariwisata", mobility: "High", color: "#10d98e" },
  { kota: "Malang", kandidat: 84000, density: 23, top_skill: "Pendidikan", mobility: "Medium", color: "#8b5cf6" },
  { kota: "Solo", kandidat: 62000, density: 17, top_skill: "Perdagangan & Budaya", mobility: "Low", color: "#f59e0b" },
];

const mobilityInsights = [
  {
    icon: TrendingUp,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Arus Mobilitas Dominan",
    desc: "Tenaga kerja dari Yogyakarta, Malang, dan Solo cenderung bermigrasi ke Jakarta dan Surabaya untuk posisi teknologi dan manufaktur.",
  },
  {
    icon: MapPin,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.08)",
    title: "Konsentrasi Talent IT",
    desc: "78% kandidat dengan skill teknologi terkonsentrasi di Jakarta, Bandung, dan Surabaya. Potensi distribusi ke kota lain masih besar.",
  },
  {
    icon: Users,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "Peluang Redistribusi",
    desc: "Kota-kota dengan surplus manufaktur (Bekasi, Tangerang) berpotensi menjadi sumber talent untuk sektor kesehatan dan logistik yang kekurangan.",
  },
];

export default function UntukPemerintahHeatmapPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021220 0%, #041c2e 55%, #062640 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,184,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Heatmap Wilayah
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Distribusi & Mobilitas Tenaga Kerja
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a9ab8", lineHeight: 1.7, marginBottom: 20 }}>
            Visualisasi sebaran konsentrasi tenaga kerja per kota di Pulau Jawa dan pola mobilitas antar wilayah — data agregat, tanpa informasi individual.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.2)", borderRadius: 10, padding: "8px 16px" }}>
            <Shield size={14} color="#10d98e" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#10d98e" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>

        {/* Visual Heatmap Grid */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <MapPin size={20} color="#4DB8FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D" }}>Konsentrasi Kandidat per Kota — Pulau Jawa</h2>
          </div>

          {/* Heatmap visual representation */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
            {regionData.map((r) => {
              const opacity = 0.15 + (r.density / 100) * 0.75;
              return (
                <div key={r.kota} style={{ background: `rgba(77,184,255,${opacity})`, border: `1px solid rgba(77,184,255,${opacity + 0.1})`, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: opacity > 0.5 ? "#fff" : "#0A1B3D", marginBottom: 2 }}>
                    {r.kandidat >= 100000 ? `${(r.kandidat / 1000).toFixed(0)}K` : `${(r.kandidat / 1000).toFixed(0)}K`}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: opacity > 0.5 ? "rgba(255,255,255,0.85)" : "#4a6080" }}>{r.kota}</div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>Densitas rendah</span>
            {[0.2, 0.35, 0.5, 0.65, 0.8, 0.9].map((o, i) => (
              <div key={i} style={{ width: 24, height: 12, background: `rgba(77,184,255,${o})`, borderRadius: 3 }} />
            ))}
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>Densitas tinggi</span>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 20 }}>Detail per Kota</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {regionData.map((r, i) => (
              <div key={r.kota} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 1fr", gap: 16, padding: "14px 0", borderBottom: i < regionData.length - 1 ? "1px solid rgba(22,119,255,0.07)" : "none", alignItems: "center" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{r.kota}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: r.color }}>{r.kandidat.toLocaleString("id-ID")}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{r.top_skill}</div>
                <div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
                    color: r.mobility === "High" ? "#10d98e" : r.mobility === "Medium" ? "#f59e0b" : "#ff6b6b",
                    background: r.mobility === "High" ? "rgba(16,217,142,0.1)" : r.mobility === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(255,107,107,0.1)",
                    border: `1px solid ${r.mobility === "High" ? "rgba(16,217,142,0.3)" : r.mobility === "Medium" ? "rgba(245,158,11,0.3)" : "rgba(255,107,107,0.3)"}`,
                    borderRadius: 99, padding: "3px 10px"
                  }}>
                    Mobilitas {r.mobility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobility Insights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
          {mobilityInsights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div key={ins.title} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.08)", padding: "24px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ins.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={20} color={ins.color} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{ins.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>{ins.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/daftar/pemerintah")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
            Akses Heatmap Interaktif <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
