import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  X,
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

const statusBadgeClass: Record<AppealStatus, string> = {
  OPEN: "admin-status admin-status-neutral",
  IN_REVIEW: "admin-status admin-status-pending",
  NEED_INFO: "admin-status admin-status-pending",
  APPROVED: "admin-status admin-status-approved",
  REJECTED: "admin-status admin-status-rejected",
  RESOLVED: "admin-status admin-status-approved",
};

const appealDecisionOptions: Array<{
  value: "IN_REVIEW" | "NEED_INFO" | "APPROVED" | "REJECTED" | "RESOLVED";
  label: string;
}> = [
  { value: "IN_REVIEW", label: "Sedang Ditinjau (IN_REVIEW)" },
  { value: "NEED_INFO", label: "Butuh Bukti Tambahan (NEED_INFO)" },
  { value: "APPROVED", label: "Setujui Sanggahan (APPROVED)" },
  { value: "REJECTED", label: "Tolak Sanggahan (REJECTED)" },
  { value: "RESOLVED", label: "Selesai (RESOLVED)" },
];

const tabs = ["Semua", "OPEN", "IN_REVIEW", "NEED_INFO", "APPROVED", "REJECTED", "RESOLVED"];

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState<AdminAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedAppeal, setSelectedAppeal] = useState<AdminAppeal | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<
    "IN_REVIEW" | "NEED_INFO" | "APPROVED" | "REJECTED" | "RESOLVED"
  >("APPROVED");
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

  const pendingReviewCount = appeals.filter(
    (a) => a.status === "OPEN" || a.status === "IN_REVIEW"
  ).length;
  const completedCount = appeals.filter(
    (a) => a.status === "APPROVED" || a.status === "REJECTED" || a.status === "RESOLVED"
  ).length;

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="appeals-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Trust &amp; governance</p>
            <h1 id="appeals-title">Sanggahan kandidat</h1>
            <p>
              Kelola sanggahan dan klarifikasi kandidat terkait fraud flag, hasil parsing CV, atau penilaian kecocokan.
            </p>
          </div>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => void fetchAppeals()}
            disabled={loading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Perbarui antrean
          </button>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan sanggahan kandidat">
          <div className="admin-queue-primary">
            <span>Menunggu review ({appeals.length} total sanggahan)</span>
            <strong>{pendingReviewCount}</strong>
            <p>Pengajuan klarifikasi kandidat yang masih membutuhkan pemeriksaan dan keputusan admin.</p>
          </div>
          <div className="admin-queue-note">
            <span>Sudah diputuskan</span>
            <strong>{completedCount}</strong>
            <p>Setiap keputusan tercatat dalam audit log beserta alasan pemeriksaan yang jelas.</p>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Antrean sanggahan</h2>
              <p>Saring pengajuan sanggahan berdasarkan status proses atau kata kunci.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter status sanggahan" style={{ flexWrap: "wrap" }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={filter === tab}
                  onClick={() => setFilter(tab)}
                >
                  {tab}
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
                  placeholder="Cari kandidat atau alasan..."
                  aria-label="Cari sanggahan kandidat"
                />
              </div>
            </div>
            <span className="admin-cell-subtitle">
              Menampilkan {filteredAppeals.length} sanggahan
            </span>
          </div>

          {loading ? (
            <div className="admin-state" role="status">
              <Loader2 className="admin-spinner" size={28} aria-hidden="true" />
              <strong>Memuat daftar sanggahan kandidat</strong>
              <p>RAVIRA sedang mengambil data pengajuan sanggahan terbaru.</p>
            </div>
          ) : error ? (
            <div className="admin-state admin-state-error" role="alert">
              <AlertTriangle size={28} aria-hidden="true" />
              <strong>Daftar sanggahan tidak dapat dimuat</strong>
              <p>{error}</p>
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => void fetchAppeals()}
              >
                <RefreshCw size={14} aria-hidden="true" />
                Coba lagi
              </button>
            </div>
          ) : filteredAppeals.length === 0 ? (
            <div className="admin-state">
              <FileText size={28} aria-hidden="true" />
              <strong>Tidak ada sanggahan kandidat</strong>
              <p>Tidak ada sanggahan kandidat yang sesuai dengan filter saat ini.</p>
            </div>
          ) : (
            <div className="admin-responsive-table">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th scope="col">Kandidat</th>
                    <th scope="col">Kategori entitas</th>
                    <th scope="col">Alasan sanggahan</th>
                    <th scope="col">Bukti</th>
                    <th scope="col">Status</th>
                    <th scope="col">Reviewer / waktu</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppeals.map((appeal) => (
                    <tr key={appeal.id}>
                      <td>
                        <span className="admin-cell-title">{appeal.candidate.user.fullName}</span>
                        <span className="admin-cell-subtitle">{appeal.candidate.user.email}</span>
                      </td>
                      <td>
                        <span className="admin-status admin-status-neutral">
                          {appeal.relatedEntity.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ maxWidth: 260 }}>{appeal.reason}</td>
                      <td>
                        {appeal.evidenceUrl ? (
                          <a
                            href={appeal.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-text-link"
                            style={{ marginTop: 0, display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            Lihat Dokumen <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="admin-cell-subtitle">Tidak ada</span>
                        )}
                      </td>
                      <td>
                        <span className={statusBadgeClass[appeal.status] ?? "admin-status admin-status-neutral"}>
                          {appeal.status}
                        </span>
                      </td>
                      <td>
                        {appeal.reviewer ? (
                          <>
                            <span className="admin-cell-title">{appeal.reviewer.fullName}</span>
                            {appeal.resolvedAt && (
                              <span className="admin-cell-subtitle">
                                {new Date(appeal.resolvedAt).toLocaleDateString("id-ID")}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="admin-cell-subtitle">Belum ditinjau</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-button admin-button-secondary"
                          onClick={() => handleOpenDecisionModal(appeal)}
                        >
                          <MessageSquare size={14} aria-hidden="true" />
                          Putuskan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {selectedAppeal && (
        <div
          className="admin-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appeal-decision-title"
          onClick={() => !isSubmitting && setSelectedAppeal(null)}
        >
          <div className="admin-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">{selectedAppeal.relatedEntity}</p>
                <h2 id="appeal-decision-title">Putuskan Sanggahan Kandidat</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => !isSubmitting && setSelectedAppeal(null)}
                disabled={isSubmitting}
                aria-label="Tutup dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-dialog-body">
              <div
                style={{
                  background: "#f5f7f9",
                  border: "1px solid #e4e9ef",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "#172033" }}>
                  {selectedAppeal.candidate.user.fullName}
                </div>
                <div style={{ fontSize: 12, color: "#526074", marginTop: 4 }}>
                  &ldquo;{selectedAppeal.reason}&rdquo;
                </div>
              </div>

              <div className="admin-field" style={{ marginBottom: 16 }}>
                <label htmlFor="appeal-status-select">Status Keputusan *</label>
                <select
                  id="appeal-status-select"
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={decisionStatus}
                  onChange={(e) =>
                    setDecisionStatus(
                      e.target.value as "IN_REVIEW" | "NEED_INFO" | "APPROVED" | "REJECTED" | "RESOLVED"
                    )
                  }
                >
                  {appealDecisionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appeal-decision-reason">Alasan Keputusan &amp; Catatan Audit *</label>
                <textarea
                  id="appeal-decision-reason"
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Jelaskan alasan verifikasi sanggahan ini untuk kandidat dan audit log..."
                  rows={4}
                />
              </div>
            </div>

            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => setSelectedAppeal(null)}
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
