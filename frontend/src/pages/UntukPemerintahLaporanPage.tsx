import { useState } from "react";
import { useNavigate } from "react-router";
import { PemerintahNavbar } from "../components/PemerintahNavbar";
import { FileText, Download, Calendar, Shield, ArrowRight, CheckCircle } from "lucide-react";

const laporanTypes = [
  { id: "monthly", label: "Laporan Bulanan", desc: "Ringkasan supply-demand, tren skill, dan mobilitas tenaga kerja per bulan.", color: "#4DB8FF", bg: "rgba(77,184,255,0.08)" },
  { id: "quarterly", label: "Laporan Kuartalan", desc: "Analisis mendalam per kuartal: tren 3 bulan, perbandingan sektor, proyeksi.", color: "#10d98e", bg: "rgba(16,217,142,0.08)" },
  { id: "annual", label: "Laporan Tahunan", desc: "Laporan komprehensif tahunan dengan tren jangka panjang dan rekomendasi kebijakan.", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  { id: "custom", label: "Laporan Kustom", desc: "Pilih periode, wilayah, dan sektor sendiri. Ekspor dalam format PDF, Excel, atau CSV.", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
];

const riwayatLaporan = [
  { judul: "Laporan Bulanan Tenaga Kerja Jawa — Mei 2026", tanggal: "01 Jun 2026", format: "PDF", ukuran: "2.4 MB", status: "Tersedia" },
  { judul: "Laporan Kuartalan Q1 2026 (Jan–Mar)", tanggal: "05 Apr 2026", format: "Excel", ukuran: "1.8 MB", status: "Tersedia" },
  { judul: "Laporan Bulanan Tenaga Kerja Jawa — Apr 2026", tanggal: "02 Mei 2026", format: "PDF", ukuran: "2.1 MB", status: "Tersedia" },
  { judul: "Laporan Skill Gap Khusus Sektor Kesehatan — Q1 2026", tanggal: "10 Apr 2026", format: "PDF", ukuran: "3.2 MB", status: "Tersedia" },
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
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PemerintahNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021220 0%, #041c2e 55%, #062640 100%)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,184,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Laporan
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.15 }}>
            Laporan Workforce Analytics
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a9ab8", lineHeight: 1.7, marginBottom: 20 }}>
            Unduh laporan tenaga kerja komprehensif untuk mendukung perumusan kebijakan. Semua laporan berbasis data agregat dan anonim.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,217,142,0.08)", border: "1px solid rgba(16,217,142,0.2)", borderRadius: 10, padding: "8px 16px" }}>
            <Shield size={14} color="#10d98e" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#10d98e" }}>Laporan hanya memuat data agregat — tidak ada data personal kandidat.</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>

        {/* Laporan Type Selector */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", marginBottom: 20 }}>Pilih Jenis Laporan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {laporanTypes.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                style={{
                  background: selectedType === t.id ? t.bg : "#fff",
                  borderRadius: 16,
                  border: selectedType === t.id ? `2px solid ${t.color}40` : "1px solid rgba(22,119,255,0.08)",
                  padding: "20px 24px",
                  boxShadow: "0 4px 18px rgba(10,27,61,0.05)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bg, border: `1px solid ${t.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={18} color={t.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D" }}>{t.label}</span>
                    {selectedType === t.id && <CheckCircle size={14} color={t.color} />}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Format & Export Preview */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 20 }}>Konfigurasi Ekspor</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 12 }}>Format File</div>
              <div style={{ display: "flex", gap: 10 }}>
                {formatOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f.split(" ")[0])}
                    style={{
                      padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                      fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                      background: selectedFormat === f.split(" ")[0] ? "#1677FF" : "rgba(22,119,255,0.08)",
                      color: selectedFormat === f.split(" ")[0] ? "#fff" : "#4a6080",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {f.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 12 }}>Isi Laporan</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Supply-Demand per Sektor", "Distribusi per Wilayah", "Tren Skill (Agregat)", "Rekomendasi Intervensi"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={13} color="#10d98e" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(22,119,255,0.08)" }}>
            <button onClick={handleRequestLaporan} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              <Download size={15} /> Ajukan Akses & Unduh Laporan
            </button>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginLeft: 16 }}>Akses dashboard diperlukan untuk mengunduh laporan.</span>
          </div>
        </div>

        {/* Riwayat Laporan */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Calendar size={18} color="#4DB8FF" />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D" }}>Riwayat Laporan Tersedia</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {riwayatLaporan.map((r, i) => (
              <div key={r.judul} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: 16, padding: "14px 0", borderBottom: i < riwayatLaporan.length - 1 ? "1px solid rgba(22,119,255,0.07)" : "none", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D", marginBottom: 2 }}>{r.judul}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{r.tanggal}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#4DB8FF", fontWeight: 600 }}>{r.format}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>{r.ukuran}</div>
                <div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#10d98e", background: "rgba(16,217,142,0.1)", border: "1px solid rgba(16,217,142,0.3)", borderRadius: 99, padding: "3px 10px" }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/daftar/pemerintah")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(77,184,255,0.4)" }}>
            Ajukan Akses Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
