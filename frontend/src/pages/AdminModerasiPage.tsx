import { useState } from "react";
import { Briefcase, CheckCircle2, Eye, Flag, Search, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { RejectionReasonModal } from "../components/Modals";
import { adminSidebarItems } from "../constants/adminSidebar";

type ModerationStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface JobPostModerationItem {
  id: number;
  judul: string;
  perusahaan: string;
  tanggal: string;
  kategori: string;
  status: ModerationStatus;
  flag: string;
  ringkasan: string;
}

const initialJobPosts: JobPostModerationItem[] = [
  { id: 1, judul: "Senior Software Engineer", perusahaan: "PT Tokopedia", tanggal: "2026-05-30", kategori: "Teknologi", status: "Menunggu", flag: "Gaji tidak wajar", ringkasan: "Rentang kompensasi yang dicantumkan melebihi standar posisi serupa tanpa rincian tunjangan." },
  { id: 2, judul: "Digital Marketing Manager", perusahaan: "CV Kreatif Nusantara", tanggal: "2026-05-29", kategori: "Marketing", status: "Menunggu", flag: "Persyaratan mencurigakan", ringkasan: "Meminta kandidat mengirimkan dokumen identitas pribadi sebelum tahap wawancara." },
  { id: 3, judul: "Warehouse Supervisor", perusahaan: "PT JNE Express", tanggal: "2026-05-28", kategori: "Logistik", status: "Disetujui", flag: "-", ringkasan: "Deskripsi posisi, lokasi penempatan, dan kualifikasi sudah sesuai standar." },
  { id: 4, judul: "Data Scientist", perusahaan: "PT Gojek Indonesia", tanggal: "2026-05-27", kategori: "Teknologi", status: "Menunggu", flag: "Konten tidak jelas", ringkasan: "Tanggung jawab pekerjaan terlalu umum dan belum mencantumkan skill wajib." },
  { id: 5, judul: "Finance Manager", perusahaan: "PT Bank BRI Tbk", tanggal: "2026-05-26", kategori: "Keuangan", status: "Ditolak", flag: "Duplikat postingan", ringkasan: "Terdeteksi identik dengan lowongan aktif lain dari unit kerja yang sama." },
  { id: 6, judul: "UI/UX Designer", perusahaan: "PT Bukalapak", tanggal: "2026-05-25", kategori: "Desain", status: "Disetujui", flag: "-", ringkasan: "Seluruh informasi lowongan terverifikasi dan aktif di daftar pencarian." },
  { id: 7, judul: "HR Business Partner", perusahaan: "PT Astra International", tanggal: "2026-05-24", kategori: "HR", status: "Menunggu", flag: "Alamat tidak valid", ringkasan: "Lokasi kantor penempatan tidak cocok dengan alamat perusahaan terdaftar." },
  { id: 8, judul: "Sales Executive", perusahaan: "CV Maju Jaya", tanggal: "2026-05-23", kategori: "Penjualan", status: "Menunggu", flag: "Konten berpotensi penipuan", ringkasan: "Mengandung indikasi permintaan biaya pelatihan di awal rekrutmen." },
];

const statusClassName: Record<ModerationStatus, string> = {
  Menunggu: "admin-status admin-status-pending",
  Disetujui: "admin-status admin-status-approved",
  Ditolak: "admin-status admin-status-rejected",
};

const tabs: Array<"Semua" | ModerationStatus> = ["Semua", "Menunggu", "Disetujui", "Ditolak"];

export default function AdminModerasiPage() {
  const [posts, setPosts] = useState<JobPostModerationItem[]>(initialJobPosts);
  const [filter, setFilter] = useState<"Semua" | ModerationStatus>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [rejectTarget, setRejectTarget] = useState<JobPostModerationItem | null>(null);
  const [detailTarget, setDetailTarget] = useState<JobPostModerationItem | null>(null);

  const pendingCount = posts.filter((post) => post.status === "Menunggu").length;
  const processedCount = posts.length - pendingCount;

  const filtered = posts.filter((post) => {
    const matchTab = filter === "Semua" || post.status === filter;
    const matchDate = !dateFilter || post.tanggal === dateFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      post.judul.toLowerCase().includes(q) ||
      post.perusahaan.toLowerCase().includes(q) ||
      post.flag.toLowerCase().includes(q);
    return matchTab && matchDate && matchSearch;
  });

  const handleApprove = (post: JobPostModerationItem) => {
    setPosts((prev) =>
      prev.map((item) => (item.id === post.id ? { ...item, status: "Disetujui" } : item))
    );
    toast.success(`Lowongan "${post.judul}" disetujui.`);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    setPosts((prev) =>
      prev.map((item) =>
        item.id === rejectTarget.id
          ? { ...item, status: "Ditolak", flag: reason.trim() || item.flag }
          : item
      )
    );
    toast.error(`Lowongan "${rejectTarget.judul}" ditolak.`);
    setRejectTarget(null);
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="moderation-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Operasional</p>
            <h1 id="moderation-title">Moderasi lowongan</h1>
            <p>
              Tinjau postingan lowongan yang ditandai sistem maupun laporan pengguna sebelum ditayangkan ke kandidat.
            </p>
          </div>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan moderasi">
          <div className="admin-queue-primary">
            <span>Menunggu peninjauan</span>
            <strong>{pendingCount}</strong>
            <p>Lowongan yang memerlukan keputusan manual admin sebelum status publikasinya diperbarui.</p>
          </div>
          <div className="admin-queue-note">
            <span>Sudah diputuskan</span>
            <strong>{processedCount}</strong>
            <p>Lowongan terindikasi tetap ditinjau secara manual agar tidak terjadi penolakan keliru.</p>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Daftar moderasi lowongan</h2>
              <p>Gunakan filter status, tanggal posting, atau kata kunci untuk mempercepat pemeriksaan.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter status moderasi">
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
                  placeholder="Cari posisi, perusahaan, atau alasan flag..."
                  aria-label="Cari lowongan moderasi"
                />
              </div>
              <input
                type="date"
                className="admin-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="Filter tanggal posting"
              />
              {dateFilter && (
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={() => setDateFilter("")}
                >
                  Reset tanggal
                </button>
              )}
            </div>
            <span className="admin-cell-subtitle">
              Menampilkan {filtered.length} dari {posts.length} lowongan
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="admin-state">
              <Briefcase size={28} aria-hidden="true" />
              <strong>Tidak ada lowongan yang cocok</strong>
              <p>Ubah filter status, tanggal, atau kata kunci pencarian untuk melihat daftar lainnya.</p>
            </div>
          ) : (
            <div className="admin-responsive-table">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th scope="col">Posisi &amp; perusahaan</th>
                    <th scope="col">Tanggal post</th>
                    <th scope="col">Kategori</th>
                    <th scope="col">Alasan flag</th>
                    <th scope="col">Status</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <span className="admin-cell-title">{post.judul}</span>
                        <span className="admin-cell-subtitle">{post.perusahaan}</span>
                      </td>
                      <td>{post.tanggal}</td>
                      <td>
                        <span className="admin-status admin-status-neutral">{post.kategori}</span>
                      </td>
                      <td>
                        {post.flag !== "-" ? (
                          <span className="admin-status admin-status-rejected" style={{ gap: 5, alignItems: "center" }}>
                            <Flag size={11} aria-hidden="true" />
                            {post.flag}
                          </span>
                        ) : (
                          <span className="admin-cell-subtitle">—</span>
                        )}
                      </td>
                      <td>
                        <span className={statusClassName[post.status]}>{post.status.toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          {post.status !== "Disetujui" && (
                            <button
                              type="button"
                              className="admin-button admin-button-approve"
                              onClick={() => handleApprove(post)}
                            >
                              <CheckCircle2 size={14} aria-hidden="true" />
                              Setujui
                            </button>
                          )}
                          {post.status !== "Ditolak" && (
                            <button
                              type="button"
                              className="admin-button admin-button-danger-quiet"
                              onClick={() => setRejectTarget(post)}
                            >
                              <XCircle size={14} aria-hidden="true" />
                              Tolak
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-button admin-button-secondary"
                            onClick={() => setDetailTarget(post)}
                          >
                            <Eye size={14} aria-hidden="true" />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {detailTarget && (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="mod-detail-title">
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">{detailTarget.perusahaan}</p>
                <h2 id="mod-detail-title">{detailTarget.judul}</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setDetailTarget(null)}
                aria-label="Tutup detail"
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-dialog-body">
              <p>
                <strong>Kategori:</strong> {detailTarget.kategori} · <strong>Tanggal Post:</strong> {detailTarget.tanggal}
              </p>
              <p>
                <strong>Catatan Pemeriksaan:</strong> {detailTarget.ringkasan}
              </p>
            </div>
            <div className="admin-dialog-actions">
              <button type="button" className="admin-button admin-button-secondary" onClick={() => setDetailTarget(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <RejectionReasonModal
          title={rejectTarget.judul}
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </DashboardLayout>
  );
}
