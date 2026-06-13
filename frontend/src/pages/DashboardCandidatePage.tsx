import { useState } from "react";
import { useNavigate } from "react-router";
import { Home, Briefcase, BarChart2, BookOpen, FileText, Globe, User, Settings, MapPin, Clock, TrendingUp, ChevronRight, Bookmark } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";

const sidebarItems: SidebarItem[] = [
  { key: "beranda", label: "Beranda", icon: <Home size={16} />, path: "/dashboard/kandidat" },
  { key: "pekerjaan", label: "Rekomendasi Pekerjaan", icon: <Briefcase size={16} />, path: "/dashboard/kandidat/rekomendasi" },
  { key: "tersimpan", label: "Lowongan Tersimpan", icon: <Bookmark size={16} />, path: "/dashboard/kandidat/tersimpan" },
  { key: "skill", label: "Skill Gap", icon: <BarChart2 size={16} />, path: "/dashboard/kandidat/skill-gap" },
  { key: "pelatihan", label: "Pelatihan", icon: <BookOpen size={16} />, path: "/dashboard/kandidat/pelatihan" },
  { key: "lamaran", label: "Lamaran Saya", icon: <FileText size={16} />, path: "/dashboard/kandidat/lamaran" },
  { key: "lintas", label: "Peluang Lintas Wilayah", icon: <Globe size={16} />, path: "/dashboard/kandidat/cross-region" },
  { key: "profil", label: "Profil Saya", icon: <User size={16} />, path: "/dashboard/kandidat/profil" },
  { key: "pengaturan", label: "Pengaturan Privasi", icon: <Settings size={16} />, path: "/dashboard/kandidat/privasi" },
];

const jobRecs = [
  { id: "1", title: "Senior UX Designer", company: "Tokopedia", location: "Jakarta Selatan", type: "Full-time", match: 94, reason: "Skill Figma dan pengalaman UI sangat cocok" },
  { id: "2", title: "Product Designer", company: "Gojek", location: "Jakarta", type: "Hybrid", match: 88, reason: "Background desain sistem kuat, ada training yang direkomendasikan" },
  { id: "3", title: "UI/UX Lead", company: "Traveloka", location: "Jakarta", type: "Full-time", match: 82, reason: "Cocok untuk tahap karier berikutnya, ada 2 skill yang perlu ditingkatkan" },
];

const skillGaps = [
  { skill: "Figma Advanced", level: 70, gap: 30, color: "#ff9a3c" },
  { skill: "React / Next.js", level: 45, gap: 55, color: "#ff6b6b" },
  { skill: "Design Systems", level: 80, gap: 20, color: "#f59e0b" },
];

const trainings = [
  { id: "1", title: "UX Research Fundamentals", platform: "Coursera", duration: "4 minggu", level: "Intermediate", progress: 72 },
  { id: "2", title: "Advanced Figma Prototyping", platform: "Udemy", duration: "3 minggu", level: "Advanced", progress: 45 },
  { id: "3", title: "Design System Mastery", platform: "Google", duration: "2 minggu", level: "Advanced", progress: 20 },
];

const crossRegion = [
  { id: "1", title: "Senior UX Designer", company: "Gojek", location: "Jakarta", type: "Relokasi", match: 91, from: "Yogyakarta" },
  { id: "2", title: "Product Designer", company: "Traveloka", location: "Jakarta", type: "Hybrid", match: 85, from: "Bandung" },
];

export default function DashboardCandidatePage() {
  const navigate = useNavigate();
  const { addApplication } = useAppContext();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ title: string; company: string; location: string; match: number } | null>(null);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Budi Santoso" userRole="Kandidat" userInitial="B">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: "#0A1B3D", letterSpacing: "-0.5px", marginBottom: 4 }}>
          Halo, Budi Santoso 👋
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Ini rekomendasi terbaik untuk Anda hari ini. AI kami terus bekerja di balik layar!
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Kelengkapan Profil", value: "78%", sub: "Tambah pengalaman kerja", color: "#1677FF", icon: <User size={18} />, path: "/dashboard/kandidat/profil" },
          { label: "Rekomendasi Pekerjaan", value: "24", sub: "3 baru hari ini", color: "#0D47A1", icon: <Briefcase size={18} />, path: "/dashboard/kandidat/rekomendasi" },
          { label: "Skill Gap Utama", value: "3", sub: "Perlu ditingkatkan", color: "#ff9a3c", icon: <TrendingUp size={18} />, path: "/dashboard/kandidat/skill-gap" },
          { label: "Progress Pelatihan", value: "45%", sub: "2 kursus aktif", color: "#10d98e", icon: <BookOpen size={18} />, path: "/dashboard/kandidat/pelatihan" },
          { label: "Lamaran Aktif", value: "5", sub: "2 menunggu respons", color: "#4DB8FF", icon: <FileText size={18} />, path: "/dashboard/kandidat/lamaran" },
        ].map((s) => (
          <div key={s.label}
            onClick={() => navigate(s.path)}
            style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "18px 16px", position: "relative", overflow: "hidden", transition: "transform 0.2s", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}55)`, borderRadius: "14px 14px 0 0" }} />
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, border: `1px solid ${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: s.color }}>{s.icon}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div>
          {/* Job Recommendations */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Rekomendasi Pekerjaan</h2>
              <button onClick={() => navigate("/dashboard/kandidat/rekomendasi")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", display: "flex", alignItems: "center", gap: 4 }}>
                Lihat Semua <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {jobRecs.map((job) => (
                <div key={job.id} style={{ padding: "16px", borderRadius: 12, border: "1px solid rgba(22,119,255,0.1)", background: "#f8fbff", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1677FF30"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,119,255,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(22,119,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D", marginBottom: 3 }}>{job.title}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>{job.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>{job.match}%</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#9ab4cc" }}>match score</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}><MapPin size={11} /> {job.location}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}><Clock size={11} /> {job.type}</span>
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a6a9a", background: "rgba(22,119,255,0.05)", padding: "6px 10px", borderRadius: 8, marginBottom: 12 }}>
                    💡 {job.reason}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => navigate(`/dashboard/kandidat/detail-pekerjaan`)}
                      style={{ flex: 1, padding: "8px", borderRadius: 9, border: "1px solid rgba(22,119,255,0.25)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#1677FF", cursor: "pointer" }}>
                      Lihat Detail
                    </button>
                    <button onClick={() => { setSelectedJob({ title: job.title, company: job.company, location: job.location, match: job.match }); setShowApplyModal(true); }}
                      style={{ flex: 1, padding: "8px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                      Lamar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pelatihan */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Pelatihan yang Direkomendasikan</h2>
              <button onClick={() => navigate("/dashboard/kandidat/pelatihan")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", display: "flex", alignItems: "center", gap: 4 }}>
                Lihat Semua <ChevronRight size={14} />
              </button>
            </div>
            {trainings.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(22,119,255,0.06)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, rgba(22,119,255,0.12), rgba(77,184,255,0.1))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={18} color="#1677FF" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", marginBottom: 6 }}>{t.platform} · {t.duration} · {t.level}</div>
                  <div style={{ height: 4, borderRadius: 2, background: "#e8f0fe", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${t.progress}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 2 }} />
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1677FF", marginTop: 3 }}>{t.progress}% selesai</div>
                </div>
                <button onClick={() => navigate(`/dashboard/kandidat/pelatihan/${t.id}`)}
                  style={{ padding: "7px 14px", borderRadius: 9, border: "none", background: "rgba(22,119,255,0.1)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1677FF", cursor: "pointer", whiteSpace: "nowrap" }}>
                  Mulai Belajar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Skill Gap */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Skill Gap Report</h2>
              <button onClick={() => navigate("/dashboard/kandidat/skill-gap")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", display: "flex", alignItems: "center", gap: 3 }}>
                Detail <ChevronRight size={13} />
              </button>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Skill yang perlu ditingkatkan berdasarkan posisi target Anda.</p>
            {skillGaps.map((sg) => (
              <div key={sg.skill} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#0A1B3D" }}>{sg.skill}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sg.color, fontWeight: 700 }}>Gap {sg.gap}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#e8f0fe", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${sg.level}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc" }}>Kamu: {sg.level}%</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9ab4cc" }}>Target: 100%</span>
                </div>
              </div>
            ))}
            <button onClick={() => navigate("/dashboard/kandidat/skill-gap")}
              style={{ width: "100%", marginTop: 4, padding: "9px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1677FF", cursor: "pointer" }}>
              Lihat Skill Gap Lengkap
            </button>
          </div>

          {/* Cross Region */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Peluang Lintas Wilayah</h2>
              <button onClick={() => navigate("/dashboard/kandidat/cross-region")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1677FF", display: "flex", alignItems: "center", gap: 3 }}>
                Lihat Semua <ChevronRight size={13} />
              </button>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 18 }}>Peluang menarik di luar kota Anda.</p>
            {crossRegion.map((cr) => (
              <div key={cr.id} style={{ padding: "14px", borderRadius: 12, border: "1px solid rgba(77,184,255,0.15)", background: "rgba(77,184,255,0.04)", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D" }}>{cr.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#4DB8FF" }}>{cr.match}%</div>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 4 }}>{cr.company}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} /> {cr.location}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(77,184,255,0.1)", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4DB8FF" }}>{cr.type}</span>
                </div>
                <button onClick={() => navigate(`/dashboard/kandidat/detail-cross-region`)}
                  style={{ width: "100%", padding: "7px", borderRadius: 9, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#4DB8FF", cursor: "pointer" }}>
                  Lihat Peluang
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showApplyModal && selectedJob && (
        <ApplicationConfirmModal
          jobTitle={selectedJob.title}
          company={selectedJob.company}
          onConfirm={() => { addApplication({ posisi: selectedJob.title, perusahaan: selectedJob.company, lokasi: selectedJob.location, match: selectedJob.match }); setShowApplyModal(false); setShowSuccessModal(true); }}
          onClose={() => setShowApplyModal(false)}
        />
      )}
      {showSuccessModal && selectedJob && (
        <ApplicationSuccessModal
          jobTitle={selectedJob.title}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
