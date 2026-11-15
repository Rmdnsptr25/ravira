import { MapPin, TrendingUp, Calendar, Lock, FileBarChart, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";

const benefits = [
  { icon: MapPin, label: "Supply-demand heatmap per wilayah" },
  { icon: TrendingUp, label: "Tren skill per wilayah Indonesia" },
  { icon: Calendar, label: "Proyeksi kebutuhan kompetensi" },
  { icon: Lock, label: "Data agregat dan anonim" },
  { icon: FileBarChart, label: "Laporan untuk kebijakan pelatihan dan ketenagakerjaan" },
];

const heatmapData = [
  { region: "DKI Jakarta", demand: 95, supply: 88, gap: "+7" },
  { region: "Jawa Barat", demand: 72, supply: 65, gap: "+7" },
  { region: "Jawa Timur", demand: 68, supply: 70, gap: "-2" },
  { region: "Sumatera Utara", demand: 54, supply: 40, gap: "+14" },
  { region: "Sulawesi Selatan", demand: 45, supply: 32, gap: "+13" },
  { region: "Kalimantan Timur", demand: 60, supply: 38, gap: "+22" },
];

export function AnalyticsSection() {
  const navigate = useNavigate();
  return (
    <section
      id="analytics"
      style={{
        padding: "24px 16px 88px",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          borderRadius: 28,
          background: "#0D1117",
          padding: "72px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Heatmap Card */}
            <div>
              <div
                style={{
                  padding: "28px",
                  borderRadius: 24,
                  background: "#FFFFFF",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.28)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    paddingBottom: 14,
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0D1117",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Workforce Heatmap: Indonesia
                  </span>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#0D1117",
                      background: "#D4FF59",
                      padding: "4px 10px",
                      borderRadius: 100,
                    }}
                  >
                    Live Data
                  </div>
                </div>

                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 76px 76px 52px",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid #E2E8F0",
                    marginBottom: 8,
                  }}
                >
                  {["Wilayah", "Demand", "Supply", "Gap"].map((h) => (
                    <div
                      key={h}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#4A5568",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {heatmapData.map((row) => {
                  const gapNum = parseInt(row.gap);
                  const gapColor = gapNum > 10 ? "#C53030" : gapNum > 0 ? "#B45309" : "#047857";
                  return (
                    <div
                      key={row.region}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 76px 76px 52px",
                        gap: 8,
                        padding: "10px 0",
                        borderBottom: "1px solid #F1F5F9",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0D1117",
                        }}
                      >
                        {row.region}
                      </span>
                      <div>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 100,
                            background: "#E2E8F0",
                            marginBottom: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${row.demand}%`,
                              background: "#0E67CC",
                              borderRadius: 100,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#4A5568",
                          }}
                        >
                          {row.demand}%
                        </span>
                      </div>
                      <div>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 100,
                            background: "#E2E8F0",
                            marginBottom: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${row.supply}%`,
                              background: "#0D1117",
                              borderRadius: 100,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#4A5568",
                          }}
                        >
                          {row.supply}%
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: gapColor,
                        }}
                      >
                        {row.gap}
                      </span>
                    </div>
                  );
                })}

                {/* Legend */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #E2E8F0",
                  }}
                >
                  {[
                    { color: "#0E67CC", label: "Demand" },
                    { color: "#0D1117", label: "Supply" },
                  ].map((l) => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 4, borderRadius: 2, background: l.color }} />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#4A5568",
                        }}
                      >
                        {l.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
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
                Workforce Analytics
              </p>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(26px, 3.4vw, 42px)",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  lineHeight: 1.18,
                  letterSpacing: "-1px",
                  marginBottom: 16,
                }}
              >
                Keputusan Berbasis <span style={{ color: "#D4FF59" }}>Data</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: "#CBD5E1",
                  lineHeight: 1.75,
                  marginBottom: 28,
                }}
              >
                Ravira menyediakan data agregat dan anonim mengenai tren tenaga kerja, kebutuhan
                skill, dan distribusi talenta antar wilayah untuk membantu pemerintah, perusahaan,
                dan institusi pendidikan mengambil keputusan yang lebih tepat.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {benefits.map((b) => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <b.icon size={15} color="#D4FF59" />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14,
                        color: "#E2E8F0",
                        lineHeight: 1.5,
                      }}
                    >
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0D1117",
                  padding: "6px 6px 6px 22px",
                  minHeight: 46,
                  borderRadius: 100,
                  border: "none",
                  background: "#D4FF59",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                onClick={() => navigate("/daftar/pemerintah")}
              >
                <span>Lihat Solusi Analytics</span>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#0D1117",
                    color: "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowUpRight size={15} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
