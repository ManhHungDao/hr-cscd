import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlySalesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
  { month: "Jul", sales: 7000 },
];

const SalesOverviewChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  return (
    <Card
      component={motion.div}
      sx={{
        bgcolor: "rgba(31,41,55,0.5)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(55,65,81,1)",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.4)",
        mb: 4,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight={600} color="#F3F4F6">
            Sales Overview
          </Typography>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              sx={{
                bgcolor: "rgba(55,65,81,1)",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              {["This Week", "This Month", "This Quarter", "This Year"].map(
                (opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesOverviewChart;
