import { Outlet, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";

const NavButton = ({ to, label }) => {
  const loc = useLocation();
  const active = loc.pathname.startsWith(to);
  return (
    <Button component={Link} to={to} variant={active ? "contained" : "text"} sx={{ borderRadius: 2 }}>
      {label}
    </Button>
  );
};

export default function AdminLayout() {
  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid #1f2937" }}>
        <Toolbar sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>HR-CSCD</Typography>
          <Stack direction="row" spacing={1}>
            <NavButton to="/dashboard" label="Dashboard" />
            <NavButton to="/soldiers" label="Cán bộ/Chiến sĩ" />
            <NavButton to="/departments" label="Đơn vị" />
            <NavButton to="/attendance" label="Chấm công" />
            <NavButton to="/reports" label="Báo cáo" />
          </Stack>
          <Button component={Link} to="/login" color="inherit">Đăng nhập</Button>
        </Toolbar>
      </AppBar>
      <Box className="container">
        <Outlet />
      </Box>
    </Box>
  );
}
