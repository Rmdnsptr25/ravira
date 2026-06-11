import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { ArrowRight, Shield, Users, TrendingUp, BookOpen, BarChart2 } from "lucide-react";
import { RaviraOwlIcon } from "../components/RaviraLogo";

const misi = [
  { icon: Users, color: "#1677FF", text: "Menghubungkan kandidat dan perusahaan dengan matching berbasis AI yang relevan dan akurat." },
  { icon: TrendingUp, color: "#10d98e", text: "Membantu kandidat memahami skill gap dan mengambil langkah pengembangan diri yang terarah." },
  { icon: BookOpen, color: "#f59e0b", text: "Mendukung peningkatan kompetensi melalui rekomendasi pelatihan yang dipersonalisasi." },
  { icon: BarChart2, color: "#4DB8FF", text: "Memberikan insight workforce berbasis data agregat untuk mendukung kebijakan ketenagakerjaan." },
];

export default function TentangPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #020a1c 0%, #071228 55%, #0a1b3d 100%)", paddingTop: 120, paddingBottom: 80, position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(22,119,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <RaviraOwlIcon size={80} />
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16 }}>Tentang Ravira</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#7a99c8", lineHeight: 1.8 }}>
            Ravira adalah ekosistem rekrutmen berbasis AI yang dibangun untuk menghubungkan talenta Indonesia dengan peluang kerja yang benar-benar relevan — secara otomatis, adil, dan transparan.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px" }}>

        {/* Visi */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "36px 40px", marginBottom: 24, boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 28, background: "#1677FF", borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", margin: 0 }}>Visi Kami</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#4a6080", lineHeight: 1.8, margin: 0 }}>
            Menjadi platform rekrutmen AI terpercaya di Indonesia yang membantu setiap talenta menemukan peluang karier yang paling relevan — sekaligus membantu perusahaan menemukan kandidat terbaik secara efisien, objektif, dan berbasis data.
          </p>
        </div>

        {/* Misi */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "36px 40px", marginBottom: 24, boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 28, background: "#10d98e", borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", margin: 0 }}>Misi Kami</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {misi.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${m.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={m.color} />
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6080", lineHeight: 1.7, margin: 0, paddingTop: 10 }}>{m.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keamanan Data */}
        <div style={{ background: "rgba(16,217,142,0.04)", borderRadius: 20, border: "1px solid rgba(16,217,142,0.15)", padding: "36px 40px", marginBottom: 40, boxShadow: "0 4px 18px rgba(10,27,61,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Shield size={20} color="#10d98e" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", margin: 0 }}>Keamanan Data & Consent Kandidat</h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6080", lineHeight: 1.8, marginBottom: 16 }}>
            Ravira berkomitmen penuh terhadap perlindungan data pribadi kandidat. Seluruh data yang diberikan kandidat hanya digunakan sesuai consent yang diberikan secara eksplisit.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Data pribadi kandidat tidak pernah dijual atau dibagikan ke pihak ketiga tanpa izin.",
              "Lembaga pemerintah hanya mendapatkan akses data agregat dan anonim — tidak ada data individual.",
              "Kandidat dapat menarik consent dan meminta penghapusan data kapan saja.",
              "Seluruh data dienkripsi dan disimpan sesuai standar keamanan industri.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10d98e", marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", lineHeight: 1.6, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #020a1c, #0a1b3d)", borderRadius: 24, padding: "40px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Bergabung dengan Ravira</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#7a99c8", marginBottom: 24 }}>Kandidat, perusahaan, dan lembaga pemerintah — semua punya tempat di ekosistem Ravira.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/daftar")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)" }}>
              Daftar Sekarang <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/kontak")} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#BDE1FF", cursor: "pointer" }}>
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
