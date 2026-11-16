import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  GitBranch,
  Briefcase,
  Plus,
  BookmarkCheck,
  BarChart2,
  Plug,
  Building2,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  UploadCloud
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { useAppContext } from "../contexts/AppContext";
import {
  getRecruiterCompanyProfile,
  resolveBackendAssetUrl,
  updateRecruiterCompanyProfile,
  uploadRecruiterCompanyLogo,
  type RecruiterCompanyProfile,
  type UpdateRecruiterCompanyInput
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
  const { user } = useAppContext();
  const [company, setCompany] = useState<RecruiterCompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    nama: "",
    industri: "",
    ukuran: "51-200 karyawan",
    hq: "",
    website: "",
    deskripsi: "",
  });

  const displayName = user?.fullName || "Recruiter";
  const displayCompany = company?.name || user?.recruiter?.company?.name || "Perusahaan";
  const displayRole = `${user?.recruiter?.position || "HR Manager"} · ${displayCompany}`;
  const displayInitial = (displayName[0] || "R").toUpperCase();
  const companyLogoInitial = (form.nama[0] || displayCompany[0] || "P").toUpperCase();

  useEffect(() => {
    let active = true;
    getRecruiterCompanyProfile()
      .then((data) => {
        if (!active) return;
        setCompany(data);
        setLogoUrl(data.logoUrl ?? null);
        setForm({
          nama: data.name || "",
          industri: data.industry || "",
          ukuran: data.size || "51-200 karyawan",
          hq: data.location || "",
          website: data.website || "",
          deskripsi: data.description || "",
        });
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Gagal memuat profil perusahaan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogoFile = async (file?: File) => {
    if (!file || uploadingLogo) return;
    const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedTypes.has(file.type) && ![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      toast.error("Format logo harus PNG, JPG, JPEG, atau WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran logo maksimal 2MB.");
      return;
    }

    setUploadingLogo(true);
    try {
      const result = await uploadRecruiterCompanyLogo(file);
      setLogoUrl(result.logoUrl);
      setCompany((prev) => (prev ? { ...prev, logoUrl: result.logoUrl } : prev));
      toast.success("Logo perusahaan berhasil diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah logo perusahaan.");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const normalizeOptional = (
      currentValue: string,
      existingValue?: string | null
    ): string | null | undefined => {
      const trimmed = currentValue.trim();
      if (trimmed) return trimmed;
      return existingValue ? null : undefined;
    };

    const payload: UpdateRecruiterCompanyInput = {
      name: form.nama.trim(),
    };

    const industryVal = normalizeOptional(form.industri, company?.industry);
    if (industryVal !== undefined) payload.industry = industryVal;

    const sizeVal = normalizeOptional(form.ukuran, company?.size);
    if (sizeVal !== undefined) payload.size = sizeVal;

    const locationVal = normalizeOptional(form.hq, company?.location);
    if (locationVal !== undefined) payload.location = locationVal;

    const websiteVal = normalizeOptional(form.website, company?.website);
    if (websiteVal !== undefined) payload.website = websiteVal;

    const descriptionVal = normalizeOptional(form.deskripsi, company?.description);
    if (descriptionVal !== undefined) payload.description = descriptionVal;

    setSaving(true);
    try {
      const updated = await updateRecruiterCompanyProfile(payload);
      setCompany(updated);
      setForm({
        nama: updated.name || "",
        industri: updated.industry || "",
        ukuran: updated.size || "51-200 karyawan",
        hq: updated.location || "",
        website: updated.website || "",
        deskripsi: updated.description || "",
      });
      toast.success("Profil perusahaan berhasil diperbarui!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui profil perusahaan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeKey="profil"
      userName={displayName}
      userRole={displayRole}
      userInitial={displayInitial}
    >
      <div style={{ minHeight: "100vh" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px", fontWeight: 700, color: "#0A1B3D", margin: 0 }}>
            Profil Perusahaan
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
            Kelola informasi publik dan data profil perusahaan Anda
          </p>
        </div>

        {loading ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "48px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <Loader2 size={32} color="#1677FF" style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: 12, fontFamily: "Inter, sans-serif", color: "#6a88b8" }}>Memuat profil perusahaan...</p>
          </div>
        ) : error ? (
          <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "32px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <XCircle size={32} color="#ef4444" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "Inter, sans-serif", color: "#dc2626", fontWeight: 600 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 16,
                padding: "8px 20px",
                borderRadius: 8,
                backgroundColor: "#1677FF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Muat Ulang
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>
            {/* Main form */}
            <form
              onSubmit={handleSubmit}
              style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "16px",
                    backgroundColor: logoUrl ? "#f8faff" : "#1677FF",
                    border: logoUrl ? "1px solid #e5eaf3" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {logoUrl ? (
                    <img
                      src={resolveBackendAssetUrl(logoUrl) ?? undefined}
                      alt={`Logo ${displayCompany}`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    companyLogoInitial
                  )}
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !uploadingLogo) {
                      e.preventDefault();
                      logoInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!uploadingLogo) setIsDraggingLogo(true);
                  }}
                  onDragLeave={() => setIsDraggingLogo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingLogo(false);
                    const file = e.dataTransfer.files?.[0];
                    void handleLogoFile(file);
                  }}
                  style={{
                    flex: "1 1 260px",
                    border: `1.5px dashed ${isDraggingLogo ? "#0E67CC" : "#cbd5e1"}`,
                    backgroundColor: isDraggingLogo ? "#eff6ff" : "#f8faff",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    cursor: uploadingLogo ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "border-color 140ms ease, background-color 140ms ease",
                  }}
                >
                  {uploadingLogo ? (
                    <Loader2 size={20} color="#0E67CC" className="animate-spin" />
                  ) : (
                    <UploadCloud size={20} color="#0E67CC" />
                  )}
                  <div>
                    <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#0A1B3D" }}>
                      {uploadingLogo ? "Mengunggah logo..." : "Seret & lepas logo perusahaan atau klik untuk pilih"}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      Format PNG, JPG, JPEG, WEBP · Maks. 2MB
                    </div>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                    style={{ display: "none" }}
                    disabled={uploadingLogo}
                    onChange={(e) => void handleLogoFile(e.target.files?.[0])}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>Nama Perusahaan</label>
                  <input
                    style={inputStyle}
                    value={form.nama}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Industri</label>
                  <input
                    style={inputStyle}
                    value={form.industri}
                    onChange={(e) => handleChange("industri", e.target.value)}
                    placeholder="Contoh: Teknologi Informasi, Finansial"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Ukuran Perusahaan</label>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={form.ukuran}
                    onChange={(e) => handleChange("ukuran", e.target.value)}
                  >
                    <option value="1-50 karyawan">1-50 karyawan</option>
                    <option value="51-200 karyawan">51-200 karyawan</option>
                    <option value="201-500 karyawan">201-500 karyawan</option>
                    <option value="500-1000 karyawan">500-1000 karyawan</option>
                    <option value="1000-5000 karyawan">1000-5000 karyawan</option>
                    <option value="5000+ karyawan">5000+ karyawan</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Lokasi HQ</label>
                  <input
                    style={inputStyle}
                    value={form.hq}
                    onChange={(e) => handleChange("hq", e.target.value)}
                    placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Website</label>
                  <input
                    style={inputStyle}
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="Contoh: https://example.com"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Deskripsi Perusahaan</label>
                  <textarea
                    style={{ ...inputStyle, height: "120px", resize: "vertical" }}
                    value={form.deskripsi}
                    onChange={(e) => handleChange("deskripsi", e.target.value)}
                    placeholder="Ceritakan tentang visi, misi, dan kultur perusahaan..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  marginTop: "24px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: saving ? "#93c5fd" : "#1677FF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 28px",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {saving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>

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
              {company?.verificationStatus === "APPROVED" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      backgroundColor: "rgba(16,217,142,0.1)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <CheckCircle size={28} color="#10d98e" />
                    <div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#059669" }}>
                        Terverifikasi
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        Perusahaan Anda telah diverifikasi oleh tim Ravira.
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>
                    {company.verifiedAt
                      ? `Verifikasi disetujui pada ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(company.verifiedAt))}.`
                      : "Akun perusahaan aktif dan terverifikasi."}
                  </div>
                </>
              ) : company?.verificationStatus === "REJECTED" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      backgroundColor: "rgba(239,68,68,0.1)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <XCircle size={28} color="#ef4444" />
                    <div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#dc2626" }}>
                        Verifikasi Ditolak
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        Pendaftaran perusahaan belum disetujui.
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#dc2626", lineHeight: "1.6" }}>
                    Silakan perbarui profil legalitas atau hubungi administrator untuk mengajukan peninjauan ulang.
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      backgroundColor: "rgba(245,158,11,0.1)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <Clock size={28} color="#f59e0b" />
                    <div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, color: "#d97706" }}>
                        Menunggu Verifikasi
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        Pendaftaran sedang ditinjau oleh tim Admin Ravira.
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>
                    Perusahaan dalam status PENDING dibatasi dari memublikasikan lowongan ke kandidat sampai diverifikasi.
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
