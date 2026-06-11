import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { RaviraOwlIcon } from "./RaviraLogo";

export function PemerintahNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Beranda Pemerintah", path: "/untuk-pemerintah", action: () => navigate("/untuk-pemerintah") },
    { label: "Analytics", path: "/untuk-pemerintah/analytics", action: () => navigate("/untuk-pemerintah/analytics") },
    { label: "Tren Skill", path: "/untuk-pemerintah/tren-skill", action: () => navigate("/untuk-pemerintah/tren-skill") },
    { label: "Heatmap Wilayah", path: "/untuk-pemerintah/heatmap", action: () => navigate("/untuk-pemerintah/heatmap") },
    { label: "Laporan", path: "/untuk-pemerintah/laporan", action: () => navigate("/untuk-pemerintah/laporan") },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all 0.3s ease",
      backgroundColor: scrolled ? "rgba(2,18,32,0.97)" : "rgba(2,18,32,0.88)",
      backdropFilter: "blur(24px)",
      borderBottom: scrolled ? "1px solid rgba(77,184,255,0.2)" : "1px solid rgba(77,184,255,0.08)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <button onClick={() => navigate("/untuk-pemerintah")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <RaviraOwlIcon size={36} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg, #fff 0%, #4DB8FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.3px" }}>
                Ravira
              </span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 7, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                untuk Pemerintah &amp; Institusi
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden md:flex">
            {navItems.map((item) => (
              <button key={item.label} onClick={item.action}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: isActive(item.path) ? 600 : 500,
                  color: isActive(item.path) ? "#fff" : "#93d4f7",
                  padding: "6px 11px",
                  borderRadius: 8,
                  background: isActive(item.path) ? "rgba(77,184,255,0.18)" : "transparent",
                  border: isActive(item.path) ? "1px solid rgba(77,184,255,0.3)" : "none",
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { if (!isActive(item.path)) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(77,184,255,0.12)"; } }}
                onMouseLeave={(e) => { if (!isActive(item.path)) { e.currentTarget.style.color = "#93d4f7"; e.currentTarget.style.background = "transparent"; } }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
            <button onClick={() => navigate("/masuk/pemerintah")}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#93d4f7", padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4DB8FF"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(77,184,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(77,184,255,0.3)"; e.currentTarget.style.color = "#93d4f7"; e.currentTarget.style.background = "transparent"; }}
            >
              Masuk
            </button>
            <button onClick={() => navigate("/daftar/pemerintah")}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", cursor: "pointer", boxShadow: "0 4px 14px rgba(77,184,255,0.4)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Ajukan Akses
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#93d4f7" }} className="flex md:hidden">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ backgroundColor: "rgba(2,18,32,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(77,184,255,0.15)", padding: "16px 24px 24px" }} className="md:hidden">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => { item.action(); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: isActive(item.path) ? 600 : 500, color: isActive(item.path) ? "#fff" : "#93d4f7", padding: "12px 8px", background: isActive(item.path) ? "rgba(77,184,255,0.12)" : "none", border: "none", borderBottom: "1px solid rgba(77,184,255,0.1)", cursor: "pointer" }}>
              {item.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => { navigate("/masuk/pemerintah"); setMenuOpen(false); }}
              style={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#93d4f7", padding: "10px", borderRadius: 10, border: "1px solid rgba(77,184,255,0.3)", background: "transparent", cursor: "pointer" }}>
              Masuk
            </button>
            <button onClick={() => { navigate("/daftar/pemerintah"); setMenuOpen(false); }}
              style={{ flex: 2, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4DB8FF, #0090d4)", cursor: "pointer" }}>
              Ajukan Akses
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
