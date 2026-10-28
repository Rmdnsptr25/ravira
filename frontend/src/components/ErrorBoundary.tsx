import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f7ff",
          fontFamily: "'Inter', sans-serif",
          padding: 32,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid rgba(22,119,255,0.12)",
            boxShadow: "0 4px 24px rgba(10,27,61,0.08)",
            padding: "48px 40px",
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: "#0A1B3D", marginBottom: 12 }}>
              Terjadi Kendala
            </h2>
            <p style={{ fontSize: 14, color: "#6a88b8", marginBottom: 28, lineHeight: 1.6 }}>
              Halaman gagal dimuat. Silakan kembali ke dashboard atau coba lagi.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
                style={{
                  padding: "11px 22px", borderRadius: 10,
                  border: "1px solid rgba(22,119,255,0.2)", background: "#f0f7ff",
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                  color: "#1677FF", cursor: "pointer",
                }}
              >
                Kembali ke Dashboard
              </button>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
                style={{
                  padding: "11px 22px", borderRadius: 10,
                  border: "none", background: "linear-gradient(135deg, #1677FF, #0D47A1)",
                  fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700,
                  color: "#fff", cursor: "pointer",
                }}
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
