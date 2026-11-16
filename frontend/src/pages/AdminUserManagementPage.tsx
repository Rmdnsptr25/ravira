import { useState } from "react";
import { CheckCircle2, KeyRound, Search, Users, UserX, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";

type UserRoleLabel = "Kandidat" | "Recruiter" | "Pemerintah" | "Admin";
type UserAccountStatus = "Aktif" | "Suspended";

interface ManagedUserRow {
  id: number;
  nama: string;
  email: string;
  role: UserRoleLabel;
  status: UserAccountStatus;
  daftar: string;
  lastLogin: string;
}

const initialUsers: ManagedUserRow[] = [
  { id: 1, nama: "Budi Santoso", email: "budi.santoso@gmail.com", role: "Kandidat", status: "Aktif", daftar: "2026-01-15", lastLogin: "2026-05-30" },
  { id: 2, nama: "PT Gojek Indonesia", email: "recruiter@gojek.com", role: "Recruiter", status: "Aktif", daftar: "2025-11-03", lastLogin: "2026-05-29" },
  { id: 3, nama: "Siti Aminah", email: "siti.aminah@yahoo.com", role: "Kandidat", status: "Suspended", daftar: "2026-02-20", lastLogin: "2026-05-10" },
  { id: 4, nama: "Disnaker Kaltim", email: "admin@disnakerkaltim.go.id", role: "Pemerintah", status: "Aktif", daftar: "2025-08-17", lastLogin: "2026-05-28" },
  { id: 5, nama: "Andi Prasetyo", email: "andi.p@hotmail.com", role: "Kandidat", status: "Aktif", daftar: "2026-03-05", lastLogin: "2026-05-30" },
  { id: 6, nama: "CV Maju Bersama", email: "hr@majubersama.co.id", role: "Recruiter", status: "Suspended", daftar: "2026-01-28", lastLogin: "2026-04-12" },
  { id: 7, nama: "Admin Pusat", email: "admin@ravira.id", role: "Admin", status: "Aktif", daftar: "2024-06-01", lastLogin: "2026-05-30" },
  { id: 8, nama: "Dewi Kurniawan", email: "dewi.k@gmail.com", role: "Kandidat", status: "Aktif", daftar: "2026-04-11", lastLogin: "2026-05-27" },
  { id: 9, nama: "PT Bank BRI Tbk", email: "rekrutmen@bri.co.id", role: "Recruiter", status: "Aktif", daftar: "2025-10-22", lastLogin: "2026-05-29" },
  { id: 10, nama: "Kemnaker RI", email: "info@kemnaker.go.id", role: "Pemerintah", status: "Aktif", daftar: "2025-07-09", lastLogin: "2026-05-25" },
];

const roleTabs: Array<"Semua" | UserRoleLabel> = [
  "Semua",
  "Kandidat",
  "Recruiter",
  "Pemerintah",
  "Admin",
];

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<ManagedUserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"Semua" | UserRoleLabel>("Semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | UserAccountStatus>("Semua");
  const [statusModalTarget, setStatusModalTarget] = useState<ManagedUserRow | null>(null);

  const activeCount = users.filter((u) => u.status === "Aktif").length;
  const suspendedCount = users.length - activeCount;

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q || u.nama.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "Semua" || u.role === roleFilter;
    const matchStatus = statusFilter === "Semua" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleConfirmStatusToggle = () => {
    if (!statusModalTarget) return;
    const nextStatus: UserAccountStatus =
      statusModalTarget.status === "Aktif" ? "Suspended" : "Aktif";
    setUsers((prev) =>
      prev.map((u) => (u.id === statusModalTarget.id ? { ...u, status: nextStatus } : u))
    );
    if (nextStatus === "Suspended") {
      toast.warning(`Akun ${statusModalTarget.nama} dinonaktifkan sementara.`);
    } else {
      toast.success(`Akun ${statusModalTarget.nama} diaktifkan kembali.`);
    }
    setStatusModalTarget(null);
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="user-management-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Sistem</p>
            <h1 id="user-management-title">Manajemen pengguna</h1>
            <p>
              Kelola status akses akun kandidat, recruiter, instansi pemerintah, dan administrator platform RAVIRA.
            </p>
          </div>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan akun pengguna">
          <div className="admin-queue-primary">
            <span>Akun aktif terdaftar</span>
            <strong>{activeCount}</strong>
            <p>Total {users.length} akun terpantau pada direktori sampel (48,924 pengguna keseluruhan).</p>
          </div>
          <div className="admin-queue-note">
            <span>Akun ditangguhkan</span>
            <strong>{suspendedCount}</strong>
            <p>Penangguhan atau pemulihan akses akun selalu memerlukan konfirmasi admin.</p>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Direktori akun pengguna</h2>
              <p>Saring akun berdasarkan peran, status aktif, atau nama/email.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter peran pengguna">
              {roleTabs.map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={roleFilter === role}
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau email..."
                  aria-label="Cari pengguna"
                />
              </div>
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "Semua" | UserAccountStatus)
                }
                aria-label="Filter status akun"
              >
                <option value="Semua">Semua status</option>
                <option value="Aktif">Aktif</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <span className="admin-cell-subtitle">
              Menampilkan {filtered.length} dari {users.length} pengguna
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="admin-state">
              <Users size={28} aria-hidden="true" />
              <strong>Tidak ada pengguna ditemukan</strong>
              <p>Coba ubah filter peran, status, atau kata kunci pencarian.</p>
            </div>
          ) : (
            <div className="admin-responsive-table">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th scope="col">Pengguna</th>
                    <th scope="col">Peran</th>
                    <th scope="col">Status</th>
                    <th scope="col">Terdaftar</th>
                    <th scope="col">Login terakhir</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const isSuspended = user.status === "Suspended";
                    return (
                      <tr key={user.id}>
                        <td>
                          <span className="admin-cell-title">{user.nama}</span>
                          <span className="admin-cell-subtitle">{user.email}</span>
                        </td>
                        <td>
                          <span className="admin-status admin-status-neutral">{user.role}</span>
                        </td>
                        <td>
                          <span
                            className={
                              isSuspended
                                ? "admin-status admin-status-rejected"
                                : "admin-status admin-status-approved"
                            }
                          >
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{user.daftar}</td>
                        <td>{user.lastLogin}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className={
                                isSuspended
                                  ? "admin-button admin-button-approve"
                                  : "admin-button admin-button-danger-quiet"
                              }
                              onClick={() => setStatusModalTarget(user)}
                            >
                              {isSuspended ? (
                                <>
                                  <CheckCircle2 size={14} aria-hidden="true" />
                                  Aktifkan
                                </>
                              ) : (
                                <>
                                  <UserX size={14} aria-hidden="true" />
                                  Suspend
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              className="admin-button admin-button-secondary"
                              onClick={() =>
                                toast.success(`Tautan reset password dikirim ke ${user.email}.`)
                              }
                            >
                              <KeyRound size={14} aria-hidden="true" />
                              Reset password
                            </button>
                          </div>
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

      {statusModalTarget && (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="user-status-dialog-title">
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">{statusModalTarget.role}</p>
                <h2 id="user-status-dialog-title">
                  {statusModalTarget.status === "Aktif" ? "Tangguhkan akun?" : "Aktifkan kembali akun?"}
                </h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setStatusModalTarget(null)}
                aria-label="Tutup dialog"
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-dialog-body">
              <p>
                {statusModalTarget.status === "Aktif" ? (
                  <>
                    Akun <strong>{statusModalTarget.nama}</strong> ({statusModalTarget.email}) akan ditangguhkan dan tidak dapat masuk ke platform sampai diaktifkan kembali.
                  </>
                ) : (
                  <>
                    Akun <strong>{statusModalTarget.nama}</strong> ({statusModalTarget.email}) akan diaktifkan kembali sehingga dapat mengakses platform RAVIRA.
                  </>
                )}
              </p>
            </div>
            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => setStatusModalTarget(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className={
                  statusModalTarget.status === "Aktif"
                    ? "admin-button admin-button-danger"
                    : "admin-button admin-button-approve"
                }
                onClick={handleConfirmStatusToggle}
              >
                {statusModalTarget.status === "Aktif" ? "Ya, tangguhkan" : "Ya, aktifkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
