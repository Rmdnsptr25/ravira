import { useState } from "react";
import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { Footer } from "../components/Footer";
import { FileText, Download, Calendar, Shield, ArrowUpRight, CheckCircle } from "lucide-react";

const laporanTypes = [
  { id: "monthly", label: "Laporan Bulanan", desc: "Ringkasan supply-demand, tren skill, dan mobilitas tenaga kerja per bulan." },
  { id: "quarterly", label: "Laporan Kuartalan", desc: "Analisis mendalam per kuartal: tren 3 bulan, perbandingan sektor, proyeksi." },
  { id: "annual", label: "Laporan Tahunan", desc: "Laporan komprehensif tahunan dengan tren jangka panjang dan rekomendasi kebijakan." },
  { id: "custom", label: "Laporan Kustom", desc: "Pilih periode, wilayah, dan sektor sendiri. Ekspor dalam format PDF, Excel, atau CSV." },
];

const riwayatLaporan = [
  { judul: "Laporan Bulanan Tenaga Kerja Jawa: Mei 2026", tanggal: "01 Jun 2026", format: "PDF", ukuran: "2.4 MB", status: "Tersedia" },
  { judul: "Laporan Kuartalan Q1 2026 (Jan–Mar)", tanggal: "05 Apr 2026", format: "Excel", ukuran: "1.8 MB", status: "Tersedia" },
  { judul: "Laporan Bulanan Tenaga Kerja Jawa: Apr 2026", tanggal: "02 Mei 2026", format: "PDF", ukuran: "2.1 MB", status: "Tersedia" },
  { judul: "Laporan Skill Gap Khusus Sektor Kesehatan: Q1 2026", tanggal: "10 Apr 2026", format: "PDF", ukuran: "3.2 MB", status: "Tersedia" },
  { judul: "Laporan Tahunan 2025", tanggal: "15 Jan 2026", format: "PDF", ukuran: "8.7 MB", status: "Tersedia" },
];

const formatOptions = ["PDF", "Excel (.xlsx)", "CSV"];

export default function UntukPemerintahLaporanPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("monthly");
  const [selectedFormat, setSelectedFormat] = useState("PDF");

  const handleRequestLaporan = () => {
    navigate("/daftar/pemerintah");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "120px 24px 64px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#D4FF59",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Laporan
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.14 }}>
              Laporan Workforce Analytics
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.7, marginBottom: 20 }}>
              Unduh laporan tenaga kerja komprehensif untuk mendukung perumusan kebijakan. Semua laporan berbasis data agregat dan anonim.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "8px 18px" }}>
              <Shield size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Laporan hanya memuat data agregat, tidak ada data personal kandidat.</span>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px" }}>
        {/* Laporan Type Selector (4 blocks) */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#0D1117", marginBottom: 20 }}>Pilih Jenis Laporan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {laporanTypes.map((t) => {
              const isSelected = selectedType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    background: isSelected ? "#0D1117" : "#F4F5F7",
                    borderRadius: 24,
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 170,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: isSelected ? "#D4FF59" : "#FFFFFF", color: "#0D1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={18} />
                    </div>
                    {isSelected && <CheckCircle size={18} color="#D4FF59" />}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: isSelected ? "#FFFFFF" : "#0D1117", marginBottom: 6 }}>{t.label}</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: isSelected ? "#CBD5E1" : "#4A5568", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format & Export Preview */}
        <div style={{ background: "#F4F5F7", borderRadius: 28, padding: "32px", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#0D1117", marginBottom: 20 }}>Konfigurasi Ekspor</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0D1117", marginBottom: 12 }}>Format File</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {formatOptions.map((f) => {
                  const key = f.split(" ")[0];
                  const active = selectedFormat === key;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFormat(key)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        background: active ? "#0D1117" : "#FFFFFF",
                        color: active ? "#D4FF59" : "#0D1117",
                      }}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0D1117", marginBottom: 12 }}>Isi Laporan</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Supply-Demand per Sektor", "Distribusi per Wilayah", "Tren Skill (Agregat)", "Rekomendasi Intervensi"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={14} color="#0E67CC" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#0D1117" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={handleRequestLaporan}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#0D1117",
                cursor: "pointer",
              }}
            >
              <Download size={15} /> Ajukan Akses & Unduh Laporan
            </button>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>Akses dashboard diperlukan untuk mengunduh laporan.</span>
          </div>
        </div>

        {/* Riwayat Laporan */}
        <div style={{ background: "#F4F5F7", borderRadius: 28, padding: "32px", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Calendar size={18} color="#0E67CC" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#0D1117" }}>Riwayat Laporan Tersedia</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {riwayatLaporan.map((r) => (
              <div key={r.judul} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: 16, padding: "16px 20px", background: "#FFFFFF", borderRadius: 16, alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, color: "#0D1117", marginBottom: 2 }}>{r.judul}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#4A5568" }}>{r.tanggal}</div>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#0849A8", fontWeight: 700 }}>{r.format}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>{r.ukuran}</div>
                <div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#0D1117", background: "#D4FF59", borderRadius: 999, padding: "4px 12px" }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/daftar/pemerintah")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "7px 8px 7px 26px",
              minHeight: 48,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <span>Ajukan Akses Dashboard</span>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#D4FF59", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} />
            </span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
