// src/layouts/AdminLayout.jsx
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const SIDEBAR_W = 230; // bạn có thể thay đổi/collapse sau

export default function AdminLayout() {
  return (
    <Box>
      <CssBaseline />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${SIDEBAR_W}px 1fr`,
          gridTemplateRows: "auto 1fr",
          gridTemplateAreas: `
            "sidebar header"
            "sidebar content"
          `,
          height: "100vh",
          overflow: "auto",
        }}
      >
        {/* Sidebar trái, sticky theo viewport */}
        <Box
          sx={{
            gridArea: "sidebar",
            position: "sticky",
            top: 0,
            alignSelf: "start",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <Sidebar />
        </Box>

        {/* Header trên cùng, sticky, tự chiếm phần còn lại */}
        <Box
          sx={{
            gridArea: "header",
            position: "sticky",
            top: 0,
            zIndex: (t) => t.zIndex.appBar,
          }}
        >
          <Header />
        </Box>

        {/* Nội dung, auto scroll, không bị che bởi header */}
        <Box
          sx={{
            gridArea: "content",
            overflow: "auto",
            // px: { xs: 2, md: 3 },
            pb: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
