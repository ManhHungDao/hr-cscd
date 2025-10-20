import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0B1524 0%, #0E1A30 100%)",
      }}
    >
      <Stack
        sx={{
          textAlign: "center",
          p: 5,
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: "#fff" }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
          Trang bạn tìm không tồn tại.
        </Typography>
        <Button
          component={Link}
          to="/"
          size="large"
          variant="contained"
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2,
            fontSize: 16,
            background: "linear-gradient(90deg, #2F86EB, rgba(47,134,235,0.7))",
          }}
        >
          Về trang chủ
        </Button>
      </Stack>
    </Box>
  );
}
