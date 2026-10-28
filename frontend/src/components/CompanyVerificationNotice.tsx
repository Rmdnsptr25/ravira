import { useState } from "react";
import { Shield } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

export function CompanyVerificationNotice({ onLogout }: { onLogout: () => void }) {
  const { user, retrySession, authError } = useAppContext();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = user?.recruiter?.company?.verificationStatus ?? "BELUM TERSEDIA";

  const handleRetry = async () => {
    if (isChecking) return;
    setIsChecking(true);
    setError(null);
    try {
      await retrySession();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status verifikasi belum dapat diperiksa.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section aria-labelledby="company-verification-title" style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(22,119,255,0.1)", padding: 32, maxWidth: 720 }}>
      <Shield size={24} color="#1677FF" />
      <h1 id="company-verification-title" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, color: "#0A1B3D", margin: "16px 0 8px" }}>Verifikasi Perusahaan</h1>
      <p role="status" style={{ color: "#0A1B3D", marginBottom: 12 }}>Status perusahaan: <strong>{status}</strong></p>
      <p style={{ color: "#6a88b8", lineHeight: 1.6, marginBottom: 24 }}>Akses rekrutmen dan data kandidat tersedia setelah perusahaan disetujui admin. Periksa kembali status verifikasi untuk melanjutkan.</p>
      {(error || authError) && <p role="alert" style={{ color: "#dc2626", marginBottom: 16 }}>{error || authError}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button type="button" onClick={handleRetry} disabled={isChecking} style={{ border: "none", borderRadius: 10, padding: "11px 16px", background: "#1677FF", color: "#fff", cursor: isChecking ? "not-allowed" : "pointer" }}>{isChecking ? "Memeriksa..." : "Cek Ulang Status"}</button>
        <button type="button" onClick={onLogout} style={{ border: "1px solid rgba(22,119,255,0.2)", borderRadius: 10, padding: "11px 16px", background: "#f0f7ff", color: "#0A1B3D", cursor: "pointer" }}>Keluar</button>
      </div>
    </section>
  );
}
