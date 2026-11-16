import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Briefcase,
  Bookmark,
  BarChart2,
  BookOpen,
  FileText,
  Globe,
  User,
  Settings,
  MapPin,
  TrendingUp,
  Building2,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import type { SidebarItem } from "../components/DashboardLayout";
import { ApplicationConfirmModal } from "../components/Modals";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";

const sidebarItems: SidebarItem[] = [
  { key: "beranda", label: "Beranda", icon: <Home size={16} />, path: "/dashboard/kandidat" },
  { key: "pekerjaan", label: "Rekomendasi Pekerjaan", icon: <Briefcase size={16} />, path: "/dashboard/kandidat/rekomendasi" },
  { key: "tersimpan", label: "Lowongan Tersimpan", icon: <Bookmark size={16} />, path: "/dashboard/kandidat/tersimpan" },
  { key: "skill", label: "Skill Gap", icon: <BarChart2 size={16} />, path: "/dashboard/kandidat/skill-gap" },
  { key: "pelatihan", label: "Pelatihan", icon: <BookOpen size={16} />, path: "/dashboard/kandidat/pelatihan" },
  { key: "lamaran", label: "Lamaran Saya", icon: <FileText size={16} />, path: "/dashboard/kandidat/lamaran" },
  { key: "lintas", label: "Peluang Lintas Wilayah", icon: <Globe size={16} />, path: "/dashboard/kandidat/cross-region" },
  { key: "profil", label: "Profil Saya", icon: <User size={16} />, path: "/dashboard/kandidat/profil" },
  { key: "pengaturan", label: "Pengaturan Privasi", icon: <Settings size={16} />, path: "/dashboard/kandidat/privasi" },
];

type WorkType = "Remote OK" | "Relokasi" | "Hybrid";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  from: string;
  region:
    | "DKI Jakarta"
    | "Jawa Barat"
    | "Jawa Tengah"
    | "DI Yogyakarta"
    | "Jawa Timur"
    | "Banten";
  type: WorkType;
  salary: string;
  match: number;
}

const opportunities: Opportunity[] = [
  { id: "opp-1", title: "Senior UX Designer", company: "Gojek", location: "Jakarta", from: "Yogyakarta", region: "DKI Jakarta", type: "Relokasi", salary: "15–22 jt", match: 91 },
  { id: "opp-2", title: "Product Designer", company: "Traveloka", location: "Jakarta", from: "Bandung", region: "DKI Jakarta", type: "Hybrid", salary: "13–19 jt", match: 85 },
  { id: "opp-3", title: "Data Analyst", company: "Tokopedia", location: "Surabaya", from: "Semarang", region: "Jawa Timur", type: "Relokasi", salary: "12–17 jt", match: 80 },
  { id: "opp-4", title: "Backend Engineer", company: "Shopee Indonesia", location: "Surabaya", from: "Malang", region: "Jawa Timur", type: "Hybrid", salary: "14–20 jt", match: 76 },
  { id: "opp-5", title: "DevOps Engineer", company: "PLN Digital", location: "Yogyakarta", from: "Solo", region: "DI Yogyakarta", type: "Relokasi", salary: "12–18 jt", match: 72 },
  { id: "opp-6", title: "UI/UX Designer", company: "BCA Digital", location: "Jakarta", from: "Bekasi", region: "DKI Jakarta", type: "Remote OK", salary: "10–16 jt", match: 68 },
];

const regionFilters = [
  "Semua Wilayah",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
] as const;

export default function CrossRegionPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const displayName = user?.fullName || "Kandidat";
  const displayInitial = (displayName[0] || "K").toUpperCase();
  const [activeRegion, setActiveRegion] = useState<string>("Semua Wilayah");
  const [showModal, setShowModal] = useState<{ title: string; company: string } | null>(null);
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());

  const filtered =
    activeRegion === "Semua Wilayah"
      ? opportunities
      : opportunities.filter((o) => o.region === activeRegion);

  const toggleInterested = (id: string) => {
    setInterestedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast.success("Peluang berhasil ditandai!");
      }
      return next;
    });
  };

  const statItems = [
    {
      label: "Total Peluang",
      value: opportunities.length,
      icon: Briefcase,
      variant: "blue" as const,
    },
    {
      label: "Remote OK",
      value: opportunities.filter((o) => o.type === "Remote OK").length,
      icon: Globe,
      variant: "light" as const,
    },
    {
      label: "Relokasi",
      value: opportunities.filter((o) => o.type === "Relokasi").length,
      icon: MapPin,
      variant: "lime" as const,
    },
    {
      label: "Avg. Match",
      value: `${Math.round(opportunities.reduce((a, o) => a + o.match, 0) / opportunities.length)}%`,
      icon: TrendingUp,
      variant: "dark" as const,
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userName={displayName}
      userRole="Kandidat"
      userInitial={displayInitial}
    >
      {/* Framed Hero Banner */}
      <section
        style={{
          borderRadius: 26,
          background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 52%, #2B8CFF 100%)",
          padding: "28px 30px",
          marginBottom: 24,
          boxShadow: "0 16px 40px rgba(8, 73, 168, 0.12)",
        }}
      >
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
          Mobilitas Karier Nasional
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
          Peluang Lintas Wilayah
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
          }}
        >
          Temukan peluang karier terbaik di seluruh Indonesia ({opportunities.length} lowongan
          tersebar di {new Set(opportunities.map((o) => o.region)).size} wilayah).
        </p>
      </section>

      {/* Bento Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statItems.map((stat) => {
          const Icon = stat.icon;
          const isBlue = stat.variant === "blue";
          const isLime = stat.variant === "lime";
          const isDark = stat.variant === "dark";
          const bg = isBlue
            ? "linear-gradient(180deg, #0E67CC 0%, #2B8CFF 100%)"
            : isLime
              ? "#D4FF59"
              : isDark
                ? "#0D1117"
                : "#F4F5F7";
          const valColor = isBlue || isDark ? "#FFFFFF" : "#0D1117";
          const subColor = isBlue
            ? "rgba(255, 255, 255, 0.9)"
            : isDark
              ? "#CBD5E1"
              : "#4A5568";
          const iconBg = isBlue || isDark ? "#FFFFFF" : "#0D1117";
          const iconColor = isBlue || isDark ? "#0D1117" : "#D4FF59";

          return (
            <div
              key={stat.label}
              style={{
                background: bg,
                borderRadius: 22,
                border: stat.variant === "light" ? "1px solid #E2E8F0" : "none",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: iconBg,
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 26,
                    fontWeight: 600,
                    color: valColor,
                    lineHeight: 1.05,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: subColor }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Region filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {regionFilters.map((region) => {
          const isActive = activeRegion === region;
          const count =
            region === "Semua Wilayah"
              ? opportunities.length
              : opportunities.filter((o) => o.region === region).length;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: "9px 18px",
                minHeight: 40,
                borderRadius: 999,
                border: isActive ? "none" : "1px solid #E2E8F0",
                background: isActive ? "#0D1117" : "#F4F5F7",
                color: isActive ? "#D4FF59" : "#0D1117",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {region}
              {count > 0 && (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: isActive ? "rgba(212, 255, 89, 0.2)" : "#FFFFFF",
                    color: isActive ? "#D4FF59" : "#0D1117",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Opportunity cards grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#F4F5F7",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            textAlign: "center",
            padding: "56px 24px",
            color: "#4A5568",
          }}
        >
          <Globe size={40} color="#0E67CC" style={{ margin: "0 auto 12px" }} />
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#0D1117",
            }}
          >
            Tidak ada peluang di wilayah ini
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((opp) => {
            const isInterested = interestedIds.has(opp.id);
            return (
              <div
                key={opp.id}
                style={{
                  background: "#F4F5F7",
                  borderRadius: 24,
                  border: "1px solid #E2E8F0",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* Top */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "#0D1117",
                      color: "#D4FF59",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#0D1117",
                      }}
                    >
                      {opp.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: "#4A5568",
                        marginTop: 2,
                      }}
                    >
                      {opp.company}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: "#4A5568",
                      }}
                    >
                      <MapPin size={11} /> {opp.location}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0D1117",
                      borderRadius: 14,
                      padding: "8px 12px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#D4FF59",
                        lineHeight: 1,
                      }}
                    >
                      {opp.match}%
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "#CBD5E1" }}>
                      match
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: "3px 12px",
                      borderRadius: 999,
                      background: "#D4FF59",
                      color: "#0D1117",
                    }}
                  >
                    {opp.type}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11.5,
                      fontWeight: 500,
                      padding: "3px 12px",
                      borderRadius: 999,
                      background: "#FFFFFF",
                      color: "#0D1117",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    {opp.region}
                  </span>
                </div>

                {/* Salary */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4A5568" }}>
                    Estimasi Gaji
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#0D1117",
                    }}
                  >
                    Rp {opp.salary}
                  </span>
                </div>

                {/* Tandai Tertarik */}
                <button
                  type="button"
                  onClick={() => toggleInterested(opp.id)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    padding: "8px 14px",
                    minHeight: 38,
                    borderRadius: 999,
                    border: isInterested ? "none" : "1px solid #CBD5E1",
                    background: isInterested ? "#D4FF59" : "#FFFFFF",
                    color: "#0D1117",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {isInterested ? "Tertandai" : "Tandai Tertarik"}
                </button>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/kandidat/detail-cross-region")}
                    style={{
                      flex: 1,
                      minHeight: 40,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      color: "#0D1117",
                      cursor: "pointer",
                    }}
                  >
                    Lihat Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal({ title: opp.title, company: opp.company })}
                    style={{
                      flex: 1,
                      minHeight: 40,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: "none",
                      background: "#0D1117",
                      color: "#D4FF59",
                      cursor: "pointer",
                    }}
                  >
                    Lamar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ApplicationConfirmModal
          jobTitle={showModal.title}
          company={showModal.company}
          onConfirm={() => setShowModal(null)}
          onClose={() => setShowModal(null)}
        />
      )}
    </DashboardLayout>
  );
}
