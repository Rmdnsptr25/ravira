import { Target, Clock, Globe, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { icon: Target, value: 85, suffix: "%+", label: "Target Relevansi Job Matching", desc: "Akurasi pencocokan kandidat dengan posisi yang tepat", variant: "blue" as const },
  { icon: Clock, value: 40, suffix: "%", label: "Potensi Reduksi Time-to-Hire", desc: "Pengurangan waktu proses seleksi awal", variant: "light" as const },
  { icon: Globe, value: 20, suffix: "%", label: "Target Cross-Region Placement", desc: "Penempatan talenta daerah ke peluang lintas wilayah", variant: "lime" as const },
  { icon: Users, value: 50, suffix: "K", label: "Target MAU Tahun Pertama", desc: "Monthly active users pada 12 bulan pertama", variant: "dark" as const },
  { icon: BookOpen, value: 60, suffix: "%", label: "Target Training Completion", desc: "Tingkat penyelesaian program pelatihan rekomendasi", variant: "light" as const },
];

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (prefersReducedMotion) {
        setCount(end);
        return;
      }
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function MetricCard({ metric }: { metric: (typeof metrics)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(metric.value, 1400, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isBlue = metric.variant === "blue";
  const isLime = metric.variant === "lime";
  const isDark = metric.variant === "dark";

  const bg = isBlue
    ? "linear-gradient(180deg, #0E67CC 0%, #389BFF 100%)"
    : isLime
    ? "#D4FF59"
    : isDark
    ? "#0D1117"
    : "#F4F5F7";

  const valueColor = isBlue ? "#FFFFFF" : isDark ? "#D4FF59" : "#0D1117";
  const labelColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
  const descColor = isBlue
    ? "rgba(255,255,255,0.9)"
    : isDark
    ? "#CBD5E1"
    : isLime
    ? "#1E293B"
    : "#4A5568";

  const iconBg = isLime ? "#0D1117" : isDark ? "#D4FF59" : "#FFFFFF";
  const iconColor = isLime ? "#D4FF59" : "#0D1117";

  return (
    <div
      ref={ref}
      style={{
        flex: "0 0 280px",
        scrollSnapAlign: "start",
        padding: "28px 22px",
        borderRadius: 24,
        background: bg,
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 220,
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
          width: 42,
          height: 42,
          borderRadius: 12,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <metric.icon size={19} color={iconColor} />
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(34px, 3.6vw, 48px)",
            fontWeight: 600,
            color: valueColor,
            lineHeight: 1.05,
            marginBottom: 10,
            letterSpacing: "-1.5px",
          }}
        >
          {count}
          {metric.suffix}
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: labelColor,
            marginBottom: 6,
            lineHeight: 1.35,
          }}
        >
          {metric.label}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: descColor,
            lineHeight: 1.55,
          }}
        >
          {metric.desc}
        </div>
      </div>
    </div>
  );
}

export function MetricsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section style={{ padding: "88px 24px", background: "#FFFFFF", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 40 }}>
          <div>
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
              Impact Metrics
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(28px, 3.6vw, 44px)",
                fontWeight: 600,
                color: "#0D1117",
                lineHeight: 1.16,
                letterSpacing: "-1.2px",
              }}
            >
              Target Dampak yang <span style={{ color: "#64748B" }}>Terukur</span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              aria-label="Geser metrik ke kiri"
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
              aria-label="Geser metrik ke kanan"
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
          {metrics.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
