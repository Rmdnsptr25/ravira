import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Mail, MessageSquare, ArrowUpRight } from "lucide-react";

const categories = ["Kandidat", "Perusahaan", "Pemerintah / Institusi", "Partnership", "Lainnya"];

export default function KontakPage() {
  const [form, setForm] = useState({ nama: "", email: "", whatsapp: "", kategori: "Kandidat", pesan: "" });

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid #CBD5E1",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: "#0D1117",
    background: "#FFFFFF",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#0D1117",
    marginBottom: 6,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pesan berhasil dikirim. Tim Ravira akan menghubungi Anda.");
    setForm({ nama: "", email: "", whatsapp: "", kategori: "Kandidat", pesan: "" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Framed Aeline Hero */}
      <section style={{ padding: "14px 14px 8px", background: "#FFFFFF" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background: "linear-gradient(180deg, #0849A8 0%, #0E67CC 45%, #389BFF 100%)",
            padding: "120px 24px 64px",
            textAlign: "center",
            boxShadow: "0 18px 48px rgba(8, 73, 168, 0.14)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#D4FF59", color: "#0D1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={24} />
              </div>
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(30px, 4.4vw, 48px)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 14 }}>
              Hubungi Tim Ravira
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.75 }}>
              Ada pertanyaan, masukan, atau ingin bermitra? Kami siap membantu. Isi form di bawah dan tim Ravira akan segera menghubungi Anda.
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px" }}>
        {/* Contact Info Strip */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <a href="mailto:raviraindonesia@gmail.com" style={{ flex: 1, minWidth: 220, boxSizing: "border-box", background: "#F4F5F7", borderRadius: 20, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14, textDecoration: "none", cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0D1117", color: "#D4FF59", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#4A5568", marginBottom: 2 }}>Email</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#0D1117", overflowWrap: "anywhere" }}>raviraindonesia@gmail.com</div>
            </div>
          </a>
          <a href="https://wa.me/6285700398224" target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 220, boxSizing: "border-box", background: "#D4FF59", borderRadius: 20, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14, textDecoration: "none", cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0D1117", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#1E293B", marginBottom: 2 }}>WhatsApp</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#0D1117" }}>+62 857-0039-8224</div>
            </div>
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: "#F4F5F7", borderRadius: 28, padding: "40px 36px" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 600, color: "#0D1117", marginBottom: 24 }}>Kirim Pesan</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Nama Lengkap</label>
            <input
              type="text" value={form.nama} onChange={(e) => set("nama", e.target.value)}
              placeholder="Masukkan nama lengkap Anda" required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="nama@email.com" required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Nomor WhatsApp</label>
              <input
                type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="08xxxxxxxxxx"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Kategori</label>
            <select
              value={form.kategori} onChange={(e) => set("kategori", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Pesan</label>
            <textarea
              value={form.pesan} onChange={(e) => set("pesan", e.target.value)}
              placeholder="Tulis pesan Anda di sini..." required rows={5}
              style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
            />
          </div>

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "7px 8px 7px 26px",
              minHeight: 48,
              borderRadius: 999,
              border: "none",
              background: "#0D1117",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <span>Kirim Pesan</span>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#D4FF59", color: "#0D1117", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} />
            </span>
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
