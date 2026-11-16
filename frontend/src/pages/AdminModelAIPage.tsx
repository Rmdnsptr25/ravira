import { useState } from "react";
import { Calendar, Eye, Play, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";

interface ModelVersionRow {
  version: string;
  status: "Current" | "Previous" | "Staging";
  deployed: string;
  accuracy: string;
  f1: string;
  size: string;
  notes: string;
}

const models: ModelVersionRow[] = [
  { version: "v2.4.1", status: "Current", deployed: "2026-05-01", accuracy: "94.2%", f1: "0.92", size: "1.2 GB", notes: "Versi produksi aktif untuk pencocokan kandidat dan lowongan." },
  { version: "v2.3.8", status: "Previous", deployed: "2026-03-15", accuracy: "92.7%", f1: "0.90", size: "1.1 GB", notes: "Versi sebelumnya, disimpan sebagai cadangan rollback." },
  { version: "v2.5.0-beta", status: "Staging", deployed: "—", accuracy: "95.1%", f1: "0.93", size: "1.4 GB", notes: "Kandidat rilis dengan kalibrasi bobot skill teknis baru." },
];

const barData = [82, 76, 88, 91, 85, 93, 89, 94, 91, 87, 95, 92];
const months = ["Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei"];

const statusClassMap: Record<ModelVersionRow["status"], string> = {
  Current: "admin-status admin-status-approved",
  Previous: "admin-status admin-status-neutral",
  Staging: "admin-status admin-status-pending",
};

export default function AdminModelAIPage() {
  const [selectedModel, setSelectedModel] = useState<ModelVersionRow | null>(null);
  const [retrainingQueued, setRetrainingQueued] = useState(false);

  const handleScheduleRetraining = () => {
    setRetrainingQueued(true);
    toast.success("Pembaruan model dijadwalkan untuk antrean berikutnya.");
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="ai-model-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Sistem</p>
            <h1 id="ai-model-title">Kinerja model AI</h1>
            <p>
              Pantau akurasi rekomendasi kerja, latensi inferensi, dan riwayat versi model yang berjalan di RAVIRA.
            </p>
          </div>
          <button
            type="button"
            className="admin-button admin-button-primary"
            onClick={handleScheduleRetraining}
            disabled={retrainingQueued}
          >
            <Play size={15} aria-hidden="true" />
            {retrainingQueued ? "Retraining terjadwal" : "Jadwalkan retraining"}
          </button>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan metrik model AI">
          <div className="admin-queue-primary">
            <span>Akurasi model aktif (v2.4.1)</span>
            <strong>94.2%</strong>
            <p>F1 Score 0.92 (Precision 0.94 · Recall 0.90) — naik +0.8% dibanding bulan sebelumnya.</p>
          </div>
          <div className="admin-queue-note">
            <span>Rata-rata latensi inferensi</span>
            <strong>120 ms</strong>
            <p>Menangani 48.2K evaluasi kecocokan per hari (P95: 340 ms · P99: 680 ms).</p>
          </div>
        </div>

        <div className="admin-grid-asymmetric">
          <div className="admin-work-panel">
            <div className="admin-work-panel-header">
              <div>
                <h2>Tren akurasi model (12 bulan)</h2>
                <p>Persentase kecocokan evaluasi bulanan pada data uji internal.</p>
              </div>
            </div>
            <div className="admin-panel-body">
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 170 }}>
                {barData.map((val, idx) => (
                  <div
                    key={months[idx]}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span className="admin-cell-subtitle" style={{ marginTop: 0 }}>
                      {val}%
                    </span>
                    <div
                      style={{
                        width: "100%",
                        height: `${(val / 100) * 124}px`,
                        background: idx === barData.length - 1 ? "#0d315d" : "#cbd5e1",
                        borderRadius: "5px 5px 0 0",
                      }}
                    />
                    <span className="admin-cell-subtitle" style={{ marginTop: 0 }}>
                      {months[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-work-panel">
            <div className="admin-work-panel-header">
              <div>
                <h2>Jadwal pembaruan</h2>
                <p>Ringkasan siklus retraining berkala.</p>
              </div>
              <Calendar size={18} color="#0e67cc" aria-hidden="true" />
            </div>
            <div className="admin-panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Jadwal berikutnya", value: "1 Juni 2026" },
                { label: "Frekuensi", value: "Bulanan" },
                { label: "Ukuran dataset", value: "2.4M records" },
                { label: "Estimasi durasi", value: "4–6 jam" },
                { label: "Pelatihan terakhir", value: "1 Mei 2026" },
                { label: "Training loss", value: "0.043" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 10,
                    borderBottom: "1px solid #e4e9ef",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#526074" }}>{item.label}</span>
                  <strong style={{ fontSize: 13, color: "#172033" }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Riwayat versi model</h2>
              <p>Daftar versi model yang aktif, cadangan, dan dalam tahap pengujian.</p>
            </div>
          </div>
          <div className="admin-responsive-table">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th scope="col">Versi</th>
                  <th scope="col">Status</th>
                  <th scope="col">Tanggal deploy</th>
                  <th scope="col">Akurasi</th>
                  <th scope="col">F1 Score</th>
                  <th scope="col">Ukuran</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.version}>
                    <td>
                      <span className="admin-cell-title">{model.version}</span>
                    </td>
                    <td>
                      <span className={statusClassMap[model.status]}>{model.status.toUpperCase()}</span>
                    </td>
                    <td>{model.deployed}</td>
                    <td>{model.accuracy}</td>
                    <td>{model.f1}</td>
                    <td>{model.size}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-button admin-button-secondary"
                        onClick={() => setSelectedModel(model)}
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
        </div>
      </section>

      {selectedModel && (
        <div className="admin-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="model-detail-title">
          <div className="admin-dialog">
            <div className="admin-dialog-header">
              <div>
                <p className="admin-page-context">{selectedModel.status}</p>
                <h2 id="model-detail-title">Model {selectedModel.version}</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setSelectedModel(null)}
                aria-label="Tutup detail model"
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-dialog-body">
              <p>
                <strong>Akurasi:</strong> {selectedModel.accuracy} · <strong>F1 Score:</strong> {selectedModel.f1} · <strong>Ukuran:</strong> {selectedModel.size}
              </p>
              <p>
                <strong>Catatan Rilis:</strong> {selectedModel.notes}
              </p>
            </div>
            <div className="admin-dialog-actions">
              <button type="button" className="admin-button admin-button-secondary" onClick={() => setSelectedModel(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
