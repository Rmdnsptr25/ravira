import { Mail, Phone, MapPin } from "lucide-react";
import { RaviraOwlIcon } from "./RaviraLogo";

const productLinks = [
  { label: "Smart Job Matching", href: "#fitur" },
  { label: "Skill Gap Advisor", href: "#fitur" },
  { label: "Personalized Training", href: "#fitur" },
  { label: "Workforce Analytics", href: "#analytics" },
  { label: "Cross-Region Matching", href: "#fitur" },
];

const companyLinks = [
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Blog", href: "#preview" },
  { label: "Karir di Ravira", href: "/untuk-kandidat" },
  { label: "Press Kit", href: "#tentang" },
  { label: "Partner", href: "/untuk-perusahaan" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "#tentang" },
  { label: "Syarat & Ketentuan", href: "#tentang" },
  { label: "Kebijakan Cookie", href: "#tentang" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0D1117", borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "72px 24px 36px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 48, marginBottom: 56 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <RaviraOwlIcon size={40} />
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>Ravira</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, color: "#D4FF59", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                  AI Recruitment Ecosystem
                </div>
              </div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, marginBottom: 24, maxWidth: 300, marginTop: 12 }}>
              Ekosistem rekrutmen berbasis AI untuk menghubungkan talenta, skill, pelatihan, dan peluang kerja di seluruh Indonesia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h5 style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.12em", marginBottom: 18, textTransform: "uppercase" }}>
              Produk
            </h5>
            {productLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: "#CBD5E1",
                  textDecoration: "none",
                  padding: "5px 0",
                  marginBottom: 4,
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h5 style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.12em", marginBottom: 18, textTransform: "uppercase" }}>
              Perusahaan
            </h5>
            {companyLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: "#CBD5E1",
                  textDecoration: "none",
                  padding: "5px 0",
                  marginBottom: 4,
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.12em", marginBottom: 18, textTransform: "uppercase" }}>
              Kontak
            </h5>
            <a href="mailto:raviraindonesia@gmail.com" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, textDecoration: "none", cursor: "pointer" }}>
              <Mail size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#CBD5E1", overflowWrap: "anywhere" }}>raviraindonesia@gmail.com</span>
            </a>
            <a href="https://wa.me/6285700398224" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, textDecoration: "none", cursor: "pointer" }}>
              <Phone size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#CBD5E1" }}>+62 857-0039-8224</span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MapPin size={14} color="#D4FF59" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#CBD5E1" }}>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.1)" }} />
          <RaviraOwlIcon size={28} />
          <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.1)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94A3B8" }}>
            © 2025 Ravira · Temukan Pekerjaan, Raih Masa Depan
          </span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {legalLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#94A3B8", textDecoration: "none", padding: "4px 0" }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
