import { useState } from "react";
import { User, Briefcase, Landmark } from "lucide-react";

const tabs = [
  { id: "kandidat", label: "Kandidat", icon: User },
  { id: "recruiter", label: "Recruiter", icon: Briefcase },
  { id: "pemerintah", label: "Pemerintah", icon: Landmark },
] as const;

type TabId = "kandidat" | "recruiter" | "pemerintah";

function KandidatDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
      {/* Job recommendations */}
      <DashCard title="Job Recommendations" variant="white">
        {[
          { role: "Senior UX Designer", match: 94, company: "Tokopedia" },
          { role: "Product Designer", match: 88, company: "Gojek" },
          { role: "UI/UX Lead", match: 82, company: "Traveloka" },
        ].map((j) => (
          <div
            key={j.role}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 0",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0D1117" }}>{j.role}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4A5568" }}>{j.company}</div>
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0849A8" }}>{j.match}%</div>
          </div>
        ))}
      </DashCard>

      {/* Skill gap report */}
      <DashCard title="Skill Gap Report" variant="dark">
        {[
          { skill: "Figma Advanced", gap: 30, color: "#D4FF59" },
          { skill: "React / Next.js", gap: 55, color: "#389BFF" },
          { skill: "Design Systems", gap: 20, color: "#D4FF59" },
        ].map((s) => (
          <div key={s.skill} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E2E8F0" }}>{s.skill}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: s.color }}>Gap {s.gap}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 100, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.gap}%`, background: s.color, borderRadius: 100 }} />
            </div>
          </div>
        ))}
      </DashCard>

      {/* Training progress */}
      <DashCard title="Training Progress" variant="lime">
        {[
          { course: "UX Research Fundamentals", progress: 72 },
          { course: "Advanced Figma Prototyping", progress: 45 },
          { course: "Design System Mastery", progress: 20 },
        ].map((c) => (
          <div key={c.course} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0D1117", marginBottom: 5 }}>{c.course}</div>
            <div style={{ height: 5, borderRadius: 100, background: "rgba(13,17,23,0.14)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${c.progress}%`, background: "#0D1117", borderRadius: 100 }} />
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#0D1117", marginTop: 3 }}>{c.progress}% selesai</div>
          </div>
        ))}
      </DashCard>
    </div>
  );
}

function RecruiterDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
      <DashCard title="Candidate Shortlist" variant="white">
        {[
          { name: "Budi Santoso", role: "Frontend Engineer", match: 96 },
          { name: "Dewi Rahayu", role: "Data Analyst", match: 91 },
          { name: "Ahmad Farhan", role: "Backend Dev", match: 87 },
        ].map((c) => (
          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #E2E8F0" }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0D1117" }}>{c.name}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#4A5568" }}>{c.role}</div>
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0849A8" }}>{c.match}%</div>
          </div>
        ))}
      </DashCard>

      <DashCard title="Hiring Pipeline" variant="dark">
        {[
          { stage: "Applied", count: 142 },
          { stage: "Shortlisted", count: 28 },
          { stage: "Interview", count: 9 },
          { stage: "Offer", count: 3 },
        ].map((p) => (
          <div key={p.stage} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#CBD5E1" }}>{p.stage}</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#D4FF59" }}>{p.count}</span>
          </div>
        ))}
      </DashCard>

      <DashCard title="Job Posting Performance" variant="lime">
        {[
          { label: "Tampilan", value: "4.2K" },
          { label: "Lamaran Masuk", value: "142" },
          { label: "Conversion Rate", value: "3.4%" },
          { label: "Avg Match Score", value: "78%" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(13,17,23,0.1)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{s.label}</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0D1117" }}>{s.value}</span>
          </div>
        ))}
      </DashCard>
    </div>
  );
}

function PemerintahDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
      <DashCard title="Workforce Heatmap" variant="white">
        {[
          { region: "DKI Jakarta", gap: "+7%" },
          { region: "Kaltim", gap: "+22%" },
          { region: "Sulsel", gap: "+13%" },
          { region: "Jatim", gap: "-2%" },
        ].map((r) => (
          <div key={r.region} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0D1117" }}>{r.region}</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#0849A8" }}>{r.gap}</span>
          </div>
        ))}
      </DashCard>

      <DashCard title="Regional Skill Demand" variant="dark">
        {[
          { skill: "AI / Machine Learning", trend: "+42%" },
          { skill: "Digital Marketing", trend: "+28%" },
          { skill: "Cloud Engineering", trend: "+35%" },
          { skill: "Data Science", trend: "+31%" },
        ].map((s) => (
          <div key={s.skill} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#CBD5E1" }}>{s.skill}</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#D4FF59" }}>{s.trend}</span>
          </div>
        ))}
      </DashCard>

      <DashCard title="Training Policy Insight" variant="lime">
        {[
          { label: "Program Direkomendasikan", value: "12" },
          { label: "Wilayah Prioritas", value: "8" },
          { label: "Est. Penerima Manfaat", value: "24K" },
          { label: "Completion Rate Target", value: "60%" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(13,17,23,0.1)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{s.label}</span>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#0D1117" }}>{s.value}</span>
          </div>
        ))}
      </DashCard>
    </div>
  );
}

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<TabId>("kandidat");

  return (
    <section
      id="preview"
      style={{
        padding: "88px 24px",
        background: "#FFFFFF",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
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
            Dashboard Preview
          </div>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 600,
              color: "#0D1117",
              lineHeight: 1.16,
              letterSpacing: "-1.2px",
              marginBottom: 28,
            }}
          >
            Satu Platform, Banyak Perspektif
          </h2>

          {/* Tab selector */}
          <div
            role="tablist"
            aria-label="Perspektif Dashboard"
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              justifyContent: "center",
              borderRadius: 100,
              background: "#F4F5F7",
              border: "1px solid #E2E8F0",
              padding: 5,
              gap: 4,
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "10px 22px",
                    minHeight: 44,
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s",
                    background: isActive ? "#0D1117" : "transparent",
                    color: isActive ? "#D4FF59" : "#4A5568",
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard content */}
        <div
          style={{
            padding: "28px",
            borderRadius: 28,
            background: "#F4F5F7",
            border: "1px solid #E2E8F0",
          }}
        >
          {/* Browser bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 22,
              paddingBottom: 16,
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            {["#0D1117", "#389BFF", "#D4FF59"].map((c) => (
              <div
                key={c}
                style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid rgba(13,17,23,0.12)" }}
              />
            ))}
            <div
              style={{
                flex: 1,
                height: 28,
                borderRadius: 100,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                marginLeft: 8,
                display: "flex",
                alignItems: "center",
                paddingLeft: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#4A5568",
                }}
              >
                app.ravira.id/dashboard
              </span>
            </div>
          </div>

          {activeTab === "kandidat" && <KandidatDashboard />}
          {activeTab === "recruiter" && <RecruiterDashboard />}
          {activeTab === "pemerintah" && <PemerintahDashboard />}
        </div>
      </div>
    </section>
  );
}

function DashCard({
  title,
  variant,
  children,
}: {
  title: string;
  variant: "white" | "dark" | "lime";
  children: React.ReactNode;
}) {
  const bg = variant === "dark" ? "#0D1117" : variant === "lime" ? "#D4FF59" : "#FFFFFF";
  const headerColor = variant === "dark" ? "#D4FF59" : "#0D1117";
  const borderColor = variant === "dark" ? "rgba(255,255,255,0.12)" : variant === "lime" ? "rgba(13,17,23,0.12)" : "#E2E8F0";

  return (
    <div
      style={{
        padding: "22px",
        borderRadius: 20,
        background: bg,
        boxShadow: variant === "white" ? "0 4px 16px rgba(13,17,23,0.04)" : "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: headerColor,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
