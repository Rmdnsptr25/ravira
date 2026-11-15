import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { RaviraOwlIcon } from "./RaviraLogo";

export function PerusahaanNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Beranda Perusahaan", path: "/untuk-perusahaan", action: () => navigate("/untuk-perusahaan") },
    { label: "Lowongan", path: "/untuk-perusahaan/lowongan", action: () => navigate("/untuk-perusahaan/lowongan") },
    { label: "Produk", path: "/untuk-perusahaan/produk", action: () => navigate("/untuk-perusahaan/produk") },
    { label: "Solusi Rekrutmen", path: "/untuk-perusahaan/solusi-rekrutmen", action: () => navigate("/untuk-perusahaan/solusi-rekrutmen") },
    { label: "Insight Rekrutmen", path: "/untuk-perusahaan/insight-rekrutmen", action: () => navigate("/untuk-perusahaan/insight-rekrutmen") },
    { label: "Untuk Kandidat", path: "/untuk-kandidat", action: () => navigate("/untuk-kandidat") },
    { label: "Untuk Pemerintah", path: "/untuk-pemerintah", action: () => navigate("/untuk-pemerintah") },
  ];

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
        aria-label="Navigasi Portal Perusahaan"
        style={{
          pointerEvents: "auto",
          maxWidth: scrolled ? 1220 : 1332,
          margin: "0 auto",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          borderRadius: scrolled ? 999 : "24px 24px 0 0",
          backgroundColor: scrolled ? "rgba(13, 17, 23, 0.92)" : "transparent",
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
                  letterSpacing: "-0.3px",
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
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                untuk Perusahaan
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div style={{ alignItems: "center", gap: 2 }} className="ravira-desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: isActive(item.path) ? 700 : 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: isActive(item.path) && scrolled ? "#D4FF59" : "#ffffff",
                  padding: "8px 10px",
                  minHeight: 40,
                  borderRadius: 999,
                  background: isActive(item.path) ? "rgba(255, 255, 255, 0.16)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ alignItems: "center", gap: 8 }} className="ravira-desktop-nav">
            <button
              onClick={() => navigate("/masuk/perusahaan")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#ffffff",
                padding: "8px 14px",
                minHeight: 40,
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.32)",
                background: "rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Masuk
            </button>
            <button
              onClick={() => navigate("/daftar/perusahaan")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#0D1117",
                padding: "8px 16px",
                minHeight: 40,
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Daftarkan Perusahaan
            </button>
            <button
              onClick={() => navigate("/daftar/perusahaan")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#ffffff",
                padding: "8px 14px",
                minHeight: 40,
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.32)",
                background: "rgba(13, 17, 23, 0.55)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Buat Lowongan
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
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
        @media (max-width: 1120px) {
          .ravira-desktop-nav { display: none !important; }
          .ravira-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>

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
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: isActive(item.path) ? 700 : 500,
                color: isActive(item.path) ? "#D4FF59" : "#ffffff",
                padding: "12px 10px",
                background: isActive(item.path) ? "rgba(255, 255, 255, 0.1)" : "none",
                border: "none",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={() => {
                navigate("/masuk/perusahaan");
                setMenuOpen(false);
              }}
              style={{
                flex: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                padding: "10px",
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.35)",
                background: "rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
              }}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                navigate("/daftar/perusahaan");
                setMenuOpen(false);
              }}
              style={{
                flex: 2,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#0D1117",
                padding: "10px",
                borderRadius: 999,
                border: "none",
                background: "#D4FF59",
                cursor: "pointer",
              }}
            >
              Daftarkan Perusahaan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
