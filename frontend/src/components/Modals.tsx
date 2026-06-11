import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Mail, Phone, Send, CheckCircle2, Calendar, Clock, MapPin, Download, FileText } from "lucide-react";

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,27,61,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalCard({ children, maxWidth = 480 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, width: "100%", maxWidth,
      boxShadow: "0 24px 80px rgba(10,27,61,0.18)",
      border: "1px solid rgba(22,119,255,0.1)",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

export function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (email) setSent(true);
  };

  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
            Lupa Password
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                Email terkirim!
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                Cek inbox Anda untuk tautan reset password.
              </p>
              <button onClick={onClose} style={{
                marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              }}>
                Tutup
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
                Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mereset password Anda.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                  Alamat Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6a88b8" }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    style={{
                      width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10,
                      border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif",
                      fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <button onClick={handleSend} style={{
                width: "100%", padding: "11px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Send size={14} /> Kirim Tautan Reset
              </button>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (name && email && message) setSent(true);
  };

  return (
    <Overlay onClose={onClose}>
      <ModalCard maxWidth={520}>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
            Hubungi Tim Ravira
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                Pesan terkirim!
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                Tim kami akan menghubungi Anda dalam 1×24 jam.
              </p>
              <button onClick={onClose} style={{
                marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              }}>
                Tutup
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Nama</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@domain.com"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Pesan</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tuliskan pertanyaan atau kebutuhan Anda..." rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={13} color="#1677FF" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>hello@ravira.id</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={13} color="#1677FF" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8" }}>+62 21 1234 5678</span>
                </div>
              </div>
              <button onClick={handleSend} style={{
                width: "100%", padding: "11px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Send size={14} /> Kirim Pesan
              </button>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function ApplicationConfirmModal({
  jobTitle, company, onConfirm, onClose,
}: {
  jobTitle: string; company: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
            Kirim Lamaran?
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ padding: "16px", borderRadius: 12, background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.12)", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#0A1B3D", marginBottom: 4 }}>{jobTitle}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>{company}</div>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
            Profil dan CV Anda akan dikirim ke perusahaan sesuai consent yang Anda berikan.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)",
              background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer",
            }}>
              Batal
            </button>
            <button onClick={onConfirm} style={{
              flex: 2, padding: "11px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #1677FF, #0D47A1)",
              fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}>
              Kirim Lamaran
            </button>
          </div>
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function InterviewScheduleModal({
  candidateName, onConfirm, onClose,
}: {
  candidateName: string; onConfirm: () => void; onClose: () => void;
}) {
  const [date, setDate] = useState("2026-06-15");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("Online (Google Meet)");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => { onConfirm(); onClose(); }, 1500);
  };

  return (
    <Overlay onClose={onClose}>
      <ModalCard maxWidth={500}>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
            Jadwalkan Wawancara
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          {confirmed ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>
                Jadwal wawancara dikirim!
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
                Jadwalkan wawancara dengan <strong style={{ color: "#0A1B3D" }}>{candidateName}</strong>
              </p>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                    <Calendar size={12} style={{ marginRight: 4 }} />Tanggal
                  </label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                    <Clock size={12} style={{ marginRight: 4 }} />Waktu
                  </label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                  <MapPin size={12} style={{ marginRight: 4 }} />Lokasi / Platform
                </label>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)",
                  background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer",
                }}>
                  Batal
                </button>
                <button onClick={handleConfirm} style={{
                  flex: 2, padding: "11px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                  fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                }}>
                  Kirim Undangan
                </button>
              </div>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function ExportReportModal({ reportName, onClose }: { reportName: string; onClose: () => void }) {
  const [format, setFormat] = useState<"pdf" | "xlsx" | "csv">("pdf");
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDone(true); }, 1800);
  };

  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>
            Ekspor Laporan
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <Download size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>
                Laporan siap diunduh!
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>
                {reportName}.{format}
              </p>
              <button onClick={onClose} style={{
                marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              }}>
                Tutup
              </button>
            </div>
          ) : (
            <>
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(22,119,255,0.04)", border: "1px solid rgba(22,119,255,0.1)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={16} color="#1677FF" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#0A1B3D" }}>{reportName}</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 10 }}>Pilih Format</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {(["pdf", "xlsx", "csv"] as const).map(f => (
                  <button key={f} onClick={() => setFormat(f)} style={{
                    flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${format === f ? "#1677FF" : "rgba(22,119,255,0.15)"}`,
                    background: format === f ? "rgba(22,119,255,0.08)" : "#f8fbff",
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
                    color: format === f ? "#1677FF" : "#6a88b8", textTransform: "uppercase",
                  }}>
                    .{f}
                  </button>
                ))}
              </div>
              <button onClick={handleExport} disabled={downloading} style={{
                width: "100%", padding: "11px", borderRadius: 10, border: "none",
                background: downloading ? "rgba(22,119,255,0.5)" : "linear-gradient(135deg, #1677FF, #0D47A1)",
                fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: downloading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Download size={14} /> {downloading ? "Memproses..." : "Ekspor Sekarang"}
              </button>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function ContactRecruiterModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Hubungi Recruiter</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Pesan terkirim!</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8" }}>Recruiter akan merespons melalui email Anda.</p>
              <button onClick={onClose} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Tutup</button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>Kirim pesan ke recruiter terkait status lamaran Anda.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Pesan</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tulis pertanyaan atau pesan Anda..." rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => message && setSent(true)} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Send size={14} /> Kirim Pesan
              </button>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function ChangeCareerTargetModal({ onClose }: { onClose: () => void }) {
  const [target, setTarget] = useState("Senior UX Designer");
  const [saved, setSaved] = useState(false);
  const options = ["Senior UX Designer", "Product Manager", "Frontend Developer", "Data Scientist", "UI Designer", "UX Researcher", "Design System Lead"];
  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Ubah Target Karier</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 28 }}>
          {saved ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>Target karier diperbarui!</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>Skill gap Anda akan dihitung ulang.</p>
              <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Tutup</button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>Pilih posisi target karier Anda. Skill gap akan dihitung berdasarkan pilihan ini.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {options.map(opt => (
                  <div key={opt} onClick={() => setTarget(opt)} style={{ padding: "12px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${target === opt ? "#1677FF" : "rgba(22,119,255,0.15)"}`, background: target === opt ? "rgba(22,119,255,0.06)" : "#f8fbff", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${target === opt ? "#1677FF" : "#c0d0e8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {target === opt && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1677FF" }} />}
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: target === opt ? 600 : 400, color: "#0A1B3D" }}>{opt}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setSaved(true)} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Simpan Target</button>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function RevokeConsentModal({ companyName, onClose }: { companyName: string; onClose: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Cabut Izin Akses</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 28 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#10d98e" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>Izin akses dicabut.</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>{companyName} tidak lagi dapat melihat profil Anda.</p>
              <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Tutup</button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 20 }}>
                Apakah Anda yakin ingin mencabut izin akses profil untuk <strong style={{ color: "#0A1B3D" }}>{companyName}</strong>? Mereka tidak akan bisa melihat profil lengkap Anda lagi.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>Batal</button>
                <button onClick={() => setDone(true)} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ff6b6b, #e03030)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Cabut Izin</button>
              </div>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [input, setInput] = useState("");
  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#ff6b6b" }}>Hapus Akun</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 28 }}>
          {confirmed ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <FileText size={48} color="#ff6b6b" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>Permintaan diterima.</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 16 }}>Akun Anda akan dihapus dalam 30 hari. Anda dapat membatalkan sebelum itu.</p>
              <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#f0f7ff", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#6a88b8", cursor: "pointer" }}>Tutup</button>
            </div>
          ) : (
            <>
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", marginBottom: 20 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#ff6b6b", fontWeight: 600 }}>Tindakan ini tidak dapat dibatalkan.</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6a88b8", marginTop: 4 }}>Semua data profil, lamaran, dan riwayat pelatihan akan dihapus permanen.</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Ketik "HAPUS" untuk konfirmasi</label>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="HAPUS"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,107,107,0.3)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>Batal</button>
                <button onClick={() => input === "HAPUS" && setConfirmed(true)} disabled={input !== "HAPUS"} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: input === "HAPUS" ? "linear-gradient(135deg, #ff6b6b, #e03030)" : "rgba(255,107,107,0.3)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: input === "HAPUS" ? "pointer" : "not-allowed" }}>Hapus Akun Saya</button>
              </div>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function RejectionReasonModal({
  title, onConfirm, onClose,
}: {
  title: string; onConfirm: (reason: string) => void; onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    if (!reason.trim()) return;
    setDone(true);
    setTimeout(() => { onConfirm(reason); onClose(); }, 1200);
  };

  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: "#0A1B3D" }}>Alasan Penolakan</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a88b8" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 28 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={48} color="#ff6b6b" style={{ marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#0A1B3D" }}>Penolakan dikirim.</p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 6 }}>
                Sedang menolak: <strong style={{ color: "#0A1B3D" }}>{title}</strong>
              </p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#0A1B3D", marginBottom: 6 }}>Alasan Penolakan</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Jelaskan alasan penolakan..." rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0A1B3D", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", cursor: "pointer" }}>Batal</button>
                <button onClick={handleConfirm} disabled={!reason.trim()} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: reason.trim() ? "linear-gradient(135deg, #ff6b6b, #e03030)" : "rgba(255,107,107,0.3)", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: reason.trim() ? "pointer" : "not-allowed" }}>Kirim Penolakan</button>
              </div>
            </>
          )}
        </div>
      </ModalCard>
    </Overlay>
  );
}

export function ApplicationSuccessModal({ jobTitle, onClose }: { jobTitle: string; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <Overlay onClose={onClose}>
      <ModalCard>
        <div style={{ padding: "28px" }}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <CheckCircle2 size={56} color="#10d98e" style={{ marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 800, color: "#0A1B3D", marginBottom: 8 }}>Lamaran Berhasil Dikirim</h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 8 }}>{jobTitle}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6a88b8", marginBottom: 24 }}>Anda dapat memantau status lamaran melalui menu Lamaran Saya.</p>
            <button onClick={() => { onClose(); navigate("/dashboard/kandidat/lamaran"); }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              Lihat Lamaran Saya
            </button>
          </div>
        </div>
      </ModalCard>
    </Overlay>
  );
}
