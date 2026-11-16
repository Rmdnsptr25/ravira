import type { RaviraRole } from "../services/raviraApi";

export const ADMIN_ROLES: readonly RaviraRole[] = ["ADMIN", "SUPER_ADMIN"];
export const SUPER_ADMIN_ROLES: readonly RaviraRole[] = ["SUPER_ADMIN"];

export const SUPER_ADMIN_ONLY_PATHS = [
  "/dashboard/admin/model-ai",
  "/dashboard/admin/user-management",
  "/dashboard/admin/pengaturan",
] as const;

export function isSuperAdminOnlyPath(pathname: string) {
  return SUPER_ADMIN_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function canAccessAdminPath(role: RaviraRole, pathname: string) {
  return !isSuperAdminOnlyPath(pathname) || role === "SUPER_ADMIN";
}
