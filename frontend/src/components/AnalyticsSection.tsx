import { MapPin, TrendingUp, Calendar, Lock, FileBarChart, ArrowRight } from "lucide-react";
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
        padding: "100px 24px",
        background: "linear-gradient(180deg, #0a1b3d 0%, #071228 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 600,
          height: 600,
          background: "radial-gradient(circle at top right, rgba(77, 184, 255, 0.05), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 60,
            alignItems: "center",
          }}
        >
          {/* Heatmap Mockup */}
          <div>
            <div
              style={{
                padding: "28px",
                borderRadius: 20,
                background: "rgba(13, 31, 63, 0.8)",
                border: "1px solid rgba(77, 184, 255, 0.15)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  paddingBottom: 14,
                  borderBottom: "1px solid rgba(77, 184, 255, 0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#4DB8FF",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Workforce Heatmap — Indonesia
                </span>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#3a5480",
                  }}
                >
                  Live Data
                </div>
              </div>

              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 80px 60px",
                  gap: 8,
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(22, 119, 255, 0.08)",
                  marginBottom: 8,
                }}
              >
                {["Wilayah", "Demand", "Supply", "Gap"].map((h) => (
                  <div
                    key={h}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#3a5480",
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
                const gapColor = gapNum > 10 ? "#ff6b6b" : gapNum > 0 ? "#f59e0b" : "#10d98e";
                return (
                  <div
                    key={row.region}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px 80px 60px",
                      gap: 8,
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: "#c5d3f0",
                      }}
                    >
                      {row.region}
                    </span>
                    <div>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.05)",
                          marginBottom: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${row.demand}%`,
                            background: "linear-gradient(90deg, #1677FF, #1677FF)",
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: "#5a7aaa",
                        }}
                      >
                        {row.demand}%
                      </span>
                    </div>
                    <div>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.05)",
                          marginBottom: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${row.supply}%`,
                            background: "linear-gradient(90deg, #10d98e, #0dbb78)",
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: "#5a7aaa",
                        }}
                      >
                        {row.supply}%
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
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
                  borderTop: "1px solid rgba(22, 119, 255, 0.08)",
                }}
              >
                {[
                  { color: "#1677FF", label: "Demand" },
                  { color: "#10d98e", label: "Supply" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{ width: 10, height: 3, borderRadius: 2, background: l.color }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#5a7aaa",
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
            <span
              style={{
                display: "inline-block",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#4DB8FF",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 12px",
                border: "1px solid rgba(77, 184, 255, 0.25)",
                borderRadius: 100,
                background: "rgba(77, 184, 255, 0.06)",
                marginBottom: 20,
              }}
            >
              Workforce Analytics
            </span>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(24px, 3vw, 38px)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
                letterSpacing: "-0.8px",
                marginBottom: 16,
              }}
            >
              Keputusan Berbasis{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #4DB8FF, #1677FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Data
              </span>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                color: "#5a7aaa",
                lineHeight: 1.8,
                marginBottom: 28,
              }}
            >
              Ravira menyediakan data agregat dan anonim mengenai tren tenaga kerja, kebutuhan
              skill, dan distribusi talenta antar wilayah untuk membantu pemerintah, perusahaan,
              dan institusi pendidikan mengambil keputusan yang lebih tepat.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {benefits.map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(77, 184, 255, 0.1)",
                      border: "1px solid rgba(77, 184, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <b.icon size={14} color="#4DB8FF" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: "#8899bb",
                      lineHeight: 1.6,
                      paddingTop: 6,
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
                gap: 8,
                fontFamily: "'Poppins', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#071228",
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #4DB8FF, #0099ff)",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(77, 184, 255, 0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              onClick={() => navigate("/daftar/pemerintah")}
            >
              Lihat Solusi Analytics <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
