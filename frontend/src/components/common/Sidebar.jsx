import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  BarChart2,
  DollarSign,
  Menu as MenuIcon,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
  { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const COLLAPSED_W = 80;
const EXPANDED_W = 256;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <motion.div
      animate={{ width: open ? EXPANDED_W : COLLAPSED_W }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{ position: "relative", zIndex: 10, flexShrink: 0 }}
    >
      <Box
        sx={{
          height: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          bgcolor: "rgba(31,41,55,0.5)", // tương đương bg-gray-800/50
          backdropFilter: "blur(8px)", // backdrop-blur-md
          borderRight: "1px solid rgba(55,65,81,1)", // border-gray-700
        }}
      >
        <Tooltip title={open ? "Thu gọn" : "Mở rộng"} placement="right">
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              alignSelf: "flex-start",
              borderRadius: "999px",
              "&:hover": { bgcolor: "rgba(55,65,81,0.8)" },
            }}
            component={motion.button}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <MenuIcon size={24} />
          </IconButton>
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

                  {/* Ẩn/hiện nhãn với animation */}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItemText
                          primary={item.name}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#F3F4F6", // text-gray-100 tương đương
                          }}
                          sx={{ ml: 1 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Sidebar;
