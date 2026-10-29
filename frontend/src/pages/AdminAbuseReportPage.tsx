import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  Search,
  UserX,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";
import {
  listFraudCases,
  updateFraudCaseDecision,
  type FraudCase,
  type FraudRiskLevel,
  type FraudReviewStatus,
} from "../services/raviraApi";

const severityColor: Record<FraudRiskLevel, string> = {
  HIGH: "#ff6b6b",
  MEDIUM: "#f59e0b",
  LOW: "#10d98e",
};

const severityBg: Record<FraudRiskLevel, string> = {
  HIGH: "rgba(255,107,107,0.1)",
  MEDIUM: "rgba(245,158,11,0.1)",
  LOW: "rgba(16,217,142,0.1)",
};

const statusBadgeColor: Record<FraudReviewStatus, { color: string; bg: string }> = {
  OPEN: { color: "#1677FF", bg: "rgba(22,119,255,0.1)" },
  IN_REVIEW: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  NEED_VERIFICATION: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  VALID: { color: "#ff6b6b", bg: "rgba(255,107,107,0.1)" },
  FALSE_POSITIVE: { color: "#10d98e", bg: "rgba(16,217,142,0.1)" },
  MERGED: { color: "#0D47A1", bg: "rgba(13,71,161,0.1)" },
  BLOCKED: { color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
  RESOLVED: { color: "#059669", bg: "rgba(5,150,105,0.1)" },
};

const decisionOptions: Array<{
  value: "VALID" | "FALSE_POSITIVE" | "NEED_VERIFICATION" | "MERGED" | "BLOCKED" | "RESOLVED";
  label: string;
  description: string;
}> = [
  { value: "VALID", label: "Valid Fraud", description: "Terbukti melakukan kecurangan identitas" },
  { value: "FALSE_POSITIVE", label: "False Positive", description: "Bukan pelanggaran, data sah" },
  { value: "NEED_VERIFICATION", label: "Butuh Verifikasi", description: "Kandidat diminta melampirkan verifikasi tambahan" },
  { value: "MERGED", label: "Gabungkan Duplikat", description: "Akun digabung dengan data utama" },
  { value: "BLOCKED", label: "Blokir Akun", description: "Tutup akses akun kandidat (status nonaktif)" },
  { value: "RESOLVED", label: "Selesai (Resolved)", description: "Kasus telah ditindaklanjuti dan diselesaikan" },
];

export default function AdminAbuseReportPage() {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Decision Modal State
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [decision, setDecision] = useState<"VALID" | "FALSE_POSITIVE" | "NEED_VERIFICATION" | "MERGED" | "BLOCKED" | "RESOLVED">("VALID");
  const [decisionReason, setDecisionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCases = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const query: { riskLevel?: FraudRiskLevel; reviewStatus?: FraudReviewStatus } = {};
        if (riskFilter !== "ALL") query.riskLevel = riskFilter as FraudRiskLevel;
        if (statusFilter !== "ALL") query.reviewStatus = statusFilter as FraudReviewStatus;

        const data = await listFraudCases(query, signal);
        queueMicrotask(() => {
          setCases(data);
          setLoading(false);
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Gagal memuat daftar kasus fraud.";
        queueMicrotask(() => {
          setError(message);
          setLoading(false);
        });
      }
    },
    [riskFilter, statusFilter]
  );

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void fetchCases(controller.signal);
    });
    return () => controller.abort();
  }, [fetchCases]);

  const handleOpenDecisionModal = (c: FraudCase) => {
    setSelectedCase(c);
    setDecision("VALID");
    setDecisionReason("");
  };

  const handleSubmitDecision = async () => {
    if (!selectedCase || !decisionReason.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await updateFraudCaseDecision(selectedCase.id, {
        decision,
        reason: decisionReason.trim(),
      });
      toast.success(`Keputusan untuk kasus ${selectedCase.candidate.fullName} berhasil disimpan.`);
      setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? updated : c)));
      setSelectedCase(null);
      setDecisionReason("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan keputusan kasus.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.candidate.fullName.toLowerCase().includes(q) ||
      c.candidate.emailMasked.toLowerCase().includes(q) ||
      (c.candidate.location && c.candidate.location.toLowerCase().includes(q)) ||
      c.signals.some((s) => s.signalType.toLowerCase().includes(q))
    );
  });

  const stats = [
    { label: "Total Kasus", value: cases.length, color: "#1677FF" },
    { label: "Risiko Tinggi", value: cases.filter((c) => c.riskLevel === "HIGH").length, color: "#ff6b6b" },
    { label: "Risiko Sedang", value: cases.filter((c) => c.riskLevel === "MEDIUM").length, color: "#f59e0b" },
    { label: "Risiko Rendah", value: cases.filter((c) => c.riskLevel === "LOW").length, color: "#10d98e" },
  ];

  const riskTabs = [
    { id: "ALL", label: "Semua Level" },
    { id: "HIGH", label: "Tinggi" },
    { id: "MEDIUM", label: "Sedang" },
    { id: "LOW", label: "Rendah" },
  ];

  const statusOptions = [
    { id: "ALL", label: "Semua Status" },
    { id: "OPEN", label: "OPEN" },
    { id: "IN_REVIEW", label: "IN_REVIEW" },
    { id: "NEED_VERIFICATION", label: "NEED_VERIFICATION" },
    { id: "VALID", label: "VALID" },
    { id: "FALSE_POSITIVE", label: "FALSE_POSITIVE" },
    { id: "MERGED", label: "MERGED" },
    { id: "BLOCKED", label: "BLOCKED" },
    { id: "RESOLVED", label: "RESOLVED" },
  ];

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} userName="Admin Ravira" userRole="Super Admin" userInitial="A">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 4 }}>
          Laporan Abuse & Integritas Fraud
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6a88b8" }}>
          Investigasi deteksi otomatis sistem, duplikasi akun, dan sinyal integritas profil kandidat
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

      {/* Filter and Search Bar */}
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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Risk Level Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {riskTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setRiskFilter(t.id)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: riskFilter === t.id ? 600 : 400,
                  color: riskFilter === t.id ? "#1677FF" : "#6a88b8",
                  background: riskFilter === t.id ? "rgba(22,119,255,0.08)" : "transparent",
                  border: riskFilter === t.id ? "1px solid rgba(22,119,255,0.25)" : "1px solid transparent",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#0A1B3D",
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(22,119,255,0.2)",
              background: "#fff",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
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
            placeholder="Cari kandidat atau sinyal..."
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

      {/* Cases List */}
      {loading ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(22,119,255,0.1)",
            padding: 48,
            textAlign: "center",
            color: "#6a88b8",
          }}
        >
          <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "#1677FF" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Memuat daftar kasus integritas & fraud...</p>
        </div>
      ) : error ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(255,107,107,0.2)",
            padding: 36,
            textAlign: "center",
          }}
        >
          <AlertTriangle size={32} color="#ff6b6b" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#ff6b6b", marginBottom: 12 }}>
            {error}
          </p>
          <button
            onClick={() => void fetchCases()}
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
      ) : filteredCases.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(22,119,255,0.1)",
            padding: 48,
            textAlign: "center",
            color: "#6a88b8",
          }}
        >
          <ShieldAlert size={36} color="#6a88b8" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500 }}>
            Tidak ada laporan atau kasus fraud yang sesuai filter.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredCases.map((c) => {
            const statusConfig = statusBadgeColor[c.reviewStatus] || {
              color: "#6a88b8",
              bg: "rgba(106,136,184,0.1)",
            };

            return (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: `1px solid ${severityColor[c.riskLevel]}40`,
                  padding: "18px 20px",
                  boxShadow: "0 2px 8px rgba(10,27,61,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: "#0A1B3D" }}>
                        {c.candidate.fullName}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9,
                          fontWeight: 700,
                          color: severityColor[c.riskLevel],
                          background: severityBg[c.riskLevel],
                          borderRadius: 6,
                          padding: "2px 7px",
                          border: `1px solid ${severityColor[c.riskLevel]}40`,
                        }}
                      >
                        {c.riskLevel} RISK ({c.riskScore})
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9,
                          fontWeight: 600,
                          color: statusConfig.color,
                          background: statusConfig.bg,
                          borderRadius: 6,
                          padding: "2px 7px",
                          border: `1px solid ${statusConfig.color}40`,
                        }}
                      >
                        STATUS: {c.reviewStatus}
                      </span>
                      {!c.candidate.isActive && (
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9,
                            fontWeight: 600,
                            color: "#dc2626",
                            background: "rgba(220,38,38,0.1)",
                            borderRadius: 6,
                            padding: "2px 7px",
                            border: "1px solid rgba(220,38,38,0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <UserX size={10} /> AKUN NONAKTIF
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>
                      Email: <strong style={{ color: "#0A1B3D" }}>{c.candidate.emailMasked}</strong>
                      {c.candidate.phoneMasked && (
                        <> · No Telp: <strong style={{ color: "#0A1B3D" }}>{c.candidate.phoneMasked}</strong></>
                      )}
                      {c.candidate.location && (
                        <> · Lokasi: <strong style={{ color: "#0A1B3D" }}>{c.candidate.location}</strong></>
                      )}
                      {" · "}Dibuat: {c.createdAt ? new Date(c.createdAt).toLocaleDateString("id-ID") : "-"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleOpenDecisionModal(c)}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1677FF",
                        background: "rgba(22,119,255,0.08)",
                        border: "1px solid rgba(22,119,255,0.25)",
                        borderRadius: 8,
                        padding: "6px 14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={13} /> Tinjau & Putuskan
                    </button>
                  </div>
                </div>

                {/* Signals breakdown */}
                {c.signals && c.signals.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(22,119,255,0.03)",
                      border: "1px solid rgba(22,119,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0A1B3D",
                        marginBottom: 6,
                      }}
                    >
                      Sinyal Deteksi Integritas:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {c.signals.map((sig) => (
                        <div
                          key={sig.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            color: "#4a6080",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 10,
                              color: severityColor[sig.riskLevel],
                              background: severityBg[sig.riskLevel],
                              borderRadius: 4,
                              padding: "1px 5px",
                            }}
                          >
                            {sig.signalType}
                          </span>
                          <span>{sig.evidenceMasked}</span>
                          <span style={{ fontSize: 10, color: "#9ab4cc" }}>({sig.status})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision history if decided */}
                {c.decision && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#f8fafc",
                      border: "1px solid rgba(0,0,0,0.06)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: "#4a6080",
                    }}
                  >
                    <strong>Keputusan Terakhir:</strong> {c.decision}
                    {c.reason && <> · Alasan: "{c.reason}"</>}
                    {c.reviewer && (
                      <> · Reviewer: {c.reviewer.fullName} ({c.reviewer.role})</>
                    )}
                    {c.decidedAt && (
                      <> · Waktu: {new Date(c.decidedAt).toLocaleString("id-ID")}</>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Modal */}
      {selectedCase && (
        <div
          onClick={() => !isSubmitting && setSelectedCase(null)}
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
              maxWidth: 520,
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
                Tinjau & Putuskan Kasus Integritas
              </h2>
              <button
                onClick={() => !isSubmitting && setSelectedCase(null)}
                disabled={isSubmitting}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 28 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>
                Kandidat: <strong style={{ color: "#0A1B3D" }}>{selectedCase.candidate.fullName}</strong> (
                {selectedCase.candidate.emailMasked})
              </p>

              {/* Decision select */}
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
                  Pilih Keputusan Review <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <select
                  value={decision}
                  onChange={(e) =>
                    setDecision(
                      e.target.value as "VALID" | "FALSE_POSITIVE" | "NEED_VERIFICATION" | "MERGED" | "BLOCKED" | "RESOLVED"
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
                  {decisionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} — {opt.description}
                    </option>
                  ))}
                </select>
              </div>

              {decision === "BLOCKED" && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(220,38,38,0.08)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "#dc2626",
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>
                    Perhatian: Keputusan ini akan menonaktifkan akun kandidat secara langsung di sistem.
                  </span>
                </div>
              )}

              {/* Reason input */}
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
                  placeholder="Berikan alasan keputusan yang jelas untuk audit log..."
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

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSelectedCase(null)}
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
