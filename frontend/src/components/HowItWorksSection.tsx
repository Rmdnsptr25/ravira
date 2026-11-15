import { useState } from "react";
import { Upload, Brain, FileText, Rocket, PlusSquare, Search, CheckSquare, LayoutDashboard } from "lucide-react";

const candidateSteps = [
  { icon: Upload, title: "Upload CV atau Lengkapi Profil", desc: "Unggah CV atau isi profil lengkap termasuk skill, pengalaman, dan preferensi karier.", variant: "light" as const },
  { icon: Brain, title: "AI Menganalisis Skill & Pengalaman", desc: "Mesin AI Ravira membaca profil Anda secara mendalam dan memahami potensi karier Anda.", variant: "blue" as const },
  { icon: FileText, title: "Dapatkan Rekomendasi & Skill Gap Report", desc: "Terima daftar pekerjaan paling cocok beserta laporan skill gap yang personal dan actionable.", variant: "lime" as const },
  { icon: Rocket, title: "Lamar, Belajar, dan Kembangkan Karier", desc: "Lamar langsung dari platform, ikuti kursus rekomendasi, dan pantau progress karier Anda.", variant: "dark" as const },
];

const recruiterSteps = [
  { icon: PlusSquare, title: "Buat Job Posting", desc: "Publikasikan lowongan kerja dengan deskripsi kebutuhan skill, pengalaman, dan lokasi.", variant: "light" as const },
  { icon: Search, title: "AI Mencari Kandidat Paling Cocok", desc: "Ravira AI secara otomatis menyisir database kandidat dan menemukan profil paling relevan.", variant: "blue" as const },
  { icon: CheckSquare, title: "Terima Shortlist Kandidat Tervalidasi", desc: "Dapatkan daftar kandidat terbaik dilengkapi match score, analisis skill, dan ringkasan profil.", variant: "lime" as const },
  { icon: LayoutDashboard, title: "Pantau Pipeline dari Dashboard", desc: "Kelola seluruh proses rekrutmen dari satu dashboard terpadu yang mudah digunakan.", variant: "dark" as const },
];

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"kandidat" | "recruiter">("kandidat");
  const steps = activeTab === "kandidat" ? candidateSteps : recruiterSteps;

  return (
    <section style={{ padding: "88px 24px", background: "#FFFFFF", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#0D1117",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D1117", display: "inline-block" }} />
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 600,
              color: "#0D1117",
              lineHeight: 1.16,
              letterSpacing: "-1.2px",
              marginBottom: 28,
            }}
          >
            Cara Kerja Ravira
          </h2>

          <div
            role="tablist"
            aria-label="Pilih Peran"
            style={{
              display: "inline-flex",
              borderRadius: 100,
              background: "#F4F5F7",
              border: "1px solid #E2E8F0",
              padding: 5,
              gap: 4,
            }}
          >
            {(["kandidat", "recruiter"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "10px 24px",
                    minHeight: 44,
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s",
                    background: isActive ? "#0D1117" : "transparent",
                    color: isActive ? "#D4FF59" : "#4A5568",
                  }}
                >
                  {tab === "kandidat" ? "Untuk Kandidat" : "Untuk Recruiter"}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {steps.map((step, i) => {
            const isBlue = step.variant === "blue";
            const isLime = step.variant === "lime";
            const isDark = step.variant === "dark";

            const bg = isBlue
              ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
              : isLime
              ? "#D4FF59"
              : isDark
              ? "#0D1117"
              : "#F4F5F7";

            const titleColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
            const descColor = isBlue
              ? "rgba(255,255,255,0.9)"
              : isDark
              ? "#CBD5E1"
              : isLime
              ? "#1E293B"
              : "#4A5568";

            const badgeBg = isBlue
              ? "#FFFFFF"
              : isLime
              ? "#0D1117"
              : isDark
              ? "#D4FF59"
              : "#FFFFFF";
            const badgeColor = isLime ? "#D4FF59" : "#0D1117";

            return (
              <div
                key={step.title}
                style={{
                  padding: "28px 24px",
                  borderRadius: 24,
                  background: bg,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 240,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: badgeBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <step.icon size={19} color={badgeColor} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 28,
                      fontWeight: 600,
                      color: isBlue || isDark ? "rgba(255,255,255,0.35)" : "rgba(13,17,23,0.22)",
                      letterSpacing: "-1px",
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>

                <div>
                  <h4
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: titleColor,
                      marginBottom: 8,
                      lineHeight: 1.35,
                    }}
                  >
                    {step.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: descColor,
                      lineHeight: 1.65,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
