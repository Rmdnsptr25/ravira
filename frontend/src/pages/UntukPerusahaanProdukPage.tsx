import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Briefcase, BookmarkCheck, Cpu, Shield, Plug, ArrowRight } from "lucide-react";

const products = [
  {
    icon: Briefcase,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "Buat Lowongan",
    desc: "Publikasikan lowongan dalam hitungan menit. Tentukan kriteria skill, pengalaman, lokasi, dan tipe pekerjaan — sistem AI langsung menyortir kandidat yang relevan.",
    bullets: ["Template lowongan siap pakai", "Kriteria AI yang dapat dikonfigurasi", "Multi-lokasi dalam satu lowongan"],
  },
  {
    icon: BookmarkCheck,
    color: "#1677FF",
    bg: "rgba(22,119,255,0.08)",
    title: "Shortlist Kandidat Berbasis AI",
    desc: "Ravira secara otomatis meranking dan memfilter kandidat berdasarkan match score AI, memastikan hanya profil terbaik yang masuk shortlist Anda.",
    bullets: ["Ranking otomatis berdasarkan relevansi", "Filter multi-dimensi skill dan pengalaman", "Shortlist bisa dikustomisasi per lowongan"],
  },
  {
    icon: Cpu,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Match Score Kandidat",
    desc: "Setiap kandidat mendapatkan match score yang dihitung dari relevansi skill, pengalaman, dan kecocokan peran — keputusan hiring lebih objektif dan terukur.",
    bullets: ["Skor 0–100% dengan penjelasan transparan", "Breakdown per dimensi (skill, pengalaman, lokasi)", "Bisa dibandingkan antar kandidat"],
  },
  {
    icon: Shield,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Profil Kandidat Berbasis Consent",
    desc: "Profil kandidat hanya dapat dilihat setelah kandidat memberikan consent. Ravira memastikan proses rekrutmen etis dan sesuai regulasi perlindungan data.",
    bullets: ["Kandidat kontrol penuh atas data mereka", "Audit trail akses profil", "Sesuai regulasi perlindungan data (PDPA)"],
  },
  {
    icon: Plug,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.08)",
    title: "Integrasi ATS / HRIS",
    desc: "Hubungkan Ravira dengan sistem ATS atau HRIS yang sudah Anda gunakan. Data kandidat dan pipeline tersinkronisasi secara otomatis tanpa duplikasi kerja.",
    bullets: ["Kompatibel dengan Workday, SAP, Oracle", "Sinkronisasi dua arah real-time", "API dokumentasi tersedia untuk tim IT"],
  },
];

export default function UntukPerusahaanProdukPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0d0820 0%, #130e2e 55%, #1a0a3d 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Produk & Fitur
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Fitur Rekrutmen Lengkap untuk Perusahaan
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9a85c8", lineHeight: 1.7 }}>
            Dari posting lowongan hingga hired — semua dalam satu ekosistem Ravira.
          </p>
        </div>
      </div>

      {/* Product Cards */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "32px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={26} color={p.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>{p.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", lineHeight: 1.7, marginBottom: 16 }}>{p.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {p.bullets.map((b) => (
                      <span key={b} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: p.color, background: p.bg, border: `1px solid ${p.color}30`, borderRadius: 99, padding: "4px 12px" }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button onClick={() => navigate("/daftar/perusahaan")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
            Daftarkan Perusahaan <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
