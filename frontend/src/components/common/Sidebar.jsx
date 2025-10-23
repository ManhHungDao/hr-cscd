import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  BarChart2,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  ScrollText,
  CalendarDays,
  Warehouse,
  HeartPulse,
} from "lucide-react";
import Img from "../../assets/huyhieuCAND.png";

const SIDEBAR_ITEMS = [
  {
    name: "Thông tin chung",
    icon: BarChart2,
    color: "var(--color-text)",
    href: "/dashboard",
  },
  {
    name: "Cán bộ chiến sĩ",
    icon: Users,
    color: "var(--color-text)",
    href: "/list-soldiers",
  },

  {
    name: "Lịch trực",
    icon: CalendarDays,
    color: "var(--color-text)",
    href: "/duty-schedule",
  },
  {
    name: "Huấn luyện",
    icon: HeartPulse,
    color: "var(--color-text)",
    href: "/training",
  },
  {
    name: "Văn bản",
    icon: ScrollText,
    color: "var(--color-text)",
    href: "/documents",
  },
  {
    name: "Kho",
    icon: Warehouse,
    color: "var(--color-text)",
    href: "/warehouse ",
  },
  {
    name: "Cài đặt",
    icon: Settings,
    color: "var(--color-text)",
    href: "/settings",
  },
];

const COLLAPSED_W = 80;
const EXPANDED_W = 230;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <Box
      // Bỏ animation: width đổi tức thì theo state
      sx={{
        width: open ? EXPANDED_W : COLLAPSED_W,
        position: "relative",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          height: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          bgcolor: "rgba(31,41,55,0.5)",
          backdropFilter: "blur(8px)",
          borderRight: "1px solid rgba(55,65,81,1)",
        }}
      >
        {/* Logo: căn giữa phía trên */}
        <Tooltip title={open ? "Thu gọn" : "Mở rộng"} placement="right">
          <Stack
            onClick={() => setOpen(!open)}
            sx={{
              width: "100%",
              alignItems: "center", // căn giữa ngang
              justifyContent: "center", // căn giữa dọc trong khung logo
              pt: 1,
              pb: 1, // khoảng trống phía trên
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: open ? 120 : 56, // thu nhỏ khi collapse cho gọn
                height: open ? 120 : 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={Img}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
          </Stack>
        </Tooltip>

        <Divider sx={{ my: 2, borderColor: "rgba(75,85,99,0.6)" }} />

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List disablePadding>
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const selected = location.pathname === item.href;

              return (
                <ListItemButton
                  key={item.href}
                  component={RouterLink}
                  to={item.href}
                  selected={selected}
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    px: 2,
                    py: 1.25,
                    "&.Mui-selected": {
                      bgcolor: "rgba(255,255,255,0.08)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                    },
                    "&:hover": { bgcolor: "rgba(55,65,81,0.7)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Icon size={20} style={{ color: item.color }} />
                  </ListItemIcon>

                  {/* Bỏ AnimatePresence/transition: render thẳng */}
                  {open && (
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#F3F4F6",
                      }}
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
