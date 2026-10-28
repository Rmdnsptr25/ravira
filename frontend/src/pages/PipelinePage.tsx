import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, ChevronRight, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  listRecruiterJobs,
  listApplicationsForRecruiterJob,
  getRecruiterJobCandidateScores,
  updateApplicationStage,
  type RecruiterJob,
  type RecruiterJobApplication,
  type RecruiterCandidateScore,
  type ApplicationStageStatus,
} from "../services/raviraApi";

const sidebarItems: SidebarItem[] = [
  { key: "beranda", label: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/dashboard/perusahaan" },
  { key: "pipeline", label: "Kandidat Pipeline", icon: <GitBranch size={16} />, path: "/dashboard/perusahaan/pipeline" },
  { key: "lowongan", label: "Lowongan Aktif", icon: <Briefcase size={16} />, path: "/dashboard/perusahaan/lowongan" },
  { key: "buat", label: "Buat Lowongan", icon: <Plus size={16} />, path: "/dashboard/perusahaan/buat-lowongan" },
  { key: "shortlist", label: "Shortlist Kandidat", icon: <BookmarkCheck size={16} />, path: "/dashboard/perusahaan/shortlist" },
  { key: "analitik", label: "Analitik Rekrutmen", icon: <BarChart2 size={16} />, path: "/dashboard/perusahaan/analitik" },
  { key: "ats", label: "Integrasi ATS", icon: <Plug size={16} />, path: "/dashboard/perusahaan/integrasi-ats" },
  { key: "profil", label: "Profil Perusahaan", icon: <Building2 size={16} />, path: "/dashboard/perusahaan/profil" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/perusahaan/pengaturan" },
];

type PipelineCandidate = {
  applicationId: string;
  name: string;
  role: string;
  jobId: string;
  match: number;
  candidateScore?: number;
  location?: string;
  status: ApplicationStageStatus;
  isNew?: boolean;
};

type PipelineColumn = {
  id: string;
  status: ApplicationStageStatus;
  label: string;
  color: string;
  candidates: PipelineCandidate[];
};

const stageOrder: ApplicationStageStatus[] = ["APPLIED", "SCREENING", "INTERVIEW", "ACCEPTED", "REJECTED"];
const stageLabels: Record<ApplicationStageStatus, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  SELEKSI_TAHAP_1: "Seleksi Tahap 1",
  SELEKSI_TAHAP_2: "Seleksi Tahap 2",
  INTERVIEW: "Interview",
  ACCEPTED: "Offer / Hired",
  REJECTED: "Ditolak",
  NEED_VERIFICATION: "Verifikasi",
};

function matchColor(score: number): string {
  if (score >= 85) return "#10d98e";
  if (score >= 70) return "#f59e0b";
  return "#ff6b6b";
}

export default function PipelinePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedJobId = searchParams.get("jobId") || "all";
  const { user } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [allCandidates, setAllCandidates] = useState<PipelineCandidate[]>([]);

  // Move modal state
  const [moveModal, setMoveModal] = useState<{
    applicationId: string;
    candidateName: string;
    fromStage: ApplicationStageStatus;
    toStage: ApplicationStageStatus;
  } | null>(null);
  const [moveReason, setMoveReason] = useState("");
  const [isMoving, setIsMoving] = useState(false);

  const loadPipeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobList = await listRecruiterJobs();
      setJobs(jobList);

      const items: PipelineCandidate[] = [];
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      await Promise.all(
        jobList.map(async (j) => {
          try {
            const [rawApps, scores] = await Promise.all([
              listApplicationsForRecruiterJob(j.id).catch(() => [] as RecruiterJobApplication[]),
              getRecruiterJobCandidateScores(j.id).catch(() => [] as RecruiterCandidateScore[]),
            ]);

            const scoreMap = new Map<string, RecruiterCandidateScore>();
            scores.forEach((s) => scoreMap.set(s.applicationId, s));

            rawApps.forEach((app) => {
              const sc = scoreMap.get(app.id);
              const createdTime = new Date(app.createdAt).getTime();

              items.push({
                applicationId: app.id,
                name: app.candidate.user.fullName,
                role: j.title,
                jobId: j.id,
                match: sc ? sc.matchScore : 80,
                candidateScore: sc?.candidateScore,
                location: app.candidate.location || "Indonesia",
                status: app.status,
                isNew: createdTime > oneWeekAgo,
              });
            });
          } catch {
            // continue
          }
        })
      );

      setAllCandidates(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat pipeline kandidat.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadPipeline();
    });
  }, []);

  const filteredCandidates = selectedJobId === "all"
    ? allCandidates
    : allCandidates.filter((c) => c.jobId === selectedJobId);

  const mapStatusToColumn = (st: ApplicationStageStatus): ApplicationStageStatus => {
    if (st === "SELEKSI_TAHAP_1" || st === "SELEKSI_TAHAP_2" || st === "NEED_VERIFICATION") {
      return "SCREENING";
    }
    return st;
  };

  const columns: PipelineColumn[] = [
    {
      id: "applied",
      status: "APPLIED",
      label: "Applied",
      color: "#6a88b8",
      candidates: filteredCandidates.filter((c) => mapStatusToColumn(c.status) === "APPLIED"),
    },
    {
      id: "screening",
      status: "SCREENING",
      label: "Screening",
      color: "#4DB8FF",
      candidates: filteredCandidates.filter((c) => mapStatusToColumn(c.status) === "SCREENING"),
    },
    {
      id: "interview",
      status: "INTERVIEW",
      label: "Interview",
      color: "#f59e0b",
      candidates: filteredCandidates.filter((c) => mapStatusToColumn(c.status) === "INTERVIEW"),
    },
    {
      id: "offer",
      status: "ACCEPTED",
      label: "Offer / Hired",
      color: "#10d98e",
      candidates: filteredCandidates.filter((c) => mapStatusToColumn(c.status) === "ACCEPTED"),
    },
    {
      id: "rejected",
      status: "REJECTED",
      label: "Ditolak",
      color: "#ff6b6b",
      candidates: filteredCandidates.filter((c) => mapStatusToColumn(c.status) === "REJECTED"),
    },
  ];

  const handleOpenMove = (candidate: PipelineCandidate, toStage: ApplicationStageStatus) => {
    setMoveModal({
      applicationId: candidate.applicationId,
      candidateName: candidate.name,
      fromStage: candidate.status,
      toStage,
    });
    setMoveReason(`Memenuhi kualifikasi untuk tahap ${stageLabels[toStage]}.`);
  };

  const handleConfirmMove = async () => {
    if (!moveModal || !moveReason.trim()) {
      toast.error("Alasan perpindahan tahap wajib diisi.");
      return;
    }

    setIsMoving(true);
    try {
      await updateApplicationStage(moveModal.applicationId, {
        newStatus: moveModal.toStage,
        reason: moveReason.trim(),
      });

      // Update local state after verified server response
      setAllCandidates((prev) =>
        prev.map((c) =>
          c.applicationId === moveModal.applicationId
            ? { ...c, status: moveModal.toStage }
            : c
        )
      );

      toast.success(`${moveModal.candidateName} berhasil dipindahkan ke ${stageLabels[moveModal.toStage]}`);
      setMoveModal(null);
      setMoveReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memindahkan tahap kandidat.";
      toast.error(msg);
    } finally {
      setIsMoving(false);
    }
  };

  const userName = user?.fullName || "Recruiter";
  const userRole = `${user?.recruiter?.position || "HR Recruiter"} · ${user?.recruiter?.company?.name || "Perusahaan"}`;
  const userInitial = (user?.fullName || "R").charAt(0).toUpperCase();

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="pipeline"
      userName={userName}
      userRole={userRole}
      userInitial={userInitial}
    >
      {/* Modal Konfirmasi Pindah Stage */}
      {moveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,27,61,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 440, width: "90%", boxShadow: "0 8px 32px rgba(10,27,61,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D" }}>
                Pindah Tahap Seleksi
              </span>
              <button onClick={() => setMoveModal(null)} disabled={isMoving} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 14 }}>
              Pindahkan <strong>{moveModal.candidateName}</strong> dari tahap <strong>{stageLabels[moveModal.fromStage]}</strong> ke <strong>{stageLabels[moveModal.toStage]}</strong>.
            </p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Alasan Perpindahan Tahap *
              </label>
              <textarea
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                placeholder="Tuliskan alasan pemindahan tahap seleksi..."
                style={{ width: "100%", height: 75, padding: "10px", borderRadius: 8, border: "1px solid #e5eaf3", background: "#f8faff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", resize: "vertical", boxSizing: "border-box" }}
                disabled={isMoving}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setMoveModal(null)}
                disabled={isMoving}
                style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #e5eaf3", background: "#f0f7ff", color: "#6a88b8", fontFamily: "'Inter', sans-serif", fontSize: 13, cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                onClick={() => void handleConfirmMove()}
                disabled={isMoving || !moveReason.trim()}
                style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, cursor: isMoving || !moveReason.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                {isMoving && <Loader2 size={14} className="animate-spin" />}
                Konfirmasi Pindah
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
              Kandidat Pipeline
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
              Kelola kandidat di setiap tahapan rekrutmen untuk {user?.recruiter?.company?.name || "perusahaan Anda"}
            </p>
          </div>

          {/* Job filter dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
              Filter Lowongan:
            </span>
            <select
              value={selectedJobId}
              onChange={(e) => setSearchParams(e.target.value === "all" ? {} : { jobId: e.target.value })}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #e5eaf3",
                background: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#0A1B3D",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">Semua Lowongan ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "60px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <Loader2 size={32} className="animate-spin" color="#1677FF" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6a88b8" }}>Memuat pipeline kandidat...</p>
          </div>
        ) : error ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "40px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#ff6b6b", marginBottom: 16 }}>{error}</p>
            <button
              onClick={() => { void loadPipeline(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #1677FF", background: "#f0f7ff", color: "#1677FF", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px" }}>
            {columns.map((col) => (
              <div
                key={col.id}
                style={{
                  minWidth: "240px",
                  flex: "0 0 240px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>
                    {col.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: col.color,
                      backgroundColor: col.color + "1a",
                      borderRadius: "12px",
                      padding: "2px 10px",
                    }}
                  >
                    {col.candidates.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  {col.candidates.map((c) => {
                    const currentIdx = stageOrder.indexOf(col.status);
                    const nextStage = currentIdx >= 0 && currentIdx < stageOrder.length - 1 ? stageOrder[currentIdx + 1] : null;

                    return (
                      <div
                        key={c.applicationId}
                        style={{
                          backgroundColor: c.isNew ? "rgba(22,119,255,0.03)" : "#f9fbff",
                          border: c.isNew ? "1px solid rgba(22,119,255,0.25)" : "1px solid #e5eaf3",
                          borderRadius: "10px",
                          padding: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor: "#1677FF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "13px",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {c.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#0A1B3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {c.name}
                              </div>
                              {c.isNew && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, fontWeight: 700, color: "#fff", background: "#1677FF", borderRadius: 4, padding: "1px 5px" }}>BARU</span>}
                            </div>
                            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {c.role}{c.location ? ` · ${c.location}` : ""}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: nextStage ? 8 : 0 }}>
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: matchColor(c.match),
                              backgroundColor: matchColor(c.match) + "1a",
                              borderRadius: "8px",
                              padding: "2px 8px",
                            }}
                          >
                            {c.match}% match
                          </span>
                          <button
                            onClick={() => navigate(`/dashboard/perusahaan/kandidat/${c.applicationId}`)}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#1677FF",
                              backgroundColor: "#e8f0fe",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Profil
                          </button>
                        </div>

                        {nextStage && (
                          <button
                            onClick={() => handleOpenMove(c, nextStage)}
                            style={{ width: "100%", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: col.color, backgroundColor: col.color + "1a", border: `1px solid ${col.color}40`, borderRadius: "6px", padding: "5px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}
                          >
                            Pindah ke {stageLabels[nextStage]} <ChevronRight size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {col.candidates.length === 0 && (
                    <div style={{ padding: "20px 10px", textAlign: "center", color: "#9ca3af", fontFamily: "Inter, sans-serif", fontSize: "12px", border: "1px dashed #e5eaf3", borderRadius: 8 }}>
                      Tidak ada kandidat
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
