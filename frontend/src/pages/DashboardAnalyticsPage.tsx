import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  TrendingUp,
  Briefcase,
  AlertCircle,
  BarChart2,
  Globe,
  LayoutDashboard,
  MapPin,
  BookOpen,
  FileText,
  Settings,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ExportReportModal } from "../components/Modals";

const sidebarItems: SidebarItem[] = [
  { key: "ringkasan", label: "Ringkasan", icon: <LayoutDashboard size={16} />, path: "/dashboard/analytics" },
  { key: "workforce", label: "Analitik Workforce", icon: <Users size={16} />, path: "/dashboard/analytics/workforce" },
  { key: "tren", label: "Tren Skill", icon: <TrendingUp size={16} />, path: "/dashboard/analytics/tren-skill" },
  { key: "heatmap", label: "Heatmap Regional", icon: <MapPin size={16} />, path: "/dashboard/analytics/heatmap" },
  { key: "proyeksi", label: "Proyeksi Kompetensi", icon: <BarChart2 size={16} />, path: "/dashboard/analytics/proyeksi" },
  { key: "program", label: "Rekomendasi Program Pelatihan", icon: <BookOpen size={16} />, path: "/dashboard/analytics/rekomendasi-program" },
  { key: "laporan", label: "Laporan & Ekspor", icon: <FileText size={16} />, path: "/dashboard/analytics/laporan" },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/analytics/pengaturan" },
];

const kpiData = [
  { label: "Total Angkatan Kerja", value: "142.6 Jt", change: "+2.3%", variant: "blue" as const, icon: Users },
  { label: "Tingkat Pengangguran", value: "5.32%", change: "-0.4%", variant: "light" as const, icon: TrendingUp },
  { label: "Lowongan Terbuka", value: "2.84 Jt", change: "+8.1%", variant: "lime" as const, icon: Briefcase },
  { label: "Mismatch Skill", value: "34.2%", change: "-1.8%", variant: "dark" as const, icon: AlertCircle },
];

const trendData = [
  { bulan: "Jan", tersedia: 2100, terserap: 1850 },
  { bulan: "Feb", tersedia: 2280, terserap: 1960 },
  { bulan: "Mar", tersedia: 2450, terserap: 2100 },
  { bulan: "Apr", tersedia: 2600, terserap: 2280 },
  { bulan: "Mei", tersedia: 2750, terserap: 2400 },
  { bulan: "Jun", tersedia: 2840, terserap: 2520 },
];

const skillDemandData = [
  { skill: "Software Dev", demand: 95, supply: 62 },
  { skill: "Data Science", demand: 88, supply: 45 },
  { skill: "Cloud/DevOps", demand: 82, supply: 38 },
  { skill: "Cybersecurity", demand: 78, supply: 32 },
  { skill: "UI/UX Design", demand: 74, supply: 58 },
  { skill: "Digital Mktg", demand: 70, supply: 65 },
];

const regionalData = [
  { wilayah: "DKI Jakarta", pengangguran: 6.8, lowongan: 285 },
  { wilayah: "Jawa Barat", pengangguran: 7.2, lowongan: 412 },
  { wilayah: "Jawa Tengah", pengangguran: 5.9, lowongan: 198 },
  { wilayah: "DI Yogyakarta", pengangguran: 4.1, lowongan: 132 },
  { wilayah: "Jawa Timur", pengangguran: 4.8, lowongan: 356 },
  { wilayah: "Banten", pengangguran: 6.2, lowongan: 214 },
];

const emergingSkills = [
  { name: "Generative AI", growth: "+340%", urgency: "high" },
  { name: "LLM Engineering", growth: "+280%", urgency: "high" },
  { name: "Cloud Architecture", growth: "+145%", urgency: "medium" },
  { name: "Data Engineering", growth: "+132%", urgency: "medium" },
  { name: "Blockchain Dev", growth: "+98%", urgency: "medium" },
  { name: "IoT Development", growth: "+76%", urgency: "low" },
];

interface DashTooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
}

interface DashCustomTooltipProps {
  active?: boolean;
  payload?: DashTooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: DashCustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#0D1117",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: 12,
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#D4FF59",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        {payload.map((p: DashTooltipPayloadItem) => (
          <div
            key={p.name}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#FFFFFF",
              marginBottom: 2,
            }}
          >
            {p.name}:{" "}
            <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardAnalyticsPage() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName="Dr. Bambang Prasetyo"
      userRole="Disnaker DKI Jakarta"
      userInitial="B"
    >
      {showExport && (
        <ExportReportModal
          reportName="Laporan Workforce Nasional"
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Framed Hero Banner matching Beranda */}
      <section
        style={{
          borderRadius: 26,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 52%, #2B8CFF 100%)",
          padding: "28px 30px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 16px 40px rgba(8, 73, 168, 0.12)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#D4FF59",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            Portal Pemerintah &amp; Institusi
          </p>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              margin: "0 0 6px",
              lineHeight: 1.15,
            }}
          >
            Workforce Analytics Dashboard
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Data agregat dan anonim nasional per Mei 2026 · Diperbarui setiap hari
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate("/dashboard/analytics/heatmap")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              minHeight: 44,
              borderRadius: 999,
              border: "1px solid rgba(255, 255, 255, 0.35)",
              background: "rgba(13, 17, 23, 0.28)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <Globe size={14} /> Semua Wilayah
          </button>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 22px",
              minHeight: 44,
              borderRadius: 999,
              border: "none",
              background: "#D4FF59",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#0D1117",
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Ekspor Laporan
          </button>
        </div>
      </section>

      {/* Bento KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {kpiData.map((k) => {
          const Icon = k.icon;
          const isBlue = k.variant === "blue";
          const isLime = k.variant === "lime";
          const isDark = k.variant === "dark";

          const bg = isBlue
            ? "linear-gradient(180deg, #0E67CC 0%, #2B8CFF 100%)"
            : isLime
              ? "#D4FF59"
              : isDark
                ? "#0D1117"
                : "#F4F5F7";

          const valColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
          const subColor = isBlue
            ? "rgba(255, 255, 255, 0.88)"
            : isDark
              ? "#CBD5E1"
              : "#4A5568";
          const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
          const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

          return (
            <div
              key={k.label}
              style={{
                background: bg,
                borderRadius: 22,
                border: k.variant === "light" ? "1px solid #E2E8F0" : "none",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 150,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: iconBg,
                    color: iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: isBlue || isDark ? "#D4FF59" : "#0D1117",
                    background: isBlue || isDark ? "rgba(13, 17, 23, 0.35)" : "#FFFFFF",
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  {k.change}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 28,
                    fontWeight: 600,
                    color: valColor,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {k.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: subColor,
                    marginTop: 4,
                  }}
                >
                  {k.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="ravira-analytics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginBottom: 18,
        }}
      >
        {/* Trend Chart */}
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#0D1117",
              marginBottom: 4,
            }}
          >
            Tren Penyerapan Tenaga Kerja
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12.5,
              color: "#4A5568",
              marginBottom: 16,
            }}
          >
            dalam ribuan orang · Jan–Jun 2026
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px 10px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E67CC" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#0E67CC" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D1117" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#0D1117" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#4A5568" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#4A5568" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tersedia"
                  name="Lowongan Tersedia"
                  stroke="#0E67CC"
                  fill="url(#gradA)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="terserap"
                  name="Tenaga Terserap"
                  stroke="#0D1117"
                  fill="url(#gradB)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Demand vs Supply */}
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#0D1117",
              marginBottom: 4,
            }}
          >
            Demand vs Supply Skill
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12.5,
              color: "#4A5568",
              marginBottom: 16,
            }}
          >
            Skor 0–100 · Gap = mismatch skill
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px 10px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={skillDemandData}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#4A5568" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="skill"
                  tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#0D1117" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" name="Demand" fill="#0E67CC" radius={[0, 4, 4, 0]} barSize={8} />
                <Bar dataKey="supply" name="Supply" fill="#0D1117" radius={[0, 4, 4, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className="ravira-analytics-bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 310px",
          gap: 18,
        }}
      >
        {/* Regional Table */}
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0D1117",
                }}
              >
                Data Workforce per Provinsi
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                Klik baris untuk detail ·{" "}
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/analytics/heatmap")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#0E67CC",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Lihat Heatmap
                </button>
              </div>
            </div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 700,
                color: "#0D1117",
                background: "#D4FF59",
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              Top 6 Provinsi
            </span>
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Provinsi", "Pengangguran (%)", "Lowongan (rb)"].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#4A5568",
                        textAlign: "left",
                        padding: "12px 16px",
                        borderBottom: "1px solid #E2E8F0",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regionalData.map((r) => (
                  <tr
                    key={r.wilayah}
                    onClick={() => setActiveRegion(r.wilayah === activeRegion ? null : r.wilayah)}
                    style={{
                      cursor: "pointer",
                      background: activeRegion === r.wilayah ? "#F4F5F7" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#0D1117",
                        padding: "12px 16px",
                        borderBottom: "1px solid #F1F5F9",
                      }}
                    >
                      {r.wilayah}
                    </td>
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: "#0D1117",
                        padding: "12px 16px",
                        borderBottom: "1px solid #F1F5F9",
                        fontWeight: 600,
                      }}
                    >
                      {r.pengangguran}%
                    </td>
                    <td
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: "#0E67CC",
                        padding: "12px 16px",
                        borderBottom: "1px solid #F1F5F9",
                        fontWeight: 700,
                      }}
                    >
                      {r.lowongan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeRegion && (
            <div
              style={{
                marginTop: 14,
                padding: "14px 16px",
                background: "#0D1117",
                borderRadius: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#FFFFFF" }}>
                Wilayah terpilih: <strong>{activeRegion}</strong>
              </span>
              <button
                type="button"
                onClick={() => navigate("/dashboard/analytics/detail-wilayah")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: "#D4FF59",
                  color: "#0D1117",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Lihat Detail Wilayah →
              </button>
            </div>
          )}
        </div>

        {/* Emerging Skills */}
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#0D1117",
              marginBottom: 4,
            }}
          >
            Emerging Skills
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12.5,
              color: "#4A5568",
              marginBottom: 16,
            }}
          >
            Pertumbuhan permintaan YoY
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {emergingSkills.map((s) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#0D1117",
                      marginBottom: 2,
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#4A5568",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.urgency === "high" ? "PRIORITAS TINGGI" : s.urgency === "medium" ? "MENENGAH" : "MODERAT"}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0E67CC",
                  }}
                >
                  {s.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .ravira-analytics-grid,
          .ravira-analytics-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
