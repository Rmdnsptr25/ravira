import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";
import {
  listPendingCompanies,
  approveCompany,
  rejectCompany,
  type AdminPendingCompany,
  type AdminCompanyVerificationStatus,
} from "../services/raviraApi";

const statusColor: Record<AdminCompanyVerificationStatus, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#10d98e",
  REJECTED: "#ff6b6b",
};

const statusBg: Record<AdminCompanyVerificationStatus, string> = {
  PENDING: "rgba(245,158,11,0.1)",
  APPROVED: "rgba(16,217,142,0.1)",
  REJECTED: "rgba(255,107,107,0.1)",
};

const statusLabel: Record<AdminCompanyVerificationStatus, string> = {
  PENDING: "MENUNGGU",
  APPROVED: "DIVERIFIKASI",
  REJECTED: "DITOLAK",
};

export default function AdminVerifikasiPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<AdminPendingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("Semua");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Reject Modal State
  const [rejectModalCompany, setRejectModalCompany] = useState<AdminPendingCompany | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchCompanies = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPendingCompanies(signal);
      queueMicrotask(() => {
        setCompanies(data);
        setLoading(false);
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Gagal memuat data perusahaan.";
      queueMicrotask(() => {
        setError(message);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void fetchCompanies(controller.signal);
    });
    return () => controller.abort();
  }, [fetchCompanies]);

  const handleApprove = async (company: AdminPendingCompany) => {
    if (submittingId) return;
    setSubmittingId(company.id);
    try {
      const updated = await approveCompany(company.id);
      toast.success(`Perusahaan ${company.name} berhasil diverifikasi.`);
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? { ...c, ...updated, verificationStatus: "APPROVED" } : c))
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memverifikasi perusahaan.";
      toast.error(message);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalCompany || !rejectReason.trim() || isRejecting) return;
    setIsRejecting(true);
    try {
      const updated = await rejectCompany(rejectModalCompany.id, { reason: rejectReason.trim() });
      toast.success(`Perusahaan ${rejectModalCompany.name} berhasil ditolak.`);
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === rejectModalCompany.id ? { ...c, ...updated, verificationStatus: "REJECTED" } : c
        )
      );
      setRejectModalCompany(null);
      setRejectReason("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menolak perusahaan.";
      toast.error(message);
    } finally {
      setIsRejecting(false);
    }
  };

  const tabs = ["Semua", "Menunggu", "Diverifikasi", "Ditolak"];

  const filtered = companies.filter((c) => {
    if (filter === "Semua") return true;
    if (filter === "Menunggu") return c.verificationStatus === "PENDING";
    if (filter === "Diverifikasi") return c.verificationStatus === "APPROVED";
    if (filter === "Ditolak") return c.verificationStatus === "REJECTED";
    return true;
  });

  const stats = [
    { label: "Total Perusahaan", value: companies.length, color: "#1677FF" },
    {
      label: "Menunggu",
      value: companies.filter((c) => c.verificationStatus === "PENDING").length,
      color: "#f59e0b",
    },
    {
      label: "Diverifikasi",
      value: companies.filter((c) => c.verificationStatus === "APPROVED").length,
      color: "#10d98e",
    },
    {
      label: "Ditolak",
      value: companies.filter((c) => c.verificationStatus === "REJECTED").length,
      color: "#ff6b6b",
    },
  ];

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>
          Verifikasi Perusahaan
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Kelola pengajuan verifikasi perusahaan dan entitas rekrutmen
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid rgba(22,119,255,0.1)",
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(10,27,61,0.04)",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: filter === t ? 600 : 400,
              color: filter === t ? "#1677FF" : "#6a88b8",
              background: filter === t ? "rgba(22,119,255,0.08)" : "transparent",
              border: filter === t ? "1px solid rgba(22,119,255,0.25)" : "1px solid transparent",
              borderRadius: 8,
              padding: "6px 16px",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(22,119,255,0.1)",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(10,27,61,0.04)",
        }}
      >
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#6a88b8" }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "#1677FF" }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Memuat daftar pengajuan verifikasi...</p>
          </div>
        ) : error ? (
          <div style={{ padding: 36, textAlign: "center" }}>
            <AlertTriangle size={32} color="#ff6b6b" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#ff6b6b", marginBottom: 12 }}>
              {error}
            </p>
            <button
              onClick={() => void fetchCompanies()}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#1677FF",
                background: "rgba(22,119,255,0.08)",
                border: "1px solid rgba(22,119,255,0.25)",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#6a88b8" }}>
            <Building2 size={36} color="#6a88b8" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500 }}>
              Tidak ada perusahaan yang menunggu verifikasi.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
                {["Nama Perusahaan", "Industri & Lokasi", "Tanggal Daftar", "PIC Recruiter", "Status", "Aksi"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6a88b8",
                        textAlign: "left",
                        padding: "12px 16px",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const recruiterPic =
                  c.recruiters?.[0]?.user?.fullName || c.recruiters?.[0]?.user?.email || "-";
                const isSubmitting = submittingId === c.id;
                const isPending = c.verificationStatus === "PENDING";

                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none",
                    }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "rgba(22,119,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Building2 size={15} color="#1677FF" />
                        </div>
                        <div>
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0A1B3D",
                              display: "block",
                            }}
                          >
                            {c.name}
                          </span>
                          {c.website && (
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#9ab4cc" }}>
                              {c.website}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                      <div>{c.industry || "Umum"}</div>
                      <div style={{ fontSize: 11, color: "#9ab4cc" }}>{c.location || "Indonesia"}</div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: "#6a88b8",
                      }}
                    >
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#0A1B3D" }}>
                      {recruiterPic}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: statusColor[c.verificationStatus],
                          background: statusBg[c.verificationStatus],
                          borderRadius: 6,
                          padding: "3px 8px",
                          border: `1px solid ${statusColor[c.verificationStatus]}40`,
                        }}
                      >
                        {statusLabel[c.verificationStatus]}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {isPending && (
                          <>
                            <button
                              onClick={() => void handleApprove(c)}
                              disabled={isSubmitting || submittingId !== null}
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#10d98e",
                                background: "rgba(16,217,142,0.08)",
                                border: "1px solid rgba(16,217,142,0.25)",
                                borderRadius: 7,
                                padding: "5px 10px",
                                cursor: isSubmitting || submittingId !== null ? "not-allowed" : "pointer",
                                opacity: isSubmitting || submittingId !== null ? 0.6 : 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <CheckCircle2 size={12} /> {isSubmitting ? "Memproses..." : "Approve"}
                            </button>
                            <button
                              onClick={() => {
                                setRejectModalCompany(c);
                                setRejectReason("");
                              }}
                              disabled={isSubmitting || submittingId !== null}
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#ff6b6b",
                                background: "rgba(255,107,107,0.08)",
                                border: "1px solid rgba(255,107,107,0.25)",
                                borderRadius: 7,
                                padding: "5px 10px",
                                cursor: isSubmitting || submittingId !== null ? "not-allowed" : "pointer",
                                opacity: isSubmitting || submittingId !== null ? 0.6 : 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => navigate(`/dashboard/admin/verifikasi-perusahaan/${c.id}`)}
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#1677FF",
                            background: "rgba(22,119,255,0.08)",
                            border: "1px solid rgba(22,119,255,0.25)",
                            borderRadius: 7,
                            padding: "5px 10px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FileText size={12} /> Review Dokumen
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalCompany && (
        <div
          onClick={() => !isRejecting && setRejectModalCompany(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(10,27,61,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 24px 80px rgba(10,27,61,0.18)",
              border: "1px solid rgba(22,119,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "24px 28px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
                Alasan Penolakan Perusahaan
              </h2>
              <button
                onClick={() => !isRejecting && setRejectModalCompany(null)}
                disabled={isRejecting}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 28 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 12 }}>
                Sedang menolak verifikasi untuk: <strong style={{ color: "#0A1B3D" }}>{rejectModalCompany.name}</strong>
              </p>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0A1B3D",
                    marginBottom: 6,
                  }}
                >
                  Alasan Penolakan <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Jelaskan alasan penolakan (misal: dokumen SIUP tidak valid)..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(22,119,255,0.2)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#0A1B3D",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setRejectModalCompany(null)}
                  disabled={isRejecting}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "1px solid rgba(22,119,255,0.2)",
                    background: "#f0f7ff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#6a88b8",
                    cursor: isRejecting ? "not-allowed" : "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={() => void handleRejectConfirm()}
                  disabled={!rejectReason.trim() || isRejecting}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background:
                      rejectReason.trim() && !isRejecting
                        ? "linear-gradient(135deg, #ff6b6b, #e03030)"
                        : "rgba(255,107,107,0.3)",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: rejectReason.trim() && !isRejecting ? "pointer" : "not-allowed",
                  }}
                >
                  {isRejecting ? "Mengirim..." : "Kirim Penolakan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
