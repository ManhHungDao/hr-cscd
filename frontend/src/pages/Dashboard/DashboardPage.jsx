import { motion } from "framer-motion";
import { Box, Container, Grid } from "@mui/material";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";

import StatCard from "../../components/common/StatCard"; // bản MUI đã chuyển
import SalesOverviewChart from "../../components/sales/SalesOverviewChart";

const OverviewPage = () => {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* STATS */}
        <Box>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                name="Total Sales"
                icon={Zap}
                value="$12,345"
                color="#6366F1"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                name="New Users"
                icon={Users}
                value="1,234"
                color="#8B5CF6"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                name="Total Products"
                icon={ShoppingBag}
                value="567"
                color="#EC4899"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                name="Conversion Rate"
                icon={BarChart2}
                value="12.5%"
                color="#10B981"
              />
            </Grid>
          </Grid>
        </Box>

        {/* CHARTS */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SalesOverviewChart />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OverviewPage;
