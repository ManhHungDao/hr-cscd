// src/pages/Auth/LoginPage.jsx
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  Stack,
  CssBaseline,
  Link,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Img from "../../assets/huyhieuCAND.png";

export default function LoginPage() {
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
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-family-base)",
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        {/* Logo + tiêu đề */}
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 1 }}
        >
          <Stack sx={{ width: 200 }}>
            <img src={Img} alt="Logo" style={{ width: "100%" }} />
          </Stack>

          <Box>
            <Typography variant="h4" gutterBottom sx={{ lineHeight: 1.05 }}>
              HỆ THỐNG QUẢN LÝ NHÂN SỰ
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "var(--color-muted)", letterSpacing: 2, mt: -0.5 }}
            >
              PHÒNG CẢNH SÁT CƠ ĐỘNG
            </Typography>
          </Box>
        </Stack>

        {/* Card mờ bo lớn, viền mảnh */}
        <Paper
          elevation={0}
          component="form"
          onSubmit={onSubmit}
          sx={{
            p: { xs: 2.5, sm: 3 },
            backdropFilter: "saturate(140%) blur(14px)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
            borderRadius: "var(--radius-lg)",
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
                    borderColor: "var(--color-border)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      "color-mix(in srgb, var(--color-border), white 20%)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary)",
                  },
                  height: 56,
                  color: "var(--color-text)",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon
                      sx={{ color: "var(--color-text)" }}
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { color: "var(--color-text)" },
              }}
              FormHelperTextProps={{
                sx: { color: "var(--color-text)" },
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
                    borderColor: "var(--color-border)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      "color-mix(in srgb, var(--color-border), white 20%)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary)",
                  },
                  height: 56,
                  color: "var(--color-text)",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ color: "var(--color-text)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: "var(--color-text)" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { color: "var(--color-text)" },
              }}
              FormHelperTextProps={{
                sx: { color: "var(--color-text)" },
              }}
            />

            {/* Nút Đăng nhập */}
            <Button
              type="submit"
              size="large"
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{
                py: 1.4,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-secondary)",
                color: "#fff",
                "&:hover": {
                  backgroundColor:
                    "color-mix(in srgb, var(--color-secondary), black 12%)",
                },
              }}
            >
              {loading ? "Đang xử lý…" : "Đăng nhập"}
            </Button>

            {/* Gạch mảnh + bản quyền mờ */}
            <Divider sx={{ my: 0.5, borderColor: "var(--color-border)" }} />
            <Typography
              variant="body2"
              sx={{ color: "var(--color-muted)", textAlign: "center" }}
            >
              © {new Date().getFullYear()} Phòng Cảnh sát Cơ Động — Đội Cảnh sát
              Bảo vệ mục tiêu số 8
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
