import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { LogOut, Menu, X, Bell, ChevronDown } from "lucide-react";
import { RaviraOwlIcon } from "./RaviraLogo";

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface DashboardLayoutProps {
  sidebarItems: SidebarItem[];
  userName: string;
  userRole: string;
  userInitial: string;
  children: React.ReactNode;
}

export function DashboardLayout({ sidebarItems, userName, userRole, userInitial, children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Inter', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#071228",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transition: "left 0.25s ease",
      }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(22,119,255,0.12)" }}>
          <a
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", cursor: "pointer" }}
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
          >
            <RaviraOwlIcon size={32} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700, color: "#ffffff" }}>Ravira</span>
          </a>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#3a5480", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>
            {userRole}
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                  marginBottom: 2, textAlign: "left",
                  background: isActive ? "rgba(22,119,255,0.18)" : "transparent",
                  color: isActive ? "#4DB8FF" : "rgba(189,225,255,0.6)",
                  fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                  transition: "all 0.15s",
                  borderLeft: isActive ? "2px solid #1677FF" : "2px solid transparent",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(22,119,255,0.08)"; e.currentTarget.style.color = "rgba(189,225,255,0.9)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(189,225,255,0.6)"; } }}
              >
                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(22,119,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
              flexShrink: 0,
            }}>
              {userInitial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#c5d3f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#3a5480" }}>{userRole}</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/masuk")}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "rgba(189,225,255,0.45)",
              fontFamily: "'Inter', sans-serif", fontSize: 13, transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.08)"; e.currentTarget.style.color = "#ff8080"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(189,225,255,0.45)"; }}
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 240, minWidth: 0 }} className="main-content">
        {/* Topbar */}
        <header style={{
          background: "#ffffff", borderBottom: "1px solid rgba(22,119,255,0.1)",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 30,
          boxShadow: "0 1px 8px rgba(10,27,61,0.06)",
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6a88b8",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="menu-toggle"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#f0f7ff", border: "1px solid rgba(22,119,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
            }}>
              <Bell size={16} color="#1677FF" />
              <span style={{
                position: "absolute", top: 6, right: 6, width: 7, height: 7,
                borderRadius: "50%", background: "#ff4757", border: "1.5px solid #fff",
              }} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #1677FF, #4DB8FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
              }}>
                {userInitial}
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{userName}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6a88b8" }}>{userRole}</div>
              </div>
              <ChevronDown size={14} color="#6a88b8" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .sidebar-desktop { left: 0 !important; }
          .menu-toggle { display: none !important; }
          .main-content { margin-left: 240px !important; }
        }
        @media (max-width: 768px) {
          .sidebar-desktop { left: ${sidebarOpen ? '0' : '-240px'} !important; }
          .menu-toggle { display: flex !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
