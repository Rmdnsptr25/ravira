import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, CheckCircle2, Star, Mail, Phone, MessageSquare, ChevronRight, Loader2, Award, ShieldAlert, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  getApplicationById,
  getApplicationCandidateScore,
  updateApplicationStage,
  type ApplicationDetail,
  type ApplicationCandidateScore,
  type ApplicationStageStatus,
} from "../services/raviraApi";

export default function CandidateProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [candidateScore, setCandidateScore] = useState<ApplicationCandidateScore | null>(null);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStageStatus>("INTERVIEW");
  const [statusReason, setStatusReason] = useState("");

  const loadData = async (appId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [app, score] = await Promise.all([
        getApplicationById(appId),
        getApplicationCandidateScore(appId).catch(() => null),
      ]);
      setApplication(app);
      setCandidateScore(score);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat profil pelamar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      if (id) {
        void loadData(id);
      } else {
        setError("ID lamaran tidak valid.");
        setLoading(false);
      }
    });
  }, [id]);

  const handleUpdateStage = async (newStatus: ApplicationStageStatus, reasonText: string) => {
    if (!id || !reasonText.trim()) {
      toast.error("Alasan pembaruan status wajib diisi.");
      return;
    }

    setUpdatingStage(true);
    try {
      const updated = await updateApplicationStage(id, {
        newStatus,
        reason: reasonText.trim(),
      });
      setApplication(updated);
      toast.success(`Status lamaran berhasil diperbarui menjadi ${newStatus}.`);
      setShowStatusModal(false);
      setStatusReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status seleksi.";
      toast.error(msg);
    } finally {
      setUpdatingStage(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={36} className="animate-spin" color="#1677FF" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6a88b8" }}>Memuat profil pelamar...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ff", padding: "40px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 18, padding: 32, textAlign: "center", boxShadow: "0 2px 12px rgba(10,27,61,0.06)" }}>
          <ShieldAlert size={48} color="#ff6b6b" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>
            Tidak Dapat Mengakses Profil
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6a88b8", marginBottom: 24 }}>
            {error || "Lamaran tidak ditemukan atau Anda tidak memiliki akses ke data kandidat ini."}
          </p>
          <button
            onClick={() => navigate("/dashboard/perusahaan/pipeline")}
            style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#1677FF", color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Kembali ke Pipeline
          </button>
        </div>
      </div>
    );
  }

  const { candidate, job, coverLetter, status } = application;
  const matchScore = candidateScore?.matchScore ?? 80;
  const internalScore = candidateScore?.candidateScore;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      {/* Modal Ubah Status Seleksi */}
      {showStatusModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,27,61,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 460, width: "90%", boxShadow: "0 8px 32px rgba(10,27,61,0.2)" }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D", marginBottom: 12 }}>
              Ubah Status Tahap Seleksi
            </h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>
              Pilih tahap baru untuk pelamar <strong>{candidate.user.fullName}</strong> pada posisi <strong>{job.title}</strong>:
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Tahap Seleksi Baru *
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as ApplicationStageStatus)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5eaf3", background: "#f8faff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D" }}
                disabled={updatingStage}
              >
                <option value="SCREENING">SCREENING — Ulasan Kualifikasi</option>
                <option value="INTERVIEW">INTERVIEW — Wawancara</option>
                <option value="ACCEPTED">ACCEPTED — Diterima / Penawaran Kerja</option>
                <option value="REJECTED">REJECTED — Tidak Melanjutkan</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Alasan / Catatan Status *
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Tuliskan catatan evaluasi atau alasan perubahan status..."
                style={{ width: "100%", height: 80, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5eaf3", background: "#f8faff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", resize: "vertical", boxSizing: "border-box" }}
                disabled={updatingStage}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={updatingStage}
                style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #e5eaf3", background: "#f0f7ff", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13, cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                onClick={() => void handleUpdateStage(targetStatus, statusReason)}
                disabled={updatingStage || !statusReason.trim()}
                style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, cursor: updatingStage || !statusReason.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                {updatingStage && <Loader2 size={14} className="animate-spin" />}
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(22,119,255,0.1)", padding: "0 28px", height: 60, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 20 }}>
        <button onClick={() => navigate("/dashboard/perusahaan/pipeline")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
          <ArrowLeft size={15} /> Kembali ke Pipeline
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            if (candidate.user.email) {
              window.location.href = `mailto:${candidate.user.email}?subject=Lamaran%20Posisi%20${encodeURIComponent(job.title)}`;
            } else {
              toast.info("Email kandidat belum tersedia.");
            }
          }}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", cursor: "pointer" }}
        >
          <MessageSquare size={14} /> Hubungi Kandidat
        </button>
        <button
          onClick={() => {
            setTargetStatus("INTERVIEW");
            setStatusReason("Kualifikasi awal sesuai kriteria lowongan, lanjut ke sesi wawancara.");
            setShowStatusModal(true);
          }}
          style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}
        >
          Ubah Tahap Seleksi ({status})
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Main Content */}
        <div>
          {/* Profile header */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, #1677FF, #4DB8FF)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                {candidate.user.fullName.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", margin: 0 }}>{candidate.user.fullName}</h1>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#1677FF", backgroundColor: "#e8f0fe", borderRadius: 8, padding: "2px 10px" }}>
                    Status: {status}
                  </span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a88b8", marginBottom: 12 }}>
                  Melamar: <strong>{job.title}</strong> · {job.company.name}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                    <MapPin size={13} /> {candidate.location || "Indonesia"}
                  </span>
                  <a href={`mailto:${candidate.user.email}`} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1677FF", textDecoration: "none" }}>
                    <Mail size={13} /> {candidate.user.email}
                  </a>
                  {candidate.user.phone && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                      <Phone size={13} /> {candidate.user.phone}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginBottom: 4 }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 800, color: "#1677FF", lineHeight: 1 }}>{matchScore}%</span>
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#6a88b8" }}>AI Match Score</div>
                <div style={{ marginTop: 8, height: 6, width: 100, borderRadius: 3, background: "#e8f0fe", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${matchScore}%`, background: "linear-gradient(90deg, #1677FF, #4DB8FF)", borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {candidate.experienceSummary && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.8, padding: "16px 20px", background: "#f0f7ff", borderRadius: 12, margin: 0 }}>
                {candidate.experienceSummary}
              </p>
            )}
          </div>

          {/* Cover Letter */}
          {coverLetter && (
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color="#1677FF" /> Surat Lamaran (Cover Letter)
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
                {coverLetter}
              </p>
            </div>
          )}

          {/* Education & Experience Details */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "28px", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 18 }}>
              Latar Belakang & Kualifikasi
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(22,119,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1677FF", flexShrink: 0 }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Pendidikan Terakhir</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 2 }}>
                    {candidate.education || "Pendidikan belum dicantumkan secara lengkap."}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(16,217,142,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10d98e", flexShrink: 0 }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>Ringkasan Pengalaman</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginTop: 2 }}>
                    {candidate.experienceSummary || "Pengalaman profesional di bidang terkait."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Candidate Score & Evaluasi */}
        <div>
          {/* Internal Candidate Score */}
          <div style={{ background: "linear-gradient(135deg, #071228, #0a1b3d)", borderRadius: 18, border: "1px solid rgba(22,119,255,0.2)", padding: "22px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Award size={16} color="#4DB8FF" />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4DB8FF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Candidate Score Internal
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 8 }}>
              {internalScore !== undefined ? `${internalScore}` : `${matchScore}`}
              <span style={{ fontSize: 18, color: "#6a88b8", fontWeight: 500 }}>/100</span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8899bb", lineHeight: 1.6, margin: 0 }}>
              {candidateScore?.explanation || "Penilaian kualifikasi internal recruiter berbasis kecocokan kompetensi dan pengalaman."}
            </p>
            {candidateScore?.ruleVersion && (
              <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4a6a9a" }}>
                Versi Aturan: {candidateScore.ruleVersion}
              </div>
            )}
          </div>

          {/* AI Reasoning */}
          {candidateScore?.matchExplanation && (
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "20px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>
                Alasan Kecocokan AI
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6a9a", lineHeight: 1.6, margin: 0 }}>
                {candidateScore.matchExplanation}
              </p>
            </div>
          )}

          {/* Verified Skills */}
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(22,119,255,0.1)", boxShadow: "0 2px 12px rgba(10,27,61,0.05)", padding: "20px", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 12 }}>
              Keahlian Terverifikasi
            </h3>
            {candidate.skills && candidate.skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {candidate.skills.map((s) => (
                  <span key={s.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.3)", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "#10d98e" }}>
                    <CheckCircle2 size={10} /> {s.skillName} {s.level ? `(${s.level})` : ""}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", margin: 0 }}>
                Belum ada keahlian terverifikasi.
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => {
                setTargetStatus("INTERVIEW");
                setStatusReason("Kandidat dijadwalkan untuk sesi wawancara.");
                setShowStatusModal(true);
              }}
              style={{ padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(22,119,255,0.4)" }}
            >
              Jadwalkan Interview <ChevronRight size={14} />
            </button>
            <button
              onClick={() => {
                setTargetStatus("ACCEPTED");
                setStatusReason("Kandidat memenuhi seluruh kualifikasi dan diberikan penawaran kerja.");
                setShowStatusModal(true);
              }}
              style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(16,217,142,0.3)", background: "rgba(16,217,142,0.08)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#10d98e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              Berikan Penawaran (Offer)
            </button>
            <button
              onClick={() => {
                setTargetStatus("REJECTED");
                setStatusReason("Kualifikasi belum sesuai dengan profil yang dibutuhkan saat ini.");
                setShowStatusModal(true);
              }}
              style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.06)", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#ff6b6b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              Tolak Lamaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
