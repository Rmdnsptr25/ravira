import { XCircle } from "lucide-react";

const candidateProblems = [
  "Sulit menemukan pekerjaan sesuai kompetensi",
  "Tidak tahu skill apa yang harus ditingkatkan",
  "Akses peluang kerja masih terpusat di kota besar",
  "Minim panduan karier yang personal",
];

const companyProblems = [
  "Proses rekrutmen panjang dan mahal",
  "Banyak kandidat tidak sesuai kebutuhan posisi",
  "Sulit menemukan talenta daerah berkualitas",
  "Kurang insight data tenaga kerja",
];

export function ProblemSection() {
  return (
    <section style={{ padding: "96px 24px", background: "#f0f7ff", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: "#e53e3e", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(229,62,62,0.25)",
            borderRadius: 100, background: "rgba(229,62,62,0.05)", marginBottom: 16,
          }}>
            Masalah
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800,
            color: "#0A1B3D", lineHeight: 1.2, letterSpacing: "-0.8px", marginBottom: 14,
          }}>
            Rekrutmen Tidak Selesai dengan{" "}
            <span style={{ color: "#e53e3e" }}>Sekadar Lowongan</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6a88b8", maxWidth: 500, margin: "0 auto" }}>
            Ketidaksesuaian antara kebutuhan industri dan kompetensi tenaga kerja adalah masalah nyata yang butuh solusi sistemis.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          <ProblemCard title="Untuk Kandidat" problems={candidateProblems} accentColor="#1677FF" />
          <ProblemCard title="Untuk Perusahaan" problems={companyProblems} accentColor="#0D47A1" />
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ title, problems, accentColor }: { title: string; problems: string[]; accentColor: string }) {
  return (
    <div
      style={{
        padding: "32px", borderRadius: 18,
        background: "#ffffff",
        border: "1px solid rgba(22,119,255,0.1)",
        boxShadow: "0 2px 20px rgba(10,27,61,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(22,119,255,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 20px rgba(10,27,61,0.06)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}66)`, borderRadius: "18px 18px 0 0" }} />

      <div style={{
        display: "inline-block", padding: "4px 12px", borderRadius: 8,
        background: `${accentColor}0e`, border: `1px solid ${accentColor}22`,
        fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700,
        color: accentColor, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {problems.map(p => (
          <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <XCircle size={15} color="#e53e3e" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.6 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
