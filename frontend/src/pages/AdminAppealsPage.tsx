import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  Search,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";
import {
  listAppealsForAdmin,
  updateAppealDecision,
  type AdminAppeal,
  type AppealStatus,
} from "../services/raviraApi";

const statusColor: Record<AppealStatus, { color: string; bg: string }> = {
  OPEN: { color: "#1677FF", bg: "rgba(22,119,255,0.1)" },
  IN_REVIEW: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  NEED_INFO: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  APPROVED: { color: "#10d98e", bg: "rgba(16,217,142,0.1)" },
  REJECTED: { color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" },
  RESOLVED: { color: "#059669", bg: "rgba(5,150,105,0.1)" },
};

const appealDecisionOptions: Array<{
  value: "IN_REVIEW" | "NEED_INFO" | "APPROVED" | "REJECTED" | "RESOLVED";
  label: string;
  desc: string;
}> = [
  { value: "IN_REVIEW", label: "Sedang Ditinjau (IN_REVIEW)", desc: "Sanggahan dalam proses review internal" },
  { value: "NEED_INFO", label: "Butuh Bukti Tambahan (NEED_INFO)", desc: "Meminta informasi atau bukti pendukung lebih lanjut" },
  { value: "APPROVED", label: "Setujui Sanggahan (APPROVED)", desc: "Sanggahan diterima dan klaim dipulihkan" },
  { value: "REJECTED", label: "Tolak Sanggahan (REJECTED)", desc: "Sanggahan ditolak karena bukti tidak memadai" },
  { value: "RESOLVED", label: "Selesai (RESOLVED)", desc: "Proses sanggahan tuntas" },
];

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState<AdminAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Decision Modal State
  const [selectedAppeal, setSelectedAppeal] = useState<AdminAppeal | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<"IN_REVIEW" | "NEED_INFO" | "APPROVED" | "REJECTED" | "RESOLVED">("APPROVED");
  const [decisionReason, setDecisionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppeals = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAppealsForAdmin(signal);
      queueMicrotask(() => {
        setAppeals(data);
        setLoading(false);
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Gagal memuat data sanggahan kandidat.";
      queueMicrotask(() => {
        setError(message);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void fetchAppeals(controller.signal);
    });
    return () => controller.abort();
  }, [fetchAppeals]);

  const handleOpenDecisionModal = (appeal: AdminAppeal) => {
    setSelectedAppeal(appeal);
    setDecisionStatus(appeal.status === "OPEN" ? "IN_REVIEW" : "APPROVED");
    setDecisionReason("");
  };

  const handleSubmitDecision = async () => {
    if (!selectedAppeal || !decisionReason.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await updateAppealDecision(selectedAppeal.id, {
        status: decisionStatus,
        reason: decisionReason.trim(),
      });
      toast.success(`Keputusan untuk sanggahan kandidat ${selectedAppeal.candidate.user.fullName} berhasil disimpan.`);
      setAppeals((prev) => prev.map((a) => (a.id === selectedAppeal.id ? updated : a)));
      setSelectedAppeal(null);
      setDecisionReason("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan keputusan sanggahan.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = ["Semua", "OPEN", "IN_REVIEW", "NEED_INFO", "APPROVED", "REJECTED", "RESOLVED"];

  const filteredAppeals = appeals.filter((a) => {
    if (filter !== "Semua" && a.status !== filter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.candidate.user.fullName.toLowerCase().includes(q) ||
      a.candidate.user.email.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q) ||
      a.relatedEntity.toLowerCase().includes(q)
    );
  });

  const stats = [
    { label: "Total Sanggahan", value: appeals.length, color: "#1677FF" },
    {
      label: "Menunggu Review",
      value: appeals.filter((a) => a.status === "OPEN" || a.status === "IN_REVIEW").length,
      color: "#f59e0b",
    },
    {
      label: "Disetujui",
      value: appeals.filter((a) => a.status === "APPROVED").length,
      color: "#10d98e",
    },
    {
      label: "Ditolak",
      value: appeals.filter((a) => a.status === "REJECTED").length,
      color: "#ff6b6b",
    },
  ];

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>
          Sanggahan Kandidat (Appeals)
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Kelola sanggahan dan klarifikasi kandidat terkait fraud flag, penolakan verifikasi, atau scoring
        </p>
      </div>

      {/* Stats */}
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

      {/* Filters and search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            borderRadius: 8,
            border: "1px solid rgba(22,119,255,0.15)",
            padding: "6px 12px",
          }}
        >
          <Search size={14} color="#6a88b8" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kandidat atau alasan..."
            style={{
              border: "none",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#0A1B3D",
              background: "transparent",
              width: 180,
            }}
          />
        </div>
      </div>

      {/* Appeals List Container */}
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
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Memuat daftar sanggahan...</p>
          </div>
        ) : error ? (
          <div style={{ padding: 36, textAlign: "center" }}>
            <AlertTriangle size={32} color="#ff6b6b" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#ff6b6b", marginBottom: 12 }}>
              {error}
            </p>
            <button
              onClick={() => void fetchAppeals()}
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
        ) : filteredAppeals.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#6a88b8" }}>
            <FileText size={36} color="#6a88b8" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500 }}>
              Tidak ada sanggahan kandidat yang ditemukan.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(22,119,255,0.04)", borderBottom: "1px solid rgba(22,119,255,0.1)" }}>
                {["Kandidat", "Kategori Entitas", "Alasan Sanggahan", "Bukti", "Status", "Reviewer / Waktu", "Aksi"].map(
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
              {filteredAppeals.map((a, i) => {
                const badge = statusColor[a.status] || { color: "#6a88b8", bg: "rgba(106,136,184,0.1)" };

                return (
                  <tr
                    key={a.id}
                    style={{
                      borderBottom: i < filteredAppeals.length - 1 ? "1px solid rgba(22,119,255,0.06)" : "none",
                    }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>
                        {a.candidate.user.fullName}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>
                        {a.candidate.user.email}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#1677FF",
                          background: "rgba(22,119,255,0.08)",
                          borderRadius: 6,
                          padding: "2px 7px",
                        }}
                      >
                        {a.relatedEntity.toUpperCase()}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: "#4a6080",
                        maxWidth: 240,
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {a.reason}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
                      {a.evidenceUrl ? (
                        <a
                          href={a.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1677FF",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 500,
                          }}
                        >
                          Lihat Dokumen <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span style={{ color: "#9ab4cc" }}>Tidak ada</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          color: badge.color,
                          background: badge.bg,
                          borderRadius: 6,
                          padding: "3px 8px",
                          border: `1px solid ${badge.color}40`,
                        }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>
                      {a.reviewer ? (
                        <>
                          <div style={{ color: "#0A1B3D", fontWeight: 500 }}>{a.reviewer.fullName}</div>
                          {a.resolvedAt && (
                            <div style={{ fontSize: 10, color: "#9ab4cc" }}>
                              {new Date(a.resolvedAt).toLocaleDateString("id-ID")}
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ color: "#9ab4cc" }}>Belum ditinjau</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => handleOpenDecisionModal(a)}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#1677FF",
                          background: "rgba(22,119,255,0.08)",
                          border: "1px solid rgba(22,119,255,0.25)",
                          borderRadius: 7,
                          padding: "5px 12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MessageSquare size={12} /> Putuskan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Decision Modal */}
      {selectedAppeal && (
        <div
          onClick={() => !isSubmitting && setSelectedAppeal(null)}
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
              maxWidth: 500,
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
                Putuskan Sanggahan Kandidat
              </h2>
              <button
                onClick={() => !isSubmitting && setSelectedAppeal(null)}
                disabled={isSubmitting}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 28 }}>
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 16,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", fontWeight: 600 }}>
                  {selectedAppeal.candidate.user.fullName}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 2 }}>
                  Kategori: <strong>{selectedAppeal.relatedEntity}</strong>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4a6080", marginTop: 4 }}>
                  "{selectedAppeal.reason}"
                </div>
              </div>

              {/* Status selection */}
              <div style={{ marginBottom: 16 }}>
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
                  Status Keputusan <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <select
                  value={decisionStatus}
                  onChange={(e) =>
                    setDecisionStatus(
                      e.target.value as "IN_REVIEW" | "NEED_INFO" | "APPROVED" | "REJECTED" | "RESOLVED"
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(22,119,255,0.25)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#0A1B3D",
                    background: "#fff",
                    outline: "none",
                  }}
                >
                  {appealDecisionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason textarea */}
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
                  Alasan Keputusan & Catatan Audit <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Jelaskan alasan verifikasi sanggahan ini untuk kandidat dan audit log..."
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

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSelectedAppeal(null)}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "1px solid rgba(22,119,255,0.2)",
                    background: "#f0f7ff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: "#6a88b8",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={() => void handleSubmitDecision()}
                  disabled={!decisionReason.trim() || isSubmitting}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background:
                      decisionReason.trim() && !isSubmitting
                        ? "linear-gradient(135deg, #1677FF, #0D47A1)"
                        : "rgba(22,119,255,0.3)",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: decisionReason.trim() && !isSubmitting ? "pointer" : "not-allowed",
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Keputusan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
