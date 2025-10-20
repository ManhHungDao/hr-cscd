import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  Stack,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Img from "../../assets/huyhieuCAND.png";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2F86EB" }, // xanh nút
    text: { primary: "#EAF2FF", secondary: "rgba(234,242,255,0.65)" },
    background: { default: "#0B1524", paper: "#0F1C2E" },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h3: { fontWeight: 800, letterSpacing: 0.2 },
    h6: { fontWeight: 600, letterSpacing: 1.2 },
    button: { textTransform: "none", fontWeight: 700 },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    remember: true,
  });
  const [errors, setErrors] = React.useState({ username: "", password: "" });

  const handleChange = (field) => (e) => {
    setValues((prev) => ({
      ...prev,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      username: values.username ? "" : "Vui lòng nhập tài khoản",
      password: values.password ? "" : "Vui lòng nhập mật khẩu",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(
        `Đăng nhập thành công!\nTài khoản: ${values.username}\nGhi nhớ: ${
          values.remember ? "Có" : "Không"
        }`
      );
    }, 900);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box />

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        {/* Logo + tiêu đề */}
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          <Stack
            sx={{
              width: 200,
            }}
          >
            <img src={Img} alt="Logo" />
          </Stack>

          <Box>
            <Typography variant="h4" gutterBottom sx={{ lineHeight: 1.05 }}>
              HỆ THỐNG QUẢN LÝ NHÂN SỰ
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", letterSpacing: 2, mt: -0.5 }}
            >
              PHÒNG CẢNH SÁT CƠ ĐỘNG
            </Typography>
          </Box>
        </Stack>

        {/* Card mờ bo lớn, viền mảnh giống ảnh */}
        <Paper
          elevation={0}
          component="form"
          onSubmit={onSubmit}
          sx={{
            p: { xs: 2.5, sm: 3 },
            backdropFilter: "saturate(140%) blur(14px)",
            background: (t) => alpha(t.palette.background.paper, 0.6),
            border: "1px solid",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <Stack spacing={2.2}>
            {/* Ô Tài khoản */}
            <TextField
              variant="outlined"
              label="Tài khoản"
              autoComplete="username"
              fullWidth
              value={values.username}
              onChange={handleChange("username")}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                sx: {
                  backgroundColor: "rgba(255,255,255,0.02)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.08)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.16)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  height: 56,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Ô Mật khẩu */}
            <TextField
              variant="outlined"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              value={values.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                sx: {
                  backgroundColor: "rgba(255,255,255,0.02)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.08)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.16)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  height: 56,
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Ghi nhớ + Link */}
            {/* <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={1}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.remember}
                    onChange={handleChange("remember")}
                  />
                }
                label="Ghi nhớ đăng nhập"
              />

              <Stack direction="row" spacing={3} sx={{ mt: { xs: 1, sm: 0 } }}>
                <Link underline="hover" sx={{ color: "text.secondary" }}>
                  Quên mật khẩu?
                </Link>
                <Link
                  underline="hover"
                  sx={{
                    color: "text.secondary",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <SupportAgentOutlinedIcon sx={{ fontSize: 18 }} /> Liên hệ
                  quản trị
                </Link>
              </Stack>
            </Stack> */}

            {/* Nút Đăng nhập xanh nổi */}
            <Button
              type="submit"
              size="large"
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{
                py: 1.4,
                fontSize: 16,
                background: (t) =>
                  `linear-gradient(90deg, ${t.palette.primary.main}, ${alpha(
                    t.palette.primary.main,
                    0.75
                  )})`,
              }}
            >
              {loading ? "Đang xử lý…" : "Đăng nhập"}
            </Button>

            {/* Gạch mảnh + bản quyền mờ */}
            <Divider sx={{ my: 0.5, borderColor: "rgba(255,255,255,0.08)" }} />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              © {new Date().getFullYear()} Phòng Cảnh sát Cơ động — Đội Cảnh Sát
              bảo vệ mục tiêu số 8
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
