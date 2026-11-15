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
    <section style={{ padding: "84px 24px", background: "#ffffff", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 52px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11.5,
              fontWeight: 700,
              color: "#0D1117",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D1117" }} />
            Masalah
          </div>

          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "#0D1117",
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
              marginBottom: 14,
            }}
          >
            Rekrutmen Tidak Selesai dengan{" "}
            <span style={{ color: "#4A5568" }}>Sekadar Lowongan</span>
          </h2>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "#4A5568", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Ketidaksesuaian antara kebutuhan industri dan kompetensi tenaga kerja adalah masalah nyata yang butuh solusi sistemis.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <ProblemCard title="Untuk Kandidat" problems={candidateProblems} variant="light" />
          <ProblemCard title="Untuk Perusahaan" problems={companyProblems} variant="dark" />
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  title,
  problems,
  variant,
}: {
  title: string;
  problems: string[];
  variant: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div
      style={{
        padding: "32px 28px",
        borderRadius: 24,
        background: isDark ? "#0D1117" : "#F4F5F7",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 999,
          background: isDark ? "#D4FF59" : "#0D1117",
          fontFamily: "'Poppins', sans-serif",
          fontSize: 11.5,
          fontWeight: 700,
          color: isDark ? "#0D1117" : "#ffffff",
          marginBottom: 22,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {problems.map((p) => (
          <div
            key={p}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 14,
              background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
            }}
          >
            <XCircle size={16} color={isDark ? "#D4FF59" : "#0E67CC"} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: isDark ? "#ffffff" : "#0D1117", lineHeight: 1.55, fontWeight: 500 }}>
              {p}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
