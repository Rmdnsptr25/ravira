import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { Footer } from "../components/Footer";
import { ArrowUpRight, Shield, CheckCircle } from "lucide-react";

const portalCards = [
  { title: "Supply-Demand Analytics", desc: "Data tenaga kerja nasional, supply, demand, dan gap per sektor.", path: "/untuk-pemerintah/analytics", variant: "blue" as const },
  { title: "Tren Skill", desc: "Skill yang tumbuh, jenuh, dan perlu diintervensi oleh kebijakan.", path: "/untuk-pemerintah/tren-skill", variant: "light" as const },
  { title: "Heatmap Wilayah", desc: "Peta distribusi tenaga kerja dan kebutuhan per provinsi dan kota.", path: "/untuk-pemerintah/heatmap", variant: "lime" as const },
  { title: "Laporan & Ekspor", desc: "Unduh laporan PDF, Excel, atau CSV untuk kebutuhan kebijakan.", path: "/untuk-pemerintah/laporan", variant: "dark" as const },
];

export default function UntukPemerintahPage() {
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
            padding: "120px 24px 68px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
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
              Portal Pemerintah & Institusi
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 50px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.12 }}>
              Workforce Analytics untuk Pemerintah dan Institusi
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.92)", lineHeight: 1.75, maxWidth: 640, margin: "0 auto 22px" }}>
              Ravira membantu institusi melihat data tenaga kerja secara agregat dan anonim untuk memahami kebutuhan skill, tren pekerjaan, dan rekomendasi program pelatihan berbasis bukti.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "8px 18px", marginBottom: 32 }}>
              <Shield size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>
                Data yang ditampilkan bersifat agregat dan anonim.
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/untuk-pemerintah/analytics")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "7px 8px 7px 24px",
                  minHeight: 48,
                  borderRadius: 999,
                  border: "none",
                  background: "#D4FF59",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0D1117",
                  cursor: "pointer",
                }}
              >
                <span>Lihat Analytics</span>
                <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowUpRight size={16} />
                </span>
              </button>
              <button
                onClick={() => navigate("/untuk-pemerintah/tren-skill")}
                style={{
                  padding: "12px 26px",
                  minHeight: 48,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "rgba(6, 42, 96, 0.52)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Lihat Tren Skill
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, color: "#0D1117", letterSpacing: "-1px", marginBottom: 10 }}>
            Fitur Workforce Analytics
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#4A5568" }}>
            Data tenaga kerja komprehensif untuk mendukung kebijakan berbasis bukti.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {portalCards.map((item) => {
            const isBlue = item.variant === "blue";
            const isLime = item.variant === "lime";
            const isDark = item.variant === "dark";

            const bg = isBlue
              ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
              : isLime
                ? "#D4FF59"
                : isDark
                  ? "#0D1117"
                  : "#F4F5F7";

            const titleColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const descColor = isBlue ? "rgba(255,255,255,0.9)" : isDark ? "#CBD5E1" : "#4A5568";
            const badgeBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const badgeColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

            return (
              <div
                key={item.title}
                onClick={() => navigate(item.path)}
                style={{
                  background: bg,
                  borderRadius: 24,
                  padding: "28px 24px",
                  cursor: "pointer",
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: badgeBg, color: badgeColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cocok untuk */}
        <div style={{ background: "#F4F5F7", borderRadius: 24, padding: "32px 36px", marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, color: "#0D1117", marginBottom: 18 }}>Cocok untuk:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {["Kementerian Ketenagakerjaan", "Dinas Ketenagakerjaan (Disnaker)", "Badan Pusat Statistik (BPS)", "Kampus & Perguruan Tinggi", "Lembaga Pelatihan Kerja", "Institusi Riset & Think Tank"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={15} color="#0E67CC" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#0D1117" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ background: "#D4FF59", borderRadius: 24, padding: "28px 32px", display: "flex", alignItems: "flex-start", gap: 16, marginTop: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0D1117", color: "#D4FF59", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: "#0D1117", marginBottom: 6 }}>Komitmen Privasi Data Kandidat</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#1E293B", lineHeight: 1.7, margin: 0 }}>
              Seluruh data yang ditampilkan pada platform analytics Ravira bersifat agregat dan anonim. Tidak ada nama, email, nomor telepon, CV, atau identitas pribadi kandidat yang dapat diakses oleh lembaga pemerintah maupun institusi mitra.
            </p>
          </div>
        </div>

        {/* Info section */}
        <div style={{ background: "#0D1117", borderRadius: 28, padding: "52px 32px", textAlign: "center", marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, color: "#FFFFFF", marginBottom: 12 }}>Data Komprehensif untuk Kebijakan</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#CBD5E1", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Tersedia untuk lembaga pemerintah, Disnaker, dan institusi mitra. Semua data bersifat agregat, tidak ada identitas kandidat yang terekspos.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/untuk-pemerintah/laporan")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "7px 8px 7px 24px",
                minHeight: 48,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#0D1117",
                cursor: "pointer",
              }}
            >
              <span>Lihat Laporan</span>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={16} />
              </span>
            </button>
            <button
              onClick={() => navigate("/untuk-pemerintah/heatmap")}
              style={{
                padding: "12px 26px",
                minHeight: 48,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.28)",
                background: "transparent",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Lihat Heatmap Wilayah
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
