import { Mail, Phone, MapPin } from "lucide-react";
import { RaviraOwlIcon } from "./RaviraLogo";

const productLinks = [
  "Smart Job Matching",
  "Skill Gap Advisor",
  "Personalized Training",
  "Workforce Analytics",
  "Cross-Region Matching",
];

const companyLinks = [
  "Tentang Kami",
  "Blog",
  "Karir di Ravira",
  "Press Kit",
  "Partner",
];

const legalLinks = [
  "Kebijakan Privasi",
  "Syarat & Ketentuan",
  "Kebijakan Cookie",
];

export function Footer() {
  return (
    <footer style={{ background: "#020a1c", borderTop: "1px solid rgba(22, 119, 255, 0.12)", padding: "72px 24px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 48, marginBottom: 60 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <RaviraOwlIcon size={42} />
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg, #ffffff, #4DB8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ravira</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 7.5, fontWeight: 600, color: "#4DB8FF", textTransform: "uppercase", marginTop: 2 }}>AI Recruitment Ecosystem</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#4a6a9a", lineHeight: 1.7, marginBottom: 24, maxWidth: 280, marginTop: 12 }}>
              Ekosistem rekrutmen berbasis AI untuk menghubungkan talenta, skill, pelatihan, dan peluang kerja di seluruh Indonesia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h5 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#BDE1FF", marginBottom: 16, textTransform: "uppercase" }}>Produk</h5>
            {productLinks.map((l) => (
              <a key={l} href="#" style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3a5a8a", textDecoration: "none", marginBottom: 10 }}>
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h5 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#BDE1FF", marginBottom: 16, textTransform: "uppercase" }}>Perusahaan</h5>
            {companyLinks.map((l) => (
              <a key={l} href="#" style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3a5a8a", textDecoration: "none", marginBottom: 10 }}>
                {l}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, color: "#BDE1FF", marginBottom: 16, textTransform: "uppercase" }}>Kontak</h5>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Mail size={13} color="#2a4a7a" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3a5a8a" }}>hello@ravira.id</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Phone size={13} color="#2a4a7a" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3a5a8a" }}>+62 21 1234 5678</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={13} color="#2a4a7a" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3a5a8a" }}>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(22, 119, 255, 0.1)" }} />
          <RaviraOwlIcon size={28} />
          <div style={{ flex: 1, height: 1, background: "rgba(22, 119, 255, 0.1)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#1e3260" }}>© 2025 Ravira · Temukan Pekerjaan, Raih Masa Depan</span>
          <div style={{ display: "flex", gap: 20 }}>
            {legalLinks.map((l) => (
              <a key={l} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1e3260", textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
