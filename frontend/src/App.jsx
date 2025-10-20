import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
// import ListSoldiers from "./pages/Soldiers/ListSoldiers.jsx";
// import SoldierDetail from "./pages/Soldiers/SoldierDetail.jsx";
// import AddSoldierForm from "./pages/Soldiers/AddSoldierForm.jsx";
// import DepartmentPage from "./pages/Department/DepartmentPage.jsx";
// import AttendancePage from "./pages/Attendance/AttendancePage.jsx";
// import ReportPage from "./pages/Reports/ReportPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      {/* <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/soldiers" element={<ListSoldiers />} />
        <Route path="/soldiers/new" element={<AddSoldierForm />} />
        <Route path="/soldiers/:id" element={<SoldierDetail />} />
        <Route path="/departments" element={<DepartmentPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Route> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
