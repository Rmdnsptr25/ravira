import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  applyToJob as submitJobApplication,
  getAuthToken,
  getCurrentUser,
  listMyApplications,
  listPublishedJobs,
  login as loginRequest,
  logout as logoutRequest,
  registerCandidate as registerCandidateRequest,
  registerRecruiter as registerRecruiterRequest,
  type CandidateApplication,
  type PublicJob,
  type RaviraUser,
} from "../services/raviraApi";

import { ApiError, AUTH_TOKEN_KEY, SESSION_INVALIDATED } from "../services/api";
import type { RaviraRole } from "../services/raviraApi";

export type AppStatus = "Dikirim" | "Screening" | "Interview" | "Offer" | "Diterima" | "Ditolak";

export interface Application {
  id: string;
  posisi: string;
  perusahaan: string;
  lokasi: string;
  tanggal: string;
  status: AppStatus;
  match: number;
  isNew?: boolean;
}

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  matchedSkills: string[];
}

type RegisterCandidateInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
};

type RegisterRecruiterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  industry?: string;
  location?: string;
  companyWebsite?: string;
  position?: string;
};

interface AppContextType {
  user: RaviraUser | null;
  authReady: boolean;
  authError: string | null;
  retrySession: () => Promise<void>;
  backendOnline: boolean;
  jobs: PublicJob[];
  applications: Application[];
  savedJobs: SavedJob[];
  login: (email: string, password: string, expectedRole?: RaviraRole | readonly RaviraRole[]) => Promise<RaviraUser>;
  registerCandidate: (input: RegisterCandidateInput) => Promise<RaviraUser>;
  registerRecruiter: (input: RegisterRecruiterInput) => Promise<RaviraUser>;
  logout: () => void;
  refreshApplications: () => Promise<void>;
  addApplication: (app: Omit<Application, "id" | "tanggal" | "status" | "isNew">) => string;
  applyToJob: (job: Omit<Application, "id" | "tanggal" | "status" | "isNew"> & { jobId?: string }) => Promise<string>;
  updateApplicationStatus: (id: string, status: AppStatus) => void;
  hasApplied: (posisi: string, perusahaan: string) => boolean;
  saveJob: (job: SavedJob) => void;
  unsaveJob: (id: string) => void;
  isJobSaved: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

function todayStr(): string {
  const d = new Date();
  return `${d.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][d.getMonth()]} ${d.getFullYear()}`;
}

function mapApplicationStatus(status: string): AppStatus {
  switch (status) {
    case "SCREENING":
    case "SELEKSI_TAHAP_1":
    case "SELEKSI_TAHAP_2":
    case "NEED_VERIFICATION":
      return "Screening";
    case "INTERVIEW":
      return "Interview";
    case "ACCEPTED":
      return "Diterima";
    case "REJECTED":
      return "Ditolak";
    default:
      return "Dikirim";
  }
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function mapBackendApplication(app: CandidateApplication): Application {
  return {
    id: app.id,
    posisi: app.job.title,
    perusahaan: app.job.company.name,
    lokasi: app.job.location ?? "-",
    tanggal: formatDate(app.createdAt),
    status: mapApplicationStatus(app.status),
    match: 80,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RaviraUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  const [authError, setAuthError] = useState<string | null>(null);
  const generation = useRef(0);
  const authRequest = useRef<AbortController | null>(null);

  const clearPrivateState = useCallback(() => {
    generation.current += 1;
    authRequest.current?.abort();
    setUser(null);
    setApplications([]);
    setSavedJobs([]);
    setAuthError(null);
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    clearPrivateState();
    setAuthReady(true);
  }, [clearPrivateState]);

  const refreshApplications = useCallback(async () => {
    const token = getAuthToken();
    const version = generation.current;
    const backendApplications = await listMyApplications();
    if (token && token === getAuthToken() && version === generation.current) {
      setApplications(backendApplications.map(mapBackendApplication));
    }
  }, []);

  const retrySession = useCallback(async () => {
    clearPrivateState();
    const version = generation.current;
    const token = getAuthToken();
    setAuthReady(false);
    try {
      if (token) {
        const currentUser = await getCurrentUser();
        if (version !== generation.current || token !== getAuthToken()) return;
        setUser(currentUser);
        setBackendOnline(true);
      }
    } catch (error) {
      if (version !== generation.current) return;
      if (error instanceof ApiError && error.status === 401) logout();
      else setAuthError(error instanceof ApiError && error.status === 403
        ? "Akses sesi ditolak. Silakan masuk kembali atau hubungi administrator."
        : "Sesi belum dapat diperiksa. Periksa koneksi lalu coba lagi.");
    } finally {
      if (version === generation.current) setAuthReady(true);
    }
  }, [clearPrivateState, logout]);

  useEffect(() => {
    const controller = new AbortController();
    listPublishedJobs(controller.signal)
      .then(publishedJobs => { setJobs(publishedJobs); setBackendOnline(true); })
      .catch(() => setBackendOnline(false));
    queueMicrotask(() => { if (!controller.signal.aborted) void retrySession(); });
    const onStorage = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY || event.key === null) void retrySession();
    };
    window.addEventListener(SESSION_INVALIDATED, logout);
    window.addEventListener("storage", onStorage);
    return () => {
      controller.abort();
      generation.current += 1;
      window.removeEventListener(SESSION_INVALIDATED, logout);
      window.removeEventListener("storage", onStorage);
    };
  }, [retrySession, logout]);

  useEffect(() => {
    if (user?.role === "CANDIDATE") {
      void refreshApplications().catch(() => setBackendOnline(false));
    }
  }, [user, refreshApplications]);

  useEffect(() => {
    if (!user) return;
    const token = getAuthToken();
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiry = () => {
      clearTimeout(timer);
      try {
        const payload: unknown = JSON.parse(atob((token?.split(".")[1] ?? "").replace(/-/g, "+").replace(/_/g, "/")));
        if (typeof payload !== "object" || payload === null || !("exp" in payload) || typeof payload.exp !== "number") {
          logout();
          return;
        }
        const remaining = payload.exp * 1000 - Date.now();
        if (remaining <= 0) logout();
        else timer = setTimeout(checkExpiry, Math.min(remaining, 2147483647));
      } catch {
        logout();
      }
    };
    checkExpiry();
    window.addEventListener("focus", checkExpiry);
    return () => { clearTimeout(timer); window.removeEventListener("focus", checkExpiry); };
  }, [user, logout]);

  const login = useCallback(async (email: string, password: string, expectedRole: RaviraRole | readonly RaviraRole[] = "CANDIDATE") => {
    logout();
    const controller = new AbortController();
    authRequest.current = controller;
    const result = await loginRequest(email, password, expectedRole, controller.signal);
    setUser(result.user);
    setBackendOnline(true);
    return result.user;
  }, [logout]);

  const registerCandidate = useCallback(async (input: RegisterCandidateInput) => {
    logout();
    const controller = new AbortController();
    authRequest.current = controller;
    const result = await registerCandidateRequest(input, controller.signal);
    setUser(result.user);
    setBackendOnline(true);
    return result.user;
  }, [logout]);

  const registerRecruiter = useCallback(async (input: RegisterRecruiterInput) => {
    logout();
    const controller = new AbortController();
    authRequest.current = controller;
    const result = await registerRecruiterRequest(input, controller.signal);
    setUser(result.user);
    setBackendOnline(true);
    return result.user;
  }, [logout]);

  const addApplication = useCallback((app: Omit<Application, "id" | "tanggal" | "status" | "isNew">): string => {
    const id = `app-${Date.now()}`;
    const newApp: Application = { ...app, id, tanggal: todayStr(), status: "Dikirim", isNew: true };
    setApplications(prev => [newApp, ...prev]);
    return id;
  }, []);

  const applyToJob = useCallback(async (job: Omit<Application, "id" | "tanggal" | "status" | "isNew"> & { jobId?: string }) => {
    if (job.jobId && user?.role === "CANDIDATE") {
      const version = generation.current;
      const created = await submitJobApplication(job.jobId);
      if (version !== generation.current) throw new ApiError("Sesi telah berubah.", 401);
      const mapped = mapBackendApplication(created);
      setApplications(prev => [mapped, ...prev.filter((app) => app.id !== mapped.id)]);
      return mapped.id;
    }

    return addApplication(job);
  }, [addApplication, user?.role]);

  const updateApplicationStatus = useCallback((id: string, status: AppStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status, isNew: false } : a));
  }, []);

  const hasApplied = useCallback((posisi: string, perusahaan: string) => {
    return applications.some(a => a.posisi === posisi && a.perusahaan === perusahaan);
  }, [applications]);

  const saveJob = useCallback((job: SavedJob) => {
    setSavedJobs(prev => prev.some(s => s.id === job.id) ? prev : [job, ...prev]);
  }, []);

  const unsaveJob = useCallback((id: string) => {
    setSavedJobs(prev => prev.filter(s => s.id !== id));
  }, []);

  const isJobSaved = useCallback((id: string) => {
    return savedJobs.some(s => s.id === id);
  }, [savedJobs]);

  return (
    <AppContext.Provider value={{
      user,
      authReady,
      authError,
      retrySession,
      backendOnline,
      jobs,
      applications,
      savedJobs,
      login,
      registerCandidate,
      registerRecruiter,
      logout,
      refreshApplications,
      addApplication,
      applyToJob,
      updateApplicationStatus,
      hasApplied,
      saveJob,
      unsaveJob,
      isJobSaved,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// The provider and its hook intentionally share this context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
