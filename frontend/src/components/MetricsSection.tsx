import { Target, Clock, Globe, Users, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { icon: Target, value: 85, suffix: "%+", label: "Target Relevansi Job Matching", desc: "Akurasi pencocokan kandidat dengan posisi yang tepat", color: "#1677FF" },
  { icon: Clock, value: 40, suffix: "%", label: "Potensi Reduksi Time-to-Hire", desc: "Pengurangan waktu proses seleksi awal", color: "#0D47A1" },
  { icon: Globe, value: 20, suffix: "%", label: "Target Cross-Region Placement", desc: "Penempatan talenta daerah ke peluang lintas wilayah", color: "#1677FF" },
  { icon: Users, value: 50, suffix: "K", label: "Target MAU Tahun Pertama", desc: "Monthly active users pada 12 bulan pertama", color: "#0D47A1" },
  { icon: BookOpen, value: 60, suffix: "%", label: "Target Training Completion", desc: "Tingkat penyelesaian program pelatihan rekomendasi", color: "#1677FF" },
];

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
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
  const count = useCountUp(metric.value, 1800, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: "28px 22px", borderRadius: 16,
        background: "#ffffff",
        border: "1px solid rgba(22,119,255,0.1)",
        boxShadow: "0 2px 16px rgba(10,27,61,0.05)",
        textAlign: "center", position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(22,119,255,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(10,27,61,0.05)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${metric.color}, ${metric.color}55)`, borderRadius: "16px 16px 0 0" }} />

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${metric.color}0e`, border: `1px solid ${metric.color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px",
      }}>
        <metric.icon size={20} color={metric.color} />
      </div>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800,
        color: metric.color, lineHeight: 1, marginBottom: 6, letterSpacing: "-1px",
      }}>
        {count}{metric.suffix}
      </div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0A1B3D", marginBottom: 5, lineHeight: 1.3 }}>
        {metric.label}
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", lineHeight: 1.5 }}>
        {metric.desc}
      </div>
    </div>
  );
}

export function MetricsSection() {
  return (
    <section style={{ padding: "96px 24px", background: "#ffffff", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: "#1677FF", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 14px", border: "1px solid rgba(22,119,255,0.25)",
            borderRadius: 100, background: "rgba(22,119,255,0.06)", marginBottom: 16,
          }}>
            Impact Metrics
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800,
            color: "#0A1B3D", lineHeight: 1.2, letterSpacing: "-0.8px",
          }}>
            Target Dampak yang{" "}
            <span style={{ color: "#1677FF" }}>Terukur</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18 }}>
          {metrics.map(m => <MetricCard key={m.label} metric={m} />)}
        </div>
      </div>
    </section>
  );
}
