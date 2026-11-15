import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Footer } from "../components/Footer";
import { ArrowUpRight, CheckCircle } from "lucide-react";

const portalCards = [
  { title: "Kelola Lowongan", desc: "Buat dan kelola posisi rekrutmen yang sedang dibuka.", path: "/untuk-perusahaan/lowongan", variant: "blue" as const },
  { title: "Fitur Produk", desc: "Shortlist AI, match score, dan profil berbasis consent.", path: "/untuk-perusahaan/produk", variant: "light" as const },
  { title: "Solusi Rekrutmen", desc: "Pipeline, jadwal interview, dan kolaborasi tim recruiter.", path: "/untuk-perusahaan/solusi-rekrutmen", variant: "lime" as const },
  { title: "Insight Rekrutmen", desc: "Analitik performa rekrutmen dan konversi pipeline.", path: "/untuk-perusahaan/insight-rekrutmen", variant: "dark" as const },
];

export default function UntukPerusahaanPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "124px 24px 72px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(255,255,255,0.28) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
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
              Portal Perusahaan
            </p>
            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(32px, 4.6vw, 52px)",
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                marginBottom: 16,
                lineHeight: 1.12,
              }}
            >
              Rekrut Kandidat Lebih Tepat dengan Ravira
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.92)",
                lineHeight: 1.75,
                maxWidth: 640,
                margin: "0 auto 32px",
              }}
            >
              Ravira membantu perusahaan menemukan kandidat yang relevan, mengelola lowongan, melihat match score, shortlist berbasis AI, dan pipeline rekrutmen dalam satu ekosistem terintegrasi.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/untuk-perusahaan/solusi-rekrutmen")}
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
                <span>Lihat Solusi Rekrutmen</span>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#0D1117",
                    color: "#D4FF59",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowUpRight size={16} />
                </span>
              </button>
              <button
                onClick={() => navigate("/untuk-perusahaan/insight-rekrutmen")}
                style={{
                  padding: "12px 26px",
                  minHeight: 48,
                  borderRadius: 999,
                  border: "1px solid rgba(255, 255, 255, 0.35)",
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
                Lihat Insight Rekrutmen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#0D1117",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D1117" }} />
            Ekosistem Rekrutmen
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, color: "#0D1117", letterSpacing: "-1px", marginBottom: 10 }}>
            Jelajahi Portal Perusahaan
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#4A5568" }}>
            Pelajari semua fitur rekrutmen yang tersedia untuk perusahaan Anda.
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

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 40 }}>
          {[
            { value: "2.800+", label: "Perusahaan Aktif", bg: "#F4F5F7", text: "#0D1117", sub: "#4A5568" },
            { value: "94%", label: "Akurasi Match Score", bg: "#D4FF59", text: "#0D1117", sub: "#1E293B" },
            { value: "48K+", label: "Kandidat Tersedia", bg: "#0D1117", text: "#D4FF59", sub: "#CBD5E1" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 24, padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 34, fontWeight: 600, color: s.text, letterSpacing: "-1px", marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: s.sub }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature bullets */}
        <div style={{ background: "#0D1117", borderRadius: 28, padding: "44px 36px", marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#FFFFFF", marginBottom: 24 }}>Mengapa Ravira?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              "Matching AI berdasarkan skill & pengalaman",
              "Shortlist kandidat otomatis per lowongan",
              "Candidate consent untuk privasi data",
              "Pipeline rekrutmen visual & terstruktur",
              "Notifikasi real-time tiap tahap proses",
              "Integrasi ATS & HRIS perusahaan",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CheckCircle size={16} color="#D4FF59" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#E2E8F0", lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
