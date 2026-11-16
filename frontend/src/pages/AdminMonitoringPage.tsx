import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";

type IntegrationStatus = "OK" | "Error";

interface IntegrationItem {
  id: number;
  name: string;
  endpoint: string;
  lastPing: string;
  uptime: number;
  latency: number;
  status: IntegrationStatus;
}

const initialIntegrations: IntegrationItem[] = [
  { id: 1, name: "BPS Open Data API", endpoint: "api.bps.go.id/v1/data", lastPing: "2 menit lalu", uptime: 99.8, latency: 134, status: "OK" },
  { id: 2, name: "Kemnaker Job Portal", endpoint: "portal.kemnaker.go.id/api", lastPing: "5 menit lalu", uptime: 98.7, latency: 210, status: "OK" },
  { id: 3, name: "BPJS Ketenagakerjaan", endpoint: "api.bpjsketenagakerjaan.go.id", lastPing: "12 menit lalu", uptime: 87.2, latency: 2450, status: "Error" },
  { id: 4, name: "LinkedIn Jobs API", endpoint: "api.linkedin.com/v2/jobs", lastPing: "1 menit lalu", uptime: 99.9, latency: 98, status: "OK" },
  { id: 5, name: "Google Jobs Indexing", endpoint: "indexing.googleapis.com", lastPing: "3 jam lalu", uptime: 72.4, latency: 5800, status: "Error" },
  { id: 6, name: "Dukcapil Verifikasi", endpoint: "api.dukcapil.kemendagri.go.id", lastPing: "8 menit lalu", uptime: 99.1, latency: 188, status: "OK" },
];

export default function AdminMonitoringPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);
  const [statusFilter, setStatusFilter] = useState<"Semua" | IntegrationStatus>("Semua");

  const okCount = integrations.filter((item) => item.status === "OK").length;
  const errorCount = integrations.length - okCount;
  const avgUptime = (
    integrations.reduce((sum, item) => sum + item.uptime, 0) / integrations.length
  ).toFixed(1);

  const filtered = integrations.filter(
    (item) => statusFilter === "Semua" || item.status === statusFilter
  );

  const handleRetrySync = (target: IntegrationItem) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === target.id
          ? {
              ...item,
              lastPing: "Baru saja",
              status: "OK",
              latency: Math.min(item.latency, 240),
            }
          : item
      )
    );
    toast.success(`Sinkronisasi ${target.name} berhasil diperbarui.`);
  };

  const handleRefreshAll = () => {
    setIntegrations((prev) =>
      prev.map((item) => ({
        ...item,
        lastPing: "Baru saja",
      }))
    );
    toast.success("Status seluruh integrasi API diperbarui.");
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <section className="admin-page" aria-labelledby="monitoring-title">
        <header className="admin-page-header">
          <div>
            <p className="admin-page-context">Sistem</p>
            <h1 id="monitoring-title">Monitoring integrasi API</h1>
            <p>
              Pantau ketersediaan endpoint eksternal, waktu respons, dan ulangi sinkronisasi jika terjadi gangguan.
            </p>
          </div>
          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={handleRefreshAll}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Periksa semua
          </button>
        </header>

        <div className="admin-queue-summary" aria-label="Ringkasan kesehatan integrasi">
          <div className="admin-queue-primary">
            <span>Layanan aktif</span>
            <strong>
              {okCount} / {integrations.length}
            </strong>
            <p>Rata-rata uptime seluruh integrasi saat ini berada di {avgUptime}%.</p>
          </div>
          <div className="admin-queue-note">
            <span>Perlu tindak lanjut</span>
            <strong>{errorCount}</strong>
            <p>Endpoint bermasalah memerlukan uji ulang koneksi atau pengecekan kredensial integrasi.</p>
          </div>
        </div>

        <div className="admin-work-panel">
          <div className="admin-work-panel-header">
            <div>
              <h2>Daftar koneksi eksternal</h2>
              <p>Status koneksi, latensi terakhir, dan tindakan sinkronisasi per layanan.</p>
            </div>
            <div className="admin-segmented-control" aria-label="Filter status integrasi">
              {(["Semua", "OK", "Error"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={statusFilter === tab}
                  onClick={() => setStatusFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-responsive-table">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th scope="col">Layanan &amp; endpoint</th>
                  <th scope="col">Ping terakhir</th>
                  <th scope="col">Uptime</th>
                  <th scope="col">Latensi</th>
                  <th scope="col">Status</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((api) => {
                  const isOk = api.status === "OK";
                  return (
                    <tr key={api.id}>
                      <td>
                        <span className="admin-cell-title">{api.name}</span>
                        <span className="admin-cell-subtitle">{api.endpoint}</span>
                      </td>
                      <td>{api.lastPing}</td>
                      <td>{api.uptime}%</td>
                      <td>{api.latency} ms</td>
                      <td>
                        <span
                          className={
                            isOk
                              ? "admin-status admin-status-approved"
                              : "admin-status admin-status-rejected"
                          }
                        >
                          {api.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-button admin-button-secondary"
                          onClick={() => handleRetrySync(api)}
                        >
                          <RefreshCw size={14} aria-hidden="true" />
                          Ulangi sinkronisasi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
