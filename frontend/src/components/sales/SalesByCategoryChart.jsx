import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Card, CardContent } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const salesByCategory = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Home & Garden", value: 200 },
  { name: "Books", value: 100 },
  { name: "Others", value: 150 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
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
      transition={{ delay: 0.3 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} color="#F3F4F6" mb={2}>
          Sales by Category
        </Typography>

        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesByCategoryChart;
