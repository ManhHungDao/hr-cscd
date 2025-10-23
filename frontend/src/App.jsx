import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import ListSoldiers from "./pages/Soldiers/ListSoldiers.jsx";
import SoldierDetail from "./pages/Soldiers/SoldierDetail.jsx";
import DutySchedulePage from "./pages/DutySchedule/ViewDutySchedulePage/DutySchedulePage.jsx";
export default function App() {
  return (
    <Routes>
      {/* Trang login riêng, không dùng layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Tất cả các route sau đây đều nằm trong AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/list-soldiers" element={<ListSoldiers />} />
        <Route path="/detail-profile" element={<SoldierDetail />} />
        <Route path="/duty-schedule" element={<DutySchedulePage />} />
        {/* Khi bạn thêm các trang khác, chỉ cần thêm vào đây */}
        {/* 
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/reports" element={<ReportPage />} /> 
        */}
      </Route>

      {/* Trang 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
