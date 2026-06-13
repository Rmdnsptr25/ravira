import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  color: "#0A1B3D",
  backgroundColor: "#f8faff",
  border: "1px solid #e5eaf3",
  borderRadius: "10px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  display: "block",
  marginBottom: "6px",
};

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    posisi: "",
    departemen: "",
    lokasi: "",
    tipeKerja: "Full-time",
    gajiMin: "",
    gajiMax: "",
    deskripsi: "",
    persyaratan: "",
    tanggalTutup: "",
  });
  const [skills, setSkills] = useState<string[]>(["React", "Figma", "TypeScript"]);
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills((prev) => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="buat"
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Buat Lowongan Baru
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Isi detail posisi yang ingin Anda buka
          </p>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", maxWidth: "760px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Nama Posisi</label>
              <input
                style={inputStyle}
                placeholder="e.g. Senior UX Designer"
                value={form.posisi}
                onChange={(e) => handleChange("posisi", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Departemen</label>
              <input
                style={inputStyle}
                placeholder="e.g. Product Design"
                value={form.departemen}
                onChange={(e) => handleChange("departemen", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Lokasi</label>
              <input
                style={inputStyle}
                placeholder="e.g. Jakarta / Remote"
                value={form.lokasi}
                onChange={(e) => handleChange("lokasi", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Tipe Kerja</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.tipeKerja}
                onChange={(e) => handleChange("tipeKerja", e.target.value)}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Range Gaji (Min)</label>
              <input
                style={inputStyle}
                placeholder="e.g. 15.000.000"
                value={form.gajiMin}
                onChange={(e) => handleChange("gajiMin", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Range Gaji (Max)</label>
              <input
                style={inputStyle}
                placeholder="e.g. 25.000.000"
                value={form.gajiMax}
                onChange={(e) => handleChange("gajiMax", e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Deskripsi Pekerjaan</label>
            <textarea
              style={{ ...inputStyle, height: "120px", resize: "vertical" }}
              placeholder="Jelaskan tanggung jawab dan lingkup pekerjaan..."
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Persyaratan</label>
            <textarea
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
              placeholder="Tulis persyaratan kandidat..."
              value={form.persyaratan}
              onChange={(e) => handleChange("persyaratan", e.target.value)}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Skill yang Dibutuhkan</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              {skills.map((s) => (
                <span
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#1677FF",
                    backgroundColor: "#e8f0fe",
                    borderRadius: "20px",
                    padding: "4px 12px",
                  }}
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#1677FF", padding: 0, display: "flex" }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Tambah skill (tekan Enter)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <button
                onClick={addSkill}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1677FF",
                  backgroundColor: "#e8f0fe",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                Tambah
              </button>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Tanggal Tutup</label>
            <input
              type="date"
              style={inputStyle}
              value={form.tanggalTutup}
              onChange={(e) => handleChange("tanggalTutup", e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            <button
              onClick={() => toast.success("Draft lowongan berhasil disimpan!")}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#0A1B3D",
                backgroundColor: "#f0f4fa",
                border: "1px solid #e5eaf3",
                borderRadius: "10px",
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              Simpan Draft
            </button>
            <button
              onClick={() => { toast.success("Lowongan berhasil dipublikasikan!"); navigate("/dashboard/perusahaan/lowongan"); }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "#1677FF",
                border: "none",
                borderRadius: "10px",
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              Publikasikan Lowongan
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
