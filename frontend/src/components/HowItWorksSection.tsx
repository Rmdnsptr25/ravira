import { useState } from "react";
import { Upload, Brain, FileText, Rocket, PlusSquare, Search, CheckSquare, LayoutDashboard } from "lucide-react";

const candidateSteps = [
  { icon: Upload, title: "Upload CV atau Lengkapi Profil", desc: "Unggah CV atau isi profil lengkap termasuk skill, pengalaman, dan preferensi karier.", color: "#1677FF" },
  { icon: Brain, title: "AI Menganalisis Skill & Pengalaman", desc: "Mesin AI Ravira membaca profil Anda secara mendalam dan memahami potensi karier Anda.", color: "#0D47A1" },
  { icon: FileText, title: "Dapatkan Rekomendasi & Skill Gap Report", desc: "Terima daftar pekerjaan paling cocok beserta laporan skill gap yang personal dan actionable.", color: "#1677FF" },
  { icon: Rocket, title: "Lamar, Belajar, dan Kembangkan Karier", desc: "Lamar langsung dari platform, ikuti kursus rekomendasi, dan pantau progress karier Anda.", color: "#0D47A1" },
];

const recruiterSteps = [
  { icon: PlusSquare, title: "Buat Job Posting", desc: "Publikasikan lowongan kerja dengan deskripsi kebutuhan skill, pengalaman, dan lokasi.", color: "#1677FF" },
  { icon: Search, title: "AI Mencari Kandidat Paling Cocok", desc: "Ravira AI secara otomatis menyisir database kandidat dan menemukan profil paling relevan.", color: "#0D47A1" },
  { icon: CheckSquare, title: "Terima Shortlist Kandidat Tervalidasi", desc: "Dapatkan daftar kandidat terbaik dilengkapi match score, analisis skill, dan ringkasan profil.", color: "#1677FF" },
  { icon: LayoutDashboard, title: "Pantau Pipeline dari Dashboard", desc: "Kelola seluruh proses rekrutmen dari satu dashboard terpadu yang mudah digunakan.", color: "#0D47A1" },
];

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"kandidat" | "recruiter">("kandidat");
  const steps = activeTab === "kandidat" ? candidateSteps : recruiterSteps;

  return (
    <section style={{ padding: "96px 24px", background: "#ffffff", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: "#1677FF", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(22,119,255,0.25)",
            borderRadius: 100, background: "rgba(22,119,255,0.06)", marginBottom: 16,
          }}>
            How It Works
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800,
            color: "#0A1B3D", lineHeight: 1.2, letterSpacing: "-0.8px", marginBottom: 28,
          }}>
            Cara Kerja Ravira
          </h2>

          <div style={{
            display: "inline-flex", borderRadius: 12,
            background: "#f0f7ff",
            border: "1px solid rgba(22,119,255,0.15)",
            boxShadow: "0 2px 12px rgba(10,27,61,0.06)",
            padding: 4, gap: 4,
          }}>
            {(["kandidat", "recruiter"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
                  padding: "10px 24px", borderRadius: 9, border: "none", cursor: "pointer",
                  transition: "all 0.2s",
                  background: activeTab === tab ? "linear-gradient(135deg, #1677FF, #0D47A1)" : "transparent",
                  color: activeTab === tab ? "#fff" : "#6a88b8",
                  boxShadow: activeTab === tab ? "0 4px 16px rgba(22,119,255,0.3)" : "none",
                }}
              >
                {tab === "kandidat" ? "Untuk Kandidat" : "Untuk Recruiter"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {steps.map((step, i) => (
            <div
              key={step.title}
              style={{
                padding: "28px 22px", borderRadius: 16,
                background: "#ffffff",
                border: "1px solid rgba(22,119,255,0.1)",
                boxShadow: "0 2px 16px rgba(10,27,61,0.05)",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,119,255,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(10,27,61,0.05)"; }}
            >
              <div style={{
                position: "absolute", top: -12, left: 22,
                width: 24, height: 24, borderRadius: "50%",
                background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#fff",
                boxShadow: `0 4px 12px ${step.color}44`,
              }}>
                {i + 1}
              </div>

              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${step.color}0e`, border: `1px solid ${step.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14, marginTop: 6,
              }}>
                <step.icon size={20} color={step.color} />
              </div>

              <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 7, lineHeight: 1.3 }}>
                {step.title}
              </h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
