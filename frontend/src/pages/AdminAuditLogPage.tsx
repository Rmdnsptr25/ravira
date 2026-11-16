import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, FileText, Search, X } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";

type AuditAction = "LOGIN" | "CREATE" | "UPDATE" | "DELETE" | "APPROVE";

interface AuditLogRow {
  id: number;
  timestamp: string;
  user: string;
  action: AuditAction;
  resource: string;
  ip: string;
  detail: string;
}

const logs: AuditLogRow[] = [
  { id: 1, timestamp: "2026-05-30 14:32:11", user: "admin@ravira.id", action: "APPROVE", resource: "Perusahaan: PT Gojek Indonesia", ip: "192.168.1.100", detail: "Verifikasi perusahaan disetujui" },
  { id: 2, timestamp: "2026-05-30 14:15:42", user: "admin2@ravira.id", action: "DELETE", resource: "Lowongan ID: #4892", ip: "192.168.1.102", detail: "Lowongan dihapus karena melanggar ToS" },
  { id: 3, timestamp: "2026-05-30 13:58:09", user: "superadmin@ravira.id", action: "UPDATE", resource: "Pengaturan: rate_limit_api", ip: "10.0.0.1", detail: "Rate limit diubah dari 100 ke 200 req/min" },
  { id: 4, timestamp: "2026-05-30 13:44:33", user: "admin@ravira.id", action: "LOGIN", resource: "Auth System", ip: "192.168.1.100", detail: "Login berhasil via 2FA" },
  { id: 5, timestamp: "2026-05-30 13:21:17", user: "admin3@ravira.id", action: "CREATE", resource: "User ID: #98712", ip: "192.168.1.105", detail: "Akun admin baru dibuat" },
  { id: 6, timestamp: "2026-05-30 12:55:04", user: "admin2@ravira.id", action: "UPDATE", resource: "User ID: #45231", ip: "192.168.1.102", detail: "Status user diubah ke Suspended" },
  { id: 7, timestamp: "2026-05-30 12:33:48", user: "superadmin@ravira.id", action: "DELETE", resource: "Report ID: #2341", ip: "10.0.0.1", detail: "Laporan abuse ditutup dan dihapus" },
  { id: 8, timestamp: "2026-05-30 11:47:22", user: "admin@ravira.id", action: "APPROVE", resource: "Lowongan ID: #7823", ip: "192.168.1.100", detail: "Lowongan disetujui setelah review" },
  { id: 9, timestamp: "2026-05-30 11:20:09", user: "admin3@ravira.id", action: "LOGIN", resource: "Auth System", ip: "192.168.1.105", detail: "Login berhasil via SSO" },
  { id: 10, timestamp: "2026-05-30 10:58:37", user: "admin@ravira.id", action: "UPDATE", resource: "AI Config: threshold", ip: "192.168.1.100", detail: "Ambang batas matching diubah ke 0.85" },
  { id: 11, timestamp: "2026-05-30 10:32:14", user: "superadmin@ravira.id", action: "CREATE", resource: "Backup: ravira_db_20260530", ip: "10.0.0.1", detail: "Backup manual database berhasil" },
  { id: 12, timestamp: "2026-05-30 09:45:58", user: "admin2@ravira.id", action: "DELETE", resource: "Perusahaan ID: #1123", ip: "192.168.1.102", detail: "Perusahaan palsu dihapus dari sistem" },
  { id: 13, timestamp: "2026-05-30 09:22:41", user: "admin@ravira.id", action: "UPDATE", resource: "SMTP Config", ip: "192.168.1.100", detail: "Konfigurasi email server diperbarui" },
  { id: 14, timestamp: "2026-05-30 08:55:03", user: "superadmin@ravira.id", action: "APPROVE", resource: "Perusahaan: Kemenaker RI", ip: "10.0.0.1", detail: "Lembaga pemerintah berhasil diverifikasi" },
  { id: 15, timestamp: "2026-05-30 08:30:17", user: "admin3@ravira.id", action: "CREATE", resource: "Report: #3412", ip: "192.168.1.105", detail: "Laporan abuse baru dibuat oleh admin" },
];

const actionBadgeClass: Record<AuditAction, string> = {
  LOGIN: "admin-status admin-status-neutral",
  CREATE: "admin-status admin-status-approved",
  UPDATE: "admin-status admin-status-pending",
  DELETE: "admin-status admin-status-rejected",
  APPROVE: "admin-status admin-status-approved",
};

const actions: Array<"Semua" | AuditAction> = ["Semua", "LOGIN", "CREATE", "UPDATE", "DELETE", "APPROVE"];
const PAGE_SIZE = 6;

export default function AdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"Semua" | AuditAction>("Semua");
  const [dateFrom, setDateFrom] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);

  const filtered = logs.filter((log) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      log.user.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      log.detail.toLowerCase().includes(q);
    const matchAction = actionFilter === "Semua" || log.action === actionFilter;
    const logDate = log.timestamp.slice(0, 10);
    const matchDate = !dateFrom || logDate >= dateFrom;
    return matchSearch && matchAction && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="audit-log-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Trust &amp; governance</p>
            <h1 id="audit-log-title">Audit log</h1>
            <p>
              Rekam jejak aktivitas administratif, perubahan konfigurasi, dan keputusan moderasi pada sistem RAVIRA.
            </p>
          </div>
        </header>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Riwayat aktivitas admin</h2>
              <p>Saring catatan berdasarkan jenis aksi, rentang tanggal, atau aktor.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter jenis aksi">
              {actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  aria-pressed={actionFilter === action}
                  onClick={() => {
                    setActionFilter(action);
                    setPage(1);
                  }}
                >
                  {action}
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
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari user, resource, atau detail..."
                  aria-label="Cari audit log"
                />
              </div>
              <input
                type="date"
                className="admin-input"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter mulai tanggal"
              />
              {dateFrom && (
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={() => {
                    setDateFrom("");
                    setPage(1);
                  }}
                >
                  Reset tanggal
                </button>
              )}
            </div>
            <span className="admin-cell-subtitle">
              Total {filtered.length} catatan cocok
            </span>
          </div>

          {paginated.length === 0 ? (
            <div className="admin-state">
              <FileText size={28} aria-hidden="true" />
              <strong>Tidak ada catatan audit</strong>
              <p>Sesuaikan kata kunci pencarian, jenis aksi, atau tanggal untuk melihat catatan lainnya.</p>
            </div>
          ) : (
            <div className="admin-responsive-table">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th scope="col">Waktu &amp; aktor</th>
                    <th scope="col">Aksi</th>
                    <th scope="col">Resource</th>
                    <th scope="col">IP Address</th>
                    <th scope="col">Detail</th>
                    <th scope="col">Pemeriksaan</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span className="admin-cell-title">{log.user}</span>
                        <span className="admin-cell-subtitle">{log.timestamp}</span>
                      </td>
                      <td>
                        <span className={actionBadgeClass[log.action]}>{log.action}</span>
                      </td>
                      <td>{log.resource}</td>
                      <td>{log.ip}</td>
                      <td>{log.detail}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-button admin-button-secondary"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye size={14} aria-hidden="true" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-pagination">
            <span>
              Menampilkan {paginated.length} dari {filtered.length} log
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Halaman sebelumnya"
                style={{ minHeight: 36, padding: "6px 10px" }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Halaman berikutnya"
                style={{ minHeight: 36, padding: "6px 10px" }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedLog && (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="audit-detail-title">
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">{selectedLog.action}</p>
                <h2 id="audit-detail-title">{selectedLog.resource}</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setSelectedLog(null)}
                aria-label="Tutup detail audit"
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-dialog-body">
              <p>
                <strong>Aktor:</strong> {selectedLog.user} · <strong>IP:</strong> {selectedLog.ip}
              </p>
              <p>
                <strong>Waktu:</strong> {selectedLog.timestamp}
              </p>
              <p>
                <strong>Keterangan:</strong> {selectedLog.detail}
              </p>
            </div>
            <div className="admin-dialog-actions">
              <button type="button" className="admin-button admin-button-secondary" onClick={() => setSelectedLog(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
