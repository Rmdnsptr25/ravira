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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Beranda Perusahaan", path: "/untuk-perusahaan", action: () => navigate("/untuk-perusahaan") },
    { label: "Lowongan", path: "/untuk-perusahaan/lowongan", action: () => navigate("/untuk-perusahaan/lowongan") },
    { label: "Produk", path: "/untuk-perusahaan/produk", action: () => navigate("/untuk-perusahaan/produk") },
    { label: "Solusi Rekrutmen", path: "/untuk-perusahaan/solusi-rekrutmen", action: () => navigate("/untuk-perusahaan/solusi-rekrutmen") },
    { label: "Insight Rekrutmen", path: "/untuk-perusahaan/insight-rekrutmen", action: () => navigate("/untuk-perusahaan/insight-rekrutmen") },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all 0.3s ease",
      backgroundColor: scrolled ? "rgba(13,8,32,0.97)" : "rgba(13,8,32,0.88)",
      backdropFilter: "blur(24px)",
      borderBottom: scrolled ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(139,92,246,0.08)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <button onClick={() => navigate("/untuk-perusahaan")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <RaviraOwlIcon size={36} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg, #fff 0%, #c4b5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.3px" }}>
                Ravira
              </span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 7, fontWeight: 600, color: "#8b5cf6", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                untuk Perusahaan
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
                  color: isActive(item.path) ? "#fff" : "#c4b5fd",
                  padding: "6px 11px",
                  borderRadius: 8,
                  background: isActive(item.path) ? "rgba(139,92,246,0.22)" : "transparent",
                  border: isActive(item.path) ? "1px solid rgba(139,92,246,0.35)" : "none",
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { if (!isActive(item.path)) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(139,92,246,0.14)"; } }}
                onMouseLeave={(e) => { if (!isActive(item.path)) { e.currentTarget.style.color = "#c4b5fd"; e.currentTarget.style.background = "transparent"; } }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
            <button onClick={() => navigate("/masuk/perusahaan")}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#c4b5fd", padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.3)", background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(139,92,246,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.color = "#c4b5fd"; e.currentTarget.style.background = "transparent"; }}
            >
              Masuk
            </button>
            <button onClick={() => navigate("/daftar/perusahaan")}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", cursor: "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.4)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Daftarkan Perusahaan
            </button>
            <button onClick={() => navigate("/daftar/perusahaan")}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.08)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.08)"; }}
            >
              Buat Lowongan
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }} className="flex md:hidden">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ backgroundColor: "rgba(13,8,32,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(139,92,246,0.15)", padding: "16px 24px 24px" }} className="md:hidden">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => { item.action(); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: isActive(item.path) ? 600 : 500, color: isActive(item.path) ? "#fff" : "#c4b5fd", padding: "12px 8px", background: isActive(item.path) ? "rgba(139,92,246,0.14)" : "none", border: "none", borderBottom: "1px solid rgba(139,92,246,0.1)", cursor: "pointer" }}>
              {item.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => { navigate("/masuk/perusahaan"); setMenuOpen(false); }}
              style={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#c4b5fd", padding: "10px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.3)", background: "transparent", cursor: "pointer" }}>
              Masuk
            </button>
            <button onClick={() => { navigate("/daftar/perusahaan"); setMenuOpen(false); }}
              style={{ flex: 2, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", cursor: "pointer" }}>
              Daftarkan Perusahaan
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
