import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";
import {
  approveCompany,
  listPendingCompanies,
  rejectCompany,
  type AdminCompanyVerificationStatus,
  type AdminPendingCompany,
} from "../services/raviraApi";

const statusLabel: Record<AdminCompanyVerificationStatus, string> = {
  PENDING: "MENUNGGU",
  APPROVED: "DIVERIFIKASI",
  REJECTED: "DITOLAK",
};

type QueueFilter = "all" | "pending" | "processed";

export default function AdminVerifikasiPage() {
  const [companies, setCompanies] = useState<AdminPendingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
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
    queueMicrotask(() => void fetchCompanies(controller.signal));
    return () => controller.abort();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!rejectModalCompany) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isRejecting) setRejectModalCompany(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isRejecting, rejectModalCompany]);

  const handleApprove = async (company: AdminPendingCompany) => {
    if (submittingId) return;
    setSubmittingId(company.id);
    try {
      const updated = await approveCompany(company.id);
      setCompanies((current) =>
        current.map((item) =>
          item.id === company.id ? { ...item, ...updated, verificationStatus: "APPROVED" } : item
        )
      );
      toast.success(`${company.name} disetujui dan tercatat di audit log.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memverifikasi perusahaan.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalCompany || !rejectReason.trim() || isRejecting) return;
    setIsRejecting(true);
    try {
      const updated = await rejectCompany(rejectModalCompany.id, { reason: rejectReason.trim() });
      setCompanies((current) =>
        current.map((item) =>
          item.id === rejectModalCompany.id
            ? { ...item, ...updated, verificationStatus: "REJECTED" }
            : item
        )
      );
      toast.success(`${rejectModalCompany.name} ditolak dengan alasan yang tercatat.`);
      setRejectModalCompany(null);
      setRejectReason("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menolak perusahaan.");
    } finally {
      setIsRejecting(false);
    }
  };

  const pendingCount = companies.filter((company) => company.verificationStatus === "PENDING").length;
  const processedCount = companies.length - pendingCount;
  const filtered = companies.filter((company) => {
    if (filter === "pending") return company.verificationStatus === "PENDING";
    if (filter === "processed") return company.verificationStatus !== "PENDING";
    return true;
  });

  const emptyMessage =
    filter === "pending"
      ? "Tidak ada perusahaan yang perlu ditinjau saat ini."
      : filter === "processed"
        ? "Belum ada keputusan yang dibuat dalam sesi ini."
        : "Antrean verifikasi masih kosong.";

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="verification-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Kepercayaan dan kepatuhan</p>
            <h1 id="verification-title">Verifikasi perusahaan</h1>
            <p>
              Tinjau identitas perusahaan sebelum akses kandidat dan proses rekrutmen dibuka.
            </p>
          </div>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => void fetchCompanies()}
            disabled={loading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Perbarui antrean
          </button>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan antrean">
          <div className="admin-queue-primary">
            <span>Perlu keputusan</span>
            <strong>{pendingCount}</strong>
            <p>Pengajuan dari database RAVIRA yang masih menunggu pemeriksaan admin.</p>
          </div>
          <div className="admin-queue-note">
            <span>Diproses sesi ini</span>
            <strong>{processedCount}</strong>
            <p>Keputusan tetap memerlukan pemeriksaan manual. Sistem tidak menolak otomatis.</p>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Antrean pemeriksaan</h2>
              <p>Data yang tersedia berasal dari endpoint pengajuan berstatus menunggu.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter antrean">
              {[
                { key: "all", label: "Semua" },
                { key: "pending", label: "Perlu ditinjau" },
                { key: "processed", label: "Diproses" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key as QueueFilter)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="admin-state" role="status">
              <Loader2 className="admin-spinner" size={28} aria-hidden="true" />
              <strong>Memuat antrean verifikasi</strong>
              <p>RAVIRA sedang mengambil pengajuan perusahaan terbaru.</p>
            </div>
          ) : error ? (
            <div className="admin-state admin-state-error" role="alert">
              <AlertTriangle size={28} aria-hidden="true" />
              <strong>Antrean tidak dapat dimuat</strong>
              <p>{error}</p>
              <button type="button" className="admin-button admin-button-secondary" onClick={() => void fetchCompanies()}>
                Coba lagi
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-state">
              <Building2 size={28} aria-hidden="true" />
              <strong>Antrean kosong</strong>
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <div className="admin-responsive-table">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th scope="col">Perusahaan</th>
                    <th scope="col">Profil usaha</th>
                    <th scope="col">PIC recruiter</th>
                    <th scope="col">Status</th>
                    <th scope="col">Keputusan</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((company) => {
                    const recruiterPic =
                      company.recruiters?.[0]?.user?.fullName ||
                      company.recruiters?.[0]?.user?.email ||
                      "Belum tersedia";
                    const isSubmitting = submittingId === company.id;
                    const isPending = company.verificationStatus === "PENDING";

                    return (
                      <tr key={company.id}>
                        <td data-label="Perusahaan">
                          <div className="admin-company-cell">
                            <span className="admin-company-mark" aria-hidden="true">
                              <Building2 size={16} />
                            </span>
                            <div>
                              <strong>{company.name}</strong>
                              <span>
                                Terdaftar {company.createdAt ? new Date(company.createdAt).toLocaleDateString("id-ID") : "tanpa tanggal"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td data-label="Profil usaha">
                          <strong className="admin-cell-title">{company.industry || "Industri belum diisi"}</strong>
                          <span className="admin-cell-subtitle">{company.location || "Lokasi belum diisi"}</span>
                          {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="admin-text-link">
                              Buka website
                            </a>
                          )}
                        </td>
                        <td data-label="PIC recruiter">{recruiterPic}</td>
                        <td data-label="Status">
                          <span className={`admin-status admin-status-${company.verificationStatus.toLowerCase()}`}>
                            {statusLabel[company.verificationStatus]}
                          </span>
                        </td>
                        <td data-label="Keputusan">
                          {isPending ? (
                            <div className="admin-row-actions">
                              <button
                                type="button"
                                aria-label={`Approve ${company.name}`}
                                className="admin-button admin-button-approve"
                                onClick={() => void handleApprove(company)}
                                disabled={submittingId !== null}
                              >
                                <CheckCircle2 size={15} aria-hidden="true" />
                                {isSubmitting ? "Memproses" : "Setujui"}
                              </button>
                              <button
                                type="button"
                                aria-label={`Reject ${company.name}`}
                                className="admin-button admin-button-danger-quiet"
                                onClick={() => {
                                  setRejectModalCompany(company);
                                  setRejectReason("");
                                }}
                                disabled={submittingId !== null}
                              >
                                <XCircle size={15} aria-hidden="true" />
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="admin-decision-complete">Keputusan tersimpan</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {rejectModalCompany && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isRejecting) setRejectModalCompany(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-company-title"
            aria-describedby="reject-company-description"
            className="admin-dialog"
          >
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">Keputusan manual</p>
                <h2 id="reject-company-title">Alasan Penolakan Perusahaan</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                aria-label="Tutup dialog penolakan"
                onClick={() => setRejectModalCompany(null)}
                disabled={isRejecting}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="admin-dialog-body">
              <p id="reject-company-description">
                Alasan untuk <strong>{rejectModalCompany.name}</strong> akan disimpan dalam audit log dan dapat digunakan untuk peninjauan ulang.
              </p>
              <label htmlFor="company-rejection-reason">Alasan penolakan</label>
              <textarea
                id="company-rejection-reason"
                autoFocus
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Jelaskan alasan penolakan, dokumen, atau informasi yang perlu diperbaiki."
                rows={5}
                required
              />
            </div>
            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => setRejectModalCompany(null)}
                disabled={isRejecting}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-button admin-button-danger"
                onClick={() => void handleRejectConfirm()}
                disabled={!rejectReason.trim() || isRejecting}
              >
                {isRejecting ? "Menyimpan keputusan" : "Kirim Penolakan"}
              </button>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
