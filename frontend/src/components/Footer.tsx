import { Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
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
    <footer
      style={{
        background: "#020a1c",
        borderTop: "1px solid rgba(22, 119, 255, 0.12)",
        padding: "72px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(3, 1fr)",
            gap: 48,
            marginBottom: 60,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <RaviraOwlIcon size={42} />
              <div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #ffffff, #4DB8FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.3px",
                    lineHeight: 1.1,
                  }}
                >
                  Ravira
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 7.5,
                    fontWeight: 600,
                    color: "#4DB8FF",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  AI Recruitment Ecosystem
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: "#4a6a9a",
                lineHeight: 1.7,
                marginBottom: 24,
                maxWidth: 280,
                marginTop: 12,
              }}
            >
              Ekosistem rekrutmen berbasis AI untuk menghubungkan talenta, skill, pelatihan, dan
              peluang kerja di seluruh Indonesia.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(22, 119, 255, 0.08)",
                    border: "1px solid rgba(22, 119, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4a6a9a",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(22, 119, 255, 0.2)";
                    e.currentTarget.style.color = "#4DB8FF";
                    e.currentTarget.style.borderColor = "rgba(22, 119, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(22, 119, 255, 0.08)";
                    e.currentTarget.style.color = "#4a6a9a";
                    e.currentTarget.style.borderColor = "rgba(22, 119, 255, 0.15)";
                  }}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h5
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#BDE1FF",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Produk
            </h5>
            {productLinks.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: "#3a5a8a",
                  textDecoration: "none",
                  marginBottom: 10,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8bb8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3a5a8a")}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Company links */}
          <div>
            <h5
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#BDE1FF",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Perusahaan
            </h5>
            {companyLinks.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: "#3a5a8a",
                  textDecoration: "none",
                  marginBottom: 10,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8bb8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3a5a8a")}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#BDE1FF",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Kontak
            </h5>
            {[
              { icon: Mail, text: "hello@ravira.id" },
              { icon: Phone, text: "+62 21 1234 5678" },
              { icon: MapPin, text: "Jakarta, Indonesia" },
            ].map((c) => (
              <div
                key={c.text}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
              >
                <c.icon size={13} color="#2a4a7a" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#3a5a8a",
                  }}
                >
                  {c.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider with owl */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "rgba(22, 119, 255, 0.1)" }}
          />
          <RaviraOwlIcon size={28} />
          <div
            style={{ flex: 1, height: 1, background: "rgba(22, 119, 255, 0.1)" }}
          />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#1e3260",
            }}
          >
            © 2025 Ravira · Temukan Pekerjaan, Raih Masa Depan
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {legalLinks.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "#1e3260",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4a6a9a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1e3260")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
