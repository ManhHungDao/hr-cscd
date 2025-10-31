// src/components/common/Header.jsx
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const HEADER_HEIGHT = 64;

export default function Header({
  user = { name: "Người dùng", avatarUrl: "" },
  onSearch,
  onProfile,
  onLogout,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");
  const open = Boolean(anchorEl);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <AppBar
      elevation={0}
      color="transparent"
      position="static" // 👈 đơn giản: để static, sticky do container lo
      sx={{
        backgroundColor: "var(--color-surface)",
        backdropFilter: "blur(8px)", // backdrop-blur-md
        border: "1px solid rgba(55,65,81,1)", // border-gray-700
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.4)",
        borderLeft: "none",
      }}
    >
      <Toolbar
        sx={{
          minHeight: HEADER_HEIGHT,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 400,
              color: "var(--color-text)",
              maxWidth: { xs: 120, sm: 200 },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0, border: "1px solid var(--color-border)" }}
          >
            <Avatar
              alt={user?.name || "User"}
              src={user?.avatarUrl || ""}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "var(--color-primary)",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {(user?.name?.[0] || "U").toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "var(--color-primary)",
                  color: "#fff",
                },
              },
            }}
          >
            <MenuItem
              component={RouterLink}
              to="/soldiers/6904626b64d7cbb818d51b65"
              onClick={() => setAnchorEl(null)}
            >
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              Xem hồ sơ cá nhân
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onLogout?.();
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
