import { useRef } from "react";
import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Footer } from "../components/Footer";
import { BarChart2, TrendingUp, Users, Clock, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const metrics = [
  { label: "Rata-rata Match Score", value: "82%", variant: "blue" as const, desc: "Rata-rata kesesuaian kandidat yang melamar terhadap lowongan yang dibuka" },
  { label: "Time-to-Hire", value: "12 hari", variant: "light" as const, desc: "Rata-rata waktu dari lowongan dibuka hingga kandidat di-hire" },
  { label: "Pipeline Conversion", value: "34%", variant: "lime" as const, desc: "Persentase kandidat yang bergerak dari Applied ke Interview" },
  { label: "Offer Acceptance Rate", value: "78%", variant: "dark" as const, desc: "Persentase offer yang diterima oleh kandidat final" },
];

const insights = [
  {
    icon: TrendingUp,
    variant: "blue" as const,
    title: "Rata-rata Match Score",
    desc: "Lihat tren match score kandidat per lowongan dan per periode. Identifikasi lowongan dengan kualitas kandidat tertinggi dan terendah.",
  },
  {
    icon: BarChart2,
    variant: "light" as const,
    title: "Skill yang Sering Cocok",
    desc: "Skill apa yang paling sering muncul di kandidat yang lolos ke tahap interview. Berguna untuk memperbarui kriteria lowongan.",
  },
  {
    icon: Users,
    variant: "lime" as const,
    title: "Skill Gap Kandidat",
    desc: "Skill apa yang paling sering kurang dari kandidat yang melamar. Bisa jadi sinyal bahwa deskripsi lowongan perlu disesuaikan.",
  },
  {
    icon: TrendingUp,
    variant: "dark" as const,
    title: "Source Kandidat",
    desc: "Dari mana kandidat terbaik berasal, direct apply, referral, atau platform mana. Optimalkan anggaran rekrutmen berdasarkan data.",
  },
  {
    icon: Clock,
    variant: "light" as const,
    title: "Time-to-Hire",
    desc: "Berapa lama proses rekrutmen rata-rata per posisi dan per tahap pipeline. Identifikasi bottleneck yang memperlambat proses.",
  },
  {
    icon: BarChart2,
    variant: "blue" as const,
    title: "Pipeline Conversion",
    desc: "Berapa persen kandidat yang bergerak dari satu tahap ke tahap berikutnya. Data conversion per stage membantu mengoptimalkan proses screening.",
  },
];

export default function UntukPerusahaanInsightRekrutmenPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

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
              Insight Rekrutmen
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Analitik Rekrutmen Berbasis Data
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7 }}>
              Pantau performa rekrutmen Anda secara menyeluruh. Buat keputusan hiring yang lebih cerdas berdasarkan data nyata.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics (4 blocks) */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 56 }}>
          {metrics.map((m) => {
            const isBlue = m.variant === "blue";
            const isLime = m.variant === "lime";
            const isDark = m.variant === "dark";

            const bg = isBlue
              ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
              : isLime
                ? "#D4FF59"
                : isDark
                  ? "#0D1117"
                  : "#F4F5F7";

            const valColor = isBlue ? "#FFFFFF" : isDark ? "#D4FF59" : "#0D1117";
            const labelColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const descColor = isBlue ? "rgba(255,255,255,0.9)" : isDark ? "#CBD5E1" : "#4A5568";

            return (
              <div key={m.label} style={{ background: bg, borderRadius: 24, padding: "28px 24px" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 34, fontWeight: 600, color: valColor, letterSpacing: "-1px", marginBottom: 8 }}>{m.value}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: labelColor, marginBottom: 6 }}>{m.label}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: descColor, lineHeight: 1.55, margin: 0 }}>{m.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Insight Cards (6 items -> Horizontal Scroll) */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, color: "#0D1117", marginBottom: 6 }}>
              Data Insight yang Tersedia
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#4A5568" }}>
              Semua metrik penting rekrutmen dalam satu dashboard terpadu.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser insight ke kiri"
              onClick={() => scrollByAmount("left")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#F4F5F7", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Geser insight ke kanan"
              onClick={() => scrollByAmount("right")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="ravira-no-scrollbar"
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
            marginBottom: 48,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {insights.map((ins) => {
            const Icon = ins.icon;
            const isBlue = ins.variant === "blue";
            const isLime = ins.variant === "lime";
            const isDark = ins.variant === "dark";

            const bg = isBlue
              ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
              : isLime
                ? "#D4FF59"
                : isDark
                  ? "#0D1117"
                  : "#F4F5F7";

            const titleColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const descColor = isBlue ? "rgba(255,255,255,0.9)" : isDark ? "#CBD5E1" : "#4A5568";
            const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

            return (
              <div
                key={ins.title}
                style={{
                  flex: "0 0 300px",
                  scrollSnapAlign: "start",
                  background: bg,
                  borderRadius: 24,
                  padding: "28px 24px",
                  minHeight: 240,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{ins.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: descColor, lineHeight: 1.65, margin: 0 }}>{ins.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/daftar/perusahaan")}
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
            <span>Akses Dashboard Insight</span>
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
