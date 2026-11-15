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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: scrolled ? 12 : 14,
        left: scrolled ? 16 : 14,
        right: scrolled ? 16 : 14,
        zIndex: 50,
        pointerEvents: "none",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <nav
        aria-label="Navigasi Utama"
        style={{
          pointerEvents: "auto",
          maxWidth: scrolled ? 1160 : 1332,
          margin: "0 auto",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          borderRadius: scrolled ? 999 : "24px 24px 0 0",
          backgroundColor: scrolled
            ? "rgba(13, 17, 23, 0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          border: scrolled ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid transparent",
          boxShadow: scrolled ? "0 14px 40px rgba(8, 24, 56, 0.28)" : "none",
          padding: scrolled ? "0 18px" : "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: scrolled ? 60 : 72,
            transition: "height 0.25s ease",
          }}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 4px",
              minHeight: 44,
            }}
          >
            <RaviraOwlIcon size={scrolled ? 30 : 34} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, textAlign: "left" }}>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: scrolled ? 19 : 21,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.4px",
                }}
              >
                Ravira
              </span>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 7.5,
                  fontWeight: 600,
                  color: "#D4FF59",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                AI Recruitment Ecosystem
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div style={{ alignItems: "center", gap: 2 }} className="ravira-desktop-nav">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => navigate(link.path)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: isActive(link.path) ? 700 : 500,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: isActive(link.path) && scrolled ? "#D4FF59" : "#ffffff",
                  padding: "8px 11px",
                  minHeight: 40,
                  borderRadius: 999,
                  background: isActive(link.path)
                    ? "rgba(255, 255, 255, 0.16)"
                    : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ alignItems: "center", gap: 8 }} className="ravira-desktop-nav">
            <button
              type="button"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#ffffff",
                padding: "8px 16px",
                minHeight: 40,
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.32)",
                background: "rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.32)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              }}
              onClick={() => navigate("/masuk/kandidat")}
            >
              Masuk
            </button>
            <button
              type="button"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#0D1117",
                padding: "8px 20px",
                minHeight: 40,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                cursor: "pointer",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "#e0ff80";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#D4FF59";
              }}
              onClick={() => navigate("/daftar/kandidat")}
            >
              Daftar
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: 999,
              width: 44,
              height: 44,
              cursor: "pointer",
              color: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="ravira-mobile-toggle"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <style>{`
        .ravira-desktop-nav { display: flex; }
        .ravira-mobile-toggle { display: none; }
        @media (max-width: 1024px) {
          .ravira-desktop-nav { display: none !important; }
          .ravira-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            pointerEvents: "auto",
            maxWidth: 1160,
            margin: "8px auto 0",
            backgroundColor: "rgba(13, 17, 23, 0.96)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            padding: "16px 24px 24px",
            borderRadius: 24,
            boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => {
                navigate(link.path);
                setMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: isActive(link.path) ? 700 : 500,
                color: isActive(link.path) ? "#D4FF59" : "#ffffff",
                padding: "12px 10px",
                minHeight: 44,
                background: isActive(link.path) ? "rgba(255, 255, 255, 0.1)" : "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              type="button"
              style={{
                flex: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                padding: "11px",
                minHeight: 44,
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.35)",
                background: "rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/masuk/kandidat");
                setMenuOpen(false);
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#0D1117",
                padding: "11px",
                minHeight: 44,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/daftar/kandidat");
                setMenuOpen(false);
              }}
            >
              Daftar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
