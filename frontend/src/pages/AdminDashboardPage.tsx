import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  AlertTriangle,
  Clock,
  Search,
  Eye,
  FileText,
  Users,
  Shield,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "../components/DashboardLayout";
import { adminSidebarItems } from "../constants/adminSidebar";
import {
  listPendingCompanies,
  listFraudCases,
  listAppealsForAdmin,
  type AdminPendingCompany,
  type FraudCase,
  type AdminAppeal,
} from "../services/raviraApi";

const growthData = [
  { bulan: "Jan", kandidat: 32000, perusahaan: 850 },
  { bulan: "Feb", kandidat: 35000, perusahaan: 940 },
  { bulan: "Mar", kandidat: 38500, perusahaan: 1020 },
  { bulan: "Apr", kandidat: 42000, perusahaan: 1120 },
  { bulan: "Mei", kandidat: 48924, perusahaan: 1284 },
];

const matchData = [
  { bulan: "Jan", avgMatch: 78, lamaran: 8200 },
  { bulan: "Feb", avgMatch: 80, lamaran: 9100 },
  { bulan: "Mar", avgMatch: 82, lamaran: 10400 },
  { bulan: "Apr", avgMatch: 84, lamaran: 12800 },
  { bulan: "Mei", avgMatch: 87, lamaran: 15600 },
];

const recentActivity = [
  { action: "User baru mendaftar", detail: "Kandidat bergabung hari ini", time: "Baru saja", type: "user" },
  { action: "Laporan konten", detail: "Lowongan mencurigakan di-flag oleh user", time: "15 menit lalu", type: "warning" },
  { action: "Verifikasi perusahaan", detail: "Pengajuan verifikasi diproses admin", time: "1 jam lalu", type: "success" },
  { action: "AI Model Update", detail: "Model rekomendasi v2.4.1 aktif", time: "3 jam lalu", type: "system" },
  { action: "Sinkronisasi Data", detail: "Data integrasi sistem siap", time: "6 jam lalu", type: "system" },
];

interface AdminTooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
}

interface AdminCustomTooltipProps {
  active?: boolean;
  payload?: AdminTooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: AdminCustomTooltipProps) => {
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
        {payload.map((p: AdminTooltipPayloadItem) => (
          <div
            key={p.name}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#FFFFFF",
              marginBottom: 2,
            }}
          >
            {p.name}: <strong>{p.value?.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingCompanies, setPendingCompanies] = useState<AdminPendingCompany[]>([]);
  const [fraudCases, setFraudCases] = useState<FraudCase[]>([]);
  const [appeals, setAppeals] = useState<AdminAppeal[]>([]);

  const fetchDashboardData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [companiesRes, fraudRes, appealsRes] = await Promise.allSettled([
        listPendingCompanies(signal),
        listFraudCases(undefined, signal),
        listAppealsForAdmin(signal),
      ]);

      queueMicrotask(() => {
        if (companiesRes.status === "fulfilled") setPendingCompanies(companiesRes.value);
        if (fraudRes.status === "fulfilled") setFraudCases(fraudRes.value);
        if (appealsRes.status === "fulfilled") setAppeals(appealsRes.value);
        setLoading(false);
      });
    } catch {
      queueMicrotask(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void fetchDashboardData(controller.signal);
    });
    return () => controller.abort();
  }, [fetchDashboardData]);

  const highRiskFraudCount = fraudCases.filter((c) => c.riskLevel === "HIGH").length;
  const pendingAppealsCount = appeals.filter((a) => a.status === "OPEN" || a.status === "IN_REVIEW").length;

  const kpis = [
    {
      label: "Pending Verifikasi",
      value: loading ? "..." : String(pendingCompanies.length),
      change: "Butuh tindakan admin",
      variant: "blue" as const,
      icon: Clock,
      path: "/dashboard/admin/verifikasi-perusahaan",
    },
    {
      label: "Kasus Integritas & Fraud",
      value: loading ? "..." : String(fraudCases.length),
      change: `${highRiskFraudCount} risiko tinggi`,
      variant: "light" as const,
      icon: AlertTriangle,
      path: "/dashboard/admin/laporan-abuse",
    },
    {
      label: "Sanggahan Kandidat",
      value: loading ? "..." : String(appeals.length),
      change: `${pendingAppealsCount} menunggu review`,
      variant: "lime" as const,
      icon: FileText,
      path: "/dashboard/admin/sanggahan",
    },
    {
      label: "Perusahaan Menunggu",
      value: loading ? "..." : String(pendingCompanies.length),
      change: "Pusat Verifikasi",
      variant: "dark" as const,
      icon: Building2,
      path: "/dashboard/admin/verifikasi-perusahaan",
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={adminSidebarItems}
      userName="Admin Ravira"
      userRole="Super Admin"
      userInitial="A"
    >
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
            Admin Console · Super Admin
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
            Admin Dashboard
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Platform overview · Ravira Ecosystem · Mei 2026
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            borderRadius: 999,
            padding: "10px 18px",
            minWidth: 240,
          }}
        >
          <Search size={15} color="#4A5568" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user, perusahaan..."
            style={{
              border: "none",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              color: "#0D1117",
              background: "transparent",
              width: "100%",
            }}
          />
        </div>
      </section>

      {/* Bento KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {kpis.map((k) => {
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
            <button
              key={k.label}
              type="button"
              onClick={() => navigate(k.path)}
              style={{
                background: bg,
                borderRadius: 22,
                border: k.variant === "light" ? "1px solid #E2E8F0" : "none",
                padding: "20px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 152,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
                  marginBottom: 14,
                }}
              >
                <Icon size={18} />
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
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: valColor,
                    marginTop: 4,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: subColor,
                    marginTop: 2,
                  }}
                >
                  {k.change}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="ravira-admin-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginBottom: 18,
        }}
      >
        {/* Growth chart */}
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
              marginBottom: 16,
            }}
          >
            Pertumbuhan User Platform
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px 10px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={growthData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
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
                <Bar dataKey="kandidat" name="Kandidat" fill="#0E67CC" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match quality */}
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
              marginBottom: 16,
            }}
          >
            Kualitas Matching AI
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "14px 10px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={matchData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
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
                <Line
                  type="monotone"
                  dataKey="avgMatch"
                  name="Avg Match %"
                  stroke="#0E67CC"
                  strokeWidth={2.5}
                  dot={{ fill: "#0E67CC", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="lamaran"
                  name="Total Lamaran"
                  stroke="#0D1117"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className="ravira-admin-bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 330px",
          gap: 18,
        }}
      >
        {/* Pending verifications */}
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
                Antrian Verifikasi
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#4A5568" }}>
                {pendingCompanies.length} menunggu tindakan
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/verifikasi-perusahaan")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#0E67CC",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Lihat Semua →
            </button>
          </div>
          {loading ? (
            <div
              style={{
                padding: 28,
                textAlign: "center",
                color: "#4A5568",
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid #E2E8F0",
              }}
            >
              <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px", color: "#0E67CC" }} />
              <span style={{ fontSize: 13 }}>Memuat antrian verifikasi...</span>
            </div>
          ) : pendingCompanies.length === 0 ? (
            <div
              style={{
                padding: 28,
                textAlign: "center",
                color: "#4A5568",
                fontSize: 13.5,
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid #E2E8F0",
              }}
            >
              Tidak ada perusahaan yang menunggu verifikasi saat ini.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingCompanies.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: "#FFFFFF",
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: "#0D1117",
                      color: "#D4FF59",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#0D1117",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {v.name}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4A5568" }}>
                      {v.industry || "Umum"} ·{" "}
                      {v.createdAt ? new Date(v.createdAt).toLocaleDateString("id-ID") : "-"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#0D1117",
                        background: "#D4FF59",
                        borderRadius: 999,
                        padding: "3px 10px",
                        textTransform: "uppercase",
                      }}
                    >
                      PENDING
                    </span>
                    <button
                      type="button"
                      aria-label={`Lihat verifikasi ${v.name}`}
                      onClick={() => navigate("/dashboard/admin/verifikasi-perusahaan")}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        border: "1px solid #E2E8F0",
                        background: "#F4F5F7",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Eye size={14} color="#0D1117" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity log */}
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
              marginBottom: 16,
            }}
          >
            Log Aktivitas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentActivity.map((a) => {
              const icons: Record<string, React.ReactNode> = {
                user: <Users size={14} />,
                warning: <AlertTriangle size={14} />,
                success: <CheckCircle2 size={14} />,
                system: <Shield size={14} />,
              };
              return (
                <div
                  key={a.action + a.time}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "#0D1117",
                      color: "#D4FF59",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {icons[a.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0D1117",
                        marginBottom: 2,
                      }}
                    >
                      {a.action}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: "#4A5568",
                        lineHeight: 1.45,
                      }}
                    >
                      {a.detail}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: "#4A5568",
                        marginTop: 4,
                      }}
                    >
                      {a.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .ravira-admin-grid,
          .ravira-admin-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
