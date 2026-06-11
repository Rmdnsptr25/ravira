import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
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
  backendOnline: boolean;
  jobs: PublicJob[];
  applications: Application[];
  savedJobs: SavedJob[];
  login: (email: string, password: string) => Promise<RaviraUser>;
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

const STATIC_APPS: Application[] = [
  { id: "app-001", posisi: "Data Analyst", perusahaan: "Tokopedia", lokasi: "Jakarta", tanggal: "28 Mei 2026", status: "Screening", match: 88 },
  { id: "app-002", posisi: "UX Researcher", perusahaan: "Gojek", lokasi: "Jakarta Selatan", tanggal: "20 Mei 2026", status: "Interview", match: 82 },
  { id: "app-003", posisi: "Product Designer", perusahaan: "Bukalapak", lokasi: "Bandung", tanggal: "10 Mei 2026", status: "Dikirim", match: 76 },
  { id: "app-004", posisi: "Frontend Developer", perusahaan: "Shopee", lokasi: "Jakarta Barat", tanggal: "5 Mei 2026", status: "Ditolak", match: 71 },
];

const STATIC_SAVED: SavedJob[] = [
  { id: "saved-001", title: "Senior UX Designer", company: "Gojek", location: "Jakarta Selatan", type: "Full-time", salary: "Rp 18-28 Jt/bln", match: 94, matchedSkills: ["Figma", "Design Systems", "User Research"] },
  { id: "saved-002", title: "Product Manager", company: "Tokopedia", location: "Jakarta", type: "Hybrid", salary: "Rp 22-35 Jt/bln", match: 87, matchedSkills: ["Agile", "Roadmapping", "Stakeholder Management"] },
];

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
  const [applications, setApplications] = useState<Application[]>(STATIC_APPS);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(STATIC_SAVED);

  const refreshApplications = useCallback(async () => {
    const backendApplications = await listMyApplications();
    setApplications(backendApplications.map(mapBackendApplication));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    listPublishedJobs(controller.signal)
      .then((publishedJobs) => {
        setJobs(publishedJobs);
        setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));

    if (!getAuthToken()) {
      setAuthReady(true);
      return () => controller.abort();
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setBackendOnline(true);
        if (currentUser.role === "CANDIDATE") {
          return refreshApplications();
        }
        return undefined;
      })
      .catch(() => logoutRequest())
      .finally(() => setAuthReady(true));

    return () => controller.abort();
  }, [refreshApplications]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setUser(result.user);
    setBackendOnline(true);
    if (result.user.role === "CANDIDATE") {
      await refreshApplications();
    }
    return result.user;
  }, [refreshApplications]);

  const registerCandidate = useCallback(async (input: RegisterCandidateInput) => {
    const result = await registerCandidateRequest(input);
    setUser(result.user);
    setBackendOnline(true);
    await refreshApplications();
    return result.user;
  }, [refreshApplications]);

  const registerRecruiter = useCallback(async (input: RegisterRecruiterInput) => {
    const result = await registerRecruiterRequest(input);
    setUser(result.user);
    setBackendOnline(true);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    setApplications(STATIC_APPS);
  }, []);

  const addApplication = useCallback((app: Omit<Application, "id" | "tanggal" | "status" | "isNew">): string => {
    const id = `app-${Date.now()}`;
    const newApp: Application = { ...app, id, tanggal: todayStr(), status: "Dikirim", isNew: true };
    setApplications(prev => [newApp, ...prev]);
    return id;
  }, []);

  const applyToJob = useCallback(async (job: Omit<Application, "id" | "tanggal" | "status" | "isNew"> & { jobId?: string }) => {
    if (job.jobId && user?.role === "CANDIDATE") {
      const created = await submitJobApplication(job.jobId);
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

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
