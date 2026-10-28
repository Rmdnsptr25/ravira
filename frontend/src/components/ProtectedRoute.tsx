import { Navigate, Outlet, useLocation } from "react-router";
import { useAppContext } from "../contexts/AppContext";
import type { RaviraRole } from "../services/raviraApi";

const homes: Record<RaviraRole, string> = {
  CANDIDATE: "/dashboard/kandidat",
  RECRUITER: "/dashboard/perusahaan",
  ADMIN: "/dashboard/admin",
  SUPER_ADMIN: "/dashboard/admin",
};

export function ProtectedRoute() {
  const { pathname } = useLocation();
  const { user, authReady, authError, retrySession, logout } = useAppContext();
  const government = pathname.startsWith("/dashboard/analytics");
  const recruiter = pathname.startsWith("/dashboard/perusahaan") || pathname.startsWith("/daftar/perusahaan/onboarding");
  const admin = pathname === "/admin" || pathname.startsWith("/dashboard/admin");
  const login = government ? "/masuk/pemerintah" : recruiter ? "/masuk/perusahaan" : admin ? "/masuk/admin" : "/masuk/kandidat";
  if (!authReady) return <p role="status">Memeriksa sesi...</p>;
  if (government) return <Navigate to={login} replace />;
  if (authError) return <div role="alert"><p>{authError}</p><button onClick={() => void retrySession()}>Coba lagi</button><button onClick={logout}>Keluar</button></div>;
  if (!user) return <Navigate to={login} replace />;
  const roles: readonly RaviraRole[] = admin ? ["ADMIN", "SUPER_ADMIN"] : recruiter ? ["RECRUITER"] : ["CANDIDATE"];
  if (!roles.includes(user.role)) return <Navigate to={homes[user.role]} replace />;
  if (recruiter && user.recruiter?.company?.verificationStatus !== "APPROVED" && pathname !== "/dashboard/perusahaan") {
    return <Navigate to="/dashboard/perusahaan" replace />;
  }
  return <Outlet key={user.id} />;
}
