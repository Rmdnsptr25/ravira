import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { LogOut, Menu, X } from "lucide-react";
import { RaviraOwlIcon } from "./RaviraLogo";
import { useAppContext } from "../contexts/AppContext";
import { CompanyVerificationNotice } from "./CompanyVerificationNotice";

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
  activeKey?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  sidebarItems,
  userName,
  userRole,
  userInitial,
  activeKey,
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    const loginPath = user
      ? {
          CANDIDATE: "/masuk/kandidat",
          RECRUITER: "/masuk/perusahaan",
          ADMIN: "/masuk/admin",
          SUPER_ADMIN: "/masuk/admin",
        }[user.role]
      : "/masuk";
    logout();
    navigate(loginPath, { replace: true });
  };

  return (
    <div
      className="ravira-dashboard-shell"
      style={{
        display: "flex",
        minHeight: "100dvh",
        background: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
        color: "#0D1117",
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13, 17, 23, 0.55)",
            zIndex: 40,
          }}
        />
      )}

      {/* Framed Aeline Sidebar */}
      <aside
        aria-label="Navigasi dashboard"
        className="sidebar-desktop"
        style={{
          width: 264,
          padding: "12px 0 12px 12px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transition: "left 0.22s ease",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: 26,
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 54%, #1E82EB 100%)",
            boxShadow: "0 18px 44px rgba(8, 73, 168, 0.14)",
            overflow: "hidden",
          }}
        >
          {/* Brand Header */}
          <div
            style={{
              padding: "22px 20px 18px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.14)",
            }}
          >
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <RaviraOwlIcon size={32} />
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.4px",
                }}
              >
                Ravira
              </span>
            </a>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: "#D4FF59",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                marginTop: 6,
              }}
            >
              {userRole}
            </div>
          </div>

          {/* Nav items */}
          <nav
            className="ravira-no-scrollbar"
            style={{
              flex: 1,
              padding: "14px 12px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {sidebarItems.map((item) => {
              const isActive = activeKey ? item.key === activeKey : location.pathname === item.path;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`ravira-sidebar-btn ${isActive ? "ravira-sidebar-btn-active" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User + Logout */}
          <div
            style={{
              padding: "14px 12px 16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.14)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                marginBottom: 10,
                borderRadius: 16,
                background: "rgba(13, 17, 23, 0.22)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#0D1117",
                  color: "#D4FF59",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userName}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.78)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userRole}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ravira-logout-btn"
            >
              <LogOut size={15} aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div
        className="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 264,
          minWidth: 0,
          background: "#FFFFFF",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid #E2E8F0",
            padding: "0 28px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            type="button"
            aria-label={sidebarOpen ? "Tutup navigasi" : "Buka navigasi"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="menu-toggle"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#F4F5F7",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              color: "#0D1117",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {sidebarOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px 6px 6px",
              borderRadius: 999,
              background: "#F4F5F7",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#0D1117",
                color: "#D4FF59",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {userInitial}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0D1117",
                  lineHeight: 1.2,
                }}
              >
                {userName}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "#4A5568",
                  lineHeight: 1.2,
                }}
              >
                {userRole}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: "28px 32px 48px",
            maxWidth: 1320,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {user?.role === "RECRUITER" &&
          user.recruiter?.company?.verificationStatus !== "APPROVED" ? (
            <CompanyVerificationNotice onLogout={handleLogout} />
          ) : (
            children
          )}
        </main>
      </div>

      <style>{`
        .ravira-sidebar-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          text-align: left;
          background: transparent;
          color: rgba(255, 255, 255, 0.88);
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ravira-sidebar-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #FFFFFF;
        }
        .ravira-sidebar-btn-active,
        .ravira-sidebar-btn-active:hover {
          background: #D4FF59;
          color: #0D1117;
          font-weight: 700;
        }
        .ravira-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 42px;
          padding: 9px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(13, 17, 23, 0.24);
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ravira-logout-btn:hover {
          background: rgba(13, 17, 23, 0.45);
        }
        .ravira-dashboard-shell a:focus-visible,
        .ravira-dashboard-shell button:focus-visible,
        .ravira-dashboard-shell input:focus-visible,
        .ravira-dashboard-shell select:focus-visible,
        .ravira-dashboard-shell textarea:focus-visible,
        .ravira-dashboard-shell [role="button"]:focus-visible {
          outline: 2px solid #0E67CC;
          outline-offset: 2px;
        }
        @media (min-width: 901px) {
          .sidebar-desktop { left: 0 !important; }
          .menu-toggle { display: none !important; }
          .main-content { margin-left: 264px !important; }
        }
        @media (max-width: 900px) {
          .sidebar-desktop {
            left: ${sidebarOpen ? "0" : "-280px"} !important;
            padding: 10px !important;
          }
          .menu-toggle { display: inline-flex !important; }
          .main-content { margin-left: 0 !important; }
          .ravira-dashboard-shell main {
            padding: 20px 16px 36px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ravira-dashboard-shell *,
          .ravira-dashboard-shell *::before,
          .ravira-dashboard-shell *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
