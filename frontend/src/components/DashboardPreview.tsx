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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      {/* Job recommendations */}
      <DashCard title="Job Recommendations" accentColor="#1677FF">
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
              padding: "8px 0",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#c5d3f0" }}>{j.role}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: "#4a6a9a" }}>{j.company}</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#1677FF" }}>{j.match}%</div>
          </div>
        ))}
      </DashCard>

      {/* Skill gap report */}
      <DashCard title="Skill Gap Report" accentColor="#ff9a3c">
        {[
          { skill: "Figma Advanced", gap: 30, color: "#ff9a3c" },
          { skill: "React / Next.js", gap: 55, color: "#ff6b6b" },
          { skill: "Design Systems", gap: 20, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.skill} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: "#7a99c8" }}>{s.skill}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: s.color }}>Gap {s.gap}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.gap}%`, background: s.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </DashCard>

      {/* Training progress */}
      <DashCard title="Training Progress" accentColor="#10d98e">
        {[
          { course: "UX Research Fundamentals", progress: 72 },
          { course: "Advanced Figma Prototyping", progress: 45 },
          { course: "Design System Mastery", progress: 20 },
        ].map((c) => (
          <div key={c.course} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: "#7a99c8", marginBottom: 4 }}>{c.course}</div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${c.progress}%`, background: "linear-gradient(90deg, #10d98e, #2ad669)", borderRadius: 2 }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#10d98e", marginTop: 2 }}>{c.progress}% selesai</div>
          </div>
        ))}
      </DashCard>
    </div>
  );
}

function RecruiterDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      <DashCard title="Candidate Shortlist" accentColor="#1677FF">
        {[
          { name: "Budi Santoso", role: "Frontend Engineer", match: 96 },
          { name: "Dewi Rahayu", role: "Data Analyst", match: 91 },
          { name: "Ahmad Farhan", role: "Backend Dev", match: 87 },
        ].map((c) => (
          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#c5d3f0" }}>{c.name}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: "#4a6a9a" }}>{c.role}</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#1677FF" }}>{c.match}%</div>
          </div>
        ))}
      </DashCard>

      <DashCard title="Hiring Pipeline" accentColor="#4DB8FF">
        {[
          { stage: "Applied", count: 142, color: "#5a7aaa" },
          { stage: "Shortlisted", count: 28, color: "#1677FF" },
          { stage: "Interview", count: 9, color: "#4DB8FF" },
          { stage: "Offer", count: 3, color: "#10d98e" },
        ].map((p) => (
          <div key={p.stage} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "#7a99c8" }}>{p.stage}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: p.color }}>{p.count}</span>
          </div>
        ))}
      </DashCard>

      <DashCard title="Job Posting Performance" accentColor="#f59e0b">
        {[
          { label: "Tampilan", value: "4.2K", color: "#5a7aaa" },
          { label: "Lamaran Masuk", value: "142", color: "#1677FF" },
          { label: "Conversion Rate", value: "3.4%", color: "#f59e0b" },
          { label: "Avg Match Score", value: "78%", color: "#10d98e" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "#5a7aaa" }}>{s.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </DashCard>
    </div>
  );
}

function PemerintahDashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      <DashCard title="Workforce Heatmap" accentColor="#4DB8FF">
        {[
          { region: "DKI Jakarta", gap: "+7%", color: "#f59e0b" },
          { region: "Kaltim", gap: "+22%", color: "#ff6b6b" },
          { region: "Sulsel", gap: "+13%", color: "#ff9a3c" },
          { region: "Jatim", gap: "-2%", color: "#10d98e" },
        ].map((r) => (
          <div key={r.region} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "#7a99c8" }}>{r.region}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: r.color }}>{r.gap}</span>
          </div>
        ))}
      </DashCard>

      <DashCard title="Regional Skill Demand" accentColor="#a855f7">
        {[
          { skill: "AI / Machine Learning", trend: "+42%" },
          { skill: "Digital Marketing", trend: "+28%" },
          { skill: "Cloud Engineering", trend: "+35%" },
          { skill: "Data Science", trend: "+31%" },
        ].map((s) => (
          <div key={s.skill} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: "#7a99c8" }}>{s.skill}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#a855f7" }}>{s.trend}</span>
          </div>
        ))}
      </DashCard>

      <DashCard title="Training Policy Insight" accentColor="#10d98e">
        {[
          { label: "Program Direkomendasikan", value: "12", color: "#10d98e" },
          { label: "Wilayah Prioritas", value: "8", color: "#f59e0b" },
          { label: "Est. Penerima Manfaat", value: "24K", color: "#1677FF" },
          { label: "Completion Rate Target", value: "60%", color: "#4DB8FF" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: "#5a7aaa" }}>{s.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
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
        padding: "100px 24px",
        background: "linear-gradient(180deg, #071228 0%, #0a1b3d 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#1677FF",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 12px",
              border: "1px solid rgba(22, 119, 255, 0.25)",
              borderRadius: 100,
              background: "rgba(22, 119, 255, 0.06)",
              marginBottom: 16,
            }}
          >
            Dashboard Preview
          </span>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-1px",
              marginBottom: 32,
            }}
          >
            Satu Platform, Banyak Perspektif
          </h2>

          {/* Tab selector */}
          <div
            style={{
              display: "inline-flex",
              borderRadius: 12,
              background: "rgba(13, 31, 63, 0.8)",
              border: "1px solid rgba(22, 119, 255, 0.15)",
              padding: 4,
              gap: 4,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "9px 18px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, #1677FF, #0D47A1)"
                      : "transparent",
                  color: activeTab === tab.id ? "#fff" : "#5a7aaa",
                  boxShadow:
                    activeTab === tab.id ? "0 4px 16px rgba(22, 119, 255, 0.35)" : "none",
                }}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard content */}
        <div
          style={{
            padding: "28px",
            borderRadius: 20,
            background: "rgba(13, 31, 63, 0.6)",
            border: "1px solid rgba(22, 119, 255, 0.12)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Fake browser bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(22, 119, 255, 0.08)",
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
              />
            ))}
            <div
              style={{
                flex: 1,
                height: 22,
                borderRadius: 6,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                marginLeft: 8,
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#3a5480",
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
  accentColor,
  children,
}: {
  title: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: 14,
        background: "rgba(5, 12, 30, 0.6)",
        border: `1px solid ${accentColor}18`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: accentColor,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: `1px solid ${accentColor}18`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
