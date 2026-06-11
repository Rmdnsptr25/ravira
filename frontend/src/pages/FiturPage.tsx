import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Cpu, TrendingUp, BookOpen, MapPin, BarChart2, ArrowRight, Shield, GitBranch, Star } from "lucide-react";

const features = [
  {
    icon: Cpu,
    color: "#1677FF",
    bg: "rgba(22,119,255,0.08)",
    title: "Smart Job Matching",
    desc: "Algoritma AI mencocokkan profil kandidat dengan lowongan secara otomatis berdasarkan skill, pengalaman, dan preferensi lokasi — bukan sekadar keyword.",
  },
  {
    icon: Star,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Explainable Match Score",
    desc: "Setiap match score dilengkapi penjelasan transparan: skill apa yang cocok, apa yang kurang, dan mengapa lowongan ini direkomendasikan untukmu.",
  },
  {
    icon: TrendingUp,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Skill Gap Advisor",
    desc: "Ravira menganalisis skill kandidat vs kebutuhan pasar kerja, lalu memberikan laporan gap yang jelas beserta saran pengembangan skill spesifik.",
  },
  {
    icon: BookOpen,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "Personalized Training",
    desc: "Rekomendasi pelatihan dan kursus disesuaikan dengan skill gap masing-masing kandidat — bukan kurikulum generik.",
  },
  {
    icon: MapPin,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.08)",
    title: "Cross-Region Matching",
    desc: "Temukan peluang kerja di luar kota atau wilayah asal. Ravira membantu kandidat mengeksplorasi pasar kerja yang lebih luas.",
  },
  {
    icon: BarChart2,
    color: "#1677FF",
    bg: "rgba(22,119,255,0.06)",
    title: "Workforce Analytics",
    desc: "Data agregat tenaga kerja untuk lembaga pemerintah dan institusi: tren skill, heatmap wilayah, dan proyeksi kompetensi — semuanya anonim.",
  },
  {
    icon: Shield,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Consent & Privacy Control",
    desc: "Kandidat mengendalikan data mereka sendiri. Profil hanya bisa diakses oleh recruiter setelah kandidat memberikan consent eksplisit — transparan dan aman.",
  },
  {
    icon: GitBranch,
    color: "#ff6b6b",
    bg: "rgba(255,107,107,0.08)",
    title: "Recruiter Pipeline",
    desc: "Kelola seluruh proses rekrutmen dalam satu kanban board visual: dari lamaran masuk, screening, interview, offer, hingga hired — semua terpusat.",
  },
];

export default function FiturPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #020a1c 0%, #071228 55%, #0a1b3d 100%)", paddingTop: 120, paddingBottom: 72, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(22,119,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(22,119,255,0.1)", border: "1px solid rgba(22,119,255,0.2)", borderRadius: 20, padding: "4px 14px" }}>
            Platform Rekrutmen AI
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.15 }}>
            Fitur Utama Ravira
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#7a99c8", lineHeight: 1.8, marginBottom: 0 }}>
            Ekosistem rekrutmen berbasis AI yang menghubungkan kandidat, perusahaan, dan lembaga pemerintah dalam satu platform terintegrasi.
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "32px 28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={24} color={f.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>{f.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 60, textAlign: "center", background: "linear-gradient(135deg, #020a1c, #0a1b3d)", borderRadius: 24, padding: "48px 32px" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Siap Memulai?</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#7a99c8", marginBottom: 28 }}>Bergabunglah dengan 50.000+ pengguna Ravira dan mulai perjalanan karier atau rekrutmen Anda.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/daftar")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)" }}>
              Mulai Sekarang <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/masuk")} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: "#BDE1FF", cursor: "pointer" }}>
              Masuk ke Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
