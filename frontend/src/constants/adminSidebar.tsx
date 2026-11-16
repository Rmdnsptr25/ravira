import {
  LayoutDashboard,
  Building2,
  Shield,
  AlertTriangle,
  FileText,
  Activity,
  ClipboardList,
  Cpu,
  Users,
  Settings,
} from "lucide-react";
import type { SidebarItem } from "../components/DashboardLayout";
import { SUPER_ADMIN_ROLES } from "./adminAccess";

export const adminSidebarItems: SidebarItem[] = [
  { key: "overview", label: "Ringkasan", icon: <LayoutDashboard size={16} />, path: "/dashboard/admin", section: "Operasional" },
  { key: "verifikasi", label: "Verifikasi Perusahaan", icon: <Building2 size={16} />, path: "/dashboard/admin/verifikasi-perusahaan", section: "Operasional" },
  { key: "moderasi", label: "Moderasi Lowongan", icon: <Shield size={16} />, path: "/dashboard/admin/moderasi-lowongan", section: "Operasional" },
  { key: "laporan", label: "Abuse & Fraud", icon: <AlertTriangle size={16} />, path: "/dashboard/admin/laporan-abuse", section: "Trust & governance" },
  { key: "sanggahan", label: "Sanggahan Kandidat", icon: <FileText size={16} />, path: "/dashboard/admin/sanggahan", section: "Trust & governance" },
  { key: "audit", label: "Audit Log", icon: <ClipboardList size={16} />, path: "/dashboard/admin/audit-log", section: "Trust & governance" },
  { key: "monitoring", label: "Monitoring Integrasi", icon: <Activity size={16} />, path: "/dashboard/admin/monitoring-integrasi", section: "Sistem" },
  { key: "ai", label: "Kinerja Model", icon: <Cpu size={16} />, path: "/dashboard/admin/model-ai", section: "Otoritas Super Admin", roles: SUPER_ADMIN_ROLES },
  { key: "users", label: "Manajemen Pengguna", icon: <Users size={16} />, path: "/dashboard/admin/user-management", section: "Otoritas Super Admin", roles: SUPER_ADMIN_ROLES },
  { key: "pengaturan", label: "Pengaturan", icon: <Settings size={16} />, path: "/dashboard/admin/pengaturan", section: "Otoritas Super Admin", roles: SUPER_ADMIN_ROLES },
];
