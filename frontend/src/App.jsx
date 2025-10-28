import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import ListSoldiers from "./pages/Soldiers/ListSoldiers.jsx";
import DetailSoldier from "./pages/Soldiers/DetailSoldier.jsx";
import DutySchedulePage from "./pages/DutySchedule/ViewDutySchedulePage/DutySchedulePage.jsx";
import TargetDutyDetailPage from "./pages/DutySchedule/ViewDutySchedulePage/TargetDutyDetailPage.jsx";
import ManageDutySchedulePage from "./pages/DutySchedule/ManageDutySchedulePage/ManageDutySchedulePage.jsx";
import TrainingList from "@/pages/Training/TrainingList";
import TrainingDetail from "@/pages/Training/TrainingDetail";
import TrainingManage from "@/pages/Training/TrainingManage";
import DocumentManagerPage from "@/pages/Documents/DocumentManager.jsx";
import InventoryList from "@/pages/Inventory/InventoryList";
import InventoryManage from "@/pages/Inventory/InventoryManage";
export default function App() {
  return (
    <Routes>
      {/* Trang login riêng, không dùng layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Tất cả các route sau đây đều nằm trong AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/soldiers" element={<ListSoldiers />} />
        {/* <Route path="/soldiers/:id" element={<DetailSoldier />} /> */}
        <Route path="/soldierss" element={<DetailSoldier />} />
        <Route path="/duty-schedule" element={<DutySchedulePage />} />
        <Route
          path="/duty-schedule/targets/:id"
          element={<TargetDutyDetailPage />}
        />
        <Route
          path="/duty-schedule/manage"
          element={<ManageDutySchedulePage />}
        />
        <Route path="/training" element={<TrainingList />} />
        <Route path="/training/:id" element={<TrainingDetail />} />
        <Route path="/training/manage" element={<TrainingManage />} />
        <Route path="/documents" element={<DocumentManagerPage />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/manage" element={<InventoryManage />} />
      </Route>

      {/* Trang 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
