import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Trang login riêng, không dùng layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Tất cả các route sau đây đều nằm trong AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Khi bạn thêm các trang khác, chỉ cần thêm vào đây */}
        {/* 
        <Route path="/soldiers" element={<ListSoldiers />} />
        <Route path="/departments" element={<DepartmentPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/reports" element={<ReportPage />} /> 
        */}
      </Route>

      {/* Trang 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
