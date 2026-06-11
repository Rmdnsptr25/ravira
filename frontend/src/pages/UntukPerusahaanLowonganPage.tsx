import { useState } from "react";
import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Briefcase, MapPin, ArrowRight, CheckCircle } from "lucide-react";

const lokasiOptions = ["Semua Lokasi", "Jakarta", "Bandung", "Semarang", "Yogyakarta", "Surabaya", "Malang", "Bekasi", "Tangerang", "Depok", "Solo"];

export default function UntukPerusahaanLowonganPage() {
  const navigate = useNavigate();
  const [posisi, setPosisi] = useState("");
  const [lokasi, setLokasi] = useState("");

  const handleBuat = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/masuk/perusahaan");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0d0820 0%, #130e2e 55%, #1a0a3d 100%)", paddingTop: 120, paddingBottom: 72, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "'Poppins', sans-serif", fontSize: 11, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "4px 14px" }}>
            Kelola Lowongan
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.15 }}>
            Buat dan Kelola Lowongan Kerja
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#9a85c8", lineHeight: 1.8, marginBottom: 36 }}>
            Publikasikan lowongan dalam hitungan menit. Sistem AI langsung menyortir kandidat yang relevan berdasarkan kriteria yang Anda tentukan.
          </p>

          {/* Form */}
          <form onSubmit={handleBuat} style={{ background: "#fff", borderRadius: 16, padding: "12px 12px 12px 16px", display: "flex", gap: 10, alignItems: "center", maxWidth: 680, margin: "0 auto", boxShadow: "0 8px 32px rgba(10,27,61,0.25)", flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 180, display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid rgba(22,119,255,0.12)", paddingRight: 10 }}>
              <Briefcase size={16} color="#9ab4cc" />
              <input
                type="text" value={posisi} onChange={(e) => setPosisi(e.target.value)}
                placeholder="Posisi yang direkrut..."
                style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0A1B3D", background: "transparent", width: "100%" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={16} color="#9ab4cc" />
              <select value={lokasi} onChange={(e) => setLokasi(e.target.value)}
                style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: lokasi ? "#0A1B3D" : "#9ab4cc", background: "transparent", width: "100%", cursor: "pointer" }}>
                {lokasiOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button type="submit"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
              <Briefcase size={14} /> Buat Lowongan
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "32px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Cara Membuat Lowongan</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { step: "01", title: "Isi detail posisi", desc: "Masukkan nama posisi, departemen, deskripsi tugas, dan kualifikasi yang dibutuhkan." },
                { step: "02", title: "Tentukan kriteria AI", desc: "Pilih skill wajib, pengalaman minimum, lokasi, dan tipe pekerjaan untuk filter otomatis." },
                { step: "03", title: "Publikasikan", desc: "Lowongan langsung aktif dan AI mulai mencocokkan kandidat secara otomatis." },
                { step: "04", title: "Review shortlist", desc: "Kandidat terbaik masuk ke shortlist berdasarkan match score — Anda tinggal memilih." },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: "#8b5cf6" }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>{s.title}</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.08)", padding: "28px", boxShadow: "0 4px 18px rgba(10,27,61,0.05)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: "#0A1B3D", marginBottom: 16 }}>Fitur Pengelolaan Lowongan</h3>
              {[
                "Buat lowongan dengan template cepat",
                "Edit dan perbarui lowongan kapan saja",
                "Pantau jumlah pelamar real-time",
                "Tutup lowongan dengan satu klik",
                "Duplikat lowongan sebelumnya",
                "Preview tampilan kandidat sebelum publish",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <CheckCircle size={14} color="#8b5cf6" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4a6080" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg, #0d0820, #1a0a3d)", borderRadius: 20, padding: "24px", textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 800, color: "#8b5cf6", marginBottom: 4 }}>2 menit</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#9a85c8" }}>rata-rata waktu membuat lowongan di Ravira</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/daftar/perusahaan")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(139,92,246,0.4)" }}>
            Mulai Buat Lowongan <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
