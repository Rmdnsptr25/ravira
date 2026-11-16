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
      setError(
        cause instanceof Error ? cause.message : "Status verifikasi belum dapat diperiksa."
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section
      aria-labelledby="company-verification-title"
      style={{
        background: "#F4F5F7",
        borderRadius: 24,
        border: "1px solid #E2E8F0",
        padding: 32,
        maxWidth: 720,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "#0D1117",
          color: "#D4FF59",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Shield size={20} />
      </div>
      <h1
        id="company-verification-title"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 24,
          fontWeight: 600,
          color: "#0D1117",
          margin: "16px 0 8px",
        }}
      >
        Verifikasi Perusahaan
      </h1>
      <p role="status" style={{ color: "#0D1117", marginBottom: 12, fontSize: 14.5 }}>
        Status perusahaan: <strong>{status}</strong>
      </p>
      <p style={{ color: "#4A5568", lineHeight: 1.65, marginBottom: 24, fontSize: 14 }}>
        Akses rekrutmen dan data kandidat tersedia setelah perusahaan disetujui admin. Periksa
        kembali status verifikasi untuk melanjutkan.
      </p>
      {(error || authError) && (
        <p role="alert" style={{ color: "#B91C1C", marginBottom: 16, fontSize: 14 }}>
          {error || authError}
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button
          type="button"
          onClick={handleRetry}
          disabled={isChecking}
          style={{
            border: "none",
            borderRadius: 999,
            minHeight: 44,
            padding: "0 22px",
            background: "#0D1117",
            color: "#D4FF59",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: isChecking ? "not-allowed" : "pointer",
          }}
        >
          {isChecking ? "Memeriksa..." : "Cek Ulang Status"}
        </button>
        <button
          type="button"
          onClick={onLogout}
          style={{
            border: "1px solid #CBD5E1",
            borderRadius: 999,
            minHeight: 44,
            padding: "0 22px",
            background: "#FFFFFF",
            color: "#0D1117",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Keluar
        </button>
      </div>
    </section>
  );
}
