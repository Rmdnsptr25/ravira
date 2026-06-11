import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { CandidateDashboardPage } from '../pages/CandidateDashboardPage'
import { HomePage } from '../pages/HomePage'
import { RecruiterDashboardPage } from '../pages/RecruiterDashboardPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="candidate/dashboard" element={<CandidateDashboardPage />} />
        <Route path="recruiter/dashboard" element={<RecruiterDashboardPage />} />
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
