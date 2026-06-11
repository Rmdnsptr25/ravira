import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, MapPin, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout, SidebarItem } from "../components/DashboardLayout";

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

type Job = { id: number; position: string; dept: string; lokasi: string; tipe: string; pelamar: number; avgMatch: number; status: string };

const initialJobs: Job[] = [
  { id: 1, position: "Senior UX Designer", dept: "Tokopedia", lokasi: "Jakarta", tipe: "Full-time", pelamar: 48, avgMatch: 78, status: "Aktif" },
  { id: 2, position: "Product Manager", dept: "Tokopedia", lokasi: "Jakarta", tipe: "Full-time", pelamar: 32, avgMatch: 72, status: "Aktif" },
  { id: 3, position: "Data Analyst", dept: "Tokopedia", lokasi: "Remote", tipe: "Full-time", pelamar: 67, avgMatch: 81, status: "Aktif" },
  { id: 4, position: "Backend Engineer", dept: "Tokopedia", lokasi: "Jakarta", tipe: "Full-time", pelamar: 91, avgMatch: 76, status: "Aktif" },
  { id: 5, position: "DevOps Specialist", dept: "Tokopedia", lokasi: "Jakarta", tipe: "Full-time", pelamar: 23, avgMatch: 69, status: "Ditutup" },
];

export default function ActiveJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [tutupTarget, setTutupTarget] = useState<Job | null>(null);

  const handleTutup = () => {
    if (!tutupTarget) return;
    setJobs(prev => prev.map(j => j.id === tutupTarget.id ? { ...j, status: "Ditutup" } : j));
    toast.success(`Lowongan "${tutupTarget.position}" berhasil ditutup.`);
    setTutupTarget(null);
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="lowongan"
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      {/* Modal Konfirmasi Tutup Lowongan */}
      {tutupTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,27,61,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, maxWidth: 400, width: "90%", boxShadow: "0 8px 40px rgba(10,27,61,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Tutup Lowongan?</span>
              <button onClick={() => setTutupTarget(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 8 }}>
              Anda akan menutup lowongan:
            </p>
            <div style={{ background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.12)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{tutupTarget.position}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{tutupTarget.dept} · {tutupTarget.lokasi}</div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
              Lowongan ini tidak akan lagi menerima pelamar baru. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setTutupTarget(null)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>
                Batal
              </button>
              <button onClick={handleTutup} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ff6b6b, #e03030)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
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
              Kelola semua posisi yang sedang dibuka
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

        <div style={{ backgroundColor: "#fff", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8faff", borderBottom: "1px solid #e5eaf3" }}>
                {["Nama Posisi", "Departemen", "Lokasi", "Tipe Kerja", "Pelamar", "Avg Match", "Status", "Aksi"].map((h) => (
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
              {jobs.map((job, idx) => (
                <tr
                  key={job.id}
                  style={{
                    borderBottom: idx < jobs.length - 1 ? "1px solid #f0f4fa" : "none",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "16px", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>
                    {job.position}
                  </td>
                  <td style={{ padding: "16px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>
                    {job.dept}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>
                      <MapPin size={13} /> {job.lokasi}
                    </span>
                  </td>
                  <td style={{ padding: "16px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#6b7280" }}>
                    {job.tipe}
                  </td>
                  <td style={{ padding: "16px", fontFamily: "JetBrains Mono, monospace", fontSize: "14px", fontWeight: 600, color: "#0A1B3D" }}>
                    {job.pelamar}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: job.avgMatch >= 78 ? "#10d98e" : "#f59e0b",
                      }}
                    >
                      {job.avgMatch}%
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: job.status === "Aktif" ? "#10d98e" : "#6b7280",
                        backgroundColor: job.status === "Aktif" ? "#10d98e1a" : "#6b72801a",
                        borderRadius: "20px",
                        padding: "3px 12px",
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => navigate("/dashboard/perusahaan/kandidat/1")}
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
                        onClick={() => { toast.success(`Mode edit lowongan "${job.position}" dibuka.`); navigate("/dashboard/perusahaan/buat-lowongan"); }}
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
                        <Pencil size={11} /> Edit
                      </button>
                      {job.status === "Aktif" && (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
