import { useRef } from "react";
import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Footer } from "../components/Footer";
import { Briefcase, BookmarkCheck, Cpu, Shield, Plug, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    icon: Briefcase,
    variant: "blue" as const,
    title: "Buat Lowongan",
    desc: "Publikasikan lowongan dalam hitungan menit. Tentukan kriteria skill, pengalaman, lokasi, dan tipe pekerjaan, sistem AI langsung menyortir kandidat yang relevan.",
    bullets: ["Template lowongan siap pakai", "Kriteria AI yang dapat dikonfigurasi", "Multi-lokasi dalam satu lowongan"],
  },
  {
    icon: BookmarkCheck,
    variant: "light" as const,
    title: "Shortlist Kandidat Berbasis AI",
    desc: "Ravira secara otomatis meranking dan memfilter kandidat berdasarkan match score AI, memastikan hanya profil terbaik yang masuk shortlist Anda.",
    bullets: ["Ranking otomatis berdasarkan relevansi", "Filter multi-dimensi skill dan pengalaman", "Shortlist bisa dikustomisasi per lowongan"],
  },
  {
    icon: Cpu,
    variant: "lime" as const,
    title: "Match Score Kandidat",
    desc: "Setiap kandidat mendapatkan match score yang dihitung dari relevansi skill, pengalaman, dan kecocokan peran, keputusan hiring lebih objektif dan terukur.",
    bullets: ["Skor 0–100% dengan penjelasan transparan", "Breakdown per dimensi (skill, pengalaman, lokasi)", "Bisa dibandingkan antar kandidat"],
  },
  {
    icon: Shield,
    variant: "dark" as const,
    title: "Profil Kandidat Berbasis Consent",
    desc: "Profil kandidat hanya dapat dilihat setelah kandidat memberikan consent. Ravira memastikan proses rekrutmen etis dan sesuai regulasi perlindungan data.",
    bullets: ["Kandidat kontrol penuh atas data mereka", "Audit trail akses profil", "Sesuai regulasi perlindungan data (PDPA)"],
  },
  {
    icon: Plug,
    variant: "light" as const,
    title: "Integrasi ATS / HRIS",
    desc: "Hubungkan Ravira dengan sistem ATS atau HRIS yang sudah Anda gunakan. Data kandidat dan pipeline tersinkronisasi secara otomatis tanpa duplikasi kerja.",
    bullets: ["Kompatibel dengan Workday, SAP, Oracle", "Sinkronisasi dua arah real-time", "API dokumentasi tersedia untuk tim IT"],
  },
];

export default function UntukPerusahaanProdukPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -360 : 360,
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
              Produk & Fitur
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Fitur Rekrutmen Lengkap untuk Perusahaan
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7 }}>
              Dari posting lowongan hingga hired, semua dalam satu ekosistem Ravira.
            </p>
          </div>
        </div>
      </section>

      {/* Product Cards (> 4 items -> Horizontal Scroll) */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 600, color: "#0D1117" }}>
            5 Modul Produk Rekrutmen
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser produk ke kiri"
              onClick={() => scrollByAmount("left")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#F4F5F7", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Geser produk ke kanan"
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
          {products.map((p) => {
            const Icon = p.icon;
            const isBlue = p.variant === "blue";
            const isLime = p.variant === "lime";
            const isDark = p.variant === "dark";

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
            const pillBg = isBlue || isDark ? "rgba(255,255,255,0.14)" : "rgba(13,17,23,0.08)";
            const pillText = isBlue || isDark ? "#FFFFFF" : "#0D1117";

            return (
              <div
                key={p.title}
                style={{
                  flex: "0 0 340px",
                  scrollSnapAlign: "start",
                  background: bg,
                  borderRadius: 24,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 310,
                }}
              >
                <div>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, color: titleColor, marginBottom: 10 }}>{p.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65, marginBottom: 18 }}>{p.desc}</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.bullets.map((b) => (
                    <span key={b} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600, color: pillText, background: pillBg, borderRadius: 999, padding: "5px 12px" }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
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
            <span>Daftarkan Perusahaan</span>
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
