import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, CheckCircle2, XCircle, Star, Mail, Phone, Linkedin, Download, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { InterviewScheduleModal } from "../components/Modals";

const candidate = {
  name: "Budi Santoso",
  role: "Senior UX Designer",
  location: "Yogyakarta",
  exp: "4 tahun",
  match: 94,
  email: "budi.santoso@email.com",
  phone: "081234567890",
  linkedin: "linkedin.com/in/budisantoso",
  summary: "Senior UX Designer berbasis di Yogyakarta dengan 4 tahun pengalaman di industri e-commerce dan startup digital. Spesialisasi dalam Figma, UI Design, dan User Research. Tertarik peluang di Jakarta dan kota-kota besar Pulau Jawa.",
  experience: [
    { company: "Gojek", role: "UX Designer", period: "2023 – Sekarang", desc: "Lead design untuk fitur super app di wilayah Jawa Tengah dan Yogyakarta." },
    { company: "Tokopedia", role: "UI Designer", period: "2021 – 2023", desc: "Merancang ulang alur checkout yang meningkatkan konversi sebesar 23%." },
    { company: "Startup Jogja", role: "Product Designer", period: "2020 – 2021", desc: "Designer pertama di startup edtech lokal, membangun design system dari awal." },
  ],
  education: [
    { school: "Universitas Gadjah Mada", degree: "S1 Desain Komunikasi Visual", year: "2020" },
  ],
  skillMatch: ["Figma", "UI Design", "User Research"],
  skillGap: ["Design System Advanced"],
  aiReason: "Budi Santoso memiliki pengalaman UX yang kuat dengan background Figma dan UI Design yang sesuai posisi Senior UX Designer. Match score 94% — kandidat baru dari Yogyakarta yang tertarik relokasi ke Jakarta.",
  portfolio: [
    { title: "Gojek Jawa Feature", category: "Mobile UX", impact: "+15% retention" },
    { title: "Tokopedia Checkout Flow", category: "E-Commerce", impact: "+23% conversion" },
    { title: "EdTech Design System", category: "Design System", impact: "30+ components" },
  ],
  status: "Pelamar Baru",
};

export default function CandidateProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showPipelineToast, setShowPipelineToast] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(22,119,255,0.1)", padding: "0 28px", height: 60, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 20 }}>
        <button onClick={() => navigate("/dashboard/perusahaan")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          <ArrowLeft size={15} /> Kembali ke Pipeline
        </button>
        <div style={{ flex: 1 }} />
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}>
          <Download size={14} /> Unduh CV
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}>
          <MessageSquare size={14} /> Hubungi
        </button>
        <button onClick={() => setShowInterviewModal(true)} style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}>
          Pindah ke Interview
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        {/* Main */}
        <div>
          {/* Profile header */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                {candidate.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>{candidate.name}</h1>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a88b8", marginBottom: 12 }}>{candidate.role}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}><MapPin size={13} /> {candidate.location}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}><Briefcase size={13} /> {candidate.exp} pengalaman</span>
                  <a href={`mailto:${candidate.email}`} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", textDecoration: "none" }}><Mail size={13} /> {candidate.email}</a>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginBottom: 4 }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>{candidate.match}%</span>
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#6a88b8" }}>match score</div>
                <div style={{ marginTop: 8, height: 6, width: 100, borderRadius: 3, background: "#e8f0fe", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${candidate.match}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 3 }} />
                </div>
              </div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.8, padding: "16px 20px", background: "#f0f7ff", borderRadius: 12 }}>{candidate.summary}</p>
          </div>

          {/* Experience */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 18 }}>Pengalaman Kerja</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {candidate.experience.map((e, i) => (
                <div key={e.company} style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(22,119,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#1677FF", flexShrink: 0 }}>
                      {e.company.charAt(0)}
                    </div>
                    {i < candidate.experience.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(22,119,255,0.1)", marginTop: 8 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < candidate.experience.length - 1 ? 20 : 0 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{e.role}</div>
                    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", fontWeight: 500 }}>{e.company}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9ab4cc" }}>{e.period}</span>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", lineHeight: 1.6 }}>{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px" }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Portfolio Pilihan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {candidate.portfolio.map((p) => (
                <div key={p.title} style={{ background: "#f0f7ff", borderRadius: 14, padding: "18px", border: "1px solid rgba(22,119,255,0.12)", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1677FF"; e.currentTarget.style.background = "rgba(22,119,255,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(22,119,255,0.12)"; e.currentTarget.style.background = "#f0f7ff"; }}
                >
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 10 }}>{p.category}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#10d98e", fontWeight: 700 }}>{p.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* AI Reasoning */}
          <div style={{ background: "linear-gradient(135deg, #071228, #0a1b3d)", borderRadius: 18, border: "1px solid rgba(22,119,255,0.2)", padding: "22px", marginBottom: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4DB8FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Analisis AI Ravira</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8899bb", lineHeight: 1.7 }}>{candidate.aiReason}</p>
          </div>

          {/* Skill Match */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "22px", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 12 }}>Skill Cocok</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
              {candidate.skillMatch.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.3)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#10d98e" }}>
                  <CheckCircle2 size={10} /> {s}
                </span>
              ))}
            </div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>Skill yang Masih Kurang</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {candidate.skillGap.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.25)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#ff6b6b" }}>
                  <XCircle size={10} /> {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "22px", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 12 }}>Pendidikan</h3>
            {candidate.education.map((e) => (
              <div key={e.school} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(22,119,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GraduationCap size={16} color="#1677FF" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{e.degree}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{e.school} · {e.year}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => setShowInterviewModal(true)} style={{ padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}>
              Jadwalkan Interview <ChevronRight size={14} />
            </button>
            <button style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Linkedin size={14} /> Lihat LinkedIn
            </button>
            <button onClick={() => { toast.success("Kandidat berhasil dimasukkan ke pipeline"); navigate("/dashboard/perusahaan/pipeline"); }} style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Masukkan ke Pipeline
            </button>
            <button style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Phone size={14} /> Hubungi via WA
            </button>
          </div>
        </div>
      </div>
      {showInterviewModal && (
        <InterviewScheduleModal
          candidateName={candidate.name}
          onConfirm={() => setShowInterviewModal(false)}
          onClose={() => setShowInterviewModal(false)}
        />
      )}
    </div>
  );
}
