import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "../components/Navbar";
import { Mail, MessageSquare } from "lucide-react";

const categories = ["Kandidat", "Perusahaan", "Pemerintah / Institusi", "Partnership", "Lainnya"];

export default function KontakPage() {
  const [form, setForm] = useState({ nama: "", email: "", whatsapp: "", kategori: "Kandidat", pesan: "" });

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(22,119,255,0.2)",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: "#0A1B3D",
    background: "#f8fbff",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: "#0A1B3D",
    marginBottom: 6,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pesan berhasil dikirim. Tim Ravira akan menghubungi Anda.");
    setForm({ nama: "", email: "", whatsapp: "", kategori: "Kandidat", pesan: "" });
  };

  const focusBlue = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#1677FF";
  };
  const blurBlue = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(22,119,255,0.2)";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8ff", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #020a1c 0%, #071228 55%, #0a1b3d 100%)", paddingTop: 120, paddingBottom: 72, position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(22,119,255,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(22,119,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={26} color="#4DB8FF" />
            </div>
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 14 }}>Hubungi Tim Ravira</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#7a99c8", lineHeight: 1.8 }}>
            Ada pertanyaan, masukan, atau ingin bermitra? Kami siap membantu. Isi form di bawah dan tim Ravira akan segera menghubungi Anda.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>

        {/* Contact Info Strip */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.08)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <Mail size={18} color="#1677FF" />
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", marginBottom: 2 }}>Email</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D" }}>halo@ravira.id</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "#fff", borderRadius: 14, border: "1px solid rgba(22,119,255,0.08)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <MessageSquare size={18} color="#10d98e" />
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, color: "#6a88b8", marginBottom: 2 }}>WhatsApp</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D" }}>+62 812-0000-RAVI</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 24, border: "1px solid rgba(22,119,255,0.08)", padding: "40px 36px", boxShadow: "0 4px 24px rgba(10,27,61,0.07)" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", marginBottom: 28 }}>Kirim Pesan</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Nama Lengkap</label>
            <input
              type="text" value={form.nama} onChange={(e) => set("nama", e.target.value)}
              placeholder="Masukkan nama lengkap Anda" required
              style={inputStyle}
              onFocus={focusBlue} onBlur={blurBlue}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="nama@email.com" required
                style={inputStyle}
                onFocus={focusBlue} onBlur={blurBlue}
              />
            </div>
            <div>
              <label style={labelStyle}>Nomor WhatsApp</label>
              <input
                type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="08xxxxxxxxxx"
                style={inputStyle}
                onFocus={focusBlue} onBlur={blurBlue}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Kategori</label>
            <select
              value={form.kategori} onChange={(e) => set("kategori", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={focusBlue} onBlur={blurBlue}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Pesan</label>
            <textarea
              value={form.pesan} onChange={(e) => set("pesan", e.target.value)}
              placeholder="Tulis pesan Anda di sini..." required rows={5}
              style={{ ...inputStyle, resize: "vertical", minHeight: 120 } as React.CSSProperties}
              onFocus={focusBlue} onBlur={blurBlue}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)", transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Kirim Pesan
          </button>
        </form>
      </div>
    </div>
  );
}
