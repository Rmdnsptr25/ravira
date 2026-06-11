import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Clock, DollarSign, Bookmark, CheckCircle2, XCircle, BookOpen, Building2, ChevronRight, Home, Briefcase, BarChart2, FileText, Globe, User, Settings } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal, ApplicationSuccessModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";

const job = {
  title: "Senior UX Designer",
  company: "Tokopedia",
  location: "Jakarta Selatan",
  type: "Full-time",
  salary: "Rp 15.000.000 – Rp 22.000.000",
  match: 94,
  posted: "2 hari lalu",
  desc: "Kami mencari Senior UX Designer yang berpengalaman untuk bergabung dengan tim Product Design Tokopedia. Anda akan berperan dalam mendefinisikan strategi desain pengalaman pengguna untuk jutaan pengguna aktif platform kami di seluruh Indonesia.",
  requirements: ["Minimal 4 tahun pengalaman sebagai UX Designer", "Mahir menggunakan Figma dan tools desain modern", "Pengalaman dalam design system dan component library", "Kemampuan user research dan usability testing", "Portfolio yang kuat dengan studi kasus lengkap", "Pengalaman berkolaborasi dengan tim engineering dan product"],
  benefits: ["Gaji kompetitif + bonus kinerja tahunan", "Remote working hybrid (3 hari/minggu WFO)", "Asuransi kesehatan premium untuk keluarga", "Budget pengembangan diri Rp 5 juta/tahun", "Saham perusahaan (ESOP)", "Laptop dan peralatan kerja premium"],
  aiReason: "Profil Anda memiliki pengalaman 3 tahun sebagai UI Designer dengan skill Figma yang sangat kuat. Match score tinggi karena background portfolio Anda mencakup proyek e-commerce yang relevan dengan industri Tokopedia.",
  skillMatch: ["Figma", "User Research", "UI Design", "Prototyping", "Responsive Design"],
  skillGap: ["Design System Advanced", "Usability Testing Formal", "Leadership & Mentoring"],
};

const trainings = [
  { title: "Design System Mastery", platform: "Google UX Design", duration: "3 minggu" },
  { title: "Advanced Usability Testing", platform: "Coursera", duration: "2 minggu" },
];

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

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { addApplication, isJobSaved, saveJob, unsaveJob } = useAppContext();
  const jobId = "job-detail-001";
  const saved = isJobSaved(jobId);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userName="Budi Santoso" userRole="Kandidat · UI Designer" userInitial="B">
      {/* Action bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button onClick={() => navigate("/dashboard/kandidat/rekomendasi")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          ← Kembali ke Rekomendasi Pekerjaan
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { if (saved) { unsaveJob(jobId); toast.success("Lowongan dihapus dari simpanan."); } else { saveJob({ id: jobId, title: job.title, company: job.company, location: job.location, type: job.type, salary: job.salary, match: job.match, matchedSkills: job.skillMatch }); toast.success("Lowongan berhasil disimpan!"); } }}
            style={{ padding: "8px 16px", borderRadius: 10, border: saved ? "1px solid rgba(16,217,142,0.4)" : "1px solid rgba(22,119,255,0.2)", background: saved ? "rgba(16,217,142,0.08)" : "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: saved ? "#10d98e" : "#1677FF", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Bookmark size={14} /> {saved ? "Tersimpan" : "Simpan"}
          </button>
          <button
            onClick={() => setShowApplyModal(true)}
            style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}>
            Lamar Sekarang
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Main */}
        <div>
          {/* Header card */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D" }}>{job.title}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>{job.company}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[
                    { icon: <MapPin size={12} />, val: job.location },
                    { icon: <Clock size={12} />, val: job.type },
                    { icon: <DollarSign size={12} />, val: job.salary },
                  ].map((m) => (
                    <span key={m.val} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                      {m.icon} {m.val}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>{job.match}%</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#6a88b8" }}>match score</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc", marginTop: 2 }}>Diposting {job.posted}</div>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#e8f0fe", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${job.match}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 4 }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Deskripsi Pekerjaan</h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.8, marginBottom: 24 }}>{job.desc}</p>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Persyaratan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {job.requirements.map((r) => (
                <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={15} color="#1677FF" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a" }}>{r}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Benefit</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {job.benefits.map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#f0f7ff", border: "1px solid rgba(22,119,255,0.1)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10d98e", flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", lineHeight: 1.4 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* AI Reasoning */}
          <div style={{ background: "linear-gradient(135deg, #071228, #0a1b3d)", borderRadius: 18, border: "1px solid rgba(22,119,255,0.2)", padding: "22px", marginBottom: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4DB8FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Mengapa AI Merekomendasikan?</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8899bb", lineHeight: 1.7 }}>{job.aiReason}</p>
          </div>

          {/* Skill Match */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "22px", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 14 }}>Skill yang Cocok</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {job.skillMatch.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.3)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#10d98e" }}>
                  <CheckCircle2 size={10} /> {s}
                </span>
              ))}
            </div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 10 }}>Skill yang Masih Kurang</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {job.skillGap.map((s) => (
                <span key={s} onClick={() => navigate("/dashboard/kandidat/skill-gap")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.25)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#ff6b6b", cursor: "pointer" }}>
                  <XCircle size={10} /> {s}
                </span>
              ))}
            </div>
          </div>

          {/* Training Panel */}
          <div style={{ background: "#f0f7ff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.15)", padding: "22px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#1677FF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Pelatihan Rekomendasi</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginBottom: 14 }}>Tingkatkan kecocokan Anda dengan kursus berikut:</p>
            {trainings.map((t) => (
              <div key={t.title} onClick={() => navigate("/dashboard/kandidat/pelatihan")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, background: "#fff", border: "1px solid rgba(22,119,255,0.1)", marginBottom: 8, cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(22,119,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={15} color="#1677FF" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D" }}>{t.title}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{t.platform} · {t.duration}</div>
                </div>
                <ChevronRight size={14} color="#1677FF" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplicationConfirmModal
          jobTitle={job.title}
          company={job.company}
          onConfirm={() => { addApplication({ posisi: job.title, perusahaan: job.company, lokasi: job.location, match: job.match }); setShowApplyModal(false); setShowSuccessModal(true); }}
          onClose={() => setShowApplyModal(false)}
        />
      )}
      {showSuccessModal && (
        <ApplicationSuccessModal
          jobTitle={job.title}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
