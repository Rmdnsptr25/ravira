import { useState } from "react";
import { useNavigate } from "react-router";
import { PerusahaanNavbar } from "../components/PerusahaanNavbar";
import { Footer } from "../components/Footer";
import { Briefcase, MapPin, ArrowUpRight, CheckCircle } from "lucide-react";

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
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <PerusahaanNavbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "120px 24px 68px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
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
              Kelola Lowongan
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.14 }}>
              Buat dan Kelola Lowongan Kerja
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.92)", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 36px" }}>
              Publikasikan lowongan dalam hitungan menit. Sistem AI langsung menyortir kandidat yang relevan berdasarkan kriteria yang Anda tentukan.
            </p>

            {/* Form */}
            <form onSubmit={handleBuat} style={{ background: "#FFFFFF", borderRadius: 999, padding: "8px 8px 8px 20px", display: "flex", gap: 10, alignItems: "center", maxWidth: 700, margin: "0 auto", boxShadow: "0 16px 40px rgba(8, 28, 68, 0.22)", flexWrap: "wrap" }}>
              <div style={{ flex: 2, minWidth: 180, display: "flex", alignItems: "center", gap: 8, borderRight: "1px solid #E2E8F0", paddingRight: 10 }}>
                <Briefcase size={16} color="#4A5568" />
                <input
                  type="text" value={posisi} onChange={(e) => setPosisi(e.target.value)}
                  placeholder="Posisi yang direkrut..."
                  style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0D1117", background: "transparent", width: "100%" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={16} color="#4A5568" />
                <select value={lokasi} onChange={(e) => setLokasi(e.target.value)}
                  style={{ border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0D1117", background: "transparent", width: "100%", cursor: "pointer" }}>
                  {lokasiOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button type="submit"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 999, border: "none", background: "#0D1117", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#D4FF59", cursor: "pointer", whiteSpace: "nowrap" }}>
                <Briefcase size={14} /> Buat Lowongan
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 44 }}>
          <div style={{ background: "#F4F5F7", borderRadius: 24, padding: "32px" }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, color: "#0D1117", marginBottom: 20 }}>Cara Membuat Lowongan</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { step: "01", title: "Isi detail posisi", desc: "Masukkan nama posisi, departemen, deskripsi tugas, dan kualifikasi yang dibutuhkan." },
                { step: "02", title: "Tentukan kriteria AI", desc: "Pilih skill wajib, pengalaman minimum, lokasi, dan tipe pekerjaan untuk filter otomatis." },
                { step: "03", title: "Publikasikan", desc: "Lowongan langsung aktif dan AI mulai mencocokkan kandidat secara otomatis." },
                { step: "04", title: "Review shortlist", desc: "Kandidat terbaik masuk ke shortlist berdasarkan match score, Anda tinggal memilih." },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: 14, background: "#FFFFFF", padding: "16px", borderRadius: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0D1117", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#D4FF59" }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0D1117", marginBottom: 4 }}>{s.title}</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#0D1117", borderRadius: 24, padding: "32px", flex: 1 }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 600, color: "#FFFFFF", marginBottom: 18 }}>Fitur Pengelolaan Lowongan</h3>
              {[
                "Buat lowongan dengan template cepat",
                "Edit dan perbarui lowongan kapan saja",
                "Pantau jumlah pelamar real-time",
                "Tutup lowongan dengan satu klik",
                "Duplikat lowongan sebelumnya",
                "Preview tampilan kandidat sebelum publish",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <CheckCircle size={15} color="#D4FF59" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#E2E8F0" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#D4FF59", borderRadius: 24, padding: "28px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 38, fontWeight: 700, color: "#0D1117", marginBottom: 4 }}>2 menit</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1E293B" }}>rata-rata waktu membuat lowongan di Ravira</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/daftar/perusahaan")}
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
            <span>Mulai Buat Lowongan</span>
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
