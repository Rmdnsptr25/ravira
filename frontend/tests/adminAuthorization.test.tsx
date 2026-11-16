import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import { ProtectedRoute } from "../src/components/ProtectedRoute";
import { DashboardLayout } from "../src/components/DashboardLayout";
import { AppProvider } from "../src/contexts/AppContext";
import { adminSidebarItems } from "../src/constants/adminSidebar";
import { AUTH_TOKEN_KEY } from "../src/services/api";
import type { RaviraRole } from "../src/services/raviraApi";
import { mockSession, tokenFixture, userFixture } from "./fixtures";

const superAdminPaths = [
  "/dashboard/admin/model-ai",
  "/dashboard/admin/user-management",
  "/dashboard/admin/pengaturan",
];

function CurrentLocation() {
  const location = useLocation();
  return <p>location:{location.pathname}</p>;
}

function AdminNavigationFixture() {
  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <p>Konten admin</p>
      <Outlet />
    </DashboardLayout>
  );
}

function renderAdminRoute(role: RaviraRole, initialPath: string, withNavigation = false) {
  localStorage.setItem(AUTH_TOKEN_KEY, tokenFixture());
  mockSession(userFixture(role));

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard/admin"
              element={withNavigation ? <AdminNavigationFixture /> : <CurrentLocation />}
            />
            {superAdminPaths.map((path) => (
              <Route key={path} path={path} element={<CurrentLocation />} />
            ))}
          </Route>
        </Routes>
      </AppProvider>
    </MemoryRouter>
  );
}

describe("Admin and Super Admin authorization", () => {
  it.each(superAdminPaths)("redirects ADMIN away from %s", async (path) => {
    renderAdminRoute("ADMIN", path);

    await waitFor(() => {
      expect(screen.getByText("location:/dashboard/admin")).toBeInTheDocument();
    });
    expect(screen.queryByText(`location:${path}`)).not.toBeInTheDocument();
  });

  it.each(superAdminPaths)("allows SUPER_ADMIN to open %s", async (path) => {
    renderAdminRoute("SUPER_ADMIN", path);

    await waitFor(() => {
      expect(screen.getByText(`location:${path}`)).toBeInTheDocument();
    });
  });

  it("shows operational navigation only to ADMIN", async () => {
    renderAdminRoute("ADMIN", "/dashboard/admin", true);

    expect(await screen.findByRole("button", { name: "Verifikasi Perusahaan" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Audit Log" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Kinerja Model" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Manajemen Pengguna" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pengaturan" })).not.toBeInTheDocument();
  });

  it("shows operational and authority navigation to SUPER_ADMIN", async () => {
    renderAdminRoute("SUPER_ADMIN", "/dashboard/admin", true);

    expect(await screen.findByRole("button", { name: "Verifikasi Perusahaan" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Audit Log" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kinerja Model" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manajemen Pengguna" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pengaturan" })).toBeInTheDocument();
  });
});
