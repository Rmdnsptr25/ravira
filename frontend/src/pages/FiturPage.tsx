import { useRef } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Cpu, TrendingUp, BookOpen, MapPin, BarChart2, ArrowUpRight, Shield, GitBranch, Star, ChevronLeft, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Cpu,
    variant: "blue" as const,
    title: "Smart Job Matching",
    desc: "Algoritma AI mencocokkan profil kandidat dengan lowongan secara otomatis berdasarkan skill, pengalaman, dan preferensi lokasi, bukan sekadar keyword.",
  },
  {
    icon: Star,
    variant: "light" as const,
    title: "Explainable Match Score",
    desc: "Setiap match score dilengkapi penjelasan transparan: skill apa yang cocok, apa yang kurang, dan mengapa lowongan ini direkomendasikan untukmu.",
  },
  {
    icon: TrendingUp,
    variant: "lime" as const,
    title: "Skill Gap Advisor",
    desc: "Ravira menganalisis skill kandidat vs kebutuhan pasar kerja, lalu memberikan laporan gap yang jelas beserta saran pengembangan skill spesifik.",
  },
  {
    icon: BookOpen,
    variant: "dark" as const,
    title: "Personalized Training",
    desc: "Rekomendasi pelatihan dan kursus disesuaikan dengan skill gap masing-masing kandidat, bukan kurikulum generik.",
  },
  {
    icon: MapPin,
    variant: "light" as const,
    title: "Cross-Region Matching",
    desc: "Temukan peluang kerja di luar kota atau wilayah asal. Ravira membantu kandidat mengeksplorasi pasar kerja yang lebih luas.",
  },
  {
    icon: BarChart2,
    variant: "blue" as const,
    title: "Workforce Analytics",
    desc: "Data agregat tenaga kerja untuk lembaga pemerintah dan institusi: tren skill, heatmap wilayah, dan proyeksi kompetensi, semuanya anonim.",
  },
  {
    icon: Shield,
    variant: "lime" as const,
    title: "Consent & Privacy Control",
    desc: "Kandidat mengendalikan data mereka sendiri. Profil hanya bisa diakses oleh recruiter setelah kandidat memberikan consent eksplisit, transparan dan aman.",
  },
  {
    icon: GitBranch,
    variant: "dark" as const,
    title: "Recruiter Pipeline",
    desc: "Kelola seluruh proses rekrutmen dalam satu kanban board visual: dari lamaran masuk, screening, interview, offer, hingga hired, semua terpusat.",
  },
];

export default function FiturPage() {
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
      <Navbar />

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
              Platform Rekrutmen AI
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 50px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.12 }}>
              Fitur Utama Ravira
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.92)", lineHeight: 1.75, marginBottom: 0 }}>
              Ekosistem rekrutmen berbasis AI yang menghubungkan kandidat, perusahaan, dan lembaga pemerintah dalam satu platform terintegrasi.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards (8 items -> Horizontal Scroll) */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 600, color: "#0D1117" }}>
            8 Kapabilitas Inti Ravira
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser fitur ke kiri"
              onClick={() => scrollByAmount("left")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#F4F5F7", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Geser fitur ke kanan"
              onClick={() => scrollByAmount("right")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 14,
            scrollbarWidth: "thin",
          }}
        >
          {features.map((f) => {
            const Icon = f.icon;
            const isBlue = f.variant === "blue";
            const isLime = f.variant === "lime";
            const isDark = f.variant === "dark";

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
                key={f.title}
                style={{
                  flex: "0 0 300px",
                  scrollSnapAlign: "start",
                  background: bg,
                  borderRadius: 24,
                  padding: "28px 24px",
                  minHeight: 256,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{f.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56, textAlign: "center", background: "#0D1117", borderRadius: 28, padding: "52px 32px" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, color: "#FFFFFF", marginBottom: 12 }}>Siap Memulai?</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#CBD5E1", marginBottom: 28 }}>Bergabunglah dengan 50.000+ pengguna Ravira dan mulai perjalanan karier atau rekrutmen Anda.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/daftar")}
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
              <span>Mulai Sekarang</span>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={16} />
              </span>
            </button>
            <button
              onClick={() => navigate("/masuk")}
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
              Masuk ke Akun
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
