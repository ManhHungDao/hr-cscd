import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Card, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dailySalesData = [
  { name: "Mon", sales: 1000 },
  { name: "Tue", sales: 1200 },
  { name: "Wed", sales: 900 },
  { name: "Thu", sales: 1100 },
  { name: "Fri", sales: 1300 },
  { name: "Sat", sales: 1600 },
  { name: "Sun", sales: 1400 },
];

const DailySalesTrend = () => {
  return (
    <Card
      component={motion.div}
      sx={{
        bgcolor: "rgba(31,41,55,0.5)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(55,65,81,1)",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.4)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} color="#F3F4F6" mb={2}>
          Daily Sales Trend
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailySalesTrend;
