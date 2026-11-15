import { useRef } from "react";
import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Footer } from "../components/Footer";
import { GitBranch, Calendar, Users, CheckCircle, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const solutions = [
  {
    icon: GitBranch,
    variant: "blue" as const,
    title: "Pipeline Rekrutmen",
    desc: "Kelola seluruh proses rekrutmen secara visual: dari aplikasi masuk, screening, interview, offer, hingga hired, dalam satu kanban board terintegrasi.",
    detail: "Setiap kandidat bergerak melalui tahap yang terstruktur. Tim recruiter bisa melihat status terkini secara real-time dan berkolaborasi dalam satu tampilan.",
  },
  {
    icon: Calendar,
    variant: "light" as const,
    title: "Jadwal Interview",
    desc: "Jadwalkan sesi interview langsung dari profil kandidat. Kirim undangan dan konfirmasi jadwal tanpa keluar dari platform Ravira.",
    detail: "Integrasi dengan Google Calendar dan Outlook. Kandidat mendapat notifikasi otomatis dan bisa mengkonfirmasi jadwal dari notifikasi mereka.",
  },
  {
    icon: CheckCircle,
    variant: "lime" as const,
    title: "Screening Kandidat",
    desc: "Filter dan screening kandidat secara otomatis berdasarkan kriteria yang Anda tentukan. Hemat waktu, fokus hanya pada yang benar-benar relevan.",
    detail: "AI melakukan pre-screening berdasarkan skill, pengalaman, lokasi, dan preferensi gaji. Hanya kandidat yang memenuhi threshold yang masuk antrian review.",
  },
  {
    icon: Users,
    variant: "dark" as const,
    title: "Manajemen Status Kandidat",
    desc: "Ubah status kandidat di setiap tahap pipeline dengan mudah. Perubahan status langsung tercatat dan kandidat mendapatkan notifikasi otomatis.",
    detail: "Status: Applied → Screening → Interview → Offer → Hired / Rejected. Setiap perubahan status memicu notifikasi ke kandidat dan update di Lamaran Saya mereka.",
  },
  {
    icon: Users,
    variant: "light" as const,
    title: "Kolaborasi Tim Recruiter",
    desc: "Beberapa recruiter bisa bekerja dalam satu pipeline yang sama. Tambahkan catatan, tag rekan, dan bagikan kandidat antar anggota tim.",
    detail: "Role-based access: Admin bisa mengatur siapa yang dapat melihat dan mengubah data kandidat. Semua aksi tercatat di log aktivitas.",
  },
];

export default function UntukPerusahaanSolusiRekrutmenPage() {
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
              Solusi Rekrutmen
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Kelola Rekrutmen dari Awal hingga Hired
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7 }}>
              Pipeline visual, jadwal interview terintegrasi, dan kolaborasi tim recruiter dalam satu platform.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions (> 4 items -> Horizontal Scroll) */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 600, color: "#0D1117" }}>
            Alur Solusi Rekrutmen Terpadu
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser solusi ke kiri"
              onClick={() => scrollByAmount("left")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#F4F5F7", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Geser solusi ke kanan"
              onClick={() => scrollByAmount("right")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: "#0D1117", color: "#D4FF59", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="ravira-no-scrollbar"
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {solutions.map((s) => {
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
            const insetBg = isBlue || isDark ? "rgba(255,255,255,0.12)" : "#FFFFFF";
            const insetText = isBlue || isDark ? "#FFFFFF" : "#0D1117";

            return (
              <div
                key={s.title}
                style={{
                  flex: "0 0 340px",
                  scrollSnapAlign: "start",
                  background: bg,
                  borderRadius: 24,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 330,
                }}
              >
                <div>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, color: titleColor, marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: descColor, lineHeight: 1.65, marginBottom: 16 }}>{s.desc}</p>
                </div>
                <div style={{ background: insetBg, borderRadius: 16, padding: "14px 16px" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: insetText, lineHeight: 1.6, margin: 0 }}>{s.detail}</p>
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
            <span>Coba Sekarang</span>
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
