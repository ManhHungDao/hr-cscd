import { motion } from "framer-motion";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <Card
      component={motion.div}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      sx={{
        bgcolor: "rgba(31,41,55,0.5)", // bg-gray-800 bg-opacity-50
        backdropFilter: "blur(8px)", // backdrop-blur-md
        border: "1px solid rgba(55,65,81,1)", // border-gray-700
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.4)",
      }}
    >
      <CardContent sx={{ px: 3, py: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon size={20} style={{ color }} />
          <Typography
            variant="body2"
            fontWeight={500}
            color="rgba(156,163,175,1)" // text-gray-400
          >
            {name}
          </Typography>
        </Stack>

        <Typography
          variant="h4"
          fontWeight={600}
          color="rgba(243,244,246,1)" // text-gray-100
          sx={{ mt: 1 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
