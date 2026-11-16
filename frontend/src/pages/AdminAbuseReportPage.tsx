import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  UserX,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";
import {
  listFraudCases,
  updateFraudCaseDecision,
  type FraudCase,
  type FraudReviewStatus,
  type FraudRiskLevel,
} from "../services/raviraApi";

const riskBadgeClass: Record<FraudRiskLevel, string> = {
  HIGH: "admin-status admin-status-rejected",
  MEDIUM: "admin-status admin-status-pending",
  LOW: "admin-status admin-status-approved",
};

const reviewStatusBadgeClass: Record<FraudReviewStatus, string> = {
  OPEN: "admin-status admin-status-neutral",
  IN_REVIEW: "admin-status admin-status-pending",
  NEED_VERIFICATION: "admin-status admin-status-pending",
  VALID: "admin-status admin-status-rejected",
  FALSE_POSITIVE: "admin-status admin-status-approved",
  MERGED: "admin-status admin-status-neutral",
  BLOCKED: "admin-status admin-status-rejected",
  RESOLVED: "admin-status admin-status-approved",
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

const riskTabs = [
  { id: "ALL", label: "Semua level" },
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

export default function AdminAbuseReportPage() {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [decision, setDecision] = useState<
    "VALID" | "FALSE_POSITIVE" | "NEED_VERIFICATION" | "MERGED" | "BLOCKED" | "RESOLVED"
  >("VALID");
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

  const handleOpenDecisionModal = (fraudCase: FraudCase) => {
    setSelectedCase(fraudCase);
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

  const highRiskCount = cases.filter((c) => c.riskLevel === "HIGH").length;
  const openReviewCount = cases.filter(
    (c) => c.reviewStatus === "OPEN" || c.reviewStatus === "IN_REVIEW" || c.reviewStatus === "NEED_VERIFICATION"
  ).length;

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="abuse-report-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Trust &amp; governance</p>
            <h1 id="abuse-report-title">Laporan abuse &amp; integritas fraud</h1>
            <p>
              Investigasi sinyal deteksi sistem, duplikasi akun, dan integritas profil kandidat dengan keputusan manual admin.
            </p>
          </div>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => void fetchCases()}
            disabled={loading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Perbarui antrean
          </button>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan kasus integritas">
          <div className="admin-queue-primary">
            <span>Menunggu peninjauan ({cases.length} total kasus)</span>
            <strong>{openReviewCount}</strong>
            <p>Kandidat tidak pernah ditolak atau diblokir otomatis tanpa review manual oleh admin.</p>
          </div>
          <div className="admin-queue-note">
            <span>Prioritas risiko tinggi</span>
            <strong>{highRiskCount}</strong>
            <p>Data identitas sensitif ditampilkan dalam format tersamarkan (masked) untuk privasi.</p>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Daftar kasus integritas</h2>
              <p>Saring kasus berdasarkan tingkat risiko, status review, atau sinyal deteksi.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter level risiko">
              {riskTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={riskFilter === tab.id}
                  onClick={() => setRiskFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-toolbar-group">
              <div className="admin-search-field">
                <Search size={15} color="#64748b" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kandidat atau sinyal..."
                  aria-label="Cari kasus fraud"
                />
              </div>
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter status review"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="admin-cell-subtitle">
              Menampilkan {filteredCases.length} kasus
            </span>
          </div>

          {loading ? (
            <div className="admin-state" role="status">
              <Loader2 className="admin-spinner" size={28} aria-hidden="true" />
              <strong>Memuat daftar kasus integritas &amp; fraud</strong>
              <p>RAVIRA sedang mengambil sinyal deteksi terbaru dari server.</p>
            </div>
          ) : error ? (
            <div className="admin-state admin-state-error" role="alert">
              <AlertTriangle size={28} aria-hidden="true" />
              <strong>Daftar kasus tidak dapat dimuat</strong>
              <p>{error}</p>
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => void fetchCases()}
              >
                <RefreshCw size={14} aria-hidden="true" />
                Coba lagi
              </button>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="admin-state">
              <ShieldAlert size={28} aria-hidden="true" />
              <strong>Tidak ada kasus yang cocok</strong>
              <p>Tidak ada laporan atau kasus fraud yang sesuai dengan filter saat ini.</p>
            </div>
          ) : (
            <div className="admin-panel-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredCases.map((c) => (
                <article
                  key={c.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #d9e0e8",
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 14,
                      flexWrap: "wrap",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <strong style={{ fontSize: 15, color: "#0d1117" }}>{c.candidate.fullName}</strong>
                        <span className={riskBadgeClass[c.riskLevel]}>
                          {c.riskLevel} RISK ({c.riskScore})
                        </span>
                        <span className={reviewStatusBadgeClass[c.reviewStatus] ?? "admin-status admin-status-neutral"}>
                          STATUS: {c.reviewStatus}
                        </span>
                        {!c.candidate.isActive && (
                          <span className="admin-status admin-status-rejected" style={{ gap: 4, alignItems: "center" }}>
                            <UserX size={11} aria-hidden="true" /> AKUN NONAKTIF
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#526074", lineHeight: 1.55 }}>
                        Email: <strong style={{ color: "#172033" }}>{c.candidate.emailMasked}</strong>
                        {c.candidate.phoneMasked && (
                          <>
                            {" "}· No Telp: <strong style={{ color: "#172033" }}>{c.candidate.phoneMasked}</strong>
                          </>
                        )}
                        {c.candidate.location && (
                          <>
                            {" "}· Lokasi: <strong style={{ color: "#172033" }}>{c.candidate.location}</strong>
                          </>
                        )}
                        {" · "}Dibuat: {c.createdAt ? new Date(c.createdAt).toLocaleDateString("id-ID") : "-"}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="admin-button admin-button-primary"
                      onClick={() => handleOpenDecisionModal(c)}
                    >
                      <CheckCircle2 size={14} aria-hidden="true" />
                      Tinjau &amp; Putuskan
                    </button>
                  </div>

                  {c.signals && c.signals.length > 0 && (
                    <div
                      style={{
                        background: "#f5f7f9",
                        border: "1px solid #e4e9ef",
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#172033", marginBottom: 8 }}>
                        Sinyal Deteksi Integritas
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {c.signals.map((sig) => (
                          <div
                            key={sig.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              fontSize: 12,
                              color: "#39475a",
                            }}
                          >
                            <span className={riskBadgeClass[sig.riskLevel]}>{sig.signalType}</span>
                            <span>{sig.evidenceMasked}</span>
                            <span className="admin-cell-subtitle" style={{ marginTop: 0 }}>
                              ({sig.status})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.decision && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "#eef2f6",
                        fontSize: 12,
                        color: "#39475a",
                      }}
                    >
                      <strong>Keputusan Terakhir:</strong> {c.decision}
                      {c.reason && <> · Alasan: &ldquo;{c.reason}&rdquo;</>}
                      {c.reviewer && (
                        <>
                          {" "}· Reviewer: {c.reviewer.fullName} ({c.reviewer.role})
                        </>
                      )}
                      {c.decidedAt && (
                        <> · Waktu: {new Date(c.decidedAt).toLocaleString("id-ID")}</>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedCase && (
        <div
          className="admin-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fraud-decision-title"
          onClick={() => !isSubmitting && setSelectedCase(null)}
        >
          <div className="admin-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">Keputusan review manual</p>
                <h2 id="fraud-decision-title">Tinjau &amp; Putuskan Kasus Integritas</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => !isSubmitting && setSelectedCase(null)}
                disabled={isSubmitting}
                aria-label="Tutup dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-dialog-body">
              <p>
                Kandidat: <strong>{selectedCase.candidate.fullName}</strong> ({selectedCase.candidate.emailMasked})
              </p>

              <div className="admin-field" style={{ marginBottom: 16 }}>
                <label htmlFor="fraud-decision-select">Pilih Keputusan Review *</label>
                <select
                  id="fraud-decision-select"
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={decision}
                  onChange={(e) =>
                    setDecision(
                      e.target.value as
                        | "VALID"
                        | "FALSE_POSITIVE"
                        | "NEED_VERIFICATION"
                        | "MERGED"
                        | "BLOCKED"
                        | "RESOLVED"
                    )
                  }
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
                  role="alert"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 9,
                    background: "#fae4e1",
                    color: "#812b25",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  <AlertTriangle size={16} aria-hidden="true" />
                  <span>Perhatian: Keputusan ini akan menonaktifkan akun kandidat secara langsung di sistem.</span>
                </div>
              )}

              <div>
                <label htmlFor="fraud-decision-reason">Alasan Keputusan &amp; Catatan Audit *</label>
                <textarea
                  id="fraud-decision-reason"
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Berikan alasan keputusan yang jelas untuk audit log..."
                  rows={4}
                />
              </div>
            </div>

            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => setSelectedCase(null)}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-button admin-button-primary"
                onClick={() => void handleSubmitDecision()}
                disabled={!decisionReason.trim() || isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Keputusan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
