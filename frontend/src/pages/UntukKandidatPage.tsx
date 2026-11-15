import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Cpu, TrendingUp, BookOpen, Bookmark, FileText, MapPin, ArrowUpRight, Search, ChevronLeft, ChevronRight } from "lucide-react";

const sections = [
  { icon: Cpu, variant: "blue" as const, title: "Rekomendasi Pekerjaan Berbasis AI", desc: "Algoritma AI Ravira mencocokkan profil dan skill Anda dengan ribuan lowongan secara otomatis, hasil yang benar-benar relevan, bukan sekadar keyword." },
  { icon: TrendingUp, variant: "light" as const, title: "Match Score", desc: "Setiap lowongan menampilkan match score yang dihitung dari relevansi skill, pengalaman, dan preferensi Anda, sehingga Anda tahu lowongan mana yang paling cocok." },
  { icon: TrendingUp, variant: "lime" as const, title: "Skill Gap Report", desc: "Ketahui skill apa yang perlu ditingkatkan dibandingkan kandidat lain di industri yang sama. Laporan personal dan actionable." },
  { icon: BookOpen, variant: "dark" as const, title: "Rekomendasi Pelatihan", desc: "Kursus dan pelatihan yang direkomendasikan disesuaikan dengan skill gap Anda, belajar terarah, bukan sembarang kursus generik." },
  { icon: Bookmark, variant: "light" as const, title: "Lowongan Tersimpan", desc: "Simpan lowongan yang menarik dan akses kapan saja. Bandingkan pilihan sebelum memutuskan untuk melamar." },
  { icon: FileText, variant: "blue" as const, title: "Lamaran Saya", desc: "Pantau status setiap lamaran: Dikirim, Screening, Interview, Offer, hingga Diterima, semua dalam satu tampilan." },
  { icon: MapPin, variant: "lime" as const, title: "Peluang Lintas Wilayah", desc: "Eksplorasi lowongan di luar kota atau provinsi Anda. Ravira membantu Anda menemukan peluang yang lebih luas sesuai preferensi mobilitas." },
];

const lokasiOptions = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Malang", "Bekasi", "Tangerang", "Depok", "Solo"];

export default function UntukKandidatPage() {
  const navigate = useNavigate();
  const [posisi, setPosisi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/masuk/kandidat");
  };

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
              Untuk Kandidat
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 50px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.12 }}>
              Temukan Pekerjaan yang Lebih Relevan dengan Ravira
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.92)", lineHeight: 1.75, maxWidth: 640, margin: "0 auto 36px" }}>
              Ravira membantu kandidat menemukan pekerjaan, memahami skill gap, mengikuti pelatihan, menyimpan lowongan, dan memantau status lamaran, semua dalam satu platform.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ background: "#FFFFFF", borderRadius: 999, padding: "8px 8px 8px 20px", display: "flex", gap: 10, alignItems: "center", maxWidth: 700, margin: "0 auto", boxShadow: "0 16px 40px rgba(8, 28, 68, 0.22)", flexWrap: "wrap" }}>
              <div style={{ flex: 2, minWidth: 180, display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid #E2E8F0", paddingRight: 10 }}>
                <Search size={16} color="#4A5568" />
                <input
                  type="text"
                  value={posisi}
                  onChange={(e) => setPosisi(e.target.value)}
                  placeholder="Posisi atau kata kunci..."
                  style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0D1117", background: "transparent", width: "100%" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={16} color="#4A5568" />
                <select
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0D1117", background: "transparent", width: "100%", cursor: "pointer" }}
                >
                  <option value="">Semua Lokasi</option>
                  {lokasiOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button
                type="submit"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 999, border: "none", background: "#0D1117", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#D4FF59", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <Search size={14} /> Cari Lowongan
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features (7 cards -> Horizontal Scroll) */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, color: "#0D1117", marginBottom: 8 }}>
              Semua yang Kamu Butuhkan dalam Satu Platform
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#4A5568" }}>
              Fitur lengkap untuk mendukung perjalanan karier Anda dari awal hingga mendapat pekerjaan.
            </p>
          </div>
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
            marginBottom: 56,
            scrollbarWidth: "thin",
          }}
        >
          {sections.map((s) => {
            const Icon = s.icon;
            const isBlue = s.variant === "blue";
            const isLime = s.variant === "lime";
            const isDark = s.variant === "dark";

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
                key={s.title}
                style={{
                  flex: "0 0 300px",
                  scrollSnapAlign: "start",
                  background: bg,
                  borderRadius: 24,
                  padding: "28px 24px",
                  minHeight: 250,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ background: "#0D1117", borderRadius: 28, padding: "52px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, color: "#FFFFFF", marginBottom: 10 }}>Mulai Perjalanan Karier Anda</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#CBD5E1", marginBottom: 28 }}>Daftar gratis dan temukan pekerjaan yang benar-benar cocok untuk Anda.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/daftar/kandidat")}
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
              <span>Daftar sebagai Kandidat</span>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={16} />
              </span>
            </button>
            <button
              onClick={() => navigate("/masuk/kandidat")}
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
              Masuk Kandidat
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
