import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { BarChart2, TrendingUp, MapPin, Cpu, BookOpen, FileText, ArrowRight, Shield } from "lucide-react";

const sections = [
  { icon: BarChart2, color: "#4DB8FF", bg: "rgba(77,184,255,0.08)", title: "Supply-Demand Tenaga Kerja", desc: "Pantau keseimbangan antara jumlah kandidat tersedia dan kebutuhan industri secara regional — data diperbarui secara berkala." },
  { icon: TrendingUp, color: "#10d98e", bg: "rgba(16,217,142,0.08)", title: "Tren Skill", desc: "Analisis skill apa yang sedang tumbuh permintaannya, mana yang mulai jenuh, dan skill baru apa yang mulai dibutuhkan industri." },
  { icon: MapPin, color: "#1677FF", bg: "rgba(22,119,255,0.08)", title: "Heatmap Wilayah", desc: "Visualisasi persebaran tenaga kerja dan lowongan per provinsi dan kota — identifikasi wilayah dengan kebutuhan rekrutmen tertinggi." },
  { icon: Cpu, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", title: "Proyeksi Kompetensi", desc: "Model prediktif AI memproyeksikan kebutuhan skill 12-24 bulan ke depan berdasarkan tren industri dan pertumbuhan ekonomi regional." },
  { icon: BookOpen, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", title: "Rekomendasi Program Pelatihan", desc: "Berdasarkan gap skill regional, Ravira merekomendasikan program pelatihan prioritas berikut estimasi anggaran dan jumlah penerima manfaat." },
  { icon: FileText, color: "#ff6b6b", bg: "rgba(255,107,107,0.08)", title: "Laporan dan Ekspor Data", desc: "Unduh laporan dalam format PDF atau Excel untuk kebutuhan pelaporan internal, perencanaan kebijakan, dan presentasi pemangku kepentingan." },
];

export default function PublicAnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021220 0%, #041c2e 55%, #062640 100%)", paddingTop: 120, paddingBottom: 72, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,184,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Workforce Intelligence
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.15 }}>
            Workforce Analytics Ravira
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6a9ab8", lineHeight: 1.8, marginBottom: 24 }}>
            Ravira menyediakan insight tenaga kerja berbasis data agregat dan anonim untuk mendukung kebijakan ketenagakerjaan berbasis bukti.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.2)", borderRadius: 10, padding: "8px 16px" }}>
            <Shield size={14} color="#10d98e" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#10d98e" }}>
              Data analytics ditampilkan secara agregat dan anonim.
            </span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginBottom: 60 }}>
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "30px 26px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={22} color={s.color} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>{s.title}</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div style={{ background: "rgba(16,217,142,0.04)", border: "1px solid rgba(16,217,142,0.15)", borderRadius: 16, padding: "24px 28px", marginBottom: 32, display: "flex", alignItems: "flex-start", gap: 14 }}>
          <Shield size={20} color="#10d98e" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 6 }}>Komitmen Privasi Data</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.7, margin: 0 }}>
              Seluruh data yang ditampilkan pada dashboard analytics bersifat agregat dan anonim. Tidak ada data pribadi kandidat (nama, email, nomor telepon, CV) yang dapat diakses oleh lembaga pemerintah maupun institusi mitra. Privasi kandidat dilindungi sepenuhnya sesuai dengan kebijakan consent Ravira.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #021220, #062640)", borderRadius: 24, padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Akses Dashboard Analytics</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a9ab8", marginBottom: 28 }}>Tersedia untuk lembaga pemerintah, Disnaker, dan institusi mitra yang telah terverifikasi.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/daftar/pemerintah")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
              Ajukan Akses Analytics <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/masuk/pemerintah")} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#4DB8FF", cursor: "pointer" }}>
              Masuk Pemerintah / Institusi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
