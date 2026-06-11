import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { RaviraOwlIcon } from "./RaviraLogo";

const navLinks = [
  { label: "Beranda", path: "/" },
  { label: "Fitur", path: "/fitur" },
  { label: "Untuk Kandidat", path: "/untuk-kandidat" },
  { label: "Untuk Perusahaan", path: "/untuk-perusahaan" },
  { label: "Untuk Pemerintah", path: "/untuk-pemerintah" },
  { label: "Tentang Ravira", path: "/tentang" },
  { label: "Kontak", path: "/kontak" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "rgba(7, 18, 40, 0.97)" : "rgba(7,18,40,0.85)",
        backdropFilter: "blur(24px)",
        borderBottom: scrolled ? "1px solid rgba(22, 119, 255, 0.12)" : "1px solid rgba(22,119,255,0.06)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <RaviraOwlIcon size={38} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg, #ffffff 0%, #4DB8FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.3px" }}>
                Ravira
              </span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 7.5, fontWeight: 600, color: "#4DB8FF", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                AI Recruitment Ecosystem
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: isActive(link.path) ? 600 : 500,
                  color: isActive(link.path) ? "#fff" : "#BDE1FF",
                  padding: "6px 11px",
                  borderRadius: 8,
                  background: isActive(link.path) ? "rgba(22, 119, 255, 0.18)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(22, 119, 255, 0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = "#BDE1FF";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
            <button
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#BDE1FF", padding: "8px 18px", borderRadius: 10, border: "1px solid rgba(77, 184, 255, 0.25)", background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4DB8FF"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(77, 184, 255, 0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(77, 184, 255, 0.25)"; e.currentTarget.style.color = "#BDE1FF"; e.currentTarget.style.background = "transparent"; }}
              onClick={() => navigate("/masuk/kandidat")}
            >
              Masuk
            </button>
            <button
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", padding: "8px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", cursor: "pointer", boxShadow: "0 4px 18px rgba(22, 119, 255, 0.4)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(22, 119, 255, 0.55)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(22, 119, 255, 0.4)"; }}
              onClick={() => navigate("/daftar/kandidat")}
            >
              Daftar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#e8eef8" }}
            className="flex md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{ backgroundColor: "rgba(7, 18, 40, 0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(22, 119, 255, 0.15)", padding: "16px 24px 24px" }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                fontWeight: isActive(link.path) ? 600 : 500,
                color: isActive(link.path) ? "#fff" : "#BDE1FF",
                padding: "12px 8px",
                borderBottom: "1px solid rgba(22, 119, 255, 0.08)",
                background: "none",
                border: "none",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "rgba(22, 119, 255, 0.08)",
                cursor: "pointer",
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              style={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#BDE1FF", padding: "10px", borderRadius: 10, border: "1px solid rgba(77, 184, 255, 0.25)", background: "transparent", cursor: "pointer" }}
              onClick={() => { navigate("/masuk/kandidat"); setMenuOpen(false); }}
            >
              Masuk
            </button>
            <button
              style={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", cursor: "pointer" }}
              onClick={() => { navigate("/daftar/kandidat"); setMenuOpen(false); }}
            >
              Daftar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
