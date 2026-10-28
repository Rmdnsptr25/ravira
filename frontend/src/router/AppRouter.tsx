import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import DashboardCandidatePage from '../pages/DashboardCandidatePage';
import LandingPage from '../pages/LandingPage';
import DashboardCompanyPage from '../pages/DashboardCompanyPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="candidate/dashboard" element={<DashboardCandidatePage />} />
        <Route path="recruiter/dashboard" element={<DashboardCompanyPage />} />
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
