import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { Footer } from "../components/Footer";
import { BarChart2, Users, TrendingUp, ArrowUpRight, Shield } from "lucide-react";

const stats = [
  { value: "2.3 juta", label: "Kandidat Terdaftar", variant: "blue" as const },
  { value: "48K+", label: "Lowongan Aktif", variant: "light" as const },
  { value: "94%", label: "Akurasi Match AI", variant: "lime" as const },
  { value: "18 Provinsi", label: "Jangkauan Wilayah", variant: "dark" as const },
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
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "120px 24px 64px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#D4FF59",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Analytics
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Supply-Demand Tenaga Kerja
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7, marginBottom: 20 }}>
              Data agregat keseimbangan antara ketersediaan tenaga kerja dan kebutuhan industri per sektor, diperbarui secara berkala.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "8px 18px" }}>
              <Shield size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px" }}>
        {/* Stats (4 blocks) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 44 }}>
          {stats.map((s) => {
            const isBlue = s.variant === "blue";
            const isLime = s.variant === "lime";
            const isDark = s.variant === "dark";
            const bg = isBlue ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)" : isLime ? "#D4FF59" : isDark ? "#0D1117" : "#F4F5F7";
            const valColor = isBlue ? "#FFFFFF" : isDark ? "#D4FF59" : "#0D1117";
            const lblColor = isBlue ? "rgba(255,255,255,0.9)" : isDark ? "#CBD5E1" : "#4A5568";

            return (
              <div key={s.label} style={{ background: bg, borderRadius: 24, padding: "26px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 30, fontWeight: 600, color: valColor, letterSpacing: "-1px", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: lblColor }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Supply Demand Table */}
        <div style={{ background: "#F4F5F7", borderRadius: 28, padding: "32px", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <BarChart2 size={20} color="#0E67CC" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#0D1117" }}>Keseimbangan Supply-Demand per Sektor</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {supplyDemand.map((row) => {
              const gapColor = row.gap > 5 ? "#047857" : row.gap < -10 ? "#C53030" : "#B45309";
              return (
                <div key={row.sektor} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, padding: "16px 20px", background: "#FFFFFF", borderRadius: 16, alignItems: "center" }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0D1117" }}>{row.sektor}</div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#4A5568", marginBottom: 4 }}>Supply</div>
                    <div style={{ height: 6, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(row.supply, 100)}%`, background: "#0D1117", borderRadius: 99 }} />
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#0D1117", marginTop: 3 }}>{row.supply}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#4A5568", marginBottom: 4 }}>Demand</div>
                    <div style={{ height: 6, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(row.demand, 100)}%`, background: "#0E67CC", borderRadius: 99 }} />
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#0849A8", marginTop: 3 }}>{row.demand}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: gapColor }}>
                      {row.gap > 0 ? "+" : ""}{row.gap}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#0D1117", background: row.gap > 5 ? "#D4FF59" : "#F4F5F7", borderRadius: 999, padding: "4px 12px" }}>
                      {row.trend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insight cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 44 }}>
          {[
            { icon: TrendingUp, bg: "#0D1117", titleColor: "#FFFFFF", descColor: "#CBD5E1", iconBg: "#D4FF59", iconColor: "#0D1117", title: "Sektor dengan Shortage Tertinggi", desc: "Kesehatan dan Teknologi & IT menunjukkan gap terbesar antara jumlah kandidat tersedia dan kebutuhan industri." },
            { icon: Users, bg: "#D4FF59", titleColor: "#0D1117", descColor: "#1E293B", iconBg: "#0D1117", iconColor: "#D4FF59", title: "Insight Kebutuhan Tenaga Kerja", desc: "Sektor Manufaktur dan Perdagangan memiliki surplus tenaga kerja, menandakan peluang redistribusi ke sektor yang kekurangan." },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} style={{ background: card.bg, borderRadius: 24, padding: "28px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.iconBg, color: card.iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: card.titleColor, marginBottom: 8 }}>{card.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: card.descColor, lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/daftar/pemerintah")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "7px 8px 7px 26px",
              minHeight: 48,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <span>Akses Dashboard Analytics</span>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#D4FF59", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} />
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
