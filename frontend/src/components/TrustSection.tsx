import { useRef } from "react";
import { Shield, Lock, Key, FileText, Database, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const securityItems = [
  { icon: Shield, title: "Data Kandidat Terlindungi", desc: "Data pribadi kandidat tidak pernah dibagikan ke pihak ketiga tanpa izin eksplisit.", variant: "light" as const },
  { icon: Lock, title: "Enkripsi End-to-End", desc: "Semua data dienkripsi baik saat disimpan maupun saat ditransmisikan.", variant: "dark" as const },
  { icon: Key, title: "Role-Based Access Control", desc: "Akses data diatur ketat berdasarkan peran pengguna di dalam platform.", variant: "lime" as const },
  { icon: FileText, title: "Audit Log Lengkap", desc: "Setiap akses dan perubahan data dicatat secara transparan dan traceable.", variant: "light" as const },
  { icon: Database, title: "Data Pemerintah Anonim", desc: "Analytics untuk pemerintah dan institusi menggunakan data agregat dan anonim.", variant: "blue" as const },
  { icon: Eye, title: "AI yang Transparan", desc: "Setiap rekomendasi AI dapat dijelaskan secara transparan kepada pengguna.", variant: "light" as const },
];

export function TrustSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section style={{ padding: "88px 24px", background: "#FFFFFF", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 40 }}>
          <div style={{ maxWidth: 680 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#0D1117",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D1117", display: "inline-block" }} />
              Trust & Security
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(28px, 3.6vw, 44px)",
                fontWeight: 600,
                color: "#0D1117",
                lineHeight: 1.16,
                letterSpacing: "-1.2px",
                marginBottom: 12,
              }}
            >
              Aman, Transparan, dan{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#D4FF59",
                  verticalAlign: "middle",
                  margin: "0 4px",
                }}
              >
                <Shield size={17} color="#0D1117" />
              </span>{" "}
              <span style={{ color: "#64748B" }}>Berbasis Consent</span>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                color: "#4A5568",
                lineHeight: 1.7,
              }}
            >
              Kepercayaan pengguna adalah fondasi Ravira. Kami berkomitmen terhadap keamanan data dan transparansi AI.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser keamanan ke kiri"
              onClick={() => scrollByAmount("left")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid #E2E8F0",
                background: "#F4F5F7",
                color: "#0D1117",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Geser keamanan ke kanan"
              onClick={() => scrollByAmount("right")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "#0D1117",
                color: "#D4FF59",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="ravira-no-scrollbar"
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {securityItems.map((item) => {
            const isDark = item.variant === "dark";
            const isLime = item.variant === "lime";
            const isBlue = item.variant === "blue";

            const bg = isBlue
              ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
              : isDark
              ? "#0D1117"
              : isLime
              ? "#D4FF59"
              : "#F4F5F7";

            const titleColor = isDark || isBlue ? "#FFFFFF" : "#0D1117";
            const descColor = isBlue
              ? "rgba(255,255,255,0.9)"
              : isDark
              ? "#CBD5E1"
              : isLime
              ? "#1E293B"
              : "#4A5568";

            const iconBg = isDark
              ? "#D4FF59"
              : isLime
              ? "#0D1117"
              : "#FFFFFF";
            const iconColor = isLime ? "#D4FF59" : "#0D1117";

            return (
              <div
                key={item.title}
                style={{
                  flex: "0 0 292px",
                  scrollSnapAlign: "start",
                  padding: "28px 24px",
                  borderRadius: 24,
                  background: bg,
                  minHeight: 230,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <item.icon size={20} color={iconColor} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: titleColor,
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: descColor,
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
