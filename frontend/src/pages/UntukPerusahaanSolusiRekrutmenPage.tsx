import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { GitBranch, Calendar, Users, CheckCircle, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: GitBranch,
    color: "#ff6b6b",
    bg: "rgba(255,107,107,0.08)",
    title: "Pipeline Rekrutmen",
    desc: "Kelola seluruh proses rekrutmen secara visual: dari aplikasi masuk, screening, interview, offer, hingga hired — dalam satu kanban board terintegrasi.",
    detail: "Setiap kandidat bergerak melalui tahap yang terstruktur. Tim recruiter bisa melihat status terkini secara real-time dan berkolaborasi dalam satu tampilan.",
  },
  {
    icon: Calendar,
    color: "#4DB8FF",
    bg: "rgba(77,184,255,0.08)",
    title: "Jadwal Interview",
    desc: "Jadwalkan sesi interview langsung dari profil kandidat. Kirim undangan dan konfirmasi jadwal tanpa keluar dari platform Ravira.",
    detail: "Integrasi dengan Google Calendar dan Outlook. Kandidat mendapat notifikasi otomatis dan bisa mengkonfirmasi jadwal dari notifikasi mereka.",
  },
  {
    icon: CheckCircle,
    color: "#10d98e",
    bg: "rgba(16,217,142,0.08)",
    title: "Screening Kandidat",
    desc: "Filter dan screening kandidat secara otomatis berdasarkan kriteria yang Anda tentukan. Hemat waktu — fokus hanya pada yang benar-benar relevan.",
    detail: "AI melakukan pre-screening berdasarkan skill, pengalaman, lokasi, dan preferensi gaji. Hanya kandidat yang memenuhi threshold yang masuk antrian review.",
  },
  {
    icon: Users,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "Manajemen Status Kandidat",
    desc: "Ubah status kandidat di setiap tahap pipeline dengan mudah. Perubahan status langsung tercatat dan kandidat mendapatkan notifikasi otomatis.",
    detail: "Status: Applied → Screening → Interview → Offer → Hired / Rejected. Setiap perubahan status memicu notifikasi ke kandidat dan update di Lamaran Saya mereka.",
  },
  {
    icon: Users,
    color: "#1677FF",
    bg: "rgba(22,119,255,0.08)",
    title: "Kolaborasi Tim Recruiter",
    desc: "Beberapa recruiter bisa bekerja dalam satu pipeline yang sama. Tambahkan catatan, tag rekan, dan bagikan kandidat antar anggota tim.",
    detail: "Role-based access: Admin bisa mengatur siapa yang dapat melihat dan mengubah data kandidat. Semua aksi tercatat di log aktivitas.",
  },
];

export default function UntukPerusahaanSolusiRekrutmenPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0d0820 0%, #130e2e 55%, #1a0a3d 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Solusi Rekrutmen
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Kelola Rekrutmen dari Awal hingga Hired
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9a85c8", lineHeight: 1.7 }}>
            Pipeline visual, jadwal interview terintegrasi, dan kolaborasi tim recruiter dalam satu platform.
          </p>
        </div>
      </div>

      {/* Solutions */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px 32px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={22} color={s.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>{s.title}</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8", lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</p>
                    <div style={{ background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.1)", borderRadius: 10, padding: "12px 16px" }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080", lineHeight: 1.6, margin: 0 }}>{s.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button onClick={() => navigate("/daftar/perusahaan")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
            Coba Sekarang <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
