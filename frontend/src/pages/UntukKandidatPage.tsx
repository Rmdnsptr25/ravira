import { useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Cpu, TrendingUp, BookOpen, Bookmark, FileText, MapPin, ArrowRight, Search } from "lucide-react";

const sections = [
  { icon: Cpu, color: "#1677FF", bg: "rgba(22,119,255,0.08)", title: "Rekomendasi Pekerjaan Berbasis AI", desc: "Algoritma AI Ravira mencocokkan profil dan skill Anda dengan ribuan lowongan secara otomatis — hasil yang benar-benar relevan, bukan sekadar keyword." },
  { icon: TrendingUp, color: "#10d98e", bg: "rgba(16,217,142,0.08)", title: "Match Score", desc: "Setiap lowongan menampilkan match score yang dihitung dari relevansi skill, pengalaman, dan preferensi Anda — sehingga Anda tahu lowongan mana yang paling cocok." },
  { icon: TrendingUp, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", title: "Skill Gap Report", desc: "Ketahui skill apa yang perlu ditingkatkan dibandingkan kandidat lain di industri yang sama. Laporan personal dan actionable." },
  { icon: BookOpen, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", title: "Rekomendasi Pelatihan", desc: "Kursus dan pelatihan yang direkomendasikan disesuaikan dengan skill gap Anda — belajar terarah, bukan sembarang kursus generik." },
  { icon: Bookmark, color: "#4DB8FF", bg: "rgba(77,184,255,0.08)", title: "Lowongan Tersimpan", desc: "Simpan lowongan yang menarik dan akses kapan saja. Bandingkan pilihan sebelum memutuskan untuk melamar." },
  { icon: FileText, color: "#10d98e", bg: "rgba(16,217,142,0.06)", title: "Lamaran Saya", desc: "Pantau status setiap lamaran: Dikirim, Screening, Interview, Offer, hingga Diterima — semua dalam satu tampilan." },
  { icon: MapPin, color: "#ff6b6b", bg: "rgba(255,107,107,0.08)", title: "Peluang Lintas Wilayah", desc: "Eksplorasi lowongan di luar kota atau provinsi Anda. Ravira membantu Anda menemukan peluang yang lebih luas sesuai preferensi mobilitas." },
];

const lokasiOptions = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Malang", "Bekasi", "Tangerang", "Depok", "Solo"];

export default function UntukKandidatPage() {
  const navigate = useNavigate();
  const [posisi, setPosisi] = useState("");
  const [lokasi, setLokasi] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/masuk/kandidat");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #020a1c 0%, #071228 55%, #0a1b3d 100%)", paddingTop: 120, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(22,119,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#10d98e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(16,217,142,0.1)", border: "1px solid rgba(16,217,142,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Untuk Kandidat
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.15 }}>
            Temukan Pekerjaan yang Lebih Relevan dengan Ravira
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#7a99c8", lineHeight: 1.8, marginBottom: 36 }}>
            Ravira membantu kandidat menemukan pekerjaan, memahami skill gap, mengikuti pelatihan, menyimpan lowongan, dan memantau status lamaran — semua dalam satu platform.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ background: "#fff", borderRadius: 16, padding: "12px 12px 12px 16px", display: "flex", gap: 10, alignItems: "center", maxWidth: 680, margin: "0 auto", boxShadow: "0 8px 32px rgba(10,27,61,0.2)", flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 180, display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid rgba(22,119,255,0.12)", paddingRight: 10 }}>
              <Search size={16} color="#9ab4cc" />
              <input
                type="text"
                value={posisi}
                onChange={(e) => setPosisi(e.target.value)}
                placeholder="Posisi atau kata kunci..."
                style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "transparent", width: "100%" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={16} color="#9ab4cc" />
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: lokasi ? "#0A1B3D" : "#9ab4cc", background: "transparent", width: "100%", cursor: "pointer" }}
              >
                <option value="">Semua Lokasi</option>
                {lokasiOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button
              type="submit"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              <Search size={14} /> Cari Lowongan
            </button>
          </form>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#0A1B3D", marginBottom: 10 }}>
            Semua yang Kamu Butuhkan dalam Satu Platform
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
            Fitur lengkap untuk mendukung perjalanan karier Anda dari awal hingga mendapat pekerjaan.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22, marginBottom: 60 }}>
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px 24px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{s.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #020a1c, #0a1b3d)", borderRadius: 24, padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Mulai Perjalanan Karier Anda</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#7a99c8", marginBottom: 28 }}>Daftar gratis dan temukan pekerjaan yang benar-benar cocok untuk Anda.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/daftar/kandidat")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)" }}>
              Daftar sebagai Kandidat <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/masuk/kandidat")} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#BDE1FF", cursor: "pointer" }}>
              Masuk Kandidat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
