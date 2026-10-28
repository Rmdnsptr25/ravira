import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, MapPin, Pencil, X, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  listRecruiterJobs,
  updateRecruiterJob,
  listApplicationsForRecruiterJob,
  getRecruiterJobCandidateScores,
  type RecruiterJob,
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

type JobRowData = {
  job: RecruiterJob;
  applicantCount: number;
  avgMatch: number;
};

export default function ActiveJobsPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [jobsData, setJobsData] = useState<JobRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tutupTarget, setTutupTarget] = useState<RecruiterJob | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobs = await listRecruiterJobs();
      const rows: JobRowData[] = await Promise.all(
        jobs.map(async (j) => {
          try {
            const [apps, scores] = await Promise.all([
              listApplicationsForRecruiterJob(j.id).catch(() => []),
              getRecruiterJobCandidateScores(j.id).catch(() => []),
            ]);
            const applicantCount = apps.length;
            const avgMatch =
              scores.length > 0
                ? Math.round(scores.reduce((sum, s) => sum + s.matchScore, 0) / scores.length)
                : 0;
            return { job: j, applicantCount, avgMatch };
          } catch {
            return { job: j, applicantCount: 0, avgMatch: 0 };
          }
        })
      );

      setJobsData(rows);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat lowongan recruiter.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadJobs();
    });
  }, []);

  const handleTutup = async () => {
    if (!tutupTarget) return;
    setIsClosing(true);
    try {
      await updateRecruiterJob(tutupTarget.id, { status: "CLOSED" });
      setJobsData((prev) =>
        prev.map((row) =>
          row.job.id === tutupTarget.id
            ? { ...row, job: { ...row.job, status: "CLOSED" } }
            : row
        )
      );
      toast.success(`Lowongan "${tutupTarget.title}" berhasil ditutup.`);
      setTutupTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menutup lowongan.";
      toast.error(msg);
    } finally {
      setIsClosing(false);
    }
  };

  const userName = user?.fullName || "Recruiter";
  const userRole = `${user?.recruiter?.position || "HR Recruiter"} · ${user?.recruiter?.company?.name || "Perusahaan"}`;
  const userInitial = (user?.fullName || "R").charAt(0).toUpperCase();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return { label: "Aktif", color: "#10d98e", bg: "#10d98e1a" };
      case "DRAFT":
        return { label: "Draft", color: "#6a88b8", bg: "#6a88b81a" };
      case "CLOSED":
        return { label: "Ditutup", color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" };
      case "ARCHIVED":
        return { label: "Diarsipkan", color: "#6b7280", bg: "#6b72801a" };
      default:
        return { label: status, color: "#6b7280", bg: "#6b72801a" };
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="lowongan"
      userName={userName}
      userRole={userRole}
      userInitial={userInitial}
    >
      {/* Modal Konfirmasi Tutup Lowongan */}
      {tutupTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,27,61,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, maxWidth: 400, width: "90%", boxShadow: "0 8px 40px rgba(10,27,61,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Tutup Lowongan?</span>
              <button onClick={() => setTutupTarget(null)} disabled={isClosing} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 8 }}>
              Anda akan menutup lowongan:
            </p>
            <div style={{ background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.12)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{tutupTarget.title}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{user?.recruiter?.company?.name || "Perusahaan"} · {tutupTarget.location || "Remote / Onsite"}</div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
              Lowongan ini tidak akan lagi menerima pelamar baru. Anda dapat mengubah statusnya kembali kapan saja.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setTutupTarget(null)} disabled={isClosing} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>
                Batal
              </button>
              <button onClick={handleTutup} disabled={isClosing} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ff6b6b, #e03030)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {isClosing && <Loader2 size={14} className="animate-spin" />}
                Ya, Tutup Lowongan
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
              Lowongan Aktif
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
              Kelola semua posisi yang sedang dibuka untuk {user?.recruiter?.company?.name || "perusahaan Anda"}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#1677FF",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={16} /> Buat Lowongan Baru
          </button>
        </div>

        {loading ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "60px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <Loader2 size={32} className="animate-spin" color="#1677FF" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6a88b8" }}>Memuat daftar lowongan perusahaan...</p>
          </div>
        ) : error ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "40px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#ff6b6b", marginBottom: 16 }}>{error}</p>
            <button
              onClick={() => { void loadJobs(); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #1677FF", background: "#f0f7ff", color: "#1677FF", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        ) : jobsData.length === 0 ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "60px 20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Briefcase size={28} color="#1677FF" />
            </div>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 700, color: "#0A1B3D", marginBottom: 8 }}>
              Belum Ada Lowongan
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", maxWidth: 400, margin: "0 auto 20px" }}>
              Perusahaan Anda belum mempublikasikan lowongan pekerjaan. Mulai buat lowongan pertama Anda sekarang.
            </p>
            <button
              onClick={() => navigate("/dashboard/perusahaan/buat-lowongan")}
              style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", backgroundColor: "#1677FF", border: "none", borderRadius: "10px", padding: "10px 20px", cursor: "pointer" }}
            >
              Buat Lowongan Sekarang
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8faff", borderBottom: "1px solid #e5eaf3" }}>
                  {["Nama Posisi", "Perusahaan", "Lokasi", "Tipe Kerja", "Pelamar", "Avg Match", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6b7280",
                        textAlign: "left",
                        padding: "14px 16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobsData.map(({ job, applicantCount, avgMatch }, idx) => {
                  const st = getStatusLabel(job.status);
                  return (
                    <tr
                      key={job.id}
                      style={{
                        borderBottom: idx < jobsData.length - 1 ? "1px solid #f0f4fa" : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "16px", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>
                        {job.title}
                      </td>
                      <td style={{ padding: "16px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>
                        {user?.recruiter?.company?.name || "Perusahaan"}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>
                          <MapPin size={13} /> {job.location || "Indonesia (WFO/Remote)"}
                        </span>
                      </td>
                      <td style={{ padding: "16px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>
                        {job.jobType || "Full-time"}
                      </td>
                      <td style={{ padding: "16px", fontFamily: "JetBrains Mono, monospace", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>
                        {applicantCount}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            fontFamily: "JetBrains Mono, monospace",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: avgMatch >= 78 ? "#10d98e" : avgMatch > 0 ? "#f59e0b" : "#6b7280",
                          }}
                        >
                          {avgMatch > 0 ? `${avgMatch}%` : "-"}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: st.color,
                            backgroundColor: st.bg,
                            borderRadius: "20px",
                            padding: "3px 12px",
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => navigate(`/dashboard/perusahaan/pipeline?jobId=${job.id}`)}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#1677FF",
                              backgroundColor: "#e8f0fe",
                              border: "none",
                              borderRadius: "8px",
                              padding: "6px 12px",
                              cursor: "pointer",
                            }}
                          >
                            Lihat Pelamar
                          </button>
                          <button
                            onClick={() => {
                              toast.info(`Informasi posisi "${job.title}".`);
                            }}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#6a88b8",
                              backgroundColor: "#f0f4fa",
                              border: "1px solid #e5eaf3",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Pencil size={11} /> Detail
                          </button>
                          {job.status === "PUBLISHED" && (
                            <button
                              onClick={() => setTutupTarget(job)}
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#ff6b6b",
                                backgroundColor: "rgba(255,107,107,0.08)",
                                border: "1px solid rgba(255,107,107,0.25)",
                                borderRadius: "8px",
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Tutup
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
