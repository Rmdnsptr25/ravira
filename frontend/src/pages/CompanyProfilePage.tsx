import { useState } from "react";
import { LayoutDashboard, GitBranch, Briefcase, Plus, BookmarkCheck, BarChart2, Plug, Building2, Settings, CheckCircle } from "lucide-react";
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

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    nama: "Tokopedia",
    industri: "E-Commerce",
    ukuran: "1000-5000 karyawan",
    hq: "Jakarta Selatan, DKI Jakarta",
    website: "https://www.tokopedia.com",
    deskripsi: "Tokopedia adalah platform e-commerce terkemuka di Indonesia yang menghubungkan jutaan penjual dan pembeli di seluruh Nusantara.",
  });

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="profil"
      userName="Siti Rahayu"
      userRole="HR Manager · Tokopedia"
      userInitial="S"
    >
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Profil Perusahaan
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Kelola informasi publik perusahaan Anda
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>
          {/* Main form */}
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "16px",
                  backgroundColor: "#10d98e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                T
              </div>
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "18px", fontWeight: 700, color: "#0A1B3D" }}>Logo Perusahaan</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>JPG, PNG, SVG. Maks 2MB</div>
                <button
                  onClick={() => alert("Upload logo")}
                  style={{
                    marginTop: "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#1677FF",
                    backgroundColor: "#e8f0fe",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    cursor: "pointer",
                  }}
                >
                  Upload Logo
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Nama Perusahaan</label>
                <input style={inputStyle} value={form.nama} onChange={(e) => handleChange("nama", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Industri</label>
                <input style={inputStyle} value={form.industri} onChange={(e) => handleChange("industri", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Ukuran Perusahaan</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.ukuran} onChange={(e) => handleChange("ukuran", e.target.value)}>
                  <option>1-50 karyawan</option>
                  <option>51-200 karyawan</option>
                  <option>201-500 karyawan</option>
                  <option>500-1000 karyawan</option>
                  <option>1000-5000 karyawan</option>
                  <option>5000+ karyawan</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Lokasi HQ</label>
                <input style={inputStyle} value={form.hq} onChange={(e) => handleChange("hq", e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Website</label>
                <input style={inputStyle} value={form.website} onChange={(e) => handleChange("website", e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Deskripsi Perusahaan</label>
                <textarea
                  style={{ ...inputStyle, height: "120px", resize: "vertical" }}
                  value={form.deskripsi}
                  onChange={(e) => handleChange("deskripsi", e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => alert("Profil disimpan!")}
              style={{
                marginTop: "24px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "#1677FF",
                border: "none",
                borderRadius: "10px",
                padding: "12px 28px",
                cursor: "pointer",
              }}
            >
              Simpan Perubahan
            </button>
          </div>

          {/* Verification card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 700, color: "#0A1B3D", margin: "0 0 16px" }}>
              Status Verifikasi
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#10d98e1a",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <CheckCircle size={28} color="#10d98e" />
              <div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#10d98e" }}>Terverifikasi</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                  Perusahaan Anda telah diverifikasi oleh tim Ravira
                </div>
              </div>
            </div>
            <div style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>
              Verifikasi diberikan pada 12 Maret 2025. Berlaku selama 12 bulan.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
