import { useRef } from "react";
import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { Footer } from "../components/Footer";
import { MapPin, Users, TrendingUp, Shield, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const regionData = [
  { kota: "Jakarta", kandidat: 684000, density: 100, top_skill: "Teknologi & IT", mobility: "High" },
  { kota: "Surabaya", kandidat: 312000, density: 75, top_skill: "Manufaktur", mobility: "Medium" },
  { kota: "Bandung", kandidat: 248000, density: 62, top_skill: "Teknologi & Tekstil", mobility: "High" },
  { kota: "Tangerang", kandidat: 198000, density: 54, top_skill: "Logistik", mobility: "Medium" },
  { kota: "Bekasi", kandidat: 176000, density: 48, top_skill: "Manufaktur", mobility: "Low" },
  { kota: "Semarang", kandidat: 142000, density: 40, top_skill: "Perdagangan", mobility: "Medium" },
  { kota: "Depok", kandidat: 118000, density: 33, top_skill: "Pendidikan", mobility: "Low" },
  { kota: "Yogyakarta", kandidat: 96000, density: 27, top_skill: "Pendidikan & Pariwisata", mobility: "High" },
  { kota: "Malang", kandidat: 84000, density: 23, top_skill: "Pendidikan", mobility: "Medium" },
  { kota: "Solo", kandidat: 62000, density: 17, top_skill: "Perdagangan & Budaya", mobility: "Low" },
];

const mobilityInsights = [
  {
    icon: TrendingUp,
    variant: "blue" as const,
    title: "Arus Mobilitas Dominan",
    desc: "Tenaga kerja dari Yogyakarta, Malang, dan Solo cenderung bermigrasi ke Jakarta dan Surabaya untuk posisi teknologi dan manufaktur.",
  },
  {
    icon: MapPin,
    variant: "lime" as const,
    title: "Konsentrasi Talent IT",
    desc: "78% kandidat dengan skill teknologi terkonsentrasi di Jakarta, Bandung, dan Surabaya. Potensi distribusi ke kota lain masih besar.",
  },
  {
    icon: Users,
    variant: "dark" as const,
    title: "Peluang Redistribusi",
    desc: "Kota-kota dengan surplus manufaktur (Bekasi, Tangerang) berpotensi menjadi sumber talent untuk sektor kesehatan dan logistik yang kekurangan.",
  },
];

export default function UntukPemerintahHeatmapPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

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
              Heatmap Wilayah
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Distribusi & Mobilitas Tenaga Kerja
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7, marginBottom: 20 }}>
              Visualisasi sebaran konsentrasi tenaga kerja per kota di Pulau Jawa dan pola mobilitas antar wilayah, data agregat, tanpa informasi individual.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "8px 18px" }}>
              <Shield size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Data yang ditampilkan bersifat agregat dan anonim.</span>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "64px 24px" }}>
        {/* Visual Heatmap Horizontal Scroll (10 cities > 4 blocks) */}
        <div style={{ background: "#F4F5F7", borderRadius: 28, padding: "32px", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MapPin size={20} color="#0E67CC" />
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#0D1117" }}>Konsentrasi Kandidat per Kota: Pulau Jawa</h2>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                aria-label="Geser kota ke kiri"
                onClick={() => scrollByAmount("left")}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #CBD5E1", background: "#FFFFFF", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Geser kota ke kanan"
                onClick={() => scrollByAmount("right")}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="ravira-no-scrollbar"
            style={{
              display: "flex",
              gap: 14,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 4,
              marginBottom: 16,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {regionData.map((r, i) => {
              const isHigh = i < 3;
              const bg = i === 0 ? "#0D1117" : isHigh ? "#0E67CC" : i === 3 ? "#D4FF59" : "#FFFFFF";
              const textColor = i === 0 ? "#D4FF59" : isHigh ? "#FFFFFF" : "#0D1117";
              const subColor = i === 0 ? "#CBD5E1" : isHigh ? "rgba(255,255,255,0.9)" : "#4A5568";

              return (
                <div
                  key={r.kota}
                  style={{
                    flex: "0 0 180px",
                    scrollSnapAlign: "start",
                    background: bg,
                    borderRadius: 20,
                    padding: "20px 18px",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: textColor, marginBottom: 4 }}>
                    {(r.kandidat / 1000).toFixed(0)}K
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: i === 0 || isHigh ? "#FFFFFF" : "#0D1117", marginBottom: 2 }}>{r.kota}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: subColor }}>{r.top_skill}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: "#F4F5F7", borderRadius: 28, padding: "32px", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#0D1117", marginBottom: 20 }}>Detail per Kota</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {regionData.map((r) => (
              <div key={r.kota} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 1fr", gap: 16, padding: "14px 20px", background: "#FFFFFF", borderRadius: 16, alignItems: "center" }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0D1117" }}>{r.kota}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#0849A8" }}>{r.kandidat.toLocaleString("id-ID")}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A5568" }}>{r.top_skill}</div>
                <div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                    color: "#0D1117",
                    background: r.mobility === "High" ? "#D4FF59" : "#F4F5F7",
                    borderRadius: 999, padding: "4px 12px"
                  }}>
                    Mobilitas {r.mobility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobility Insights (3 cards) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 48 }}>
          {mobilityInsights.map((ins) => {
            const Icon = ins.icon;
            const isBlue = ins.variant === "blue";
            const isLime = ins.variant === "lime";
            const isDark = ins.variant === "dark";
            const bg = isBlue ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)" : isLime ? "#D4FF59" : "#0D1117";
            const titleColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const descColor = isBlue ? "rgba(255,255,255,0.9)" : isDark ? "#CBD5E1" : "#1E293B";
            const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

            return (
              <div key={ins.title} style={{ background: bg, borderRadius: 24, padding: "28px 24px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={20} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{ins.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65, margin: 0 }}>{ins.desc}</p>
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
            <span>Akses Heatmap Interaktif</span>
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
